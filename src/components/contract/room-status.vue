<template>
  <div :class="{ dark: isDarkMode }">
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <!-- Beautiful Header with Toggle Controls -->
      <header class="relative overflow-hidden mb-6">
        <!-- Header Content -->
        <div class="relative">
          <div class="relative z-10">
            <div class="flex justify-center">
              <div class="flex items-center justify-between w-full space-x-6 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-600/90 backdrop-blur-sm p-2 shadow-xl border border-white/30 dark:border-gray-600/30">
                <div class="group relative">
                  <div class="relative">
                    <select 
                      v-model="dat" 
                      @change="updateLanguage" 
                      class="appearance-none bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-100 rounded-xl px-5 py-3 pr-12 text-sm font-semibold shadow-lg border border-gray-200/50 dark:border-gray-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer backdrop-blur-sm"
                    >
                      <option value="datalotin">O'zbek (Lotin)</option>
                      <option value="datakril">O'zbek (Kiril)</option>
                    </select>
                    <!-- Language Icon -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <iconify-icon 
                        icon="material-symbols:language" 
                        class="text-blue-500 dark:text-blue-400 text-xl transition-all duration-300 group-hover:scale-110"
                      ></iconify-icon>
                    </div>
                  </div>
                  
                  <!-- Language Label -->
                  <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    Til / Язык
                  </span>
                </div>
                
                <!-- Dark/Light Mode Toggle -->
                <div class="group relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                  <button 
                    @click="toggleDarkMode" 
                    class="relative p-4 rounded-xl bg-white/90 dark:bg-gray-700/90 text-gray-600 dark:text-gray-300 shadow-lg border border-gray-200/50 dark:border-gray-500/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm"
                    :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                  >
                    <!-- Light Mode Icon -->
                    <iconify-icon 
                      v-if="!isDarkMode" 
                      icon="material-symbols:dark-mode-outline" 
                      class="text-2xl transition-all duration-500 text-indigo-600 group-hover:text-indigo-800 group-hover:rotate-12"
                    ></iconify-icon>
                    
                    <!-- Dark Mode Icon -->
                    <iconify-icon 
                      v-else 
                      icon="material-symbols:light-mode-outline" 
                      class="text-2xl transition-all duration-500 text-yellow-500 group-hover:text-yellow-400 group-hover:rotate-12"
                    ></iconify-icon>
                    
                    <!-- Enhanced Tooltip -->
                    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                      <div class="relative">
                        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                      </div>
                    </div>
                  </button>
                  
                  <!-- Theme Label -->
                  <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {{ isDarkMode ? 'Tungi' : 'Kunduzgi' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
<div class=" p-4">

      <!-- Page Title -->
      <div class="text-center mb-6">
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-200 bg-clip-text text-transparent leading-tight">
          {{ dat === "datakril" ? translateText("Ish jarayoni holati") : "Ish jarayoni holati" }}
        </h1>
        <div class="mt-2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
      </div>

      <!-- Main Content -->
      <main class="max-w-full mx-auto   bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <h4 class="text-base font-medium text-center text-gray-700 dark:text-gray-200 mb-4">
          {{ dat === "datakril" ? translateText("Ish jarayoni holat \"Sudga taqdim etildi\" bo'lganida to'liq tugallangan hisoblanadi!") : "Ish jarayoni holat \"Sudga taqdim etildi\" bo'lganida to'liq tugallangan hisoblanadi!" }}
        </h4>

      <!-- Status Timeline -->
      <div class="space-y-6">
        <template v-for="(file, fileIndex) in filteredFiles" :key="file.id">
          <div class="flex flex-col md:flex-row md:items-center overflow-x-auto py-2">
            <template v-for="(step, index) in getUniqueStatuses(file.LawyerTask)" :key="step.id">
              <!-- Status Card -->
              <div :class="[
                'flex items-center md:flex-col md:items-center p-3 rounded-lg shadow-sm transition-all duration-200 w-full md:w-32 shrink-0',
                step.isLatestRejectionWithComment
                  ? 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700'
                  : 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700'
              ]">
                <div class="mr-3 md:mr-0 mb-0 md:mb-2">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  ]">
                    <img :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'" alt="Status Icon" class="w-6 h-6" />
                  </div>
                </div>
                <div class="flex-1 md:text-center">
                  <div class="relative group">
                    <p :class="[
                      'text-sm font-medium line-clamp-2',
                      step.isLatestRejectionWithComment ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    ]">
                      {{ dat === "datakril" ? translateText(getStatus(step.title)) : getStatus(step.title) }}
                    </p>
                    <p class="absolute hidden group-hover:block bottom-full mb-2 rounded-md bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 z-10 w-max max-w-xs">
                      {{ dat === "datakril" ? translateText(getStatus(step.title)) : getStatus(step.title) }}
                    </p>
                  </div>
                  <p :class="[
                    'text-xs mt-1',
                    step.isLatestRejectionWithComment ? 'text-red-500 dark:text-red-300' : 'text-green-500 dark:text-green-300'
                  ]">
                    {{ formatDate(step.date) }}
                  </p>
                </div>
              </div>

              <!-- Striped Connector -->
              <div v-if="index < getUniqueStatuses(file.LawyerTask).length - 1" class="flex justify-center overflow-hidden items-center">
                <div class=" rotate-90">

                  <div class="w-[50px] rotate-180 overflow-hidden">
                    <div class="loader1"></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
      </main>

      <!-- Payment Details Modal -->
      <div v-if="paymentDetailsModal" @click="closePaymentDetailsModal($event)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto w-full max-w-[90%] mx-4">
          <h2 class="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {{ dat === "datakril" ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
          </h2>
          <div class="mb-3">
            <span class="text-green-600 dark:text-green-400 font-medium" v-if="selectedPaymentDetails && selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0">
              {{ dat === "datakril" ? translateText("To'langan") : "To'langan" }}
            </span>
            <span class="text-red-600 dark:text-red-400 font-medium" v-else>
              {{ dat === "datakril" ? translateText("Qarzi") : "Qarzi" }}: {{ selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
            </span>
          </div>
          <ul class="space-y-2">
            <li v-for="payment in selectedPaymentDetails" :key="payment.id" class="border border-gray-200 dark:border-gray-700 p-2 rounded-lg">
              <div class="text-gray-700 dark:text-gray-300 text-xs">
                {{ dat === "datakril" ? translateText("Jami summa") : "Jami summa" }}: {{ payment.TotalSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="text-gray-700 dark:text-gray-300 text-xs">
                {{ dat === "datakril" ? translateText("Qoldiq summa") : "Qoldiq summa" }}: {{ payment.remainingSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="text-gray-700 dark:text-gray-300 text-xs">
                {{ dat === "datakril" ? translateText("To'langan summa") : "To'langan summa" }}: {{ payment.paidSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="text-gray-700 dark:text-gray-300 text-xs">
                {{ dat === "datakril" ? translateText("Vaqt") : "Vaqt" }}: {{ formatDate(payment.createdAt) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
</div>
    </div>
  </div>
</template>

<script setup>
// Add Iconify script to head if not already included
if (!document.querySelector('script[src*="iconify"]')) {
  const script = document.createElement('script');
  script.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js';
  document.head.appendChild(script);
}

import { ref, onMounted, computed, onUnmounted, inject } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { URL } from "@/auth/url.js";
import translateText from "@/auth/Translate";

const route = useRoute();
const id = route.params.id;
const clientFiles = ref([]);
const isLoading = inject('isLoading');
const searchQuery = ref("");
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const dat = ref(localStorage.getItem("til") || "datalotin");
const isDarkMode = ref(localStorage.getItem("theme") === "dark");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) dat.value = currentLang;
};

const updateLanguage = () => {
  localStorage.setItem("til", dat.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  document.documentElement.classList.toggle("dark", isDarkMode.value);
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 1000);
  fetchClientFiles();
  if (localStorage.getItem("theme") === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const fetchClientFiles = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/client-sections/${id}`);
    const ids = parseInt(response.data.ClientFile[0].fileName);
    const res = await axios.get(`${URL}/client-files/${ids}`);
    clientFiles.value = res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : [];
  } catch (error) {
    console.error("Error fetching client files:", error);
  } finally {
    isLoading.value = false;
  }
};

const openPaymentDetailsModal = (file) => {
  selectedPaymentDetails.value = file.ClientPayment;
  paymentDetailsModal.value = true;
};

const closePaymentDetailsModal = (event) => {
  if (event.target === event.currentTarget) paymentDetailsModal.value = false;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const getStatus = (status) => {
  const statusMap = {
    status1: "Imzolash uchun shartnoma yaratildi",
    status2: "Shartnoma ko'rib chiqish jarayonida",
    status3: "Yurist zimmasiga otkazildi",
    status4: "Kerakli hujjatlar yig'ib chiqilmoqda",
    status5: "Hujjatlarni yozish jarayonida",
    status6: "Imlo xatolarini tekshirish jarayonida",
    status7: "Davlat boji va boshqa to'lovlarni buyurtmachi to'liq to'lashini kutish jarayonida",
    status8: "Sudga taqdim etish jarayonida",
    status9: "Sudga taqdim etildi",
  };
  return statusMap[status] || null;
};

const getUniqueStatuses = (lawyerTask) => {
  if (!lawyerTask || !Array.isArray(lawyerTask) || lawyerTask.length === 0) return [];
  const statusHistory = lawyerTask.flatMap((task) => task.ClientFileStatusHistory || []);
  if (!statusHistory || !Array.isArray(statusHistory) || statusHistory.length === 0) return [];

  const statusMap = new Map();
  statusHistory.forEach((item) => {
    if (!statusMap.has(item.status) || item.id > statusMap.get(item.status).id) {
      const comment = item.comment || "";
      statusMap.set(item.status, {
        id: item.id,
        status: item.status,
        title: item.status,
        date: item.createdAt,
        completed: true,
        isLatestRejectionWithComment: false,
        comment: comment,
      });
    }
  });

  const extractNumber = (statusStr) => {
    const match = statusStr.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const statuses = Array.from(statusMap.values()).sort((a, b) => extractNumber(a.status) - extractNumber(b.status));
  if (statuses.length > 0) {
    const lastStatus = statuses[statuses.length - 1];
    const isLastCommentEmpty = !lastStatus.comment || lastStatus.comment.trim() === "";
    statuses.forEach((status, index) => {
      status.isLatestRejectionWithComment = index === statuses.length - 1 && !isLastCommentEmpty;
    });
  }
  return statuses;
};

const filteredFiles = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return clientFiles.value.filter(
    (file) => file.name?.toLowerCase().includes(query) || file.fileName?.toLowerCase().includes(query)
  );
});
</script>

<style scoped>
/* Striped animation for the connector */
.bg-stripes {
  background-image: linear-gradient(
    90deg,
    rgb(13, 148, 136) 25%, /* teal-500 */
    transparent 25%,
    transparent 50%,
    rgb(13, 148, 136) 50%, /* teal-500 */
    rgb(13, 148, 136) 75%, /* teal-500 */
    transparent 75%,
    transparent
  );
  background-size: 0.25rem 0.25rem;
  animation: progress-bar-stripes 0.8s linear infinite;
}

@keyframes progress-bar-stripes {
  from {
    background-position: 0.25rem 0;
  }
  to {
    background-position: 0 0;
  }
}

/* Fade-in animation for cards */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
.loader1 {
  width: calc(80px / cos(45deg));
  height: 14px;
  background: repeating-linear-gradient(
    -45deg,
    var(--stripe-color, #22c55e) 0 10px,
    #0000 0 20px
  ) left/200% 100%;
  animation: l3 4s infinite linear;
}
@keyframes l3 {
    100% {background-position:right}
}
/* Ensure touch-friendly buttons */
button, select {
  touch-action: manipulation;
}

/* Custom select arrow styling */
select::-ms-expand {
  display: none;
}
</style>