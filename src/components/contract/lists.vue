<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 font-sans relative overflow-hidden">
    <!-- Header Section -->
    <div class="container mx-auto px-4 py-8 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 transform hover:scale-[1.02] transition-all duration-500">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <iconify-icon icon="mdi:folder-multiple" class="w-7 h-7 text-white"></iconify-icon>
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            {{ dat === 'datakril' ? translateText('Fayl boshqaruvi') : 'Fayl boshqaruvi' }}
          </h1>
        </div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button
            @click="showModal = true"
            class="group px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl hover:from-teal-700 hover:to-emerald-700 flex items-center gap-3 font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <iconify-icon icon="mdi:upload" class="w-6 h-6 relative z-10"></iconify-icon>
            <span class="relative z-10">{{ dat === 'datakril' ? translateText('Fayl yuklash') : 'Fayl yuklash' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-8 relative z-10">
      <div class="grid gap-6">
        <ul class="list-none p-0 m-0 space-y-6">
          <li
            v-for="file in filteredFiles"
            :key="file.id"
            @click="router.push(file.type === 'video' ? '/video-open/' + file.id : '/lists-view/' + file.id)"
            class="group flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/85 dark:bg-gray-800/85 backdrop-blur-2xl p-8 rounded-3xl shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-500 border border-white/20 dark:border-gray-700/20 transform hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden"
          >
            <!-- Animated background glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="flex items-center gap-4 relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <iconify-icon 
                  :icon="file.type === 'video' ? 'mdi:video' : 'mdi:file-document'" 
                  class="w-8 h-8 text-white"
                ></iconify-icon>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {{ dat === 'datakril' ? translateText(file.name) : file.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {{ file.type === 'video' ? 'Video fayl' : 'Hujjat fayli' }}
                </p>
              </div>
            </div>

            <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6 mt-6 lg:mt-0 relative z-10 w-full lg:w-auto">
              <!-- Debt Information -->
              <div class="min-w-[200px]">
                <div v-if="file.ClientPayment && file.ClientPayment.length" class="cursor-pointer">
                  <div
                    @click.stop="openPaymentDetailsModal(file, $event)"
                    class="group/status px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
                    :class="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-green-500/25' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-red-500/25'"
                  >
                    <iconify-icon 
                      :icon="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0 ? 'mdi:check-circle' : 'mdi:alert-circle'" 
                      class="w-5 h-5"
                    ></iconify-icon>
                    <span v-if="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0">
                      {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                    </span>
                    <span v-else>
                      {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                      {{ formatNumberWithDots(file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum || 0) }}
                      {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                    </span>
                  </div>
                </div>
                <!-- Fallback if no payment data -->
                <div v-else class="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 italic text-sm">
                  {{ dat === 'datakril' ? translateText("To'lov ma'lumotlari yo'q") : "To'lov ma'lumotlari yo'q" }}
                </div>
              </div>

              <!-- Payment Button -->
              <div
                v-if="
                  file.ClientPayment &&
                  file.ClientPayment.length &&
                  file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum > 0
                "
              >
                <button
                  @click.stop="openPaymentModal(file)"
                  class="group/pay px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-green-500/25 flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/pay:opacity-100 transition-opacity duration-300"></div>
                  <iconify-icon icon="mdi:cash" class="w-5 h-5 relative z-10"></iconify-icon>
                  <span class="relative z-10">{{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}</span>
                </button>
              </div>

              <!-- Created Date -->
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium bg-gray-100/50 dark:bg-gray-700/50 px-4 py-2 rounded-xl">
                <iconify-icon icon="mdi:calendar" class="w-4 h-4"></iconify-icon>
                {{ formatDate(file.createdAt) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- File Upload Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/70 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm"
    >
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-3xl p-10 rounded-3xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-700 animate-modal-scale border border-white/20 dark:border-gray-700/20">
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl"></div>
        
        <button
          @click="showModal = false"
          class="absolute top-6 right-6 w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
        >
          <iconify-icon icon="mdi:close" class="w-6 h-6"></iconify-icon>
        </button>

        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <iconify-icon icon="mdi:upload" class="w-8 h-8 text-white"></iconify-icon>
            </div>
            <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              {{ dat === 'datakril' ? translateText('Fayl yuklash') : 'Fayl yuklash' }}
            </h2>
          </div>

          <form @submit.prevent="uploadFile" class="flex flex-col gap-6">
            <div class="relative">
              <input
                type="text"
                v-model="formData.name"
                :placeholder="
                  dat === 'datakril'
                    ? translateText('Shartnoma nomini kiriting')
                    : 'Shartnoma nomini kiriting'
                "
                class="w-full p-4 pl-12 rounded-2xl bg-white/90 dark:bg-gray-700/90 border border-indigo-200 dark:border-indigo-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 hover:shadow-lg"
                required
              />
              <iconify-icon icon="mdi:text" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 w-5 h-5"></iconify-icon>
            </div>

            <div class="relative">
<input
  type="file"
  @change="handleFileUpload"
  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  class="w-full p-4 pl-12 rounded-2xl bg-white/90 dark:bg-gray-700/90 border border-indigo-200 dark:border-indigo-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 hover:shadow-lg file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
  required
/>

              <iconify-icon icon="mdi:file-upload" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 w-5 h-5"></iconify-icon>
            </div>

            <div class="flex justify-end gap-4 mt-4">
              <button
                type="button"
                @click="showModal = false"
                class="group px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-lg flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <iconify-icon icon="mdi:cancel" class="w-5 h-5"></iconify-icon>
                {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
              </button>
              <button
                type="submit"
                class="group px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl hover:from-teal-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-teal-500/25 flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <iconify-icon icon="mdi:upload" class="w-5 h-5 relative z-10"></iconify-icon>
                <span class="relative z-10">{{ dat === 'datakril' ? translateText('Yuklash') : 'Yuklash' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Region and District Selection Modal -->
    <div
      v-if="showRegionModal"
      class="fixed inset-0 bg-black/70 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm"
    >
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-3xl p-10 rounded-3xl w-full max-w-lg shadow-2xl relative transform transition-all duration-700 animate-modal-scale border border-white/20 dark:border-gray-700/20">
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl"></div>
        
        <button
          @click="closeRegionModal"
          class="absolute top-6 right-6 w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
        >
          <iconify-icon icon="mdi:close" class="w-6 h-6"></iconify-icon>
        </button>

        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <iconify-icon icon="mdi:office-building" class="w-8 h-8 text-white"></iconify-icon>
            </div>
            <h2 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              {{ dat === 'datakril' ? translateText('Qarzdorlik uchun to\'lov "YURIST KONSUL KONSALTING" kompaniyasining qaysi filialida amalga oshirilmoqda?') : 'Qarzdorlik uchun to\'lov "YURIST KONSUL KONSALTING" kompaniyasining qaysi filialida amalga oshirilmoqda?' }}
            </h2>
          </div>

          <div class="flex flex-col gap-6">
            <div class="relative">
              <select
                v-model="ofis"
                class="w-full p-4 pl-12 pr-12 rounded-2xl bg-white/90 dark:bg-gray-700/90 border border-purple-200 dark:border-purple-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-400/50 dark:focus:ring-purple-500/50 focus:border-purple-400 dark:focus:border-purple-500 appearance-none transition-all duration-300 hover:shadow-lg"
              >
                <option class="text-gray-800 dark:text-gray-200" value="" disabled>
                  {{ dat === 'datakril' ? translateText('To\'lov qaysi ofisdan amalga oshirilmoqda') : 'To\'lov qaysi ofisdan amalga oshirilmoqda' }}
                </option>
                <option class="text-gray-800 dark:text-gray-200" value="Xorazm viloyati Urganch shaxar 1-son filiali">
                  {{ dat === 'datakril' ? translateText('Xorazm viloyati Urganch shaxar 1-son filiali') : 'Xorazm viloyati Urganch shaxar 1-son filiali' }}
                </option>
                <option class="text-gray-800 dark:text-gray-200" value="Xorazm viloyati Xiva shaxar markaziy binosi">
                  {{ dat === 'datakril' ? translateText('Xorazm viloyati Xiva shaxar markaziy binosi') : 'Xorazm viloyati Xiva shaxar markaziy binosi' }}
                </option>
              </select>
              <iconify-icon icon="mdi:office-building" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 dark:text-purple-400 w-5 h-5"></iconify-icon>
              <iconify-icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 dark:text-purple-400 w-5 h-5"></iconify-icon>
            </div>

            <div class="flex justify-end gap-4">
              <button
                @click="closeRegionModal"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-lg flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <iconify-icon icon="mdi:close" class="w-5 h-5"></iconify-icon>
                {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
              </button>
              <button
                @click="submitRegionSelection"
                class="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <iconify-icon icon="mdi:send" class="w-5 h-5 relative z-10"></iconify-icon>
                <span class="relative z-10">{{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div
      v-if="modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-sm"
    >
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl w-full max-w-md relative transform transition-all duration-700 animate-modal-scale border border-white/20 dark:border-gray-700/20">
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <iconify-icon icon="mdi:cash" class="w-8 h-8 text-white"></iconify-icon>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {{ dat === 'datakril' ? translateText("To'lov qilish") : "To'lov qilish" }}
            </h2>
          </div>

          <div class="relative mb-8">
            <input
              v-model="summa"
              type="number"
              :placeholder="
                dat === 'datakril' ? translateText('To\'langan summa') : 'To\'langan summa'
              "
              class="w-full p-4 pl-12 rounded-2xl bg-white/90 dark:bg-gray-700/90 border border-green-200 dark:border-green-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400/50 dark:focus:ring-green-500/50 focus:border-green-400 dark:focus:border-green-500 transition-all duration-300 hover:shadow-lg text-lg font-semibold"
            />
            <iconify-icon icon="mdi:currency-usd" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400 w-6 h-6"></iconify-icon>
          </div>

          <div class="flex justify-end gap-4">
            <button
              @click="modal = false"
              class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-lg flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <iconify-icon icon="mdi:close" class="w-5 h-5"></iconify-icon>
              {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
            </button>
            <button
              @click="submitPayment"
              class="group px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-green-500/25 flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <iconify-icon icon="mdi:cash-check" class="w-5 h-5 relative z-10"></iconify-icon>
              <span class="relative z-10">{{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div
      v-if="paymentDetailsModal"
      @click="closePaymentDetailsModal($event)"
      class="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
    >
      <div
        @click.stop
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-3xl p-8 rounded-3xl max-h-[550px] shadow-2xl overflow-y-auto transition-all duration-700 animate-modal-scale border border-white/20 dark:border-gray-700/20 w-96 relative"
      >
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <iconify-icon icon="mdi:receipt" class="w-6 h-6 text-white"></iconify-icon>
            </div>
            <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {{ dat === 'datakril' ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
            </h2>
          </div>

          <div class="mb-6 p-4 rounded-2xl" :class="
            selectedPaymentDetails &&
            selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
              : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'
          ">
            <div class="flex items-center gap-3">
              <iconify-icon 
                :icon="selectedPaymentDetails &&
                       selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0
                       ? 'mdi:check-circle' : 'mdi:alert-circle'"
                class="w-6 h-6"
                :class="selectedPaymentDetails &&
                        selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'"
              ></iconify-icon>
              <span
                class="font-bold text-lg"
                :class="selectedPaymentDetails &&
                        selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'"
              >
                <span v-if="selectedPaymentDetails &&
                           selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0">
                  {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                </span>
                <span v-else>
                  {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                  {{ formatNumberWithDots(selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum) }}
                  {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                </span>
              </span>
            </div>
          </div>

          <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
            <div
              v-for="(payment, index) in selectedPaymentDetails"
              :key="payment.id"
              class="p-6 border border-indigo-200/50 dark:border-indigo-700/50 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-700/60 dark:to-gray-800/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {{ dat === 'datakril' ? translateText("To'lov") : "To'lov" }} #{{ index + 1 }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <iconify-icon icon="mdi:calendar" class="w-3 h-3"></iconify-icon>
                  {{ formatDate(payment.createdAt) }}
                </div>
              </div>
              
              <div class="grid grid-cols-1 gap-3">
                <div class="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <iconify-icon icon="mdi:calculator" class="w-4 h-4 text-blue-500"></iconify-icon>
                    {{ dat === 'datakril' ? translateText("Jami summa") : "Jami summa" }}
                  </span>
                  <span class="font-bold text-blue-700 dark:text-blue-300">
                    {{ formatNumberWithDots(payment.TotalSum) }}
                    {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <iconify-icon icon="mdi:cash-check" class="w-4 h-4 text-green-500"></iconify-icon>
                    {{ dat === 'datakril' ? translateText("To'langan summa") : "To'langan summa" }}
                  </span>
                  <span class="font-bold text-green-700 dark:text-green-300">
                    {{ formatNumberWithDots(payment.paidSum) }}
                    {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center p-3 rounded-xl" :class="
                  payment.remainingSum > 0 
                    ? 'bg-red-50/50 dark:bg-red-900/20' 
                    : 'bg-gray-50/50 dark:bg-gray-900/20'
                ">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <iconify-icon 
                      :icon="payment.remainingSum > 0 ? 'mdi:alert-circle' : 'mdi:check-circle'" 
                      class="w-4 h-4"
                      :class="payment.remainingSum > 0 ? 'text-red-500' : 'text-gray-500'"
                    ></iconify-icon>
                    {{ dat === 'datakril' ? translateText("Qoldiq summa") : "Qoldiq summa" }}
                  </span>
                  <span class="font-bold" :class="
                    payment.remainingSum > 0 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  ">
                    {{ formatNumberWithDots(payment.remainingSum) }}
                    {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


  <style scoped>
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-30px, 20px) rotate(-120deg); }
    66% { transform: translate(20px, -20px) rotate(-240deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(20px, -20px) rotate(180deg); }
  }
  
  @keyframes modal-scale {
    0% { transform: scale(0.7) rotate(-5deg); opacity: 0; }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  
  .animate-float {
    animation: float 20s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 25s ease-in-out infinite;
  }
  
  .animate-float-slow {
    animation: float-slow 30s ease-in-out infinite;
  }
  
  .animate-modal-scale {
    animation: modal-scale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(156, 163, 175, 0.1);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
  }
  
  /* Dark mode scrollbar */
  .dark ::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.2);
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  }
  </style>

<script setup>
import { ref, onMounted, inject, computed, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import { useSearchStore } from "@/components/Templates/searchQuary";
const searchQuery = useSearchStore();
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const SectionId = route.params.id1;
const clientFiles = ref([]);
const isLoading = inject('isLoading');
const showModal = ref(false);
const showRegionModal = ref(false);
const summa = ref(0);
const modal = ref(false);
const totalsumma= ref(null)
const districts = ref([]);
const formData = ref({
  name: '',
  file: null,
});

const selectedItem = ref(null);
const receiptData = ref({});
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const data = ref(null);
const modalPosition = ref({ top: 0, left: 0});
const selectedRegionForPrint = ref({ regionName: '', districtName: '' });
const pendingPrint = ref(false);
const ofis = ref('')

onMounted(() => {
  fetchClientFiles();
});


const closeRegionModal = () => {
  showRegionModal.value = false;
ofis.value = ''
  districts.value = [];
  // If pending print, cancel the print process
  if (pendingPrint.value) {
    pendingPrint.value = false;
  }
};

const submitRegionSelection = () => {
  showRegionModal.value = false;
  
  if (pendingPrint.value) {
    pendingPrint.value = false;
    printReceipt();
  }
};

const closePaymentDetailsModal = (event) => {
  if (event.target === event.currentTarget) {
    paymentDetailsModal.value = false;
  }
};

const fetchClientFiles = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/client-sections/${id}`);
    clientFiles.value = response.data.ClientFile || [];
    data.value = response.data.clientSectionBody.client;
  } catch (error) {
    console.error('Error fetching client files:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = (event) => {
  formData.value.file = event.target.files[0];
};

const uploadFile = async () => {
    isLoading.value = true;
  const uploadData = new FormData();
  uploadData.append('name', formData.value.name);
  uploadData.append('file', formData.value.file);
  uploadData.append('clientSectionId', parseInt(id));

  try {
    await axios.post(`${URL}/client-files`, uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    fetchClientFiles();
    showModal.value = false;
    formData.value = {
      name: '',
      file: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    isLoading.value = false;
  }
};

const submitPayment = async () => {
  if (!selectedItem.value) {
    alert("Hech qanday fayl tanlanmadi!");
    return;
  }

  const paymentAmount = Number(summa.value);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    alert("Iltimos, to'g'ri summa kiriting!");
    return;
  }

  const clientPayments = selectedItem.value.ClientPayment || [];
  if (!clientPayments.length) {
    alert("To'lov ma'lumotlari topilmadi!");
    return;
  }

  const latestPayment = clientPayments[clientPayments.length - 1];
  if (!latestPayment || latestPayment.remainingSum === undefined) {
    alert("Oxirgi to'lov ma'lumotlari noto'g'ri!");
    return;
  }

  if (paymentAmount > latestPayment.remainingSum) {
    alert("To'lov miqdori qoldiq qarzdan oshib ketmoqda!");
    return;
  }

  const updatedRemainingSum = latestPayment.remainingSum - paymentAmount;
isLoading.value = true
  try {
    const response = await axios.post(`${URL}/client-pay`, {
      clientFileId: parseInt(selectedItem.value.id),
      TotalSum: latestPayment.TotalSum || 0,
      paidSum: paymentAmount,
      remainingSum: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
    });

    latestPayment.paidSum = (latestPayment.paidSum || 0) + paymentAmount;
    latestPayment.remainingSum = updatedRemainingSum >= 0 ? updatedRemainingSum : 0;

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}.${currentDate.getFullYear()}`;
    totalsumma.value=latestPayment.TotalSum
    receiptData.value = {
      name: selectedItem.value.name,
      surname: selectedItem.value.surname,
      dadname: selectedItem.value.dadname,
      phone: selectedItem.value.phone,
      uniqueCode: selectedItem.value.contractId,
      paymentAmount: paymentAmount,
      totalSum: latestPayment.TotalSum || 0,
      remainingDebt: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
      date: formattedDate,
    };

    await generateCheckFile();
    // Open region modal before printing
    showRegionModal.value = true;
    pendingPrint.value = true;
    modal.value = false;
  } catch (error) {
    console.error("To'lovni yangilashda xatolik yuz berdi:", error);
    alert("Xatolik yuz berdi: " + error.message);
  } finally{
    isLoading.value = false
  }
};

function numberToUzbekWords(n) {
  const ones = [
    '',
    'bir',
    'ikki',
    'uch',
    "to'rt",
    'besh',
    'olti',
    'yetti',
    'sakkiz',
    "to'qqiz",
  ];
  const tens = [
    '',
    "o'n",
    'yigirma',
    "o'ttiz",
    'qirq',
    'ellik',
    'oltmish',
    'yetmish',
    'sakson',
    "to'qson",
  ];
  const hundreds = [
    '',
    'bir yuz',
    'ikki yuz',
    'uch yuz',
    "to'rt yuz",
    'besh yuz',
    'olti yuz',
    'yetti yuz',
    'sakkiz yuz',
    "to'qqiz yuz",
  ];

  if (typeof n !== 'number' || isNaN(n)) return "Noto'g'ri qiymat";
  if (n === 0) return 'nol';
  if (n < 0) return 'manfiy ' + numberToUzbekWords(-n);
  if (n > 999_999_999_999) return 'Milliardgacha son kiriting.';

  const getThreeDigitWords = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;

    let parts = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t > 0 || o > 0) parts.push(tens[t] + (o > 0 ? ' ' + ones[o] : ''));
    return parts.join(' ').trim();
  };

  let result = '';

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;

  if (billions > 0) result += getThreeDigitWords(billions) + ' milliard ';
  if (millions > 0) result += getThreeDigitWords(millions) + ' million ';
  if (thousands > 0) result += getThreeDigitWords(thousands) + ' ming ';
  if (rest > 0) result += getThreeDigitWords(rest);

  return result.trim();
}

const printReceipt = () => {
  // If region selection is pending, do not proceed until modal is closed
  if (pendingPrint.value) return;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const images = [
    { src: `${window.location.origin}/telegram-cloud.jpg`, key: 'telegram-cloud' },
    { src: `${window.location.origin}/https___arizasud.uz_.png`, key: 'arizasud' },
    { src: `${window.location.origin}/telegram.png`, key: 'telegram' },
  ];
  const receiptHTML = `
    <table style="border: 1px solid black; border-collapse: collapse;">
        <tr>
            <td rowspan="8" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${window.location.origin}/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">№${clientFiles.value[0]?.contractId || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${receiptData.value.remainingDebt <= 0 ? "To'landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${ofis.value || 'Tanlanmagan'}</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const originalContent = document.body.innerHTML;
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      @page { margin: 2px; }
      body { margin: 0; }
    }
    `;
  document.head.appendChild(style);

  let loadedImages = 0;
  const totalImages = images.length;

  const checkAllImagesLoaded = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      document.body.innerHTML = receiptHTML;
      window.print();
      document.body.innerHTML = originalContent;
      document.head.removeChild(style);
      window.location.reload();
    }
  };

  images.forEach((image) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      checkAllImagesLoaded();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${image.key}`);
      checkAllImagesLoaded();
    };
  });
};

const generateCheckFile = async () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  const receiptHTML = `
    <table style="border: 1px solid black; height:80px; width:100%; border-collapse: collapse;">
        <tr>
            <td rowspan="8" style="text-align: center; color: black; border: 1px solid black;"><img width="150px" src="/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">№${clientFiles.value[0]?.contractId || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
          <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</td>
          </tr>
          <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
            <td colspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${receiptData.value.remainingDebt <= 0 ? "To'landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
          </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${ofis.value || 'Tanlanmagan'}</td>
            <td colspan="3" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const element = document.createElement('div');
  element.innerHTML = receiptHTML;

  const options = {
    margin: [0, 0, 0, 0],
    filename: `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };
isLoading.value = true
  try {
    const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');
    const formData = new FormData();
    formData.append('check', pdfBlob, `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`);
    formData.append('contractId', String(clientFiles.value[0]?.contractId || ''));
    formData.append('remainingDebt', String(receiptData.value.remainingDebt));

    await axios.post(`${URL}/client/add-check/${SectionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Error generating or sending the check file:', error);
  } finally{
    isLoading.value = false
  }
};

const openPaymentModal = (file) => {
  selectedItem.value = file;
  modal.value = true;
};

const openPaymentDetailsModal = (file, event) => {
  selectedPaymentDetails.value = file.ClientPayment;
  const rect = event.target.getBoundingClientRect();
  modalPosition.value = {
    top: rect.top + window.scrollY + rect.height,
    left: rect.left + window.scrollX,
  };
  paymentDetailsModal.value = true;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const formatNumberWithDots = (number) => {
  if (isNaN(number) || number === null || number === undefined) {
    return '0';
  }
  return Number(number)
    .toLocaleString('uz-UZ', { minimumFractionDigits: 0 })
    .replace(/,/g, '.');
};

const filteredFiles = computed(() => {
  const query = searchQuery.query.toLowerCase();
  return clientFiles.value.filter((file) => {
    const nameMatch = file.name?.toLowerCase().includes(query);
    const contractIdMatch = file.contractId?.toString().includes(query);
    return nameMatch || contractIdMatch;
  });
});
</script>

<style>
@media print {
  @page {
    size: 80mm auto;
    padding-top: 5px;
    padding-right: 5px;
    padding-left: 170px;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px !important;
    text-align: left;
    line-height: 1.2 !important;
    white-space: pre-wrap !important;
    box-sizing: border-box;
  }

  h2 {
    text-align: center;
    font-size: 12px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 0 !important;
    vertical-align: top;
  }

  th {
    text-align: center;
  }

  .hidden,
  [hidden] {
    display: none !important;
  }

  * {
    box-sizing: border-box !important;
  }
}
</style>