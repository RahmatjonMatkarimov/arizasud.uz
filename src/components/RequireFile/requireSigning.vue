<template>
    <div class="bg-gray-200">
        <div class="flex justify-center p-6">
            <div v-if="errorMessage" class="text-red-600 text-center mb-4">
                {{ errorMessage }}
            </div>

            <div class="p-4 rounded-lg w-full max-w-4xl overflow- flex flex-col items-end transition-all duration-300"
                :class="{ 'w-screen h-screen max-w-none rounded-none': isFullScreen }">

                <div v-if="isLoading" class="text-gray-600 text-lg md:text-xl animate-pulse tracking-wide">
                    Yuklanmoqda...
                </div>
                <!-- PDF Pages as Images -->
                <div v-else-if="pdfPages.length" class="flex 2xl:w-[1100px]">
                    <div>
                        <div v-for="(page, index) in pdfPages" :key="index" class="mb-4 pdf-page-container">
                            <img :src="page" class="rounded-lg w-full shadow-md object-cover transition-transform duration-300"
                                alt="PDF Page" />
                        </div>
                    </div>
                    <div>
                        <div class="flex bg-white w-[400px] shadow-lg ml-2 flex-col p-4 space-y-2 mb-4">
                            <h1 class="uppercase text-black"><b class="text-black">{{ dat === 'datakril' ? translateText('F.I.O.:') : 'F.I.O.:' }}</b> {{ dat === 'datakril' ? translateText('Maxmud Salayev Narimanovich') : 'Maxmud Salayev Narimanovich' }}</h1>
                            <h1 class="uppercase text-black"><b class="text-black">{{ dat === 'datakril' ? translateText('Yaratilgan sana:') : 'Yaratilgan sana:' }}</b> {{ formattedCreatedAt }}</h1>
                            <div class="flex space-x-2">
                                <select v-if="data === 'yurist' || data === 'bigAdmin'" v-model="selectedAction"
                                    class="px-4 py-3 bg-blue-600 text-white w-full rounded-lg shadow-md hover:bg-blue-700 transition">
                                    <option v-if="data === 'yurist'" value="signaturePending">{{
                                        $t('Imzolash_uchun_yuborish') }}</option>
                                    <option v-if="data === 'bigAdmin'" value="sign">{{ $t('Imzolash') }}</option>
                                    <option value="revision">{{ $t('Qayta') }}</option>
                                    <option value="rejected">{{ $t('Rad') }}</option>
                                </select>
                            </div>
                            <input v-if="selectedAction === 'revision' || selectedAction === 'rejected'"
                                v-model="reason" type="text"
                                class="px-4 py-2 border-2 rounded-xl w-full text-black text-[20px] outline-none"
                                :placeholder="$t('sabab')" />
                            <button v-if="selectedAction" @click="handleAction"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Fallback Message -->
                <div v-else class="text-red-600 text-center">
                    PDF faylni yuklashda xatolik: {{ errorMessage || 'Fayl topilmadi yoki yo‘l noto‘g‘ri.' }}
                </div>
            </div>

            <!-- Status Reason Modal -->
            <div v-if="qwen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                <div class="bg-white p-10 relative rounded-lg shadow-lg flex justify-center">
                    <img src="/reject.png" class="w-[30px] absolute top-2 right-2" @click="qwen = false" alt="">
                    <h1 class="text-black text-[20px] w-[500px] break-words">
                        {{ statusReason }}
                    </h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { URL } from '@/auth/url';
import * as pdfjsLib from 'pdfjs-dist';
import translateText from '@/auth/Translate';
// Explicitly set the worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Use the imported URL
const BASE_URL = URL;
const API_URL = `${BASE_URL}/signingFiles/signing`;
const createdAt = ref('');
const dat = inject('dat');
const qwen = ref(false);
const showPdfModal = ref(true);
const pdfUrl = ref('');
const pdfPages = ref([]);
const selectedFileId = ref(null);
const isFullScreen = ref(false);
const route = useRoute();
const id = ref(parseInt(route.params.id));
const data = ref('');
const userID = ref(parseInt(localStorage.getItem('id')));
const role = ref(localStorage.getItem('role'));
const statusReason = ref('');
const errorMessage = ref('');
const selectedAction = ref('');
const reason = ref(''); // New ref for input reason
const isLoading = inject('isLoading');

