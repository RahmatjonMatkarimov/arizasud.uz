<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-end mb-4">
            <button @click="openModal('post')" :disabled="isLoading"
                class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
                {{ dat === 'datakril' ? translateText("Yangi hujjat qo'shish") : "Yangi hujjat qo'shish" }}
            </button>
        </div>

        <!-- GET So‘rovi -->
        <div class="bg-white p-4 rounded shadow">
            <h3 class="text-xl font-semibold mb-2">
                {{ dat === 'datakril' ? translateText("Hujjatlari") : "Hujjatlari" }}
            </h3>
            <div v-if="getResponse" class="space-y-2">
                <div v-if="items.length > 0">
                    <div v-for="item in items" :key="item.id"
                        class="flex justify-between items-center mb-2 p-2 border border-black border-opacity-[50%] rounded">
                        <h1 @click="router.push('/ContractAdmin/' + item.id)"
                            class="cursor-pointer text-blue-600 hover:underline">
                            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                        </h1>
                        <div class="space-x-2">
                            <button @click="openPutModal(item)" :disabled="isLoading"
                                class="bg-yellow-400 text-white px-3 py-1 rounded disabled:opacity-50">
                                {{ dat === 'datakril' ? translateText("Yangilash") : "Yangilash" }}
                            </button>
                            <button @click="handleDelete(item.id)" :disabled="isLoading"
                                class="bg-red-400 text-white px-3 py-1 rounded disabled:opacity-50">
                                {{ dat === 'datakril' ? translateText("O'chirish") : "O'chirish" }}
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    {{ dat === 'datakril' ? translateText("Hech qanday ma'lumot topilmadi.") : "Hech qanday ma'lumot topilmadi." }}
                </div>
            </div>
            <div v-else>
                {{ dat === 'datakril' ? translateText("Yuklanmoqda...") : "Yuklanmoqda..." }}
            </div>
        </div>

        <!-- Modal POST va PUT uchun -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div class="bg-white p-4 rounded shadow-lg w-80">
                <h3 class="text-lg font-semibold mb-4 text-center">
                    {{ dat === 'datakril' ? translateText(modalTitle) : modalTitle }}
                </h3>
                <form @submit.prevent="handleModalSubmit">
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium mb-1">
                            {{ dat === 'datakril' ? translateText("Nomi:") : "Nomi:" }}
                        </label>
                        <input type="text" id="name" v-model="name" required
                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="file" class="block text-sm font-medium mb-1">
                            {{ dat === 'datakril' ? translateText("Fayl:") : "Fayl:" }}
                        </label>
                        <input type="file" id="file" ref="fileInput" @change="handleFileChange"
                            :required="modalType === 'post'"
                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="submit" :disabled="isLoading"
                            class="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
                            {{ isLoading ? (dat === 'datakril' ? translateText("Yuborilmoqda...") : "Yuborilmoqda...") : (dat === 'datakril' ? translateText("Yuborish") : "Yuborish") }}
                        </button>
                        <button type="button" @click="closeModal" :disabled="isLoading"
                            class="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50">
                            {{ dat === 'datakril' ? translateText("Bekor qilish") : "Bekor qilish" }}
                        </button>
                    </div>
                </form>
                <div v-if="modalResponse"
                    :class="[modalResponseClass, { 'bg-green-500': modalResponse === 'success', 'bg-red-500': modalResponse === 'error' }]"
                    class="mt-4 p-2 rounded text-white text-center">
                    {{ dat === 'datakril' ? translateText(modalResponseMessage) : modalResponseMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { URL } from '../../auth/url.js';
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate.js';

const router = useRouter();
const name = ref('');
const file = ref(null);
const fileInput = ref(null);
const selectedItem = ref(null);
const isLoading = ref(false);
const items = ref([]);
const getResponse = ref(null);
const showModal = ref(false);
const modalType = ref('');
const modalTitle = ref('');
const modalResponse = ref(null);
const dat = inject('dat');
const modalResponseMessage = ref('');

const handleFileChange = (event) => {
    file.value = event.target.files[0];
};

const modalResponseClass = computed(() => (modalResponse.value === 'success' ? 'success' : 'error'));

const handleGet = async () => {
    isLoading.value = true;
    getResponse.value = null;
    try {
        const response = await fetch(`${URL}/contract-file`, { method: 'GET' });
        const result = await response.json();

        if (response.ok) {
            getResponse.value = 'success';
            items.value = result.map(item => ({
                ...item,
                name: dat === 'datakril' ? translateText(item.name) : item.name,
            }));
        } else {
            getResponse.value = 'error';
        }
    } catch (error) {
        getResponse.value = 'error';
    } finally {
        isLoading.value = false;
    }
};

const openModal = (type) => {
    modalType.value = type;
    modalTitle.value = type === 'post' ? 'Qo\'shish' : 'Yangilash';
    showModal.value = true;
    name.value = '';
    file.value = null;
    modalResponse.value = null;
    modalResponseMessage.value = '';
    if (fileInput.value) fileInput.value.value = '';
};

const openPutModal = (item) => {
    selectedItem.value = item;
    openModal('put');
    name.value = item.name;
};

const closeModal = () => {
    showModal.value = false;
    selectedItem.value = null;
};

const handleDelete = async (id) => {
    if (!confirm('Haqiqatan ham ushbu elementni o‘chirmoqchimisiz?')) return;
    isLoading.value = true;
    try {
        const response = await fetch(`${URL}/contract-file/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            items.value = items.value.filter(item => item.id !== id);
            alert('Element muvaffaqiyatli o‘chirildi');
        } else {
            alert(`Xatolik: ${result.message || 'Nimadir xato ketdi'}`);
        }
    } catch (error) {
        alert(`Xatolik: ${error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleModalSubmit = async () => {
    isLoading.value = true;
    modalResponse.value = null;
    try {
        const formData = new FormData();
        formData.append('name', name.value);
        if (file.value) formData.append('file', file.value);

        const url = modalType.value === 'post' ? `${URL}/contract-file` : `${URL}/contract-file/${selectedItem.value.id}`;
        const method = modalType.value === 'post' ? 'POST' : 'PUT';

        const response = await fetch(url, { method, body: formData });
        const result = await response.json();

        if (response.ok) {
            modalResponse.value = 'success';
            modalResponseMessage.value = `Muvaffaqiyat: ${JSON.stringify(result, null, 2)}`;
            handleGet();
        } else {
            modalResponse.value = 'error';
        }
    } catch (error) {
        modalResponse.value = 'error';
    } finally {
        isLoading.value = false;
    }
};

onMounted(handleGet);
</script>
<style scoped>
* {
    color: black;
}

button {
    transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
    filter: brightness(90%);
}
</style>