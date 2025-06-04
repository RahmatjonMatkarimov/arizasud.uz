<template>
    <div class="h-screen -mt-8 pt-8 bg-gray-100">
        <div class="flex justify-center mt-8 items-center">
            <h1
                class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
                {{ dat === 'datakril' ? translateText("Lex.uz va QR-code xizmati uchun BXM tahrirlash") :
                    "Lex.uz va QR-code xizmati uchun BXMni tahrirlash" }}
            </h1>
        </div>
        <div class="max-w-3xl mx-auto p-6 text-center">
            <div v-if="records.length" class="overflow-x-auto">
                <div class="max-w-md mx-auto bg-white border border-gray-300 rounded-xl p-6 shadow-sm space-y-5">
                    <div>
                        <label class="block text-gray-800 font-medium mb-1">
                            {{ dat === 'datakril' ?
                                translateText('QR-code xizmati uchun') : 'QR-code xizmati uchun' }}
                        </label>
                        <h1 type="text" value="375000"
                            class="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {{ records[0].sum1 }}</h1>
                    </div>
                    <div>
                        <label class="block text-gray-800 font-medium mb-1">
                            {{ dat === 'datakril' ?
                                translateText('Lex.uz qonunchilik bazasidan foydalanish uchun') :
                                'Lex.uz qonunchilik bazasidan foydalanish uchun' }}
                        </label>
                        <h1 type="text" value="375000"
                            class="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {{ records[0].sum2 }}</h1>
                    </div>
                    <div class="text-right">
                        <button @click="openPutModal(records[0])"
                            class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md font-medium border border-gray-300">
                            {{ dat === 'datakril' ? translateText('Tahrirlash') : 'Tahrirlash' }}
                        </button>
                    </div>
                </div>

            </div>

            <!-- Display error for GET -->
            <div v-if="getError" class="mt-4 text-red-500">
                <p>{{ dat === 'datakril' ? translateText(`Error: ${getError}`) : `Error: ${getError}` }}</p>
            </div>

            <!-- POST Modal -->
            <div v-if="showPostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded shadow-lg w-80">
                    <h3 class="text-lg font-bold mb-4">{{ dat === 'datakril' ? translateText('Yangi narx yaratish') :
                        'Yangi narx yaratish' }}</h3>
                    <form @submit.prevent="submitPost">
                        <div class="flex gap-2 justify-center items-center mb-4">
                            <label class="block w-[100px] text-black font-medium">{{ dat === 'datakril' ?
                                translateText('lex.uz qonunchilik bazasidan foydalanish uchun:') :
                                'lex.uz qonunchilik bazasidan foydalanish uchun:' }}</label>
                            <input type="number" v-model.number="postForm.sum1" required
                                class="w-full text-black  p-2 border rounded" />
                        </div>
                        <div class="flex gap-2 justify-center items-center mb-4">
                            <label class="block text-black w-[100px] font-medium">{{ dat === 'datakril' ?
                                translateText('QR-code xizmati uchun:') : 'QR-code xizmati uchun:' }}</label>
                            <input type="number" v-model.number="postForm.sum2" required
                                class="w-full text-black p-2 border rounded" />
                        </div>
                        <div v-if="postError" class="text-red-500 mb-4">
                            <p>{{ postError }}</p>
                        </div>
                        <div class="flex justify-between">
                            <button type="submit" :disabled="loading"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {{ loading ? (dat === 'datakril' ? translateText('Yaratilmoqda...') : 'Yaratilmoqda...')
                                    :
                                    (dat === 'datakril' ? translateText('Yaratish') : 'Yaratish') }}
                            </button>
                            <button type="button" @click="closePostModal"
                                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- PUT Modal -->
            <div v-if="showPutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded shadow-lg w-[500px]">
                    <form @submit.prevent="submitPut">
                        <div class="flex gap-2 justify-center items-center">
                            <label class="block text-black w-[400px] font-medium">{{ dat === 'datakril' ?
                                translateText('lex.uz qonunchilik bazasidan foydalanish uchun:') :
                                'lex.uz qonunchilik bazasidan foydalanish uchun:' }}</label>
                            <input type="number" v-model.number="putForm.sum1" required
                                class="w-full mb-4 text-black border-gray-400 p-2 border rounded" />
                        </div>
                        <div class="flex gap-2 justify-center items-center mb-4">
                            <label class="block w-[400px] text-black font-medium">{{ dat === 'datakril' ?
                                translateText('QR-code xizmati uchun:') : 'QR-code xizmati uchun:' }}</label>
                            <input type="number" v-model.number="putForm.sum2" required
                                class="w-full mb-4 border-gray-400 text-black p-2 border rounded" />
                        </div>
                        <div v-if="putError" class="text-red-500 mb-4">
                            <p>{{ putError }}</p>
                        </div>
                        <div class="flex justify-between">
                            <button type="button" @click="closePutModal"
                                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                            </button>
                            <button type="submit" :disabled="loading"
                                class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                {{ loading ? (dat === 'datakril' ? translateText('Yangilanmoqda...') :
                                    'Yangilanmoqda...') :
                                    (dat === 'datakril' ? translateText('Yangilash') : 'Yangilash') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { URL } from '../../auth/url.js';
import translateText from '@/auth/Translate.js';
// Reactive state for records (GET), errors, and loading
const records = ref([]);
const getError = ref(null);
const postError = ref(null);
const putError = ref(null);
const deleteError = ref(null);
const loading = ref(false);
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
const role = localStorage.getItem('role');
const showPostModal = ref(false);
const showPutModal = ref(false);
const showDeleteModal = ref(false);

// Form data for POST and PUT
const postForm = ref({
    sum1: null,
    sum2: null,
});

const putForm = ref({
    id: null,
    sum1: null,
    sum2: null,
});

const deleteId = ref(null);

// Functions to open/close modals
const openPostModal = () => {
    postForm.value = { sum1: null, sum2: null };
    postError.value = null;
    showPostModal.value = true;
};

const closePostModal = () => {
    showPostModal.value = false;
    postError.value = null;
};

const openPutModal = (record) => {
    putForm.value = { id: record.id, sum1: record.sum1, sum2: record.sum2 };
    putError.value = null;
    showPutModal.value = true;
};

const closePutModal = () => {
    showPutModal.value = false;
    putError.value = null;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteError.value = null;
};

// GET: Fetch all records
const fetchRecords = async () => {
    getError.value = null;
    loading.value = true;
    try {
        const res = await axios.get(`${URL}/monthly-cost`);
        records.value = res.data;
    } catch (err) {
        getError.value = err.response?.data?.message || 'Failed to fetch records!';
    } finally {
        loading.value = false;
    }
};

// POST: Create a new record
const submitPost = async () => {
    postError.value = null;
    loading.value = true;
    try {
        await axios.post(`${URL}/monthly-cost`, {
            sum1: postForm.value.sum1,
            sum2: postForm.value.sum2,
        });
        closePostModal();
        fetchRecords(); // Refresh the list
    } catch (err) {
        postError.value = err.response?.data?.message || 'Failed to create record!';
    } finally {
        loading.value = false;
    }
};

// PUT: Update an existing record
const submitPut = async () => {
    putError.value = null;
    loading.value = true;
    try {
        await axios.put(`${URL}/monthly-cost/${putForm.value.id}`, {
            sum1: putForm.value.sum1,
            sum2: putForm.value.sum2,
        });
        closePutModal();
        fetchRecords(); // Refresh the list
    } catch (err) {
        putError.value = err.response?.data?.message || 'Failed to update record!';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecords();
});
</script>
