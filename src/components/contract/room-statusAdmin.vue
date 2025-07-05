<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 transition-colors duration-300">
    <!-- Header -->
    <header class="flex justify-center mb-8">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-xl px-6 py-3 shadow-md">
        {{ dat === "datakril" ? translateText("Ish jarayoni holati") : "Ish jarayoni holati" }}
      </h1>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6">
      <h4 class="text-lg md:text-xl font-medium text-center text-gray-700 dark:text-gray-200 mb-6">
        {{ dat === "datakril" ? translateText("Ish jarayoni holat \"Sudga taqdim etildi\" bo'lganida to'liq tugallangan hisoblanadi!") : "Ish jarayoni holat \"Sudga taqdim etildi\" bo'lganida to'liq tugallangan hisoblanadi!" }}
      </h4>

      <!-- Status Timeline -->
      <div class="space-y-6">
        <template v-for="(file, fileIndex) in filteredFiles" :key="file.id">
          <div class="flex flex-col md:flex-row md:items-center overflow-scroll py-2">
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
              <div v-if="index < getUniqueStatuses(file.LawyerTask).length - 1">
                <div class="w-[50px] overflow-hidden">
                  <div class="loader1 rotate-180"></div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </main>

    <!-- Payment Details Modal -->
    <div v-if="paymentDetailsModal" @click="closePaymentDetailsModal($event)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div :style="modalStyle" @click.stop class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto w-full max-w-md mx-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {{ dat === "datakril" ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
        </h2>
        <div class="mb-4">
          <span class="text-green-600 dark:text-green-400 font-medium" v-if="selectedPaymentDetails && selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0">
            {{ dat === "datakril" ? translateText("To'langan") : "To'langan" }}
          </span>
          <span class="text-red-600 dark:text-red-400 font-medium" v-else>
            {{ dat === "datakril" ? translateText("Qarzi") : "Qarzi" }}: {{ selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
          </span>
        </div>
        <ul class="space-y-3">
          <li v-for="payment in selectedPaymentDetails" :key="payment.id" class="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
            <div class="text-gray-700 dark:text-gray-300 text-sm">
              {{ dat === "datakril" ? translateText("Jami summa") : "Jami summa" }}: {{ payment.TotalSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-gray-700 dark:text-gray-300 text-sm">
              {{ dat === "datakril" ? translateText("Qoldiq summa") : "Qoldiq summa" }}: {{ payment.remainingSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-gray-700 dark:text-gray-300 text-sm">
              {{ dat === "datakril" ? translateText("To'langan summa") : "To'langan summa" }}: {{ payment.paidSum }}{{ dat === "datakril" ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-gray-700 dark:text-gray-300 text-sm">
              {{ dat === "datakril" ? translateText("Vaqt") : "Vaqt" }}: {{ formatDate(payment.createdAt) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, reactive, inject } from "vue";
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
const modalPosition = ref({ top: 0, left: 0 });
const data = ref(null);
const dat = ref(localStorage.getItem("til") || "datalotin");

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
  fetchClientFiles();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile);
});

const isMobile = ref(window.innerWidth <= 640);
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 640;
};

const fetchClientFiles = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/client-sections/${id}`);
    const ids = parseInt(response.data.ClientFile[0].fileName);
    const res = await axios.get(`${URL}/client-files/${ids}`);
    data.value = response.data.client;
    clientFiles.value = res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : [];
  } catch (error) {
    console.error("Error fetching client files:", error);
  } finally {
    isLoading.value = false;
  }
};

const openPaymentDetailsModal = (file, event) => {
  selectedPaymentDetails.value = file.ClientPayment;
  const rect = event.target.getBoundingClientRect();
  modalPosition.value = { top: rect.top + window.scrollY + rect.height, left: rect.left + window.scrollX };
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

const modalStyle = computed(() => {
  if (isMobile.value) {
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", margin: "0" };
  }
  return { top: modalPosition.value.top + 10 + "px", left: modalPosition.value.left - 143 + "px" };
});

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

  // Define valid statuses
  const validStatuses = [
    'status1', 'status2', 'status3', 'status4', 
    'status5', 'status6', 'status7', 'status8', 'status9'
  ];

  const statusMap = new Map();
  statusHistory.forEach((item) => {
    // Only include valid statuses
    if (validStatuses.includes(item.status)) {
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
    45deg,
    rgb(13, 148, 136) 25%, /* teal-500 */
    transparent 25%,
    transparent 50%,
    rgb(13, 148, 136) 50%, /* teal-500 */
    rgb(13, 148, 136) 75%, /* teal-500 */
    transparent 75%,
    transparent
  );
  background-size: 0.25rem 0.25rem; /* Smaller stripes for thinner line */
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

/* Rotate for vertical appearance on desktop */
@media (min-width: 768px) {
  .bg-stripes {
    transform: rotate(90deg);
    transform-origin: center;
  }
}

/* main.css yoki App.vue ichida <style global> bo‘limiga qo‘shing */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox uchun */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #fb010100;
}

/* HTML: <div class="loader"></div> */
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

/* Fade-in animation for cards */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>