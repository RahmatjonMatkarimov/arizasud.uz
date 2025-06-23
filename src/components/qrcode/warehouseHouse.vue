<template>
  <div class="min-h-screen w-full bg-neutral-100 dark:bg-neutral-950 px-4 py-6 md:px-8 md:py-10 font-sans">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-6">
        {{ dat === 'datakril' ? translateText(`Ombor va Zimmamdagilar Boshqaruvi`) : `Ombor va Zimmamdagilar Boshqaruvi` }}
      </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md ring-1 ring-neutral-200 dark:ring-neutral-700 transition-all duration-300 hover:shadow-lg">
          <span class="block text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ myAssignments.length }}</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{{ dat === 'datakril' ? translateText(`Mening Zimmamdagilar`) : `Mening Zimmamdagilar` }}</span>
        </div>
        <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md ring-1 ring-neutral-200 dark:ring-neutral-700 transition-all duration-300 hover:shadow-lg">
          <span class="block text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ transferredAssignments.length }}</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{{ dat === 'datakril' ? translateText(`Topshirilganlar`) : `Topshirilganlar` }}</span>
        </div>
        <div v-if="role === 'warehouseman'" class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md ring-1 ring-neutral-200 dark:ring-neutral-700 transition-all duration-300 hover:shadow-lg">
          <span class="block text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ brokenAssignments.length }}</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{{ dat === 'datakril' ? translateText(`Buzilgan Hom Ashiyolar`) : `Buzilgan Hom Ashiyolar` }}</span>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <nav class="flex flex-col sm:flex-row gap-3 mb-8 bg-white dark:bg-neutral-800 p-3 rounded-2xl shadow-md">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'flex-1 py-3 px-6 font-medium rounded-lg transition-all duration-300',
          activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-600 dark:text-neutral-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'
        ]"
        @click="activeTab = tab.id"
        :aria-current="activeTab === tab.id ? 'page' : undefined"
      >
        {{ dat === 'datakril' ? translateText(tab.label) : tab.label }}
      </button>
    </nav>

    <!-- Content -->
    <main>
      <!-- My Assignments Tab -->
      <section v-if="activeTab === 'mine'" class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Mening Zimmamdagilar`) : `Mening Zimmamdagilar` }}</h2>
          <button
            @click="refreshMyAssignments"
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            aria-label="Ma'lumotlarni yangilash"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5m6 11v-5h-5m-4-6l7 7m0 0l-7 7" />
            </svg>
            {{ dat === 'datakril' ? translateText(`Yangilash`) : `Yangilash` }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
            <thead>
              <tr class="bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText('Nomi') : `Nomi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Miqdori`) : `Miqdori` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Seriya Raqami`) : `Seriya Raqami` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Turgan Joyi`) : `Turgan Joyi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Mas'ul Shaxs`) : `Mas'ul Shaxs` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Bo'lim`) : `Bo'lim` }}</th>
                <th v-if="role !== 'warehouseman'" class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Topshirish Holati`) : `Topshirish Holati` }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assignment in myAssignments"
                :key="assignment.id"
                class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
              >
                <td class="p-4 text-neutral-800 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(assignment.warehouse?.name) : assignment.warehouse?.name || 'Noma\'lum ombor' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.quantity || '1 dona' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.id || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.location) : assignment.warehouse?.location || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.assignedBy?.name) : assignment.assignedBy?.name || 'N/A' }} {{ dat === 'datakril' ? translateText(assignment.assignedBy?.surname) : assignment.assignedBy?.surname || '' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.category?.name) : assignment.warehouse?.category?.name || 'N/A' }}</td>
                <td v-if="role !== 'warehouseman'" class="p-4">
                  <div class="flex gap-2">
                    <button
                      @click="quickTransfer(assignment, 'Yaxshi')"
                      class="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Yaxshi holatda topshirish"
                    >
                      {{ dat === 'datakril' ? translateText(`Yaxshi`) : `Yaxshi` }}
                    </button>
                    <button
                      @click="quickTransfer(assignment, 'O\'rtacha')"
                      class="px-4 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="O'rtacha holatda topshirish"
                    >
                      {{ dat === 'datakril' ? translateText(`O'rtacha`) : `O'rtacha` }}
                    </button>
                    <button
                      @click="quickTransfer(assignment, 'Yomon')"
                      class="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Buzuq holatda topshirish"
                    >
                      {{ dat === 'datakril' ? translateText(`Buzuq`) : `Buzuq` }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="myAssignments.length === 0">
              <tr>
                <td :colspan="role === 'warehouseman' ? 6 : 7" class="text-center py-12 text-neutral-500 dark:text-neutral-400 text-lg">
                  {{ dat === 'datakril' ? translateText(`Hozircha zimmaingizda ombor yo'q`) : `Hozircha zimmaingizda ombor yo'q` }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Transferred Assignments Tab -->
      <section v-if="activeTab === 'transferred'" class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Topshirilganlar`) : `Topshirilganlar` }}</h2>
          <button
            @click="refreshTransferredAssignments"
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            aria-label="Topshirilganlarni yangilash"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5m6 11v-5h-5m-4-6l7 7m0 0l-7 7" />
            </svg>
            {{ dat === 'datakril' ? translateText(`Yangilash`) : `Yangilash` }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
            <thead>
              <tr class="bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText('Nomi') : `Nomi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Miqdori`) : `Miqdori` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Seriya Raqami`) : `Seriya Raqami` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Turgan Joyi`) : `Turgan Joyi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Mas'ul Shaxs`) : `Mas'ul Shaxs` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Bo'lim`) : `Bo'lim` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Zimmaga Olish Holati`) : `Zimmaga Olish Holati` }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assignment in transferredAssignments"
                :key="assignment.id"
                class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
              >
                <td class="p-4 text-neutral-800 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(assignment.warehouse?.name) : assignment.warehouse?.name || 'Noma\'lum ombor' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.quantity || '1 dona' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.id || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.location) : assignment.warehouse?.location || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.assignedBy?.name) : assignment.assignedBy?.name || 'N/A' }} {{ dat === 'datakril' ? translateText(assignment.assignedBy?.surname) : assignment.assignedBy?.surname || '' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.category?.name) : assignment.warehouse?.category?.name || 'N/A' }}</td>
                <td class="p-4">
                  <div v-if="role !== 'warehouseman'" class="flex gap-2">
                    <button
                      @click="quickTakeBack(assignment, 'Yaxshi')"
                      class="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Yaxshi holatda zimmaga olish"
                    >
                      {{ dat === 'datakril' ? translateText(`Yaxshi`) : `Yaxshi` }}
                    </button>
                    <button
                      @click="quickTakeBack(assignment, 'O\'rtacha')"
                      class="px-4 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="O'rtacha holatda zimmaga olish"
                    >
                      {{ dat === 'datakril' ? translateText(`O'rtacha`) : `O'rtacha` }}
                    </button>
                  </div>
                  <div v-else>
                    <button
                      @click="openTransferModal(assignment, 'takeBack')"
                      class="px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Zimmamga olish"
                    >
                      {{ dat === 'datakril' ? translateText(`Zimmamga Olish`) : `Zimmamga Olish` }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="transferredAssignments.length === 0">
              <tr>
                <td colspan="7" class="text-center py-12 text-neutral-500 dark:text-neutral-400 text-lg">
                  {{ dat === 'datakril' ? translateText(`Hech qanday topshirilgan ombor yo'q`) : `Hech qanday topshirilgan ombor yo'q` }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Broken Assignments Tab -->
      <section v-if="activeTab === 'broken' && role === 'warehouseman'" class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Buzilgan Hom Ashiyolar`) : `Buzilgan Hom Ashiyolar` }}</h2>
          <button
            @click="refreshBrokenAssignments"
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            aria-label="Buzilganlarni olish"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5m6 11v-5h-5m-4-6l7 7m0 0l-7 7" />
            </svg>
            {{ dat === 'datakril' ? translateText(`Yangilash`) : `Yangilash` }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
            <thead>
              <tr class="bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText('Nomi') : `Nomi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Miqdori`) : `Miqdori` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Seriya Raqami`) : `Seriya Raqami` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Turgan Joyi`) : `Turgan Joyi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Mas'ul Shaxs`) : `Mas'ul Shaxs` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Bo'lim`) : `Bo'lim` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Mahsulot Holati`) : `Mahsulot Holati` }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assignment in brokenAssignments"
                :key="assignment.id"
                class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
              >
                <td class="p-4 text-neutral-800 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(assignment.warehouse?.name) : assignment.warehouse?.name || 'Noma\'lum ombor' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.quantity || '1 dona' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.id || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.location) : assignment.warehouse?.location || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.assignedBy?.name) : assignment.assignedBy?.name || 'N/A' }} {{ dat === 'datakril' ? translateText(assignment.assignedBy?.surname) : assignment.assignedBy?.surname || '' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.category?.name) : assignment.warehouse?.category?.name || 'N/A' }}</td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <button
                      @click="openReportModal(assignment)"
                      class="px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Ma'lumotlarni ko'rish"
                    >
                      {{ dat === 'datakril' ? translateText(`Ko'rish`) : `Ko'rish` }}
                    </button>
                    <button
                      @click="markAsFixed(assignment)"
                      class="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isTransferring"
                      aria-label="Tuzatildi deb belgilash"
                    >
                      {{ dat === 'datakril' ? translateText(`Tuzatildi`) : `Tuzatildi` }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="brokenAssignments.length === 0">
              <tr>
                <td colspan="7" class="text-center py-12 text-neutral-500 dark:text-neutral-400 text-lg">
                  {{ dat === 'datakril' ? translateText(`Hech qanday buzilgan hom ashiyolar yo'q`) : `Hech qanday buzilgan hom ashiyolar yo'q` }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- My Warehouses Tab -->
      <section v-if="activeTab === 'myWarehouses' && role === 'warehouseman'" class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Mening Omborlarim`) : `Mening Omborlarim` }}</h2>
          <button
            @click="refreshMyWarehouses"
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            aria-label="Ma'lumotlarni yangilash"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5m6 11v-5h-5m-4-6l7 7m0 0l-7 7" />
            </svg>
            {{ dat === 'datakril' ? translateText(`Yangilash`) : `Yangilash` }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
            <thead>
              <tr class="bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText('Nomi') : `Nomi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Miqdori`) : `Miqdori` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Seriya Raqami`) : `Seriya Raqami` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Turgan Joyi`) : `Turgan Joyi` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Mas'ul Shaxs`) : `Mas'ul Shaxs` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Bo'lim`) : `Bo'lim` }}</th>
                <th class="p-4 text-left text-sm font-semibold">{{ dat === 'datakril' ? translateText(`Harakat`) : `Harakat` }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assignment in myWarehouses"
                :key="assignment.id"
                class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
              >
                <td class="p-4 text-neutral-800 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(assignment.warehouse?.name) : assignment.warehouse?.name || 'Noma\'lum ombor' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.quantity || '1 dona' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ assignment.warehouse?.id || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.location) : assignment.warehouse?.location || 'N/A' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.assignedBy?.name) : assignment.assignedBy?.name || 'N/A' }} {{ dat === 'datakril' ? translateText(assignment.assignedBy?.surname) : assignment.assignedBy?.surname || '' }}</td>
                <td class="p-4 text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(assignment.warehouse?.category?.name) : assignment.warehouse?.category?.name || 'N/A' }}</td>
                <td class="p-4">
                  <button
                    @click="openAssignModal(assignment)"
                    class="px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isTransferring"
                    aria-label="Boshqa foydalanuvchiga topshirish"
                  >
                    {{ dat === 'datakril' ? translateText(`Topshirish`) : `Topshirish` }}
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="myWarehouses.length === 0">
              <tr>
                <td colspan="7" class="text-center py-12 text-neutral-500 dark:text-neutral-400 text-lg">
                  {{ dat === 'datakril' ? translateText(`Hozircha omborlaringiz yo'q`) : `Hozircha omborlaringiz yo'q` }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Broken Transfer Modal -->
      <div
        v-if="showBrokenTransferModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in-0 duration-300"
        @click="closeBrokenTransferModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="broken-transfer-modal-title"
      >
        <div
          class="bg-white dark:bg-neutral-800 rounded-2xl w-11/12 max-w-md p-6 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-700 animate-in slide-in-from-bottom-10 duration-300"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h3 id="broken-transfer-modal-title" class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {{ dat === 'datakril' ? translateText(`Omborni Buzuq deb Belgilash`) : `Omborni Buzuq deb Belgilash` }}
            </h3>
            <button
              @click="closeBrokenTransferModal"
              class="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              aria-label="Modalni yopish"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <div class="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg mb-6">
              <h4 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(selectedAssignment?.warehouse?.name) : selectedAssignment?.warehouse?.name || 'Noma\'lum' }}</h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Joriy holat`) : `Joriy holat` }}: {{ dat === 'datakril' ? translateText(selectedAssignment?.condition || 'N/A') : selectedAssignment?.condition || 'N/A' }}</p>
            </div>
            <form @submit.prevent="handleBrokenTransfer">
              <div class="mb-4">
                <label for="reason" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Buzilish sababi`) : `Buzilish sababi` }}:</label>
                <textarea
                  id="reason"
                  v-model="transferForm.reason"
                  placeholder="Buzilish haqida qo‘shimcha ma‘lumot..."
                  rows="3"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                ></textarea>
              </div>
              <div class="mb-4">
                <label for="fixByDate" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Tuzatish muddati`) : `Tuzatish muddati` }}:</label>
                <input
                  id="fixByDate"
                  v-model="transferForm.fixByDate"
                  type="date"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <div class="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  @click="closeBrokenTransferModal"
                  class="px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-500 transition-all duration-200"
                  aria-label="Bekor qilish"
                >
                  {{ dat === 'datakril' ? translateText(`Bekor qilish`) : `Bekor qilish` }}
                </button>
                <button
                  type="submit"
                  :disabled="isTransferring"
                  class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Buzuq deb belgilash"
                >
                  {{ isTransferring ? (dat === 'datakril' ? translateText('Amalga oshirilmoqda...') : 'Amalga oshirilmoqda...') : (dat === 'datakril' ? translateText('Buzuq deb Belgilash') : 'Buzuq deb Belgilash') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Take Back Modal -->
      <div
        v-if="showTransferModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in-0 duration-300"
        @click="closeTransferModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
      >
        <div
          class="bg-white dark:bg-neutral-800 rounded-2xl w-11/12 max-w-md p-6 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-700 animate-in slide-in-from-bottom-10 duration-300"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h3 id="transfer-modal-title" class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Omborni Zimmamga Olish`) : `Omborni Zimmamga Olish` }}</h3>
            <button
              @click="closeTransferModal"
              class="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              aria-label="Modalni yopish"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <div class="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg mb-6">
              <h4 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(selectedAssignment?.warehouse?.name) : selectedAssignment?.warehouse?.name || 'Noma\'lum' }}</h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Joriy holat`) : `Joriy holat` }}: {{ dat === 'datakril' ? translateText(selectedAssignment?.condition || 'N/A') : selectedAssignment?.condition || 'N/A' }}</p>
            </div>
            <form @submit.prevent="transferWarehouse(transferForm.condition, 'takeBack')">
              <div class="mb-4">
                <label for="condition" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Ombor holati`) : `Ombor holati` }}:</label>
                <select
                  id="condition"
                  v-model="transferForm.condition"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <option value="">{{ dat === 'datakril' ? translateText(`Holatni tanlang`) : `Holatni tanlang` }}</option>
                  <option value="Yaxshi">{{ dat === 'datakril' ? translateText(`Yaxshi`) : `Yaxshi` }}</option>
                  <option value="O'rtacha">{{ dat === 'datakril' ? translateText(`O'rtacha`) : `O'rtacha` }}</option>
                  <option value="Yomon">{{ dat === 'datakril' ? translateText(`Buzuq`) : `Buzuq` }}</option>
                </select>
              </div>
              <div v-if="transferForm.condition === 'Yomon'" class="mb-4">
                <label for="reason-general" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Buzilish sababi:`) : `Buzilish sababi:` }}</label>
                <textarea
                  id="reason-general"
                  v-model="transferForm.reason"
                  placeholder="Buzilish haqida qo‘shimcha ma‘lumot..."
                  rows="3"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                ></textarea>
              </div>
              <div v-if="transferForm.condition === 'Yomon'" class="mb-4">
                <label for="fixByDate-general" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Tuzatish muddati:`) : `Tuzatish muddati:` }}</label>
                <input
                  id="fixByDate-general"
                  v-model="transferForm.fixByDate"
                  type="date"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <div class="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  @click="closeTransferModal"
                  class="px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-500 transition-all duration-200"
                  aria-label="Bekor qilish"
                >
                  {{ dat === 'datakril' ? translateText(`Bekor qilish`) : `Bekor qilish` }}
                </button>
                <button
                  type="submit"
                  :disabled="isTransferring"
                  class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Zimmamga olish"
                >
                  {{ isTransferring ? (dat === 'datakril' ? translateText('Amalga oshirilmoqda...') : 'Amalga oshirilmoqda...') : (dat === 'datakril' ? translateText(`Zimmamga Olish`) : `Zimmamga Olish`) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Assign to Another User Modal -->
      <div
        v-if="showAssignModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in-0 duration-300"
        @click="closeAssignModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-modal-title"
      >
        <div
          class="bg-white dark:bg-neutral-800 rounded-2xl w-11/12 max-w-md p-6 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-700 animate-in slide-in-from-bottom-10 duration-300"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h3 id="assign-modal-title" class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Omborni Topshirish`) : `Omborni Topshirish` }}</h3>
            <button
              @click="closeAssignModal"
              class="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              aria-label="Modalni yopish"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <div class="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg mb-6">
              <h4 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(selectedAssignment?.warehouse?.name) : selectedAssignment?.warehouse?.name || 'Noma\'lum' }}</h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Joriy holat`) : `Joriy holat` }}: {{ dat === 'datakril' ? translateText(selectedAssignment?.condition || 'N/A') : selectedAssignment?.condition || 'N/A' }}</p>
            </div>
            <form @submit.prevent="transferToAnotherUser">
              <div class="mb-4">
                <label for="newAssignedById" class="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ dat === 'datakril' ? translateText(`Foydalanuvchi tanlang`) : `Foydalanuvchi tanlang` }}:</label>
                <select
                  id="newAssignedById"
                  v-model="transferForm.newAssignedById"
                  required
                  class="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <option value="">{{ dat === 'datakril' ? translateText(`Foydalanuvchi tanlang`) : `Foydalanuvchi tanlang` }}</option>
                  <option v-for="user in allDeliverers" :key="user.id" :value="user.id">
                    {{ dat === 'datakril' ? translateText(`${user.name} ${user.surname}`) : `${user.name} ${user.surname}` }}
                  </option>
                </select>
              </div>
              <div class="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  @click="closeAssignModal"
                  class="px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-500 transition-all duration-200"
                  aria-label="Bekor qilish"
                >
                  {{ dat === 'datakril' ? translateText(`Bekor qilish`) : `Bekor qilish` }}
                </button>
                <button
                  type="submit"
                  :disabled="isTransferring"
                  class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Topshirish"
                >
                  {{ isTransferring ? (dat === 'datakril' ? translateText('Amalga oshirilmoqda...') : 'Amalga oshirilmoqda...') : (dat === 'datakril' ? translateText(`Topshirish`) : `Topshirish`) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Report Details Modal -->
      <div
        v-if="showReportModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in"
      >
        <div
          class="w-11/12 max-w-md p-6 shadow-xl rounded-2xl bg-white dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 id="report-modal-title" class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(`Buzilish Ma'lumotlari`) : `Buzilish Ma'lumotlari` }}</h3>
            <button
              @click="closeReportModal"
              class="text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <div class="bg-neutral-50 dark:bg-neutral-700 p-6 rounded-lg mb-4">
              <h4 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">{{ dat === 'datakril' ? translateText(selectedAssignment?.warehouse?.name) : selectedAssignment?.warehouse?.name || 'Noma\'lum ombor' }}</h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Holati`) : `Holati` }}: {{ dat === 'datakril' ? translateText(selectedAssignment?.condition || 'N/A') : selectedAssignment?.condition || 'N/A' }}</p>
            </div>
            <div v-if="reportDetails && !reportDetails.isFixed">
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Buzilish sababi`) : `Buzilish sababi` }}:</label>
                <p class="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
                  {{ dat === 'datakril' ? translateText(reportDetails.reason) : reportDetails.reason || 'Noma\'lum' }}
                </p>
              </div>
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Buzilgan vaqti`) : `Buzilgan vaqti` }}:</label>
                <p class="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
                  {{ formatDate(reportDetails.createdAt) }}
                </p>
              </div>
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ dat === 'datakril' ? translateText(`Tuzatish muddati`) : `Tuzatish muddati` }}:</label>
                <p class="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
                  {{ formatDate(reportDetails.fixByDate) }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-6 text-neutral-500 dark:text-neutral-400">
              {{ dat === 'datakril' ? translateText(`Bu mahsulot tuzatilgan yoki ma'lumot topilmadi`) : `Bu mahsulot tuzatilgan yoki ma'lumot topilmadi` }}
            </div>
            <div class="flex justify-end mt-6">
              <button
                @click="closeReportModal"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                aria-label="Close"
              >
                {{ dat === 'datakril' ? translateText(`Yopish`) : `Yopish` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

// State
const isLoading = inject('isLoading');
const isTransferring = ref(false);
const activeTab = ref('mine');
const showTransferModal = ref(false);
const showBrokenTransferModal = ref(false);
const showReportModal = ref(false);
const showAssignModal = ref(false);
const selectedAssignment = ref(null);
const transferType = ref('takeBack');
const role = ref(localStorage.getItem('role') || 'warehouseman');
const reportDetails = ref(null);

// Data
const myAssignments = ref([]);
const transferredAssignments = ref([]);
const brokenAssignments = ref([]);
const myWarehouses = ref([]);
const allUsers = ref([]);
const allDeliverers = ref([]);

const dat = ref("datalotin");

let intervalId = null;

const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 1000); // Har 1 soniyada tilni tekshirish
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
function formatDate(dateStr) {
  if (!dateStr) return 'Belgilanmagan'
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
// Form
const transferForm = ref({
  newAssignedById: '',
  condition: '',
  note: '',
  reason: '',
  fixByDate: '',
});

// Tabs configuration
const tabs = computed(() => [
  { id: 'mine', label: 'Mening Zimmamdagilar' },
  { id: 'transferred', label: 'Topshirilganlar' },
  ...(role.value === 'warehouseman' ? [
    { id: 'broken', label: 'Buzilgan Hom Ashiyolar' },
    { id: 'myWarehouses', label: 'Mening Omborlarim' }
  ] : []),
]);

const availableUsers = computed(() => {
  return allUsers.value.filter(user => user.id !== getCurrentUserId());
});

// Methods
const getCurrentUserId = () => {
  return JSON.parse(localStorage.getItem('id'));
};

const getFirstWarehousemanId = () => {
  const warehouseman = allUsers.value.find(user => user.role === 'warehouseman');
  return warehouseman?.id || '';
};

const fetchMyAssignments = async () => {
  isLoading.value = true;
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${URL}/warehouse-assignment`);
    const allAssignments = await response.json();
    myAssignments.value = allAssignments.filter(assignment => 
      assignment.assignedById === userId && 
      !assignment.toDate &&
      (role.value === 'warehouseman' ? true : assignment.condition !== 'Yomon') &&
      (role.value === 'warehouseman' ? true : assignment.warehouse?.userId === userId)
    );
  } catch (error) {
    console.error('Mening topshiriqlarimni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTransferredAssignments = async () => {
  isLoading.value = true;
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${URL}/warehouse-assignment`);
    const allAssignments = await response.json();
    transferredAssignments.value = allAssignments.filter(assignment => 
      (role.value === 'warehouseman' ? true : assignment.warehouse?.userId === userId) && 
      assignment.assignedById !== userId && 
      !assignment.toDate &&
      (role.value === 'warehouseman' ? true : assignment.condition !== 'Yomon')
    );
  } catch (error) {
    console.error('Topshirilgan topshiriqlarni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchBrokenAssignments = async () => {
  isLoading.value = true;
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${URL}/warehouse-assignment`);
    const allAssignments = await response.json();
    brokenAssignments.value = allAssignments.filter(assignment => 
      (role.value === 'warehouseman' ? true : assignment.assignedById === userId) && 
      !assignment.toDate &&
      assignment.condition === 'Yomon'
    );
  } catch (error) {
    console.error('Buzilgan topshiriqlarni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchMyWarehouses = async () => {
  isLoading.value = true;
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${URL}/warehouse-assignment`);
    const allAssignments = await response.json();
    myWarehouses.value = allAssignments.filter(assignment => 
      assignment.assignedById === userId && 
      assignment.warehouse?.userId === userId && 
      !assignment.toDate
    );
  } catch (error) {
    console.error('Mening omborlarimni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAllUsers = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/warehouseman`);
    allUsers.value = await response.json();
  } catch (error) {
    console.error('Foydalanuvchilarni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAllDeliverers = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/deliverer/allUsers`);
    allDeliverers.value = await response.json();
  } catch (error) {
    console.error('Yetkazuvchilarni olishda xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchReportDetails = async (warehouseId) => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/warehouse-assignment/broken/${warehouseId}`);
    const brokenProduct = await response.json();
    reportDetails.value = brokenProduct;
  } catch (error) {
    console.error('Buzilish ma\'lumotlarini olishda xatolik:', error);
    reportDetails.value = null;
  } finally {
    isLoading.value = false;
  }
};

const openReportModal = async (assignment) => {
  selectedAssignment.value = assignment;
  await fetchReportDetails(assignment.warehouseId);
  showReportModal.value = true;
};

const closeReportModal = () => {
  showReportModal.value = false;
  selectedAssignment.value = null;
  reportDetails.value = null;
};

const openTransferModal = (assignment, type) => {
  selectedAssignment.value = assignment;
  transferType.value = type;
  transferForm.value = {
    newAssignedById: getCurrentUserId(),
    condition: 'Yaxshi',
    note: '',
    reason: '',
    fixByDate: '',
  };
  showTransferModal.value = true;
};

const closeTransferModal = () => {
  showTransferModal.value = false;
  selectedAssignment.value = null;
  transferType.value = 'takeBack';
  transferForm.value = {
    newAssignedById: '',
    condition: '',
    note: '',
    reason: '',
    fixByDate: '',
  };
};

const openBrokenTransferModal = (assignment) => {
  selectedAssignment.value = assignment;
  const warehousemanId = getFirstWarehousemanId();
  if (!warehousemanId) {
    alert('Xatolik: Omborxona xodimi topilmadi');
    return;
  }
  transferForm.value = {
    newAssignedById: warehousemanId,
    condition: 'Yomon',
    note: '',
    reason: '',
    fixByDate: new Date().toISOString().split('T')[0],
  };
  showBrokenTransferModal.value = true;
};

const closeBrokenTransferModal = () => {
  showBrokenTransferModal.value = false;
  selectedAssignment.value = null;
  transferForm.value = {
    newAssignedById: '',
    condition: '',
    note: '',
    reason: '',
    fixByDate: '',
  };
};

const openAssignModal = (assignment) => {
  selectedAssignment.value = assignment;
  transferForm.value = {
    newAssignedById: '',
    condition: assignment.condition || 'Yaxshi',
    note: '',
    reason: '',
    fixByDate: '',
  };
  showAssignModal.value = true;
};

const closeAssignModal = () => {
  showAssignModal.value = false;
  selectedAssignment.value = null;
  transferForm.value = {
    newAssignedById: '',
    condition: '',
    note: '',
    reason: '',
    fixByDate: '',
  };
};

const handleBrokenTransfer = async () => {
  if (!transferForm.value.reason.trim()) {
    alert('Buzilish sababini kiriting!');
    return;
  }
  await transferWarehouse('Yomon', 'transfer');
};

const quickTransfer = async (assignment, condition) => {
  isLoading.value = true;
  try {
    isTransferring.value = true;
    if (condition === 'Yomon') {
      openBrokenTransferModal(assignment);
      return;
    }
    const warehousemanId = getFirstWarehousemanId();
    if (!warehousemanId) {
      alert('Xatolik: Omborxona xodimi topilmadi');
      return;
    }
    const transferData = {
      assignmentId: assignment.id,
      newAssignedById: warehousemanId,
      condition,
      note: '',
      reason: '',
      fixByDate: '',
    };

    const response = await fetch(`${URL}/warehouse-assignment/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferData),
    });

    if (response.ok) {
      await refreshData();
    } else {
      const error = await response.json();
      alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    }
  } catch (error) {
    console.error('Transfer xatoligi:', error);
    alert('Xatolik: Transfer amalga oshirilmadi');
  } finally {
    isTransferring.value = false;
    isLoading.value = false;
  }
};

const quickTakeBack = async (assignment, condition) => {
  isLoading.value = true;
  try {
    isTransferring.value = true;
    const updateData = {
      assignedById: getCurrentUserId(),
      condition,
      note: '',
      reason: condition === 'Yomon' ? 'Quick take back to broken state' : '',
      fixByDate: condition === 'Yomon' ? new Date().toISOString().split('T')[0] : '',
    };

    const response = await fetch(`${URL}/warehouse-assignment/${assignment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      await refreshData();
    } else {
      const error = await response.json();
      alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    }
  } catch (error) {
    console.error('Take back xatoligi:', error);
    alert('Xatolik: Take back amalga oshirilmadi');
  } finally {
    isTransferring.value = false;
    isLoading.value = false;
  }
};

const transferWarehouse = async (condition, mode) => {
  isLoading.value = true;
  try {
    isTransferring.value = true;
    if (mode === 'takeBack') {
      const updateData = {
        assignedById: getCurrentUserId(),
        condition: condition || transferForm.value.condition,
        note: transferForm.value.note,
        reason: condition === 'Yomon' ? transferForm.value.reason.trim() : '',
        fixByDate: condition === 'Yomon' ? transferForm.value.fixByDate : '',
      };

      const response = await fetch(`${URL}/warehouse-assignment/${selectedAssignment.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        closeTransferModal();
        await refreshData();
      } else {
        const error = await response.json();
        alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
      }
    } else if (mode === 'transfer') {
      const warehousemanId = getFirstWarehousemanId();
      if (!warehousemanId) {
        alert('Xatolik: Omborxona xodimi topilmadi');
        return;
      }
      const transferData = {
        assignmentId: selectedAssignment.value.id,
        newAssignedById: warehousemanId,
        condition: condition || transferForm.value.condition,
        note: transferForm.value.note,
        reason: condition === 'Yomon' ? transferForm.value.reason.trim() : '',
        fixByDate: condition === 'Yomon' ? transferForm.value.fixByDate : '',
      };

      const response = await fetch(`${URL}/warehouse-assignment/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        closeBrokenTransferModal();
        await refreshData();
      } else {
        const error = await response.json();
        alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
      }
    }
  } catch (error) {
    console.error('Transfer yoki update xatoligi:', error);
    alert('Xatolik: Transfer yoki update amalga oshirilmadi');
  } finally {
    isTransferring.value = false;
    isLoading.value = false;
  }
};

const transferToAnotherUser = async () => {
  isLoading.value = true;
  try {
    isTransferring.value = true;
    if (!transferForm.value.newAssignedById) {
      alert('Foydalanuvchi tanlanmadi!');
      return;
    }
    const updateData = {
      warehouseAssignmentId: selectedAssignment.value.id,
      userId: Number(transferForm.value.newAssignedById),
    };

    const response = await fetch(`${URL}/warehouse-assignment/update-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      closeAssignModal();
      await refreshData();
    } else {
      const error = await response.json();
      alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    }
  } catch (error) {
    console.error('Topshirish xatoligi:', error);
    alert('Xatolik: Topshirish amalga oshirilmadi');
  } finally {
    isTransferring.value = false;
    isLoading.value = false;
  }
};

const markAsFixed = async (assignment) => {
  isLoading.value = true;
  try {
    isTransferring.value = true;
    const updateData = {
      assignedById: getCurrentUserId(),
      condition: 'Yaxshi',
      note: 'Mahsulot tuzatildi',
      reason: '',
      fixByDate: '',
    };

    const response = await fetch(`${URL}/warehouse-assignment/${assignment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      await refreshData();
    } else {
      const error = await response.json();
      alert(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    }
  } catch (error) {
    console.error('Tuzatildi deb belgilashda xatolik:', error);
    alert('Xatolik: Tuzatildi deb belgilash amalga oshirilmadi');
  } finally {
    isTransferring.value = false;
    isLoading.value = false;
  }
};

const refreshData = async () => {
  await Promise.all([
    fetchMyAssignments(),
    fetchTransferredAssignments(),
    fetchBrokenAssignments(),
    fetchMyWarehouses(),
  ]);
};

const refreshMyAssignments = async () => {
  await fetchMyAssignments();
};

const refreshTransferredAssignments = async () => {
  await fetchTransferredAssignments();
};

const refreshBrokenAssignments = async () => {
  await fetchBrokenAssignments();
};

const refreshMyWarehouses = async () => {
  await fetchMyWarehouses();
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchMyAssignments(),
    fetchTransferredAssignments(),
    fetchBrokenAssignments(),
    fetchMyWarehouses(),
    fetchAllUsers(),
    fetchAllDeliverers(),
  ]);
});
</script>