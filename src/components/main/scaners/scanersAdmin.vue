<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-300"
  >
    <!-- Sarlavha Bo'limi -->
    <div
      class="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- Sarlavha -->
          <div class="flex items-center gap-4">
            <div
              class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div>
              <h1
                class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
              >
                {{
                  dat === "datakril"
                    ? translateText(`Skanerlash xizmatlari bo'limi`)
                    : `Skanerlash xizmatlari bo'limi`
                }}
              </h1>
              <p class="text-slate-600 dark:text-slate-400 mt-1">
                {{
                  dat === "datakril"
                    ? translateText(`Skanerlash xizmatlarini samarali boshqaring`)
                    : `Skanerlash xizmatlarini samarali boshqaring`
                }}
              </p>
            </div>
          </div>

          <!-- Harakatlar -->
          <div class="flex items-center gap-3">
            <button
              @click="openCreateModal"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              {{ dat === 'datakril' ? translateText(`Bo'lim yaratish`) : `Bo'lim yaratish` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Asosiy tarkib -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Skanerlar tarmog'i -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="scanner in scanners"
          :key="scanner.id"
          class="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          <div
            class="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
          >
            <img
              v-if="scanner.img"
              :src="`${URL}${scanner.img}`"
              alt="Skaner rasmi"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg
                class="w-16 h-16 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>

            <!-- Holat belgisi -->
            <div class="absolute top-3 left-3">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                  scanner.isActive
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
                ]"
              >
                <div
                  :class="[
                    'w-1.5 h-1.5 rounded-full',
                    scanner.isActive ? 'bg-red-500' : 'bg-green-500',
                  ]"
                ></div>
                {{ scanner.isActive ? dat === "datakril" ? translateText('Faol emas') : 'Faol emas' : dat ===  `datakril` ? translateText(`Faol`) : `Faol` }}
              </span>
            </div>

            <!-- Uch nuqtali menyu -->
            <div class="absolute z-50 top-3 right-3">
              <button
                @click="openMenuModal(scanner)"
                class="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 shadow-sm"
              >
                <svg
                  class="w-5 h-5 text-slate-600 dark:text-slate-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Skaner ma'lumotlari -->
          <div class="p-6">
            <h3
              class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {{ dat === "datakril" ? translateText(scanner.name) : scanner.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-if="scanners.length === 0" class="text-center py-16">
        <svg
          class="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          ></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
          {{ dat === 'datakril'  ? translateText(`Skanerlar topilmadi`) : `Skanerlar topilmadi`}}
        </h3>
        <p class="text-slate-500 dark:text-slate-500 mb-6">
          {{dat === 'datakril' ? translateText('Birinchi skanerni yaratish orqali boshlang') :'Birinchi skanerni yaratish orqali boshlang'}}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          {{ dat === "datakril" ? translateText(`Skaner yaratish`) : `Skaner yaratish` }}
        </button>
      </div>
    </div>

<!-- Menu Modal -->
<div
  v-if="showMenuModal"
  @click="showMenuModal = false"
  class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
>
  <!-- Modal Container -->
  <div
    @click.stop
    class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]"
  >
    
    <!-- Header Section -->
    <div class="relative">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <!-- Header Content -->
      <div class="relative p-8 text-white">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-4">
            <!-- Icon Container -->
            <div class="relative">
              <div class="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
              <div class="relative p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 transform hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Title Section -->
            <div>
              <h3 class="text-2xl font-bold mb-1">
                {{ dat === 'datakril' ? translateText('Skaner sozlamalari') : 'Skaner sozlamalari' }}
              </h3>
              <p class="text-white/80 text-sm font-medium">{{dat === 'datakril' ? translateText('Qurilma boshqaruvi va sozlamalari') :'Qurilma boshqaruvi va sozlamalari'}}</p>
            </div>
          </div>
          
          <!-- Close Button -->
          <button
            @click="showMenuModal = false"
            class="group relative p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-90"
          >
            <div class="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="relative w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-8 space-y-4">
      
      <!-- Edit Button -->
      <button
        @click="openEditModal(selectedScanner)"
        class="group relative flex items-center gap-5 w-full p-5 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30"
      >
        
        <!-- Icon -->
        <div class="relative">
          <div class="absolute inset-0 bg-blue-200 dark:bg-blue-700/50 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1">
          <div class="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">
            {{ dat === 'datakril' ? translateText('Tahrirlash') : 'Tahrirlash' }}
          </div>
          <p class="text-slate-600 dark:text-slate-400 text-sm">{{ dat === 'datakril' ? translateText(`Skaner ma'lumotlarini o'zgartirish`) : `Skaner ma'lumotlarini o'zgartirish` }}</p>
        </div>
        
        <!-- Arrow -->
        <div class="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-600 transition-all duration-300">
          <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </button>

      <!-- Delete Button -->
      <button
        @click="openDeleteModal(selectedScanner.id)"
        class="group relative flex items-center gap-5 w-full p-5 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-100 dark:border-red-800/30 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/30 dark:hover:to-rose-800/30"
      >
        
        <!-- Icon -->
        <div class="relative">
          <div class="absolute inset-0 bg-red-200 dark:bg-red-700/50 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-4 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1">
          <div class="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">
            {{ dat === 'datakril' ? translateText(`O'chirish`) : `O'chirish` }}
          </div>
          <p class="text-slate-600 dark:text-slate-400 text-sm">{{ dat === 'datakril' ? translateText(`Skaner ma'lumotlarini o'chirish`) : `Skaner ma'lumotlarini o'chirish` }}</p>
        </div>
        
        <!-- Arrow -->
        <div class="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-600 transition-all duration-300">
          <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </button>

      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
           <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white dark:bg-slate-800 px-4 text-slate-500 dark:text-slate-400 font-medium">{{ dat === 'datakril' ? translateText(`Sozlamalar`) : `Sozlamalar` }}</span>
        </div>
      </div>

      <!-- Toggle Setting -->
      <div class="relative p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 overflow-hidden">
        
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-teal-500 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Icon -->
            <div class="relative">
              <div class="absolute inset-0 bg-emerald-200 dark:bg-emerald-700/50 rounded-2xl blur-sm opacity-50"></div>
              <div class="relative p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Text -->
            <div>
              <div class="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">
                {{ dat === 'datakril' ? translateText(`"Tez kunda" rejimi`) : `"Tez kunda" rejimi` }}
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-sm">{{ dat === 'datakril' ? translateText(`Tez kunda rejimini sozlash`) : `Tez kunda rejimini sozlash` }}</p>
            </div>
          </div>

          <!-- Toggle Switch -->
          <div class="flex items-center gap-4">
            <label class="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                v-model="selectedScanner.isActive"
                @change="updateWorkStatus(selectedScanner)"
                class="sr-only peer"
              />
              <div class="relative w-16 h-8 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-600 hover:shadow-lg transition-all duration-300 group-hover:scale-105"></div>
              
              <!-- Switch Icons -->
              <div class="absolute left-1 top-1 w-6 h-6 flex items-center justify-center transition-opacity duration-300 peer-checked:opacity-0">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div class="absolute right-1 top-1 w-6 h-6 flex items-center justify-center transition-opacity duration-300 opacity-0 peer-checked:opacity-100">
                <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </label>
            
            <div class="text-sm font-bold min-w-[4rem] text-center transition-colors duration-300"
                 :class="selectedScanner.isActive 
                   ? 'text-emerald-600 dark:text-emerald-400' 
                   : 'text-slate-700 dark:text-slate-300'">
              {{ selectedScanner.isActive ? dat === 'datakril' ? translateText(`Yoqilgan`) : `Yoqilgan` : dat === 'datakril'? translateText('O\'chirilgan') : 'O\'chirilgan' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border-t border-slate-200 dark:border-slate-700">
      <div class="flex gap-4">
        <button
          @click="showMenuModal = false"
          class="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 hover:from-slate-300 hover:to-slate-400 dark:hover:from-slate-500 dark:hover:to-slate-400 text-slate-700 dark:text-slate-300 font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-500"
        >
          {{ dat === 'datakril' ? translateText(`Yopish`) : `Yopish` }}
        </button>
      </div>
    </div>
  </div>
</div>

    <!-- Yaratish oynasi -->
    <div
      v-if="showCreateModal" @click="showCreateModal = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div @click.stop
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
      >
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
            {{ dat === `datakril` ? translateText(`Bo'lim yaratish`) : `Bo'lim yaratish` }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            {{ dat === 'datakril' ? translateText(`Yangi skaner xizmatini yaratish`) : `Yangi skaner xizmatini yaratish` }}
          </p>
        </div>

        <form @submit.prevent="createScanner" class="p-6 space-y-6">
          <div>
            <label
              class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >{{dat === 'datakril' ? translateText(`Skaner nomi`) : `Skaner nomi`}}</label
            >
            <input
              v-model="newScanner.name"
              :placeholder="dat === 'datakril' ? translateText(`Bo'lim nomi`) : `Bo'lim nomi`"
              required
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white transition-all duration-200"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >{{ dat === `datakril` ? translateText(`Skaner rasmi`) : `Skaner rasmi` }}</label
            >
            <div
              class="relative w-full p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all duration-300"
              :class="{
                'border-blue-500 bg-blue-100 dark:bg-blue-900/30 shadow-lg': isDraggingCreate,
                'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md': !isDraggingCreate,
              }"
              @dragover.prevent="isDraggingCreate = true"
              @dragleave.prevent="isDraggingCreate = false"
              @drop.prevent="handleDropCreate"
            >
              <input
                type="file"
                ref="createFileInput"
                @change="onFileChange"
                accept="image/jpeg,image/png,image/jpg"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div v-if="previewCreateUrl" class="mb-3 animate-pulse">
                <img
                  :src="previewCreateUrl"
                  alt="Preview"
                  class="w-24 h-24 object-cover rounded-lg shadow-md border border-slate-200 dark:border-slate-600 transform transition-transform duration-300 hover:scale-105"
                />
                <button
                  @click="clearCreateFile"
                  class="mt-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  {{ dat === "datakril" ? translateText(`O'chirish`) : `O'chirish` }}
                </button>
              </div>
              <div
                v-else-if="newScanner.img"
                class="flex items-center gap-2 mb-3 animate-pulse"
              >
                <svg
                  class="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{
                  newScanner.img.name
                }}</span>
                <button
                  @click="clearCreateFile"
                  class="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <svg
                v-else
                class="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{
                  newScanner.img
                    ? "Rasmni o'zgartirish uchun bosing yoki sudrang"
                    : "Rasmni yuklash uchun bosing yoki sudrang"
                }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-600 mt-1">
                {{ dat === 'datakril' ? translateText(`JPG, PNG, JPEG (maksimal 5MB)`) : `JPG, PNG, JPEG (maksimal 5MB)` }}
              </p>
              <div v-if="isUploadingCreate" class="w-full mt-3">
                <div
                  class="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    :style="{ width: `${uploadProgressCreate}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isUploadingCreate"
            >
              {{ dat === 'datakril' ? translateText(`Yaratish`) : `Yaratish` }}
            </button>
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {{ dat === `datakril` ? translateText(`Bekor qilish`) : `Bekor qilish` }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tahrirlash oynasi -->
    <div
      v-if="showEditModal" @click="showEditModal = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div @click.stop
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
      >
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
            {{ dat === `datakril` ? translateText(`Skanerni tahrirlash`) : `Skanerni tahrirlash` }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            {{ dat === 'datakril' ? translateText(`Skaner ma'lumotlarini yangilash`) : `Skaner ma'lumotlarini yangilash` }}
          </p>
        </div>

        <form @submit.prevent="updateScanner" class="p-6 space-y-6">
          <div>
            <label
              class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >{{dat === 'datakril' ? translateText(`Skaner nomi`) : `Skaner nomi` }}</label
            >
            <input
              v-model="editingScanner.name"
              :placeholder="dat === 'datakril' ? translateText(`Bo'lim nomi`) : `Bo'lim nomi`"
              required
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white transition-all duration-200"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >{{ dat === 'datakril' ? translateText(`Skaner rasmi`) : `Skaner rasmi` }}</label
            >
            <div
              class="relative w-full p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all duration-300"
              :class="{
                'border-blue-500 bg-blue-100 dark:bg-blue-900/30 shadow-lg': isDraggingEdit,
                'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md': !isDraggingEdit,
              }"
              @dragover.prevent="isDraggingEdit = true"
              @dragleave.prevent="isDraggingEdit = false"
              @drop.prevent="handleDropEdit"
            >
              <input
                type="file"
                ref="editFileInput"
                @change="onEditFileChange"
                accept="image/jpeg,image/png,image/jpg"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg
                class="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{
                  editingScanner.existingImg
                    ? "Rasmni o'zgartirish uchun bosing yoki sudrang"
                    : "Rasmni yuklash uchun bosing yoki sudrang"
                }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-600 mt-1">
                {{ dat === `datakril` ? translateText(`JPG, PNG, JPEG (maksimal 5MB)`) : `JPG, PNG, JPEG (maksimal 5MB)` }}
              </p>
              <div v-if="isUploadingEdit" class="w-full mt-3">
                <div
                  class="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    :style="{ width: `${uploadProgressEdit}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isUploadingEdit"
            >
              {{ dat === 'datakril' ? translateText('Yangilash') : 'Yangilash' }}
            </button>
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {{ dat === 'datakril' ? translateText(`Bekor qilish`) :`Bekor qilish` }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- O'chirish oynasi -->       
    <div
      v-if="showDeleteModal" @click="showDeleteModal = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div @click.stop
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700"
      >
        <div class="p-6 text-center">
          <div
            class="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {{ dat === 'datakril' ? translateText(`O'chirishni tasdiqlang`) : `O'chirishni tasdiqlang` }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            {{ dat === 'datakril' ? translateText(`Bu amalni qaytarib bo'lmaydi`) : `Bu amalni qaytarib bo'lmaydi`  }}
          </p>

          <div class="flex gap-3">
            <button
              @click="deleteScanner(deleteId)"
              class="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              {{ dat === `datakril` ? translateText(`O'chirish`) : `O'chirish` }}
            </button>
            <button
              @click="showDeleteModal = false"
              class="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {{ dat === `datakril` ? translateText(`Bekor qilish`) : `Bekor qilish` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { URL } from "@/auth/url";
import translateText from "@/auth/Translate";
import { inject } from "vue";

// API Base URL
const API_URL = `${URL}/scanners`;
const dat = ref(localStorage.getItem("til") || "datalotin");

// Reactive state for file handling and modals
const isDraggingCreate = ref(false);
const isDraggingEdit = ref(false);
const isUploadingCreate = ref(false);
const isUploadingEdit = ref(false);
const uploadProgressCreate = ref(0);
const uploadProgressEdit = ref(0);
const previewCreateUrl = ref(null);
const previewEditUrl = ref(null);
const createFileInput = ref(null);
const editFileInput = ref(null);
const isLoading = inject('isLoading')
const scanners = ref([]);
const newScanner = reactive({ name: "", img: null, isActive: false });
const editingScanner = reactive({
  id: null,
  name: "",
  img: null,
  isActive: false,
  existingImg: null,
});
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showMenuModal = ref(false);
const deleteId = ref(null);
const selectedScanner = ref(null);
const isDark = ref(false);

// Error handling function
const handleError = (error, message) => {
  console.error(message, error);
  const errorMessage =
    error.response?.data?.message ||
    "Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.";
  toast.error(errorMessage);
};

// Fetch scanners from API
const fetchScanners = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    scanners.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    handleError(error, "Error fetching scanners:");
  }finally{
    isLoading.value = false
  }
};

