```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
    <!-- Header Section -->
    <header class="py-16 px-4 text-center relative">
      <div class="absolute inset-0 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 blur-3xl animate-pulse-slow"></div>
      <h1 class="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 animate-gradient">
        {{
          dat === "datakril"
            ? translateText("Lex.uz va QR-code xizmati uchun BXM tahrirlash")
            : "Lex.uz va QR-code xizmati uchun BXMni tahrirlash"
        }}
      </h1>
      <p class="relative mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
        {{ dat === "datakril" ? translateText("Xizmat narxlarini zamonaviy va xavfsiz tarzda yangilang") : "Xizmat narxlarini zamonaviy va xavfsiz tarzda yangilang" }}
      </p>
    </header>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto p-6 sm:p-8 relative">
      <!-- Floating Action Button (Edit) -->
      <div v-if="records.length" class="absolute top-4 right-4 sm:right-8 z-20">
        <button
          @click="openConfirmModal(records[0])"
          :disabled="loading"
          class="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :aria-label="dat === 'datakril' ? translateText('Narxlarni tahrirlash') : 'Narxlarni tahrirlash'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <div class="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <span class="absolute hidden group-hover:block text-sm font-medium bg-gray-800 text-white px-3 py-1 rounded-lg -left-32 top-1/2 transform -translate-y-1/2 transition-all duration-200">
            {{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}
          </span>
        </button>
      </div>

      <!-- Cards -->
      <div v-if="records.length" class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <!-- Card for QR-code Service -->
        <div class="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-2xl"></div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ dat === "datakril" ? translateText("QR-code xizmati uchun") : "QR-code xizmati uchun" }}
            </h3>
          </div>
          <p class="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {{ formatNumber(records[0].sum1) }} {{ dat === 'datakril' ? translateText(`SO'M`) : `SO'M` }}
          </p>
        </div>

        <!-- Card for Lex.uz Usage -->
        <div class="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl"></div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ dat === "datakril" ? translateText("Lex.uz qonunchilik bazasidan foydalanish uchun") : "Lex.uz qonunchilik bazasidan foydalanish uchun" }}
            </h3>
          </div>
          <p class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {{ formatNumber(records[0].sum2) }} {{ dat === 'datakril' ? translateText(`SO'M`) : `SO'M` }}
          </p>
        </div>

        <!-- Card for Contract Bonus -->
        <div class="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-2xl"></div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ dat === "datakril" ? translateText("Shartnoma uchun bonus") : "Shartnoma uchun bonus" }}
            </h3>
          </div>
          <p class="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {{ formatNumber(records[0].sum3) }} {{ dat === 'datakril' ? translateText(`SO'M`) : `SO'M` }}
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="getError" class="mt-8 text-center">
        <p class="text-red-600 dark:text-red-400 font-medium text-lg">
          {{ dat === "datakril" ? translateText(`Xatolik: ${getError}`) : `Xatolik: ${getError}` }}
        </p>
      </div>

      <!-- Edit Modal -->
      <div v-if="showPutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-500">
        <div class="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md transform transition-all duration-300 scale-100 animate-modal-in">
          <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
            {{ dat === "datakril" ? translateText("Narxni yangilash") : "Narxni yangilash" }}
          </h3>
          <form @submit.prevent="submitPut" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ dat === "datakril" ? translateText("QR-code xizmati uchun") : "QR-code xizmati uchun" }}
              </label>
              <input
                type="number"
                v-model.number="putForm.sum1"
                required
                min="0"
                class="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gray-50/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                :placeholder="dat === 'datakril' ? translateText('Narxni kiriting') : 'Narxni kiriting'"
                aria-required="true"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ dat === "datakril" ? translateText("Lex.uz qonunchilik bazasidan foydalanish uchun") : "Lex.uz qonunchilik bazasidan foydalanish uchun" }}
              </label>
              <input
                type="number"
                v-model.number="putForm.sum2"
                required
                min="0"
                class="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gray-50/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                :placeholder="dat === 'datakril' ? translateText('Narxni kiriting') : 'Narxni kiriting'"
                aria-required="true"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ dat === "datakril" ? translateText("Shartnoma uchun bonus") : "Shartnoma uchun bonus" }}
              </label>
              <input
                type="number"
                v-model.number="putForm.sum3"
                required
                min="0"
                class="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gray-50/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                :placeholder="dat === 'datakril' ? translateText('Narxni kiriting') : 'Narxni kiriting'"
                aria-required="true"
              />
            </div>
            <div v-if="putError" class="text-red-600 dark:text-red-400 text-sm text-center">
              {{ dat === "datakril" ? translateText(putError) : putError }}
            </div>
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="closePutModal"
                :disabled="loading"
                class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200 disabled:opacity-50"
              >
                {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 text-white rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50"
              >
                <span v-if="loading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                {{
                  loading
                    ? dat === "datakril" ? translateText("Yangilanmoqda...") : "Yangilanmoqda..."
                    : dat === "datakril" ? translateText("Yangilash") : "Yangilash"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-500">
        <div class="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md transform transition-all duration-300 scale-100 animate-modal-in">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-4">
            {{ dat === "datakril" ? translateText("Narxni yangilashni tasdiqlang") : "Narxni yangilashni tasdiqlang" }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
            {{ dat === "datakril" ? translateText("Siz narxlarni yangilamoqchisiz. Davom etishni xohlaysizmi?") : "Siz narxlarni yangilamoqchisiz. Davom etishni xohlaysizmi?" }}
          </p>
          <div class="flex justify-center space-x-4">
            <button
              @click="closeConfirmModal"
              :disabled="loading"
              class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200 disabled:opacity-50"
            >
              {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
            </button>
            <button
              @click="confirmEdit"
              :disabled="loading"
              class="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 text-white rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50"
            >
              {{ dat === "datakril" ? translateText("Yangilash") : "Yangilash" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div v-if="toastMessage" class="fixed top-6 right-6 z-50 max-w-sm animate-slide-in">
        <div
          :class="[
            'p-4 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-md border',
            toastType === 'success' ? 'bg-teal-500/90 text-white border-teal-500/30' : 'bg-red-500/90 text-white border-red-500/30',
          ]"
        >
          <svg v-if="toastType === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <p class="text-sm font-semibold">{{ toastMessage }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { URL } from '../../auth/url.js';
import translateText from '@/auth/Translate.js';
import { inject } from 'vue';

// Reactive state
const records = ref([]);
const getError = ref(null);
const putError = ref(null);
const loading = ref(false);
const dat = ref(localStorage.getItem("til") || "datalotin");
const showPutModal = ref(false);
const showConfirmModal = ref(false);
const selectedRecord = ref(null);
const toastMessage = ref("");
const toastType = ref("success");
const isLoading = inject('isLoading')

let toastTimeout = null;

onMounted(() => {
  fetchRecords();
});

onUnmounted(() => {
  if (toastTimeout) clearTimeout(toastTimeout);
});

const putForm = ref({
  id: null,
  sum1: null,
  sum2: null,
  sum3: null,
});

// Toast notification
const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

// Format number with commas
const formatNumber = (num) => {
  if (num == null) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const openPutModal = (record) => {
  putForm.value = { id: record.id, sum1: record.sum1, sum3: record.sum3, sum2: record.sum2 };
  putError.value = null;
  showPutModal.value = true;
};

const closePutModal = () => {
  showPutModal.value = false;
  putError.value = null;
};

const openConfirmModal = (record) => {
  selectedRecord.value = record;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  selectedRecord.value = null;
};

const confirmEdit = () => {
  if (selectedRecord.value) {
    openPutModal(selectedRecord.value);
  }
  closeConfirmModal();
};

// API calls
const fetchRecords = async () => {
  getError.value = null;
  loading.value = true;
  isLoading.value = true
  try {
    const res = await axios.get(`${URL}/monthly-cost`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    records.value = res.data;
  } catch (err) {
    getError.value = err.response?.data?.message || (dat.value === "datakril" ? translateText("Ma'lumotlarni yuklashda xatolik yuz berdi") : "Ma'lumotlarni yuklashda xatolik yuz berdi");
    showToast(getError.value, "error");
  } finally {
    loading.value = false;
    isLoading.value = false
  }
};

const submitPut = async () => {
  putError.value = null;
  loading.value = true;
  isLoading.value = true
  try {
    await axios.put(`${URL}/monthly-cost/${putForm.value.id}`, {
      sum1: putForm.value.sum1,
      sum2: putForm.value.sum2,
      sum3: putForm.value.sum3,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    (
      dat.value === "datakril" ? translateText("Narx muvaffaqiyatli yangilandi") : "Narx muvaffaqiyatli yangilandi"
    );
    closePutModal();
    fetchRecords();
  } catch (err) {
    putError.value = err.response?.data?.message || (dat.value === "datakril" ? translateText("Narx yangilashda xatolik yuz berdi") : "Narx yangilashda xatolik yuz berdi");
    showToast(putError.value, "error");
  } finally {
    loading.value = false;
    isLoading.value = false
  }
};
</script>

<style scoped>
/* Gradient Animation */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

/* Pulse Animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.3; }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Modal Entrance Animation */
@keyframes modal-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out;
}

/* Slide-in Animation */
@keyframes slide-in {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.6);
}

/* Glassmorphism Support */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
}

/* Focus States */
:focus-visible {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}
</style>
```