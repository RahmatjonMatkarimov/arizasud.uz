<template>
    <div :class="['min-h-screen transition-colors duration-300 overflow-hidden touch-manipulation', isDarkMode ? 'bg-gradient-to-b from-gray-950 to-gray-900 text-white' : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900']">
        <!-- Header Section -->
        <header :class="['flex items-center justify-between p-2 shadow-2xl sticky top-0 z-40', isDarkMode ? 'bg-gray-950/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg']">
            <div class="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" class="h-5 w-5 rounded-full object-cover transition-transform duration-300 hover:scale-110" />
                <h1 class="text-md font-semibold truncate max-w-[60vw]">{{ translateText('Mijozlar Fayllari') }}</h1>
            </div>
            <div class="flex items-center space-x-1">
                <button @click="toggleLanguage" :class="['px-2 py-0.5 rounded-full text-[1rem] font-medium transition-all duration-200 transform hover:scale-105', isDarkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-gray-100 text-blue-600 hover:bg-gray-200']">
                    {{ dat === 'datakril' ? 'Лотин' : 'Кирил' }}
                </button>
                <button @click="toggleTheme" :class="['p-1 rounded-full transition-all duration-200 transform hover:scale-105', isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200']">
                    {{ isDarkMode ? '☀️' : '🌙' }}
                </button>
            </div>
        </header>
        <!-- Search Section -->
        <div class="px-2 pt-1.5 pb-2.5">
            <div class="relative">
                <input v-model="searchQuery" type="text"
                    :placeholder="translateText('Qidiruv')"
                    :class="['border pl-7 pr-2.5 py-1.5 rounded-full text-[0.85rem] w-full focus:outline-none focus:ring-1 transition-all duration-200', isDarkMode ? 'bg-gray-850 border-gray-800 text-white placeholder-gray-600 focus:ring-blue-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-400']" />
                <svg class="absolute left-2 top-2 h-4 w-4" :class="[isDarkMode ? 'text-gray-600' : 'text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
        <!-- File List -->
        <div v-if="isLoading" class="flex justify-center items-center h-[calc(var(--vh,1vh)*100-108px)]">
            <svg class="animate-spin h-6 w-6" :class="[isDarkMode ? 'text-blue-400' : 'text-blue-600']" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"></path>
            </svg>
        </div>
        <div v-else-if="filteredFiles.length === 0" class="flex justify-center items-center h-[calc(var(--vh,1vh)*100-108px)] text-[0.65rem]" :class="[isDarkMode ? 'text-gray-500' : 'text-gray-600']">
            {{ translateText('Fayllar topilmadi') }}
        </div>
        <div v-else class="px-2 pb-3 space-y-2 overflow-y-auto h-[calc(var(--vh,1vh)*100-108px)]">
            <ul class="list-none p-0 m-0 space-y-2">
                <li v-for="file in filteredFiles" :key="file.id"
                    @click="router.push(file.type === 'video' ? '/video/' + file.id : '/room-file/' + file.id)"
                    class="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                    :class="[isDarkMode ? 'bg-gray-850/80 border-gray-800' : 'bg-white/80 border-gray-100']">
                    <div class="p-2 space-y-1">
                        <a target="_blank" class="text-[0.65rem] font-medium truncate block" :class="[isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700']">
                            {{ translateText(file.name) }}
                        </a>
                        <div class="flex flex-col space-y-0.5 text-[1rem]">
                            <div v-if="file.ClientPayment && file.ClientPayment.length">
                                <span v-if="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0"
                                    class="text-green-400 font-medium">
                                    {{ translateText('To\'langan') }}
                                </span>
                                <span v-else @click.stop="openPaymentDetailsModal(file)"
                                    class="text-red-400 font-medium cursor-pointer hover:underline">
                                    {{ translateText('Qarzi') }}: {{ file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum || 0 }} {{ translateText('so\'m') }}
                                </span>
                            </div>
                            <span :class="[isDarkMode ? 'text-gray-600' : 'text-gray-500']">
                                {{ formatDate(file.createdAt) }}
                            </span>
                        </div>
                        <div v-if="file.LawyerTask?.[0]" class="flex justify-end">
                            <button @click.stop="toggleTaskSection(file.id)"
                                :class="['p-0.5 rounded-full text-[1rem] transition-all duration-200 transform', isDarkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:scale-110' : 'bg-gray-100 text-blue-600 hover:bg-gray-200 hover:scale-110', taskSectionOpen[file.id] ? 'rotate-180' : '']">
                                ▼
                            </button>
                        </div>
                    </div>
                    <div v-if="file.LawyerTask?.[0] && taskSectionOpen[file.id]" class="px-2 pb-2 space-y-1">
                        <h4 class="text-[1rem] font-semibold" :class="[isDarkMode ? 'text-gray-500' : 'text-gray-600']">
                            {{ translateText('Ish jarayoni holati') }}
                        </h4>
                        <div class="space-y-0.5">
                            <div v-for="step in getUniqueStatuses(file.LawyerTask[0].ClientFileStatusHistory)" :key="step.id"
                                :class="['flex items-center p-1 rounded-lg text-[1rem]', step.isLatestRejectionWithComment ? (isDarkMode ? 'bg-red-900/10' : 'bg-red-50/50') : (isDarkMode ? 'bg-green-900/10' : 'bg-green-50/50')]">
                                <div class="mr-1">
                                    <div :class="['rounded-full min-w-10 min-h-10 max-h-10 max-w-10 p-1 flex items-center justify-center', step.completed ? (isDarkMode ? 'bg-green-900' : 'bg-green-100') : (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')]">
                                        <img class="w-full h-full" :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'" alt="Status Icon" />
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium" :class="[step.isLatestRejectionWithComment ? 'dark:text-red-300 text-red-500' : 'dark:text-green-300 text-green-500']">
                                        {{ translateText(getStatus(step.title)) }}
                                    </p>
                                    <p :class="[step.isLatestRejectionWithComment ? 'dark:text-red-200 text-red-400' : 'dark:text-green-200 text-green-4. 00']">
                                        {{ formatDate(step.date) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- Payment Details Modal -->
        <div v-if="paymentDetailsModal" @click="closePaymentDetailsModal($event)" class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-75 transition-opacity duration-300">
            <div @click.stop ref="modal" :class="['p-3 rounded-t-3xl w-full max-h-[70vh] overflow-y-auto transition-all duration-300 transform bg-gradient-to-t', isDarkMode ? 'from-gray-950 to-gray-900 text-white' : 'from-white to-gray-50 text-gray-900', paymentDetailsModal ? 'translate-y-0' : 'translate-y-full']">
                <div class="flex justify-center mb-2.5">
                    <div class="w-8 h-1 bg-gray-600 rounded-full transition-all duration-200"></div>
                </div>
                <h2 class="text-xs font-semibold mb-1.5">
                    {{ translateText('To\'lov tafsilotlari') }}
                </h2>
                <div class="mb-1.5 text-[1rem]">
                    <span class="text-green-300 font-medium" v-if="selectedPaymentDetails && selectedPaymentDetails[selectedPaymentDetails.length - 1]?.remainingSum <= 0">
                        {{ translateText('To\'langan') }}
                    </span>
                    <span class="text-red-300 font-medium" v-else>
                        {{ translateText('Qarzi') }}: {{ selectedPaymentDetails?.[selectedPaymentDetails.length - 1]?.remainingSum || 0 }} {{ translateText('so\'m') }}
                    </span>
                </div>
                <ul class="list-none p-0 m-0 space-y-1">
                    <li v-for="payment in selectedPaymentDetails" :key="payment.id" :class="['p-1.5 rounded-lg text-[1rem]', isDarkMode ? 'bg-gray-850/30' : 'bg-gray-100/30']">
                        <div>{{ translateText('Jami summa') }}: {{ payment.TotalSum }} {{ translateText('so\'m') }}</div>
                        <div>{{ translateText('Qoldiq summa') }}: {{ payment.remainingSum }} {{ translateText('so\'m') }}</div>
                        <div>{{ translateText('To\'langan summa') }}: {{ payment.paidSum }} {{ translateText('so\'m') }}</div>
                        <div>{{ translateText('Vaqt') }}: {{ formatDate(payment.createdAt) }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, reactive, watch, inject } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url';

// Transliteration mapping between Latin and Cyrillic Uzbek
const transliterationMap = {
  latinToCyrillic: {
    'a': 'а', 'A': 'А',
    'b': 'б', 'B': 'Б',
    'd': 'д', 'D': 'Д',
    'e': 'э', 'E': 'Э',
    'f': 'ф', 'F': 'Ф',
    'g': 'г', 'G': 'Г',
    'h': 'ҳ', 'H': 'Ҳ',
    'i': 'и', 'I': 'И',
    'j': 'ж', 'J': 'Ж',
    'k': 'к', 'K': 'К',
    'l': 'л', 'L': 'Л',
    'm': 'м', 'M': 'М',
    'n': 'н', 'N': 'Н',
    'o': 'о', 'O': 'О',
    'p': 'п', 'P': 'П',
    'q': 'қ', 'Q': 'Қ',
    'r': 'р', 'R': 'Р',
    's': 'с', 'S': 'С',
    't': 'т', 'T': 'Т',
    'u': 'у', 'U': 'У',
    'v': 'в', 'V': 'В',
    'x': 'х', 'X': 'Х',
    'y': 'й', 'Y': 'Й',
    'z': 'з', 'Z': 'З',
    'o\'': 'ў', 'O\'': 'Ў',
    'g\'': 'ғ', 'G\'': 'Ғ',
    'sh': 'ш', 'Sh': 'Ш', 'SH': 'Ш',
    'ch': 'ч', 'Ch': 'Ч', 'CH': 'Ч',
    '\'': 'ъ',
  },
  cyrillicToLatin: {
    'а': 'a', 'А': 'A',
    'б': 'b', 'Б': 'B',
    'д': 'd', 'Д': 'D',
    'э': 'e', 'Э': 'E',
    'ф': 'f', 'Ф': 'F',
    'г': 'g', 'Г': 'G',
    'ҳ': 'h', 'Ҳ': 'H',
    'и': 'i', 'И': 'I',
    'ж': 'j', 'Ж': 'J',
    'к': 'k', 'К': 'K',
    'л': 'l', 'Л': 'L',
    'м': 'm', 'М': 'M',
    'н': 'n', 'Н': 'N',
    'о': 'o', 'О': 'O',
    'п': 'p', 'П': 'P',
    'қ': 'q', 'Қ': 'Q',
    'р': 'r', 'Р': 'R',
    'с': 's', 'С': 'S',
    'т': 't', 'Т': 'T',
    'у': 'u', 'У': 'U',
    'в': 'v', 'В': 'V',
    'х': 'x', 'Х': 'X',
    'й': 'y', 'Й': 'Y',
    'з': 'z', 'З': 'Z',
    'ў': 'o\'', 'Ў': 'O\'',
    'ғ': 'g\'', 'Ғ': 'G\'',
    'ш': 'sh', 'Ш': 'Sh',
    'ч': 'ch', 'Ч': 'Ch',
    'ъ': '\'',
  },
};

const translateText = (text) => {
  if (!text || typeof text !== 'string') return text;
  const lang = localStorage.getItem('til') || 'datalotin';
  const map = lang === 'datakril' ? transliterationMap.latinToCyrillic : transliterationMap.cyrillicToLatin;
  let result = '';
  let i = 0;

  while (i < text.length) {
    // Check for multi-character sequences first (e.g., 'o\'', 'sh')
    let matched = false;
    for (const [key, value] of Object.entries(map)) {
      if (text.startsWith(key, i)) {
        result += value;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += text[i];
      i++;
    }
  }

  return result;
};

const dat = ref(localStorage.getItem('til') || 'datalotin');
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const clientFiles = ref([]);
const isLoading = inject('isLoading');
const searchQuery = ref('');
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const data = ref(null);
const taskSectionOpen = reactive({});
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');
const modal = ref(null);

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode.value);
};

const toggleLanguage = () => {
    const newLang = dat.value === 'datakril' ? 'datalotin' : 'datakril';
    dat.value = newLang;
    localStorage.setItem('til', newLang);
};

onMounted(() => {
    document.documentElement.classList.toggle('dark', isDarkMode.value);
    fetchClientFiles();
    window.addEventListener('resize', updateViewportHeight);
    updateViewportHeight();
    setupSwipeToClose();
});

onUnmounted(() => {
    window.removeEventListener('resize', updateViewportHeight);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
});

const updateViewportHeight = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};