// File handling for create modal
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
    newScanner.img = file;
    if (previewCreateUrl.value) URL.revokeObjectURL(previewCreateUrl.value);
    previewCreateUrl.value = URL.createObjectURL(file);
  } else {
    toast.error(
      "Faqat JPG, PNG yoki JPEG formatdagi 5MB dan kichik rasmlar yuklanishi mumkin."
    );
    createFileInput.value.value = "";
  }
};

// File handling for edit modal
const onEditFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
    editingScanner.img = file;
    if (previewEditUrl.value && !editingScanner.existingImg)
      URL.revokeObjectURL(previewEditUrl.value);
    previewEditUrl.value = URL.createObjectURL(file);
  } else {
    toast.error(
      "Faqat JPG, PNG yoki JPEG formatdagi 5MB dan kichik rasmlar yuklanishi mumkin."
    );
    editFileInput.value.value = "";
  }
};

// Drag-and-drop handling for create modal
const handleDropCreate = (e) => {
  isDraggingCreate.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
    newScanner.img = file;
    if (previewCreateUrl.value) URL.revokeObjectURL(previewCreateUrl.value);
    previewCreateUrl.value = URL.createObjectURL(file);
  } else {
    toast.error(
      "Faqat JPG, PNG yoki JPEG formatdagi 5MB dan kichik rasmlar yuklanishi mumkin."
    );
  }
};

