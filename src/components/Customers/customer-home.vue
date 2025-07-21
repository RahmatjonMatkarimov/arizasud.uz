```vue
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                </path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ translateText('Mijozlarni boshqarish') }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('Mijozlar boshqaruvi tizimi') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                  </path>
                </svg>
                <span>{{ filteredCustomers.length }} {{ translateText('mijoz') }}</span>
              </div>
            </div>
            <button @click.stop="openModal"
              class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Yangi mijoz qo\'shish')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              {{ translateText('Yangi mijoz qo\'shish') }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <!-- Status Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div @click="setStatusFilter('accepted')" :class="{ 'ring-2 ring-blue-500': selectedStatus === 'accepted' }"
          class="cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Qabul qilingan') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ statusCounts.accepted }} {{ translateText('mijoz')
                }}</p>
            </div>
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div @click="setStatusFilter('waiting')" :class="{ 'ring-2 ring-blue-500': selectedStatus === 'waiting' }"
          class="cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Yurist zimmasiga otkazilganlar') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ statusCounts.waiting }} {{ translateText('mijoz')
                }}</p>
            </div>
            <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l1.5 1.5" />
            </svg>
          </div>
        </div>
        <div @click="setStatusFilter('completed')" :class="{ 'ring-2 ring-blue-500': selectedStatus === 'completed' }"
          class="cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Tugallangan') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ statusCounts.completed }} {{ translateText('mijoz')
                }}</p>
            </div>
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>



    <!-- Customer Modal -->
    <div v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
              </path>
            </svg>
            {{ editingCustomer ? translateText('Mijozni tahrirlash') : translateText('Yangi mijoz qo\'shish') }}
          </h2>
          <button @click="closeModal" class="text-white hover:text-gray-200"
            :aria-label="translateText('Modal oynasini yopish')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitCustomer" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Name -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ translateText('Ism') }} *
              </label>
              <input v-model.trim="customer.name" type="text" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Mijozning ismi')" aria-required="true"
                :aria-label="translateText('Mijozning ismini kiriting')" />
            </div>
            <!-- Surname -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ translateText('Familiya') }} *
              </label>
              <input v-model.trim="customer.surname" type="text" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Mijozning familiyasi')" aria-required="true"
                :aria-label="translateText('Mijozning familiyasini kiriting')" />
            </div>
            <!-- Phone -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                  </path>
                </svg>
                {{ translateText('Telefon') }} *
              </label>
              <input v-model="customer.phone" type="tel" required @input="formatPhoneNumber"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('+998 XX XXX XX XX')" aria-required="true"
                :aria-label="translateText('Mijozning telephone raqamini kiriting')" />
            </div>
            <!-- Purpose -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                  </path>
                </svg>
                {{ translateText('Maqsad') }} *
              </label>
              <input v-model.trim="customer.purpose" type="text" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Kelish maqsadi')" aria-required="true"
                :aria-label="translateText('Mijozning kelish maqsadini kiriting')" />
            </div>
            <!-- Region -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
 ..

                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ translateText('Viloyat') }}
              </label>
              <select v-model="customer.region_id" @change="updateDistricts"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('Viloyatni tanlang')">
                <option value="">{{ translateText('Viloyatni tanlang') }}</option>
                <option v-for="region in regions" :key="region.id" :value="String(region.id)">
                  {{ translateText(region.name_uz) }}
                </option>
              </select>
            </div>
            <!-- District -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                  </path>
                </svg>
                {{ translateText('Tuman') }}
              </label>
              <select v-model="customer.district_id" :disabled="!customer.region_id"
                class="w-full px-4 py-3 rounded-lg

 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="translateText('Tumanni tanlang')">
                <option value="">{{ translateText('Tumanni tanlang') }}</option>
                <option v-for="district in filteredDistricts" :key="district.id" :value="String(district.id)">
                  {{ translateText(district.name_uz) }}
                </option>
              </select>
            </div>
            <!-- End Date -->
            <div class="form-group md:col-span-2 lg:col-span-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ translateText('Tugash sanasi') }} *
              </label>
              <input v-model="customer.endDate" type="date" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-required="true" :aria-label="translateText('Tugash sanasini kiriting')" />
            </div>
            <!-- Description -->
            <div class="form-group md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7">
                  </path>
                </svg>
                {{ translateText('Tavsif') }} *
              </label>
              <textarea v-model.trim="customer.description" required rows="3"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                :placeholder="translateText('Qo\'shimcha ma\'lumot...')" aria-required="true"
                :aria-label="translateText('Qo\'shimcha ma\'lumot kiritish')"></textarea>
            </div>
          </div>
          <div class="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="submit"
              class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Ma\'lumotlarni saqlash')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ editingCustomer ? translateText('Yangilash') : translateText('Qo\'shish') }}
            </button>
            <button v-if="editingCustomer" type="button" @click="cancelEdit"
              class="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Tahrirni bekor qilish')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ translateText('Bekor qilish') }}
            </button>
            <button type="button" @click="closeModal"
              class="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Modal oynasini yopish')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ translateText('Yopish') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 animate-fade-in">
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
              </path>
            </svg>
            {{ translateText('Xatolik') }}
          </h2>
          <button @click="closeErrorModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            :aria-label="translateText('Xato oynasini yopish')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">{{ translateText(message) }}</p>
        <div class="flex justify-end">
          <button @click="closeErrorModal"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yopish')">
            {{ translateText('Yopish') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status Update Confirmation Modal -->
    <div v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 animate-fade-in">
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              </path>
            </svg>
            {{ translateText('Keyingi bosqichga o\'tkazish') }}
          </h2>
          <button @click="closeStatusModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            :aria-label="translateText('Modal oynasini yopish')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          {{ translateText('Mijozni keyingi bosqichga o\'tkazishni tasdiqlaysizmi?') }}
          <br />
          <span class="font-semibold">{{ selectedCustomerForStatus?.name }} {{ selectedCustomerForStatus?.surname
            }}</span>
          <br />
          {{ translateText('Hozirgi holat') }}: {{ translateText(selectedCustomerForStatus?.status === 'waiting' ?
            'Kutmoqda' : selectedCustomerForStatus?.status === 'accepted' ? 'Qabul qilingan' : 'Tugallangan') }}
          <br />
          {{ translateText('Keyingi holat') }}: {{ translateText(selectedCustomerForStatus?.status === 'waiting' ?
            'Qabul qilingan' : 'Tugallangan') }}
        </p>
        <div class="flex justify-end gap-4">
          <button @click="updateCustomerStatus"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Tasdiqlash')">
            {{ translateText('Tasdiqlash') }}
          </button>
          <button @click="closeStatusModal"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yopish')">
            {{ translateText('Yopish') }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          {{ translateText('Manzil bo\'yicha qidiruv') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Viloyat') }}
            </label>
            <select v-model="searchRegion" @change="searchDistrict = ''; updateFilteredCustomers()"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :aria-label="translateText('Viloyatni tanlang')">
              <option value="">{{ translateText('Barcha viloyatlar') }}</option>
              <option v-for="region in regions" :key="region.id" :value="String(region.id)">
                {{ translateText(region.name_uz) }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Tuman') }}
            </label>
            <select v-model="searchDistrict" :disabled="!searchRegion" @change="updateFilteredCustomers"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="translateText('Tumanni tanlang')">
              <option value="">{{ translateText('Barcha tumanlar') }}</option>
              <option v-for="district in filteredDistricts" :key="district.id" :value="String(district.id)">
                {{ translateText(district.name_uz) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="message && messageType === 'success'" class="mb-6">
        <div
          class="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 border px-4 py-3 rounded-lg shadow-sm">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ translateText(message) }}
          </div>
        </div>
      </div>

      <!-- Customers List -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            {{ translateText('Mijozlar ro\'yxati') }} ({{ filteredCustomers.length }})
          </h3>
        </div>
        <div v-if="filteredCustomers.length" class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="cust in filteredCustomers" :key="cust.id" @click="$router.push('/customer-sections/' + cust.id)"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-start space-x-4">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-semibold text-lg">
                      {{ cust.name?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {{ cust.name }} {{ cust.surname }}
                    </h4>
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                          </path>
                        </svg>
                        {{ cust.phone }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                          </path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {{cust.province ? translateText(regions.find(r => r.id === Number(cust.province))?.name_uz ||
                          'Viloyat ko\'rsatilmagan') : translateText('Viloyat ko\'rsatilmagan') }}
                        {{cust.district ? `, ${translateText(districts.find(d => d.id ===
                          Number(cust.district))?.name_uz || 'Tuman ko\'rsatilmagan')}` : '' }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                        </path>
                      </svg>
                      {{ cust.purpose }}
                    </div>
                    <div v-if="cust.endDate" class="text-sm" :class="getEndDateColor(cust.endDate)">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24" :class="getEndDateColor(cust.endDate)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                      </path>
                    </svg>
                    {{ formatDate(cust.endDate) }}
                  </div>
                    </div>
                    <div v-if="cust.description"
                      class="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded"
                      v-html="sanitizeDescription(cust.description)"></div>
                  </div>
                </div>
              </div>
              <div class="relative flex items-center flex-shrink-0">
                <button @click.stop="toggleDropdown(cust.id)"
                  class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  :aria-label="translateText('Qo\'shimcha amallar')">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v.01M12 12v.01M12 18v.01"></path>
                  </svg>
                </button>
                <div v-if="dropdownOpen === cust.id" v-click-outside="closeDropdown"
                  class="absolute right-0 top-10 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-40">
                  <button @click.stop="editCustomer(cust)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
                    :aria-label="translateText('Mijozni tahrirlash')">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                    {{ translateText('Tahrirlash') }}
                  </button>
                  <button @click.stop="openStatusModal(cust)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-950 hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                    :aria-label="translateText('Keyingi bosqichga o\'tkazish')" :disabled="cust.status === 'completed'"
                    :class="{ 'opacity-50 cursor-not-allowed': cust.status === 'completed' }">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                      </path>
                    </svg>
                    {{ translateText('Keyingi bosqich') }}
                  </button>
                  <button @click.stop="deleteCustomer(cust.id)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
                    :aria-label="translateText('Mijozni o\'chirish')">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                    {{ translateText('O\'chirish') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ translateText('Hozircha mijozlar yo\'q')
            }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ 
          translateText('Birinchi mijozingizni qo\'shish uchun yuqoridagi formadan foydalaning') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import regionsData from '@/assets/regions.json';
import districtsData from '@/assets/districts.json';
import DOMPurify from 'dompurify';
import translateText from '@/auth/Translate copy';
import { URL } from '@/auth/url';

export default {
  name: 'MijozlarniBoshqarish',
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  setup() {
    const regions = ref(regionsData);
    const districts = ref(districtsData);
    const customers = ref([]);
    const customer = ref({
      name: '',
      surname: '',
      phone: '',
      purpose: '',
      region_id: '',
      district_id: '',
      endDate: '',
      description: '',
      status: ''
    });
    const isModalOpen = ref(false);
    const isDarkMode = ref(false);
    const message = ref('');
    const messageType = ref('success');
    const editingCustomer = ref(null);
    const dropdownOpen = ref(null);
    const searchRegion = ref('');
    const searchDistrict = ref('');
    const showErrorModal = ref(false);
    const selectedStatus = ref('');
    const showStatusModal = ref(false);
    const selectedCustomerForStatus = ref(null);

    const translatedCustomers = computed(() => {
      return customers.value.map(cust => ({
        ...cust,
        name: translateText(cust.name || ''),
        surname: translateText(cust.surname || ''),
        purpose: translateText(cust.purpose || ''),
        description: translateText(cust.description || ''),
        province: cust.province ? String(cust.province) : '',
        district: cust.district ? String(cust.district) : '',
        endDate: cust.endDate ? cust.endDate : ''
      }));
    });

    const filteredCustomers = computed(() => {
      let filtered = translatedCustomers.value;
      if (searchRegion.value) {
        filtered = filtered.filter(cust => cust.province === String(searchRegion.value));
      }
      if (searchDistrict.value) {
        filtered = filtered.filter(cust => cust.district === String(searchDistrict.value));
      }
      if (selectedStatus.value) {
        filtered = filtered.filter(cust => cust.status === selectedStatus.value);
      }
      
      // Sort by endDate proximity to current date
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Normalize to start of day for consistent comparison
      return filtered.sort((a, b) => {
        // Handle cases where endDate might be missing or invalid
        const dateA = a.endDate ? new Date(a.endDate) : new Date('9999-12-31'); // Push invalid/missing dates to the end
        const dateB = b.endDate ? new Date(b.endDate) : new Date('9999-12-31');
        
        // Calculate absolute difference from current date
        const diffA = Math.abs(dateA - now);
        const diffB = Math.abs(dateB - now);
        
        return diffA - diffB; // Sort in ascending order (closest dates first)
      });
    });

    const filteredDistricts = computed(() => {
      const regionId = Number(customer.value.region_id || searchRegion.value);
      return districts.value.filter(district => Number(district.region_id) === regionId);
    });

    const statusCounts = computed(() => {
      return {
        accepted: customers.value.filter(c => c.status === 'accepted').length,
        waiting: customers.value.filter(c => c.status === 'waiting').length,
        completed: customers.value.filter(c => c.status === 'completed').length
      };
    });

    return {
      regions,
      districts,
      customers,
      customer,
      isModalOpen,
      isDarkMode,
      message,
      messageType,
      editingCustomer,
      dropdownOpen,
      searchRegion,
      searchDistrict,
      showErrorModal,
      selectedStatus,
      showStatusModal,
      selectedCustomerForStatus,
      translatedCustomers,
      filteredCustomers,
      filteredDistricts,
      statusCounts,
      translateText
    };
  },
  methods: {
    getEndDateColor(endDate) {
      if (!endDate) return 'text-gray-600 dark:text-gray-400';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 5) {
        return 'text-red-600 dark:text-red-400';
      } else if (diffDays < 10) {
        return 'text-yellow-600 dark:text-yellow-400';
      } else {
        return 'text-green-600 dark:text-green-400';
      }
    },
    async fetchCustomers() {
      try {
        const response = await axios.get(`${URL}/customers`);
        this.customers = response.data.map(customer => ({
          ...customer,
          province: customer.province ? String(customer.province) : '',
          district: customer.district ? String(customer.district) : '',
          endDate: customer.endDate || '',
        }));

      } catch (error) {
        this.message = translateText('Mijozlarni yuklashda xatolik yuz berdi!');
        this.messageType = 'error';
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
      }
    },

    setStatusFilter(status) {
      this.selectedStatus = this.selectedStatus === status ? '' : status;
    },
    formatDate(isoDate) {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    openModal() {
      this.isModalOpen = true;
      this.editingCustomer = null;
      this.resetCustomerForm();
      this.message = '';
      this.dropdownOpen = null;
    },
    closeModal() {
      this.isModalOpen = false;
      this.editingCustomer = null;
      this.resetCustomerForm();
      this.message = '';
      this.dropdownOpen = null;
    },
    closeErrorModal() {
      this.showErrorModal = false;
      this.message = '';
      this.messageType = 'success';
    },
    closeStatusModal() {
      this.showStatusModal = false;
      this.selectedCustomerForStatus = null;
      this.message = '';
    },
    resetCustomerForm() {
      this.customer = {
        name: '',
        surname: '',
        phone: '',
        purpose: '',
        region_id: '',
        district_id: '',
        endDate: '',
        description: '',
        status: ''
      };
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle('dark');
    },
    updateDistricts() {
      const regionId = Number(this.customer.region_id);
      const validDistrict = this.customer.district_id && this.districts.some(d => Number(d.id) === Number(this.customer.district_id) && Number(d.region_id) === regionId);
      if (!validDistrict) {
        this.customer.district_id = '';
      }
    },
    updateFilteredCustomers() {
      // No implementation needed
    },
    formatPhoneNumber(event) {
      let input = event.target.value.replace(/\D/g, '');
      if (input.length > 0) {
        if (!input.startsWith('998')) {
          input = '998' + input;
        }
        input = input.substring(0, 12);
        let formatted = '+998';
        if (input.length > 3) formatted += ' ' + input.substring(3, 5);
        if (input.length > 5) formatted += ' ' + input.substring(5, 8);
        if (input.length > 8) formatted += ' ' + input.substring(8, 10);
        if (input.length > 10) formatted += ' ' + input.substring(10, 12);
        this.customer.phone = formatted;
      } else {
        this.customer.phone = '';
      }
    },
    sanitizeDescription(description) {
      const translated = translateText(description || '');
      return DOMPurify.sanitize(translated);
    },
    validateCustomer() {
      if (!this.customer.name || !this.customer.surname || !this.customer.phone || !this.customer.purpose || !this.customer.endDate || !this.customer.description) {
        this.message = translateText('Barcha majburiy maydonlarni to\'ldiring!');
        this.messageType = 'error';
        this.showErrorModal = true;
        return false;
      }
      const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
      if (!phoneRegex.test(this.customer.phone)) {
        this.message = translateText('Telefon raqami +998 XX XXX XX XX formatida bo\'lishi kerak!');
        this.messageType = 'error';
        this.showErrorModal = true;
        return false;
      }
      const selectedDate = new Date(this.customer.endDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDate < now) {
        this.message = translateText('Tugash sanasi hozirgi kundan keyin bo\'lishi kerak!');
        this.messageType = 'error';
        this.showErrorModal = true;
        return false;
      }
      if (this.customer.region_id && !this.regions.some(r => Number(r.id) === Number(this.customer.region_id))) {
        this.message = translateText('Noto\'g\'ri viloyat tanlandi!');
        this.messageType = 'error';
        this.showErrorModal = true;
        return false;
      }
      if (this.customer.district_id && !this.districts.some(d => Number(d.id) === Number(this.customer.district_id) && Number(d.region_id) === Number(this.customer.region_id))) {
        this.message = translateText('Noto\'g\'ri tuman tanlandi!');
        this.messageType = 'error';
        this.showErrorModal = true;
        return false;
      }
      return true;
    },
    async submitCustomer() {
      if (!this.validateCustomer()) {
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
        return;
      }
      const customerData = {
        name: this.customer.name,
        surname: this.customer.surname,
        phone: this.customer.phone.replace(/\s/g, ''),
        purpose: this.customer.purpose,
        province: this.customer.region_id ? parseInt(this.customer.region_id) : 0,
        district: this.customer.district_id ? parseInt(this.customer.district_id) : 0,
        description: this.customer.description,
        endDate: this.customer.endDate ? new Date(this.customer.endDate).toISOString().split('T')[0] + 'T00:00:00.000Z' : '',
      };

      try {
        if (this.editingCustomer) {
          await axios.put(`${URL}/customers/${this.editingCustomer.id}`, customerData);
          this.message = translateText('Mijoz ma\'lumotlari yangilandi!');
        } else {
          const response = await axios.post(`${URL}/customers`, customerData);
          this.message = translateText('Yangi mijoz qo\'shildi!');
        }
        this.messageType = 'success';
        this.fetchCustomers()
        this.closeModal();
        setTimeout(() => { this.message = ''; }, 3000);
      } catch (error) {
        this.message = translateText('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring!');
        this.messageType = 'error';
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
      }
    },
    async deleteCustomer(id) {
      if (confirm(translateText('Mijozni o\'chirishni tasdiqlaysizmi?'))) {
        try {
          await axios.delete(`${URL}/customers/${id}`);
          this.customers = this.customers.filter(c => c.id !== id);
          this.message = translateText('Mijoz o\'chirildi!');
          this.messageType = 'success';
          setTimeout(() => { this.message = ''; }, 3000);
        } catch (error) {
          this.message = translateText('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring!');
          this.messageType = 'error';
          this.showErrorModal = true;
          setTimeout(() => {
            this.showErrorModal = false;
            this.message = '';
          }, 5000);
        }
        this.dropdownOpen = null;
      }
    },

    editCustomer(customer) {
      this.editingCustomer = { ...customer };
      const regionId = customer.province ? String(customer.province) : '';
      const districtId = customer.district ? String(customer.district) : '';
      const validDistrict = districtId && this.districts.some(d => Number(d.id) === Number(districtId) && Number(d.region_id) === Number(regionId));
      this.customer = {
        name: customer.name || '',
        surname: customer.surname || '',
        phone: customer.phone || '',
        purpose: customer.purpose || '',
        region_id: regionId,
        district_id: validDistrict ? districtId : '',
        endDate: customer.endDate ? new Date(customer.endDate).toISOString().split('T')[0] : '',
        description: customer.description || '',
        status: customer.status || 'waiting'
      };
      this.isModalOpen = true;
      this.dropdownOpen = null;
      this.updateDistricts();
    },
    cancelEdit() {
      this.closeModal();
    },
    toggleDropdown(customerId) {
      if (this.isModalOpen || this.showStatusModal) return;
      this.dropdownOpen = this.dropdownOpen === customerId ? null : customerId;
    },
    closeDropdown() {
      this.dropdownOpen = null;
    },
    validateJsonData() {
      if (!Array.isArray(this.regions) || !this.regions.every(r => r.id && r.name_uz && typeof r.id === 'number')) {
        this.message = translateText('Viloyatlar ma\'lumotlari yuklanmadi. Iltimos, tizim administratoriga murojaat qiling!');
        this.messageType = 'error';
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
        this.regions = [];
      }
      if (!Array.isArray(this.districts) || !this.districts.every(d => d.id && d.region_id && d.name_uz && typeof d.id === 'number' && typeof d.region_id === 'number')) {
        this.message = translateText('Tumanlar ma\'lumotlari yuklanmadi. Iltimos, tizim administratoriga murojaat qiling!');
        this.messageType = 'error';
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
        this.districts = [];
      }
    },
    openStatusModal(customer) {
      this.selectedCustomerForStatus = customer;
      this.showStatusModal = true;
      this.dropdownOpen = null;
    },
    async updateCustomerStatus() {
      try {
        const res = await axios.put(`${URL}/customers/${this.selectedCustomerForStatus.id}`, {
          status: this.selectedCustomerForStatus.status === 'waiting' ? 'completed' : 'waiting'
        });
        this.fetchCustomers()
        this.message = translateText('Mijoz holati yangilandi!');
        this.messageType = 'success';
        setTimeout(() => { this.message = ''; }, 3000);
        this.closeStatusModal();
      } catch (error) {
        this.message = translateText('Holatni yangilashda xatolik yuz berdi!');
        this.messageType = 'error';
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.message = '';
        }, 5000);
        this.closeStatusModal();
      }
    }
  },

  
  mounted() {
    if (localStorage.getItem('darkMode') === 'true') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
    this.validateJsonData();
    this.fetchCustomers();
    this.setStatusFilter('accepted')
  },
  watch: {
    isDarkMode(newVal) {
      localStorage.setItem('darkMode', newVal);
    },
    isModalOpen(newVal) {
      if (newVal) {
        this.dropdownOpen = null;
      }
    },
    'customer.region_id'(newVal) {
      this.updateDistricts();
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed.inset-0 {
  z-index: 50 !important;
}

.fixed.inset-0.z-60 {
  z-index: 60 !important;
}
</style>
```