// Format createdAt to DD.MM.YYYY
const formattedCreatedAt = computed(() => {
    if (!createdAt.value) return '';
    const date = new Date(createdAt.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
});

const getdata = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${BASE_URL}/${role.value}/${userID.value}`);
        console.log('Fetched user data:', response.data);
        data.value = response.data.role;
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.message.includes('Network Error')) {
            errorMessage.value = 'Backend server bilan bog‘lanishda xatolik: CORS muammosi. Backend serverda CORS sozlamalarini tekshiring.';
        } else {
            errorMessage.value = 'Xizmat maʼlumotlarini olishda xatolik yuz berdi: ' + error.message;
        }
    } finally {
        isLoading.value = false;
    }
};

const fetchFileById = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${API_URL}/${id.value}`, {
            validateStatus: (status) => status < 500,
        });
        console.log('Fetched file response:', response);

        if (response.status !== 200) {
            console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
            throw new Error(`Failed to fetch file. HTTP Status: ${response.status}`);
        }

        const file = response.data;
        createdAt.value = file.createdAt;

        if (!file || Object.keys(file).length === 0) {
            throw new Error(`Fayl topilmadi: ID ${id.value} uchun maʼlumot mavjud emas.`);
        }

        if (!file.filePath) {
            throw new Error(`Fayl yo‘li topilmadi: ID ${id.value} устойчив fayl yo‘li mavjud emas.`);
        }

        const constructedPdfUrl = file.filePath.startsWith('http')
            ? file.filePath
            : `${BASE_URL}${file.filePath}`;

        pdfUrl.value = constructedPdfUrl;
        selectedFileId.value = file.id;
        statusReason.value = file.statusReason || '';
        if (file.statusReason) qwen.value = true;

        await renderPdf(constructedPdfUrl);
    } catch (error) {
        console.error('Error fetching file:', error);
        if (error.message.includes('Network Error')) {
            errorMessage.value = `Faylni yuklashda xatolik yuz berdi: CORS muammosi. Backend server ${BASE_URL} da CORS sozlamalarini tekshiring.`;
        } else {
            errorMessage.value = 'Faylni yuklashda xatolik yuz berdi: ' + error.message;
        }
        pdfPages.value = [];
    } finally {
        isLoading.value = false;
    }
};

const renderPdf = async (url) => {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        pdfPages.value = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            const imageDataUrl = canvas.toDataURL('image/png');
            pdfPages.value.push(imageDataUrl);
        }
    } catch (error) {
        console.error('PDF yuklashda xatolik:', error);
        errorMessage.value = 'PDF-ni render qilishda xatolik: ' + error.message;
        pdfPages.value = [];
    }
};

const downloadPdf = () => {
    if (pdfUrl.value) {
        const link = document.createElement('a');
        link.href = pdfUrl.value;
        link.download = `document_${id.value}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const updateFile = async () => {
    isLoading.value = true;
    try {
        await axios.put(`${BASE_URL}/signingFiles/${selectedFileId.value}`);
        await fetchFileById();
    } catch (error) {
        console.error('Error signing file:', error);
        if (error.message.includes('Network Error')) {
            errorMessage.value = 'Faylni imzolashda xatolik yuz berdi: CORS muammosi.';
        } else {
            errorMessage.value = 'Faylni imzolashda xatolik yuz berdi: ' + error.message;
        }
    } finally {
        isLoading.value = false;
    }
};

const updateeFile = async (status) => {
    isLoading.value = true;
    try {
        await axios.put(`${URL}/signingFiles/${selectedFileId.value}/status`, {
            status: status,
            statusReason: reason.value
        });
        reason.value = '';
        showPdfModal.value = false;
        fetchFileById();
    } catch (error) {
        console.error('Error updating file status:', error);
        if (error.message.includes('Network Error')) {
            errorMessage.value = 'Fayl holatini yangilashda xatolik yuz berdi: CORS muammosi.';
        } else {
            errorMessage.value = 'Fayl holatini yangilashda xatolik yuz berdi: ' + error.message;
        }
    } finally {
        isLoading.value = false;
    }
};

const handleAction = () => {
    if (selectedAction.value === 'sign') {
        updateFile();
    } else if (selectedAction.value === 'signaturePending') {
        updateeFile('signaturePending');
    } else if (selectedAction.value === 'revision') {
        updateeFile('revision');
    } else if (selectedAction.value === 'rejected') {
        updateeFile('rejected');
    }
};

watch(data, (newData) => {
    if (newData === 'bigAdmin') {
        selectedAction.value = 'sign';
    } else if (newData === 'yurist') {
        selectedAction.value = 'signaturePending';
    }
});

onMounted(() => {
    getdata();
    fetchFileById();
});
</script>