// Drag-and-drop handling for edit modal
const handleDropEdit = (e) => {
  isDraggingEdit.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
    editingScanner.img = file;
    if (previewEditUrl.value && !editingScanner.existingImg)
      URL.revokeObjectURL(previewEditUrl.value);
    previewEditUrl.value = URL.createObjectURL(file);
  } else {
    toast.error(
      "Faqat JPG, PNG yoki JPEG formatdagi 5MB dan kichik rasmlar yuklanishi mumkin."
    );
  }
};

// Clear file for create modal
const clearCreateFile = () => {
  newScanner.img = null;
  if (previewCreateUrl.value) URL.revokeObjectURL(previewCreateUrl.value);
  previewCreateUrl.value = null;
  createFileInput.value.value = "";
};

// Clear file for edit modal
const clearEditFile = () => {
  editingScanner.img = null;
  if (previewEditUrl.value && !editingScanner.existingImg)
    URL.revokeObjectURL(previewEditUrl.value);
  previewEditUrl.value = editingScanner.existingImg || null;
  editFileInput.value.value = "";
};

// Open modals
const openCreateModal = () => {
  newScanner.name = "";
  newScanner.img = null;
  newScanner.isActive = false;
  previewCreateUrl.value = null;
  if (createFileInput.value) createFileInput.value.value = "";
  showCreateModal.value = true;
};