let touchStartY = 0;
let touchCurrentY = 0;
let isSwiping = false;
let lastTouchTime = 0;

const setupSwipeToClose = () => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
};

const handleTouchStart = (e) => {
    if (!paymentDetailsModal.value || !modal.value || !modal.value.contains(e.target)) return;
    const now = Date.now();
    if (now - lastTouchTime < 300) return;
    touchStartY = e.touches[0].clientY;
    touchCurrentY = touchStartY;
    isSwiping = true;
    lastTouchTime = now;
};

const handleTouchMove = (e) => {
    if (!paymentDetailsModal.value || !modal.value || !isSwiping) return;
    const modalContent = modal.value.querySelector('ul');
    if (modalContent && modalContent.scrollTop > 0 && e.touches[0].clientY < touchStartY) return;
    e.preventDefault();
    touchCurrentY = e.touches[0].clientY;
    const deltaY = touchCurrentY - touchStartY;
    if (deltaY > 0) {
        modal.value.style.transform = `translateY(${deltaY}px)`;
        modal.value.style.transition = 'none';
    }
};

const handleTouchEnd = () => {
    if (!paymentDetailsModal.value || !modal.value || !isSwiping) return;
    const deltaY = touchCurrentY - touchStartY;
    modal.value.style.transition = 'transform 0.3s ease-out';
    if (deltaY > 80) {
        paymentDetailsModal.value = false;
        selectedPaymentDetails.value = null;
    } else {
        modal.value.style.transform = 'translateY(0)';
    }
    isSwiping = false;
    touchStartY = 0;
    touchCurrentY = 0;
};

