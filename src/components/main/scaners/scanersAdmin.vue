<template>
    <div class="flex justify-center mt-8 items-center">
        <h1
            class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
            {{ dat === 'datakril' ? translateText('Nusxalash xizmatlar bo\'limi') : 'Nusxalash xizmatlar bo\'limi' }}
        </h1>
    </div>
    <div class="min-h-screen bg-gray-100 p-6 font-sans">
        <div class="flex justify-end mb-8">
            <button @click="openCreateModal"
                class="btn bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                {{ $t('bolim_yaratish') }}
            </button>
        </div>

        <!-- Scanner Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="scanner in scanners" :key="scanner.id"
                class="scanner-card relative flex bg-white border-2 border-blue-500 rounded-lg p-6 items-center gap-5 text-center shadow-md hover:shadow-lg transition">
                <img v-if="scanner.img" :src="URL + scanner.img" alt="Scanner image"
                    class="scanner-image w-16 h-16 object-cover" />
                <h3 v-if="dat === 'datalotin'" class="text-lg font-semibold text-gray-800 mb-2">{{ scanner.name }}</h3>
                <h3 v-if="dat === 'datakril'" class="text-lg font-semibold text-gray-800 mb-2">{{
                    translateText(scanner.name) }}</h3>

                <div v-if="scanner.isActive"
                    class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
                    <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
                </div>

                <!-- Three-dot Menu -->
                <div class="absolute top-0 right-4">
                    <button @click="toggleMenu(scanner.id)"
                        class="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <span class="font-bold text-[20px] text-black block">. . .</span>
                    </button>
                    <div v-if="openMenuId === scanner.id"
                        class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button @click="openEditModal(scanner)"
                            class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            {{ $t('tahrirlash') }}
                        </button>
                        <button @click="openDeleteModal(scanner.id)"
                            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                            {{ $t('remove') }}
                        </button>
                        <div class="flex px-4 py-2 justify-between gap-1">
                            <h1 class="text-black">Ishga tushirish</h1>
                            <label class="switch">
                                <input type="checkbox" v-model="scanner.isActive" @change="updateWorkStatus(scanner)">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Modal -->
        <div v-if="showCreateModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 class="text-xl text-gray-800 mb-4">{{ $t('bolim_yaratish') }}</h3>
                <form @submit.prevent="createScanner" class="flex flex-col gap-4">
                    <input v-model="newScanner.name" :placeholder="$t('bolimname')" required
                        class="input-field p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="file" @change="onFileChange" accept="image/*" class="file-input" />
                    <label class="switch">
                        <input type="checkbox" v-model="newScanner.workStatus">
                        <span class="slider round"></span>
                    </label>
                    <div class="flex gap-3">
                        <button type="submit"
                            class="btn bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                            {{ $t('create') }}
                        </button>
                        <button @click="showCreateModal = false"
                            class="btn bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                            {{ $t('Bekor_qilish') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 class="text-xl text-gray-800 mb-4">{{ $t('editModal.title') }}</h3>
                <form @submit.prevent="updateScanner" class="flex flex-col gap-4">
                    <input v-model="editingScanner.name" :placeholder="$t('bolimname')" required
                        class="input-field p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="file" @change="onEditFileChange" accept="image/*" class="file-input" />
                    <label class="switch">
                        <input type="checkbox" v-model="editingScanner.workStatus">
                        <span class="slider round"></span>
                    </label>
                    <div class="flex gap-3">
                        <button type="submit"
                            class="btn bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                            {{ $t('editModal.updateButton') }}
                        </button>
                        <button @click="showEditModal = false"
                            class="btn bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                            {{ $t('Bekor_qilish') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Modal -->
        <div v-if="showDeleteModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 class="text-xl text-gray-800 mb-4">{{ $t('deleteModal.confirmMessage') }}</h3>
                <p class="text-gray-600 mb-4">{{ $t('deleteModal.confirmMessage') }}</p>
                <div class="flex gap-3">
                    <button @click="deleteScanner(deleteId)"
                        class="btn bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                        {{ $t('deleteModal.deleteButton') }}
                    </button>
                    <button @click="showDeleteModal = false"
                        class="btn bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                        {{ $t('deleteModal.cancelButton') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';

// API Base URL
const API_URL = URL + '/scanners';
const dat = inject('dat');
const scanners = ref([]);
const newScanner = ref({ name: '', img: null, workStatus: false });
const editingScanner = ref(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const deleteId = ref(null);
const openMenuId = ref(null);

// Fetch Scanners
const fetchScanners = async () => {
    try {
        const response = await axios.get(API_URL);
        scanners.value = response.data;
    } catch (error) {
        console.error('Error fetching scanners:', error);
    }
};

// File Handling
const onFileChange = (e) => {
    newScanner.value.img = e.target.files[0];
};

const onEditFileChange = (e) => {
    editingScanner.value.img = e.target.files[0];
};

// Menu Toggle
const toggleMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id;
};

// Modal Controls
const openCreateModal = () => {
    newScanner.value = { name: '', img: null, workStatus: false };
    showCreateModal.value = true;
};

const openEditModal = (scanner) => {
    editingScanner.value = { ...scanner, img: null };
    showEditModal.value = true;
    openMenuId.value = null;
};

const openDeleteModal = (id) => {
    deleteId.value = id;
    showDeleteModal.value = true;
    openMenuId.value = null;
};

// CRUD Operations
const createScanner = async () => {
    const formData = new FormData();
    formData.append('name', newScanner.value.name);
    formData.append('workStatus', newScanner.value.workStatus);
    if (newScanner.value.img) formData.append('img', newScanner.value.img);

    try {
        await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        showCreateModal.value = false;
        fetchScanners();
    } catch (error) {
        console.error('Error creating scanner:', error);
    }
};

const updateWorkStatus = async (scanner) => {
    try {
        const endpoint = scanner.isActive ? `${API_URL}/${scanner.id}/isActive` : `${API_URL}/${scanner.id}/isFalse`;
        await axios.get(endpoint); // Adjust if your API uses PATCH/PUT instead of GET
        fetchScanners(); // Refresh the scanner list after update
    } catch (error) {
        console.error('Error updating workStatus:', error);
    }
};

const updateScanner = async () => {
    const formData = new FormData();
    formData.append('name', editingScanner.value.name);
    formData.append('workStatus', editingScanner.value.workStatus);
    if (editingScanner.value.img) formData.append('img', editingScanner.value.img);

    try {
        await axios.put(`${API_URL}/${editingScanner.value.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        showEditModal.value = false;
        fetchScanners();
    } catch (error) {
        console.error('Error updating scanner:', error);
    }
};

const deleteScanner = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        showDeleteModal.value = false;
        fetchScanners();
    } catch (error) {
        console.error('Error deleting scanner:', error);
    }
};

onMounted(fetchScanners);
</script>

<style scoped>
.file-input {
    padding: 0.5rem;
    color: black;
}

.input-field {
    color: black;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #09FF52;
}

input:checked+.slider:before {
    transform: translateX(24px);
}
</style>