const openEditModal = (scanner) => {
  editingScanner.id = scanner.id;
  editingScanner.name = scanner.name;
  editingScanner.img = null;
  editingScanner.isActive = scanner.isActive;
  editingScanner.existingImg = scanner.img ? `${URL}${scanner.img}` : null;
  previewEditUrl.value = scanner.img ? `${URL}${scanner.img}` : null;
  if (editFileInput.value) editFileInput.value.value = "";
  showEditModal.value = true;
  showMenuModal.value = false;
};

const openDeleteModal = (id) => {
  deleteId.value = id;
  showDeleteModal.value = true;
  showMenuModal.value = false;
};

const openMenuModal = (scanner) => {
  selectedScanner.value = { ...scanner };
  showMenuModal.value = true;
};

// CRUD operations
const createScanner = async () => {
  if (!newScanner.name) {
    toast.error("Iltimos, skaner nomini kiriting!");
    return;
  }
  if (!newScanner.img) {
    toast.error("Iltimos, rasm faylini tanlang!");
    return;
  }
  isUploadingCreate.value = true;
  uploadProgressCreate.value = 0;
  const formData = new FormData();
  formData.append("name", newScanner.name);
  formData.append("workStatus", false);
  formData.append("img", newScanner.img);
  isLoading.value = true;
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        uploadProgressCreate.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });
    showCreateModal.value = false;
    fetchScanners();
    toast.success("Skaner muvaffaqiyatli yaratildi!");
    clearCreateFile();
  } catch (error) {
    handleError(error, "Error creating scanner:");
  } finally {
    isUploadingCreate.value = false;
    uploadProgressCreate.value = 0;
    isLoading.value = false;
  }
};