const fetchClientFiles = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${URL}/client-sections/${id}`);
        clientFiles.value = response.data.ClientFile || [];
        data.value = response.data.client || null;
        clientFiles.value.forEach(file => {
            taskSectionOpen[file.id] = false;
        });
    } catch (error) {
        console.error("Error fetching client files:", error);
        clientFiles.value = [];
    } finally {
        isLoading.value = false;
    }
};

const openPaymentDetailsModal = (file) => {
    selectedPaymentDetails.value = file.ClientPayment || [];
    paymentDetailsModal.value = true;
};

const closePaymentDetailsModal = (event) => {
    if (event.target === event.currentTarget && !isSwiping) {
        paymentDetailsModal.value = false;
        selectedPaymentDetails.value = null;
    }
};

const toggleTaskSection = (fileId) => {
    if (taskSectionOpen[fileId]) {
        taskSectionOpen[fileId] = false;
    } else {
        Object.keys(taskSectionOpen).forEach(key => {
            taskSectionOpen[key] = false;
        });
        taskSectionOpen[fileId] = true;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const getStatus = (status) => {
    if (!status) return '';
    const statusMap = {
        'status1': 'Imzolash uchun shartnoma yaratildi',
        'status2': 'Shartnoma ko\'rib chiqish jarayonida',
        'status3': 'Yurist zimmasiga o\'tkazildi',
        'status4': 'Kerakli hujjatlar yig\'ib chiqilmoqda',
        'status5': 'Hujjatlarni yozish jarayonida',
        'status6': 'Imlo xatolarini tekshirish jarayonida',
        'status7': 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
        'status8': 'Sudga taqdim etish jarayonida',
        'status9': 'Sudga taqdim etildi',
    };
    return statusMap[status] || status;
};

const getUniqueStatuses = (statusHistory) => {
  if (!statusHistory || !Array.isArray(statusHistory) || statusHistory.length === 0) {
    return [];
  }

  // Define valid statuses
  const validStatuses = [
    'status1', 'status2', 'status3', 'status4',
    'status5', 'status6', 'status7', 'status8', 'status9'
  ];

  const statusMap = new Map();
  statusHistory.forEach(item => {
    // Only include valid statuses
    if (validStatuses.includes(item.status)) {
      if (!statusMap.has(item.status) || item.id > statusMap.get(item.status).id) {
        const comment = item.comment || '';
        statusMap.set(item.status, {
          id: item.id,
          status: item.status,
          title: item.status,
          date: item.createdAt,
          completed: true,
          isLatestRejectionWithComment: false,
          comment,
        });
      }
    }
  });

  const extractNumber = (statusStr) => {
    const match = statusStr.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const statuses = Array.from(statusMap.values()).sort(
    (a, b) => extractNumber(a.status) - extractNumber(b.status)
  );

  if (statuses.length > 0) {
    const lastStatus = statuses[statuses.length - 1];
    const isLastCommentEmpty = !lastStatus.comment || lastStatus.comment.trim() === '';
    statuses.forEach((status, index) => {
      status.isLatestRejectionWithComment = index === statuses.length - 1 && !isLastCommentEmpty;
    });
  }

  return statuses;
};

const filteredFiles = computed(() => {
    const query = translateText(searchQuery.value.toLowerCase());
    return clientFiles.value.filter(file => {
        const nameMatch = translateText(file.name)?.toLowerCase().includes(query);
        const contractIdMatch = file.contractId?.toString().includes(query);
        return nameMatch || contractIdMatch;
    });
});

watch(() => localStorage.getItem('til'), (newLang) => {
    if (newLang && newLang !== dat.value) {
        dat.value = newLang;
    }
}, { immediate: true });
</script>

<style>
.bg-stripes {
    background-image: linear-gradient(
        45deg,
        rgba(34, 197, 94, 0.3) 25%,
        transparent 25%,
        transparent 50%,
        rgba(34, 197, 94, 0.3) 50%,
        rgba(34, 197, 94, 0.3) 75%,
        transparent 75%,
        transparent
    );
    background-size: 0.2rem 0.2rem;
    animation: progress-bar-stripes 2.5s linear infinite;
}

@keyframes progress-bar-stripes {
    from {
        background-position: 0.2rem 0;
    }
    to {
        background-position: 0 0;
    }
}

.touch-manipulation {
    touch-action: manipulation;
}

@media (min-width: 641px) {
    header {
        padding: 0.5rem 1rem;
    }

    header h1 {
        font-size: 0.75rem;
        max-width: 70vw;
    }

    header button {
        padding: 0.25rem 0.5rem;
        font-size: 1rem;
    }

    .px-2 {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }

    ul li {
        padding: 0.25rem;
    }

    ul li div {
        padding: 0.5rem;
    }

    ul li a {
        font-size: 0.65rem;
    }

    ul li h4 {
        font-size: 1rem;
    }

    ul li .w-4 {
        width: 1rem;
        height: 1rem;
    }

    ul li .w-2\.5 {
        width: 0.625rem;
        height: 0.625rem;
    }

    .payment-modal {
        width: 18rem;
        border-radius: 0.75rem;
        max-height: 75vh;
        transform: translate(-50%, -50%) !important;
        top: 50% !important;
        bottom: auto !important;
    }
}
</style>