<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500"
  >
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div
              class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                {{ translateText("Mijozlarni boshqarish") }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ translateText("Mijozlar boshqaruvi tizimi") }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center space-x-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span
                  >{{ filteredApplications.length }}
                  {{ translateText("mijoz") }}</span
                >
              </div>
            </div>
            <button
              @click.stop="$router.push('/customer-sms')"
              class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Kerakli mijozlarga SMS yuborish')"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {{ translateText("Mijozlarga kerakli SMS xabar yuborish") }}
            </button>
            <button
              @click.stop="openModal"
              class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Yangi mijoz qo\'shish')"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {{ translateText("Yangi mijoz qo'shish") }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <!-- Customer Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center"
        >
          <h2 class="text-xl font-semibold text-white flex items-center">
            <svg
              class="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{
              editingCustomer
                ? translateText("Mijozni tahrirlash")
                : translateText("Yangi mijoz qo'shish")
            }}
          </h2>
          <button
            @click="closeModal"
            class="text-white hover:text-gray-200"
            :aria-label="translateText('Modal oynasini yopish')"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitCustomer" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Name -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ translateText("Ism") }} *
              </label>
              <input
                v-model.trim="customer.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Mijozning ismi')"
                aria-required="true"
                :aria-label="translateText('Mijozning ismini kiriting')"
              />
            </div>
            <!-- Surname -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ translateText("Familiya") }} *
              </label>
              <input
                v-model.trim="customer.surname"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Mijozning familiyasi')"
                aria-required="true"
                :aria-label="translateText('Mijozning familiyasini kiriting')"
              />
            </div>
            <!-- Phone -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {{ translateText("Telefon raqami") }} *
              </label>
              <input
                v-model="customer.phone"
                type="tel"
                required
                @input="formatPhoneNumber"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('+998 XX XXX XX XX')"
                aria-required="true"
                :aria-label="
                  translateText('Mijozning telefon raqamini kiriting')
                "
              />
            </div>
            <!-- Purpose -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {{ translateText("Maqsad") }} *
              </label>
              <input
                v-model.trim="customer.purpose"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="translateText('Kelish maqsadi')"
                aria-required="true"
                :aria-label="
                  translateText('Mijozning kelish maqsadini kiriting')
                "
              />
            </div>
            <!-- Where Coming -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ translateText("Qayerdan kelgan") }} *
              </label>
              <select
                v-model="customer.whereComing"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('Qayerdan kelganini tanlang')"
              >
                <option value="" disabled>
                  {{ translateText("Qayerdan kelganini tanlang") }}
                </option>
                <option
                  v-for="option in whereComingOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ translateText(option.label) }}
                </option>
              </select>
            </div>
            <!-- Province -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ translateText("Viloyat") }}
              </label>
              <select
                v-model="customer.province"
                @change="updateDistricts"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('Viloyatni tanlang')"
              >
                <option value="">
                  {{ translateText("Viloyatni tanlang") }}
                </option>
                <option
                  v-for="region in regions"
                  :key="region.id"
                  :value="String(region.id)"
                >
                  {{ translateText(region.name_uz) }}
                </option>
              </select>
            </div>
            <!-- District -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {{ translateText("Tuman") }}
              </label>
              <select
                v-model="customer.district"
                :disabled="!customer.province"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="translateText('Tumanni tanlang')"
              >
                <option value="">{{ translateText("Tumanni tanlang") }}</option>
                <option
                  v-for="district in filteredDistricts"
                  :key="district.id"
                  :value="String(district.id)"
                >
                  {{ translateText(district.name_uz) }}
                </option>
              </select>
            </div>
            <!-- End Date -->
            <div class="form-group md:col-span-2 lg:col-span-1">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ translateText("Tugash sanasi") }} *
              </label>
              <input
                v-model="customer.endDate"
                type="datetime-local"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-required="true"
                :aria-label="translateText('Tugash sanasini kiriting')"
              />
            </div>
            <!-- Payment Status -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ translateText("To'lov holati") }} *
              </label>
              <select
                v-model="customer.isPaying"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('To\'lov holatini tanlang')"
              >
                <option value="" disabled>
                  {{ translateText("To'lov holatini tanlang") }}
                </option>
                <option value="paid">{{ translateText("To'landi") }}</option>
                <option value="refused">
                  {{ translateText("To'lashni rad etdi") }}
                </option>
                <option value="will_pay">
                  {{ translateText("Endi to'lov qiladi") }}
                </option>
              </select>
            </div>
            <!-- Payment Due Date -->
            <div class="form-group" v-if="customer.isPaying === 'will_pay'">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ translateText("To'lov sanasi") }} *
              </label>
              <input
                v-model="customer.paymentDueDate"
                type="datetime-local"
                :required="customer.isPaying === 'will_pay'"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('To\'lov sanasini kiriting')"
              />
            </div>
            <!-- Files -->
            <div class="form-group md:col-span-2 lg:col-span-3">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {{ translateText("Fayl Yuklash") }}
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.png"
                @change="handleFileChange"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :aria-label="translateText('Chek faylini yuklash')"
              />
              <div
                v-if="customer.files.length"
                class="mt-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <p v-for="(file, index) in customer.files" :key="index">
                  {{ file.name }}
                </p>
              </div>
            </div>
            <!-- Description -->
            <div class="form-group md:col-span-2 lg:col-span-3">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                {{ translateText("Tavsif") }} *
              </label>
              <textarea
                v-model.trim="customer.description"
                required
                rows="3"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                :placeholder="translateText('Qo\'shimcha ma\'lumot...')"
                aria-required="true"
                :aria-label="translateText('Qo\'shimcha ma\'lumot kiritish')"
              />
            </div>
          </div>
          <div
            class="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="translateText('Ma\'lumotlarni saqlash')"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{
                editingCustomer
                  ? translateText("Yangilash")
                  : translateText("Qo'shish")
              }}
            </button>
            <button
              v-if="editingCustomer"
              type="button"
              @click="cancelEdit"
              class="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Tahrirni bekor qilish')"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ translateText("Bekor qilish") }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              :aria-label="translateText('Modal oynasini yopish')"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ translateText("Yopish") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 animate-fade-in"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2
            class="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {{ translateText("Xatolik") }}
          </h2>
          <button
            @click="closeErrorModal"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            :aria-label="translateText('Xato oynasini yopish')"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">{{ translateText(errorMessage) }}</p>
        <div class="flex justify-end">
          <button
            @click="closeErrorModal"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yopish')"
          >
            {{ translateText("Yopish") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status Update Confirmation Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 animate-fade-in"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2
            class="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {{ translateText("Keyingi bosqichga o'tkazish") }}
          </h2>
          <button
            @click="closeStatusModal"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            :aria-label="translateText('Modal oynasini yopish')"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          {{
            translateText(
              "Mijozni keyingi bosqichga o'tkazishni tasdiqlaysizmi?"
            )
          }}
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="updateCustomerStatus"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :aria-label="translateText('Tasdiqlash')"
          >
            {{ translateText("Tasdiqlash") }}
          </button>
          <button
            @click="closeStatusModal"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yopish')"
          >
            {{ translateText("Yopish") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="mb-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {{ translateText("Manzil bo'yicha qidiruv") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ translateText("Viloyat") }}
            </label>
            <select
              v-model="searchRegion"
              @change="
                searchDistrict = '';
                updateFilteredCustomers();
              "
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :aria-label="translateText('Viloyatni tanlang')"
            >
              <option value="">{{ translateText("Barcha viloyatlar") }}</option>
              <option
                v-for="region in regions"
                :key="region.id"
                :value="String(region.id)"
              >
                {{ translateText(region.name_uz) }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ translateText("Tuman") }}
            </label>
            <select
              v-model="searchDistrict"
              :disabled="!searchRegion"
              @change="updateFilteredCustomers"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="translateText('Tumanni tanlang')"
            >
              <option value="">{{ translateText("Barcha tumanlar") }}</option>
              <option
                v-for="district in filteredDistricts"
                :key="district.id"
                :value="String(district.id)"
              >
                {{ translateText(district.name_uz) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="message && messageType === 'success'" class="mb-6">
        <div
          class="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 border px-4 py-3 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Customers List -->
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div class="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <svg
              class="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ translateText("Mijozlar ro'yxati") }} ({{
              filteredApplications.length
            }})
          </h3>
        </div>
        <div
          v-if="filteredApplications.length"
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <div
            v-for="app in filteredApplications"
            :key="app.id"
            @click="$router.push('/customer-sections/' + app.customerId + '/' + selectedStatus)"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative cursor-pointer"
          >
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-start space-x-4">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-white font-semibold text-lg">
                      {{ app.customerName?.charAt(0)?.toUpperCase() || "?" }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4
                      class="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                    >
                      {{ translateText(app.customerName) }} {{ translateText(app.customerSurname) }}
                    </h4>
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {{ translateText("Telefon raqami") }}: {{ app.customerPhone }}
                      </div>
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {{ translateText("Manzil") }}: {{
                          app.customerProvince
                            ? regions.find(
                                (r) => r.id === Number(app.customerProvince)
                              )?.name_uz ||
                              translateText("Viloyat ko'rsatilmagan")
                            : translateText("Viloyat ko'rsatilmagan")
                        }}
                        {{
                          app.customerDistrict
                            ? translateText(`, ${
                                districts.find(
                                  (d) => d.id === Number(app.customerDistrict)
                                )?.name_uz || "Tuman ko'rsatilmagan"
                              }`)
                            : ""
                        }}
                      </div>
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {{ translateText("Qayerdan kelgan") }}: {{
                          whereComingOptions.find(
                            (option) => option.value === app.whereComing
                          )?.label || translateText("Noma'lum")
                        }}
                      </div>
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {{ translateText("Qabul qilgan xodim") }}: {{
                          app.User
                            ? translateText(`${app.User.name} ${app.User.surname} ${app.User.dadname || ''}`)
                            : translateText("Noma'lum")
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="relative flex items-center flex-shrink-0">
                <button
                  @click.stop="toggleDropdown(app.id)"
                  class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  :aria-label="translateText('Qo\'shimcha amallar')"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v.01M12 12v.01M12 18v.01"
                    />
                  </svg>
                </button>
                <div
                  v-if="dropdownOpen === app.id"
                  v-click-outside="closeDropdown"
                  class="absolute right-0 top-10 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-40"
                >
                  <button
                    @click.stop="editCustomer(app)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
                    :aria-label="translateText('Mijozni tahrirlash')"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {{ translateText("Tahrirlash") }}
                  </button>
                  <!-- <button
                    @click.stop="openStatusModal(app)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-950 hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                    :aria-label="translateText('Keyingi bosqichga o\'tkazish')"
                    :disabled="app.status === 'completed'"
                    :class="{
                      'opacity-50 cursor-not-allowed':
                        app.status === 'completed',
                    }"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {{ translateText("Keyingi bosqich") }}
                  </button> -->
                  <button
                    @click.stop="deleteCustomer(app.customerId)"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
                    :aria-label="translateText('Mijozni o\'chirish')"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {{ translateText("O'chirish") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-12 text-center">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ translateText("Hozircha mijozlar yo'q") }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{
              translateText(
                "Birinchi mijozingizni qo'shish uchun yuqoridagi formadan foydalaning"
              )
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import axios from "axios";
import regionsData from "@/assets/regions.json";
import districtsData from "@/assets/districts.json";
import DOMPurify from "dompurify";
import translateText from "@/auth/Translate copy";
import { URL } from "@/auth/url";
import { useSearchStore } from "@/components/Templates/searchQuary";
export default {
  name: "MijozlarniBoshqarish",
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  setup() {
    const searchQuery = useSearchStore();
    const regions = ref(regionsData);
    const districts = ref(districtsData);
    const customers = ref([]);
    const whereComingOptions = ref([
      { value: "instagram", label: translateText("Instagram") },
      { value: "facebook", label: translateText("Facebook") },
      { value: "youtube", label: translateText("Youtube") },
      { value: "telegram", label: translateText("Telegram") },
      { value: "tanishi", label: translateText("Tanishi") },
      { value: "boshqa", label: translateText("Boshqa") },
    ]);
    const customer = ref({
      name: "",
      surname: "",
      phone: "",
      userId: Number(localStorage.getItem("id")) || null,
      purpose: "",
      whereComing: "",
      province: "",
      district: "",
      endDate: "",
      description: "",
      status: "accepted",
      isPaying: "",
      paymentDueDate: "",
      files: [],
    });
    const isModalOpen = ref(false);
    const isDarkMode = ref(false);
    const message = ref("");
    const messageType = ref("success");
    const errorMessage = ref("");
    const editingCustomer = ref(null);
    const dropdownOpen = ref(null);
    const searchRegion = ref("");
    const searchDistrict = ref("");
    const showErrorModal = ref(false);
    const selectedStatus = ref("");
    const showStatusModal = ref(false);
    const selectedCustomerForStatus = ref(null);
    const isSubmitting = ref(false);

    const translatedApplications = computed(() => {
      const appsMap = new Map();
      customers.value.forEach((cust) => {
        if (cust.CustomerApplications && Array.isArray(cust.CustomerApplications)) {
          cust.CustomerApplications.forEach((app) => {
            const key = `${cust.id}-${app.status}-${cust.phone}`;
            if (!appsMap.has(key) || (app.createdAt && new Date(app.createdAt) > new Date(appsMap.get(key).createdAt))) {
              appsMap.set(key, {
                ...app,
                customerName: cust.name || "",
                customerSurname: cust.surname || "",
                customerPhone: cust.phone || "",
                customerProvince: cust.province ? String(cust.province) : "",
                customerDistrict: cust.district ? String(cust.district) : "",
                customerUserId: cust.userId || null,
                customerId: cust.id,
                User: cust.User || null,
              });
            }
          });
        }
      });
      return Array.from(appsMap.values());
    });
const filteredApplications = computed(() => {
  let filtered = translatedApplications.value;

  // Apply search query filter
  if (searchQuery.query) {
    const query = searchQuery.query.toLowerCase().trim();
    filtered = filtered.filter((app) => {
      const fullName = `${app.customerName} ${app.customerSurname}`.toLowerCase();
      const phone = app.customerPhone ? app.customerPhone.replace(/\s/g, '').toLowerCase() : '';
      return (
        fullName.includes(query) ||
        phone.includes(query)
      );
    });
  }

  // Apply region filter
  if (searchRegion.value) {
    filtered = filtered.filter(
      (app) => app.customerProvince === String(searchRegion.value)
    );
  }

  // Apply district filter
  if (searchDistrict.value) {
    filtered = filtered.filter(
      (app) => app.customerDistrict === String(searchDistrict.value)
    );
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((app) => app.status === selectedStatus.value);
  }

  // Sort by endDate proximity
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return filtered.sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date("9999-12-31");
    const dateB = b.endDate ? new Date(b.endDate) : new Date("9999-12-31");
    const diffA = Math.abs(dateA - now);
    const diffB = Math.abs(dateB - now);
    return diffA - diffB;
  });
});

    const filteredDistricts = computed(() => {
      const regionId = Number(customer.value.province || searchRegion.value);
      return districts.value.filter(
        (district) => Number(district.region_id) === regionId
      );
    });

    const statusCounts = computed(() => {
      return {
        accepted: translatedApplications.value.filter((a) => a.status === "accepted").length,
        waiting: translatedApplications.value.filter((a) => a.status === "waiting").length,
        completed: translatedApplications.value.filter((a) => a.status === "completed").length,
      };
    });

    return {
      regions,
      districts,
      customers,
      customer,
      whereComingOptions,
      isModalOpen,
      isDarkMode,
      message,
      messageType,
      errorMessage,
      editingCustomer,
      dropdownOpen,
      searchRegion,
      searchDistrict,
      showErrorModal,
      selectedStatus,
      showStatusModal,
      selectedCustomerForStatus,
      isSubmitting,
      translatedApplications,
      filteredApplications,
      filteredDistricts,
      statusCounts,
      translateText,
    };
  },
  methods: {
    getEndDateColor(endDate) {
      if (!endDate) return "text-gray-600 dark:text-gray-400";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 5) return "text-red-600 dark:text-red-400";
      if (diffDays < 10) return "text-yellow-600 dark:text-yellow-400";
      return "text-green-600 dark:text-green-400";
    },
    async fetchCustomers() {
      try {
        const response = await axios.get(`${URL}/customers`);
        this.customers = response.data.map((customer) => ({
          ...customer,
          province: customer.province ? String(customer.province) : "",
          district: customer.district ? String(customer.district) : "",
        }));
      } catch (error) {
        this.errorMessage = translateText(
          "Mijozlarni yuklashda xatolik yuz berdi!"
        );
        this.messageType = "error";
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.errorMessage = "";
        }, 5000);
      }
    },
    setStatusFilter(status) {
      this.selectedStatus = status;
    },
    formatDateTime(isoDate) {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatPhoneNumber(event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.startsWith("998")) {
        value = value.slice(3);
      }
      if (value.length > 9) {
        value = value.slice(0, 9);
      }
      const formatted = value.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (formatted) {
        this.customer.phone = `+998 ${formatted[1]}${
          formatted[2] ? " " + formatted[2] : ""
        }${formatted[3] ? " " + formatted[3] : ""}${
          formatted[4] ? " " + formatted[4] : ""
        }`.trim();
      }
    },
    handleFileChange(event) {
      this.customer.files = Array.from(event.target.files);
    },
    
    openModal() {
      this.customer.userId = Number(localStorage.getItem("id")) || null;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetCustomerForm();
      this.editingCustomer = null;
    },
    resetCustomerForm() {
      this.customer = {
        name: "",
        surname: "",
        phone: "",
        userId: Number(localStorage.getItem("id")) || null,
        purpose: "",
        whereComing: "",
        province: "",
        district: "",
        endDate: "",
        description: "",
        status: "accepted",
        isPaying: "",
        paymentDueDate: "",
        files: [],
      };
    },
    async submitCustomer() {
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append("name", this.customer.name);
        formData.append("surname", this.customer.surname);
        formData.append("phone", this.customer.phone.split(' ').join(''));
        formData.append("userId", String(this.customer.userId));
        formData.append("purpose", this.customer.purpose);
        formData.append("whereComing", this.customer.whereComing);
        if (this.customer.province) {
          formData.append("province", String(this.customer.province));
        }
        if (this.customer.district) {
          formData.append("district", String(this.customer.district));
        }
        formData.append("endDate", this.customer.endDate);
        formData.append("description", this.customer.description);
        formData.append("status", this.customer.status);
        formData.append("isPaying", this.customer.isPaying);
        if (this.customer.isPaying === "will_pay" && this.customer.paymentDueDate) {
          formData.append("paymentDueDate", this.customer.paymentDueDate);
        }
        if (this.customer.files && this.customer.files.length > 0) {
          this.customer.files.forEach((file) => {
            formData.append("files", file);
          });
        }

        if (this.editingCustomer) {
          await axios.put(
            `${URL}/customers/${this.editingCustomer.customerId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          this.message = translateText("Mijoz muvaffaqiyatli yangilandi!");
        } else {
          await axios.post(`${URL}/customers`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          this.message = translateText("Mijoz muvaffaqiyatli qo'shildi!");
        }
        this.messageType = "success";
        await this.fetchCustomers();
        this.closeModal();
        setTimeout(() => {
          this.message = "";
        }, 5000);
      } catch (error) {
        console.error("Submit error:", error.response?.data || error.message);
        this.errorMessage = translateText(
          error.response?.data?.message ||
            "Mijozni qo'shish/yangilashda xatolik yuz berdi!"
        );
        this.messageType = "error";
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.errorMessage = "";
        }, 5000);
      } finally {
        this.isSubmitting = false;
      }
    },
    editCustomer(app) {
      this.editingCustomer = app;
      this.customer = {
        name: app.customerName,
        surname: app.customerSurname,
        phone: app.customerPhone,
        userId: app.customerUserId || Number(localStorage.getItem("id")) || null,
        purpose: app.purpose,
        whereComing: app.whereComing,
        province: app.customerProvince,
        district: app.customerDistrict,
        endDate: app.endDate
          ? new Date(app.endDate).toISOString().slice(0, 16)
          : "",
        description: app.description,
        status: app.status,
        isPaying: app.isPaying,
        paymentDueDate: app.paymentDueDate
          ? new Date(app.paymentDueDate).toISOString().slice(0, 16)
          : "",
        files: [],
      };
      this.isModalOpen = true;
    },
    cancelEdit() {
      this.closeModal();
    },
    async deleteCustomer(id) {
      if (
        !confirm(translateText("Haqiqatan ham bu mijozni o'chirmoqchimisiz?"))
      ) {
        return;
      }
      try {
        await axios.delete(`${URL}/customers/${id}`);
        this.message = translateText("Mijoz muvaffaqiyatli o'chirildi!");
        this.messageType = "success";
        await this.fetchCustomers();
        setTimeout(() => {
          this.message = "";
        }, 5000);
      } catch (error) {
        this.errorMessage = translateText(
          "Mijozni o'chirishda xatolik yuz berdi!"
        );
        this.messageType = "error";
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.errorMessage = "";
        }, 5000);
      }
    },
    toggleDropdown(id) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id;
    },
    closeDropdown() {
      this.dropdownOpen = null;
    },
    updateDistricts() {
      this.customer.district = "";
    },
    updateFilteredCustomers() {
      this.customer.district = "";
    },
    openStatusModal(app) {
      this.selectedCustomerForStatus = app;
      this.showStatusModal = true;
    },
    closeStatusModal() {
      this.showStatusModal = false;
      this.selectedCustomerForStatus = null;
    },
    async updateCustomerStatus() {
      if (!this.selectedCustomerForStatus) return;
      this.isSubmitting = true;
      try {
        const newStatus =
          this.selectedCustomerForStatus.status === "accepted"
            ? "waiting"
            : this.selectedCustomerForStatus.status === "waiting"
            ? "completed"
            : "completed";
        await axios.put(
          `${URL}/customer-applications/${this.selectedCustomerForStatus.id}`,
          { status: newStatus }
        );
        this.message = translateText("Mijoz holati muvaffaqiyatli yangilandi!");
        this.messageType = "success";
        await this.fetchCustomers();
        this.closeStatusModal();
        setTimeout(() => {
          this.message = "";
        }, 5000);
      } catch (error) {
        this.errorMessage = translateText(
          "Mijoz holatini yangilashda xatolik yuz berdi!"
        );
        this.messageType = "error";
        this.showErrorModal = true;
        setTimeout(() => {
          this.showErrorModal = false;
          this.errorMessage = "";
        }, 5000);
      } finally {
        this.isSubmitting = false;
      }
    },
    closeErrorModal() {
      this.showErrorModal = false;
      this.errorMessage = "";
    },
  },
  mounted() {
    this.fetchCustomers();
    this.setStatusFilter('waiting')
  },
};
</script>