const updateWorkStatus = async (scanner) => {
  isLoading.value = true;
  try {
    const endpoint = scanner.isActive
      ? `${API_URL}/${scanner.id}/isActive`
      : `${API_URL}/${scanner.id}/isFalse`;
    const response = await axios.get(endpoint);
    fetchScanners();
    toast.success("Skaner holati muvaffaqiyatli yangilandi!");
  } catch (error) {
    handleError(error, "Error updating workStatus:");
  }finally{
    isLoading.value = false
  }
};

const updateScanner = async () => {
  if (!editingScanner.name) {
    toast.error("Iltimos, skaner nomini kiriting!");
    return;
  }
  isUploadingEdit.value = true;
  uploadProgressEdit.value = 0;
  const formData = new FormData();
  formData.append("name", editingScanner.name);
  formData.append("workStatus", editingScanner.isActive);
  if (editingScanner.img instanceof File) {
    formData.append("img", editingScanner.img);
  }
  isLoading.value = true;
  try {
    const response = await axios.put(`${API_URL}/${editingScanner.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        uploadProgressEdit.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });
    showEditModal.value = false;
    fetchScanners();
    toast.success("Skaner muvaffaqiyatli yangilandi!");
    clearEditFile();
  } catch (error) {
    handleError(error, "Error updating scanner:");
  } finally {
    isUploadingEdit.value = false;
    uploadProgressEdit.value = 0;
    isLoading.value = false
  }
};

const deleteScanner = async (id) => {
  isLoading.value = true;
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    showDeleteModal.value = false;
    fetchScanners();
    toast.success("Skaner muvaffaqiyatli o'chirildi!");
  } catch (error) {
    handleError(error, "Error deleting scanner:");
  }finally{
    isLoading.value = false
  }
};

// Handle system theme change
const handleSystemThemeChange = (e) => {
  if (!localStorage.getItem("theme")) {
    isDark.value = e.matches;
    document.documentElement.classList.toggle("dark", isDark.value);
  }
};

// Lifecycle hooks
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark.value);
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark.value);
  }
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", handleSystemThemeChange);
  fetchScanners();
});

onUnmounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", handleSystemThemeChange);
  if (previewCreateUrl.value) URL.revokeObjectURL(previewCreateUrl.value);
  if (previewEditUrl.value && !editingScanner.existingImg)
    URL.revokeObjectURL(previewEditUrl.value);
});
</script>