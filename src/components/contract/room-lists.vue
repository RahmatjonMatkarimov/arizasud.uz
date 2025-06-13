<template>
    <div class=" bg-gradient-to-r to-[#d2ffd7] from-[#e6ffe9]">
        <Header />
        <div class="flex justify-end">
            <input v-model="searchQuery" type="text"
                :placeholder="$t('qidiruv')"
                class="border p-2 rounded text-black focus:outline-none border-black mt-4 mx-4 focus:ring focus:ring-blue-300 w-full sm:w-auto" />
        </div>
        <div class="flex justify-center p-5 rounded-lg max-w-full overflow-x-auto">
            <div class="w-full max-w-[1140px] p-4 rounded-lg">
                <ul class="list-none p-0 m-0">
                    <li v-for="file in filteredFiles"
                        @click="router.push(file.type === 'video' ? '/video/' + file.id : '/room-file/' + file.id)"
                        :key="file.id" class="relative duration-200 rounded-xl border-4 border-blue-500 z-20 p-2 my-2 cursor-pointer">
                        <div class="py-2 flex  hover:bg-white border-4 rounded-xl  border-blue-500 bg-blue-500 group justify-between items-center">
                            <a target="_blank" class="text-white ml-1 group-hover:text-blue-500 px-0 lg:px-4 text-md lg:text-xl lg:w-auto w-[200px] lg:hover:underline">
                                {{ dat === 'datakril' ? translateText(file.name) : file.name }}
                            </a>
                            <div class="flex gap-4">
                                <div class="lg:flex items-center relative z-50 gap-4">
                                    <div v-if="file.ClientPayment && file.ClientPayment.length" class="text-lg">
                                        <span class="text-green-600"
                                            v-if="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0">
                                            {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                                        </span>
                                        <span v-else
                                            @click.stop="openPaymentDetailsModal(file, $event)">
                                            <span class="block text-red-400 cursor-pointer sm:hidden">
                                                {{ dat === 'datakril' ? translateText("Qarzlar") : "Qarzlar" }}
                                            </span>
                                            <span class="hidden text-red-400 cursor-pointer sm:inline">
                                                {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                                                {{ file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum || 0
                                                }}
                                                {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                                            </span>
                                        </span>

                                    </div>
                                    <div class="group-hover:text-blue-500 mr-2 text-white">
                                        {{ formatDate(file.createdAt) }}
                                    </div>
                                </div>
                                <div v-if="file.LawyerTask[0]"
                                    class="mt-2 rounded-full bg-white text-blue-500 w-9 rotate-90 h-9 flex justify-center items-center sm:hidden">
                                    <button @click.stop="toggleTaskSection(file.id)"
                                        :class="{ 'rotate-180': taskSectionOpen[file.id] }"
                                        class="text-blue-500 text-xl font-bold  transition-transform duration-300">
                                        < </button>
                                </div>
                            </div>

                        </div>
                        <div v-if="file.LawyerTask[0] && (taskSectionOpen[file.id] || !isMobile)" @click.stop
                            class="mt-6">
                            <h4 class="text-sm font-semibold text-gray-800 mb-2">Ish jarayoni holati</h4>
                            <div class="overflow-x-auto max-w-[100%]">
                                <div class="inline-block min-w-full">
                                    <div class="lg:flex overflow-x-auto items-center">
                                        <template
                                            v-for="(step, index) in getUniqueStatuses(file.LawyerTask[0].ClientFileStatusHistory)"
                                            :key="step.id">
                                            <div :class="[
                                                'relative flex lg:flex-col rounded-xl z-40 lg:bg-white my-1 lg:my-0 h-[100px] lg:h-[170px] items-center p-1 lg:max-w-[135px]',
                                                step.isLatestRejectionWithComment ? 'lg:border-[6px] border-b-2 bg-gradient-to-r from-[#ffd2d2] to-[#ffe6e6] border-l-2 border-red-600' : 'lg:border-[6px] bg-gradient-to-r from-[#d2ffd7] to-[#e6ffe9] border-b-2 border-l-2 border-lime-600'
                                            ]">

                                                <div class="relative mr-4 lg:mr-0 z-10">
                                                    <div class="rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                                                        :class="step.completed ? 'bg-green--100 text-green-600' : 'bg-gray-100 text-gray-400'">
                                                        <img class="min-w-[50px] max-w-[50px]"
                                                            :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'"
                                                            alt="Status Icon" />
                                                    </div>
                                                </div>
                                                <div class="mt-2 lg:text-center">
                                                    <div class="lg:asd relative">
                                                        <p :class="[
                                                            'text-[16px] font-medium lg:p-1 line-clamp-2 lg:w-[120px] mb-1',
                                                            step.isLatestRejectionWithComment ? 'text-red-600' : 'text-green-600']"
                                                            class="">
                                                            {{ dat === 'datakril' ? translateText(getStatus(step.title))
                                                                : getStatus(step.title) }}
                                                        </p>
                                                        <p
                                                            class="absolute das -mt-2 rounded-md z-40 bg-gray-600 min-w-[300px] text-center text-white">
                                                            {{ dat === 'datakril' ? translateText(getStatus(step.title))
                                                                : getStatus(step.title) }}
                                                        </p>
                                                    </div>
                                                    <p
                                                        :class="['text-[16px]',
                                                            step.isLatestRejectionWithComment ? 'text-red-600' : 'text-green-600']">
                                                        {{ formatDate(step.date) }}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="flex justify-center">
                                                <div v-if="index < getUniqueStatuses(file.LawyerTask[0].ClientFileStatusHistory).length - 1"
                                                    class="rotate-180 lg:rotate-0">
                                                    <div class="w-[70px] rotate-90 lg:rotate-180 h-5 overflow-hidden">
                                                        <div class="h-full bg-lime-600 bg-stripes" style="width: 100%">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Payment Details Modal -->
        <div v-if="paymentDetailsModal" @click="closePaymentDetailsModal($event)"
            class="fixed inset-0 z-50 flex justify-center items-start bg-black bg-opacity-50">
            <div :style="modalStyle" @click.stop
                class="absolute bg-gray-200 p-6 rounded-lg max-h-[450px] shadow-lg overflow-y-auto w-full sm:w-auto sm:max-w-md">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    {{ dat === 'datakril' ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
                </h2>
                <div class="mb-4">
                    <span class="text-green-600 font-medium"
                        v-if="selectedPaymentDetails && selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0">
                        {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                    </span>
                    <span class="text-red-600 font-medium" v-else>
                        {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                        {{ selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum }}{{ dat ===
                            'datakril' ?
                            translateText("so'm") : "so'm" }}
                    </span>
                </div>
                <ul class="list-none p-0 m-0">
                    <li v-for="payment in selectedPaymentDetails" :key="payment.id"
                        class="mt-1 border p-2 border-black">
                        <div class="text-black">
                            {{ dat === 'datakril' ? translateText("Jami summa") : "Jami summa" }}: {{ payment.TotalSum
                            }}{{
                                dat === 'datakril' ? translateText("so'm") : "so'm" }}
                        </div>
                        <div class="text-black">
                            {{ dat === 'datakril' ? translateText("Qoldiq summa") : "Qoldiq summa" }}: {{
                                payment.remainingSum }}{{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                        </div>
                        <div class="text-black">
                            {{ dat === 'datakril' ? translateText("To'langan summa") : "To'langan summa" }}: {{
                                payment.paidSum }}{{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                        </div>
                        <div class="text-black">
                            {{ dat === 'datakril' ? translateText("Vaqt") : "Vaqt" }}: {{ formatDate(payment.createdAt)
                            }}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, reactive } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import Header from '@/components/header.vue';

const dat = ref(localStorage.getItem('til'));
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const clientFiles = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const modalPosition = ref({ top: 0, left: 0 });
const data = ref(null);
// Use reactive instead of ref for taskSectionOpen to ensure deep reactivity
const taskSectionOpen = reactive({});
const isMobile = ref(window.innerWidth <= 640);

// Update isMobile on window resize
const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 640;
};
onMounted(() => {
    window.addEventListener('resize', updateIsMobile);
    fetchClientFiles();
});
onUnmounted(() => {
    window.removeEventListener('resize', updateIsMobile);
});

const fetchClientFiles = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${URL}/client-sections/${id}`);
        clientFiles.value = response.data.ClientFile || [];
        data.value = response.data.client;
        clientFiles.value.forEach(file => {
            taskSectionOpen[file.id] = false;
        });
    } catch (error) {
        console.error("Error fetching client files:", error);
    } finally {
        isLoading.value = false;
    }
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

const closePaymentDetailsModal = (event) => {
    if (event.target === event.currentTarget) {
        paymentDetailsModal.value = false;
    }
};

const toggleTaskSection = (fileId) => {
    // If the section is already open, close it
    if (taskSectionOpen[fileId]) {
        taskSectionOpen[fileId] = false;
    } else {
        // Close all other sections and open the clicked one
        Object.keys(taskSectionOpen).forEach(key => {
            taskSectionOpen[key] = false;
        });
        taskSectionOpen[fileId] = true;
    }
    // Log state for debugging
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};
const modalStyle = computed(() => {
    if (isMobile.value) {
        // Center the modal on mobile
        return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: '0',
        };
    } else {
        // Original positioning on PC
        return {
            top: modalPosition.value.top + 10 + 'px',
            left: modalPosition.value.left - 143 + 'px',
        };
    }
});
const getStatus = (status) => {
    if (!status) return null;
    const statusMap = {
        'status1': 'Imzolash uchun shartnoma yaratildi',
        'status2': 'Shartnoma ko\'rib chiqish jarayonida',
        'status3': 'Yurist zimmasiga otkazildi',
        'status4': 'Kerakli hujjatlar yig\'ib chiqilmoqda',
        'status5': 'Hujjatlarni yozish jarayonida',
        'status6': 'Imlo xatolarini tekshirish jarayonida',
        'status7': 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
        'status8': 'Sudga taqdim etish jarayonida',
        'status9': 'Sudga taqdim etildi',
    };
    return statusMap[status] || null;
};

const getUniqueStatuses = (statusHistory) => {
    if (!statusHistory || !Array.isArray(statusHistory) || statusHistory.length === 0) {
        console.log("statusHistory bo'sh yoki noto'g'ri:", statusHistory);
        return [];
    }

    const statusMap = new Map();

    // Har bir statusni yig'amiz
    statusHistory.forEach(item => {
        if (!statusMap.has(item.status) || item.id > statusMap.get(item.status).id) {
            const comment = item.comment || '';
            statusMap.set(item.status, {
                id: item.id,
                status: item.status,
                title: item.status,
                date: item.createdAt,
                completed: true,
                isLatestRejectionWithComment: false,
                comment: comment
            });
        }
    });

    const extractNumber = (statusStr) => {
        const match = statusStr.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const statuses = Array.from(statusMap.values()).sort(
        (a, b) => extractNumber(a.status) - extractNumber(b.status)
    );

    // Oxirgi statusni tekshiramiz
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
    const query = searchQuery.value.toLowerCase();
    return clientFiles.value.filter(file => {
        const nameMatch = file.name?.toLowerCase().includes(query);
        const contractIdMatch = file.contractId?.toString().includes(query);
        return nameMatch || contractIdMatch;
    });
});


let intervalId = null;
const checkLanguageChange = () => {
    const currentLang = localStorage.getItem('til') || 'datalotin';
    if (currentLang !== dat.value) {
        dat.value = currentLang;
    }
};
onMounted(() => {
    intervalId = setInterval(checkLanguageChange, 0);
})
onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style>
.infinite-border {
    position: relative;
    min-width: 75px;
    font-size: 24px;
    min-height: 20px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.border-line {
    position: absolute;
    top: -500%;
    right: 0;
    min-width: 200%;
    white-space: nowrap;
    font-size: 140px;
    font-weight: 900;
    animation: moveLine 5s linear infinite;
    pointer-events: none;
    user-select: none;
}

@keyframes moveLine {
    0% {
        transform: translateX(140%);
    }

    100% {
        transform: translateX(200%);
    }
}

@keyframes progress-bar-stripes {
    from {
        background-position: 1rem 0;
    }

    to {
        background-position: 0 0;
    }
}
.das {
    display: none;
  }

  .asd:hover .das {
    display: block;
  }
.bg-stripes {
    background-image: linear-gradient(45deg,
            rgb(159, 213, 157) 25%,
            transparent 25%,
            transparent 50%,
            rgba(159, 213, 157) 50%,
            rgb(159, 213, 157) 75%,
            transparent 75%,
            transparent);
    background-size: 1rem 1rem;
    animation: progress-bar-stripes 1s linear infinite;
}

/* Mobile-friendly styles */
@media (max-width: 640px) {
    input {
        width: 100%;
        font-size: 14px;
    }

    li {
        flex-direction: column;
        align-items: flex-start;
    }

    .text-sm {
        font-size: 12px;
    }

    h2 {
        font-size: 18px;
    }

    ul li div {
        font-size: 12px;
    }
}
</style>