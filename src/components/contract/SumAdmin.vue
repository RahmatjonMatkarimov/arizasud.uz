<template>
    <div class="max-w-3xl mx-auto p-6 text-center">
        <h2 class="text-2xl font-bold mb-6">Monthly Cost Records</h2>
        <div class="mb-6 flex justify-end">
            <button @click="openPostModal" class="px-4 py-2 bg-blue-500  text-white rounded hover:bg-blue-600">
                Yangi narx qo'shish
            </button>
        </div>

        <!-- Display GET results in a table -->
        <div v-if="records.length" class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border text-black border-gray-300 px-4 py-2"></th>
                        <th class="border text-black border-gray-300 px-4 py-2">1-Narx</th>
                        <th class="border text-black border-gray-300 px-4 py-2">2-Narx</th>
                        <th class="border text-black border-gray-300 px-4 py-2">Sozlamalar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in records" :key="record.id" class="hover:bg-gray-50">
                        <td class="border text-black border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                        <td class="border text-black border-gray-300 px-4 py-2">{{ record.sum1 }}</td>
                        <td class="border text-black border-gray-300 px-4 py-2">{{ record.sum2 }}</td>
                        <td class="border text-black border-gray-300 px-4 py-2">
                            <button @click="openPutModal(record)"
                                class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                Tahrirlash
                            </button>
                            <!-- <button @click="openDeleteModal(record.id)"
                                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                Delete
                            </button> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Display error for GET -->
        <div v-if="getError" class="mt-4 text-red-500">
            <p>Error: {{ getError }}</p>
        </div>

        <!-- POST Modal -->
        <div v-if="showPostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-80">
                <h3 class="text-lg font-bold mb-4">Yangi narx yaratish</h3>
                <form @submit.prevent="submitPost">
                    <div class="flex gap-2 justify-center items-center mb-4">
                        <label class="block w-[100px] text-black font-medium">1-Narx:</label>
                        <input type="number" v-model.number="postForm.sum1" required
                            class="w-full text-black  p-2 border rounded" />
                    </div>
                    <div class="flex gap-2 justify-center items-center mb-4">

                        <label class="block text-black w-[100px] font-medium">2-Narx:</label>
                        <input type="number" v-model.number="postForm.sum2" required
                            class="w-full text-black p-2 border rounded" />
                    </div>
                    <div v-if="postError" class="text-red-500 mb-4">
                        <p>{{ postError }}</p>
                    </div>
                    <div class="flex justify-between">
                        <button type="submit" :disabled="loading"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            {{ loading ? 'Yaratilmoqda...' : 'Yaratish' }}
                        </button>
                        <button type="button" @click="closePostModal"
                            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Bekor qilish
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- PUT Modal -->
        <div v-if="showPutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-80">
                <form @submit.prevent="submitPut">
                    <div class="flex gap-2 justify-center items-center">
                        <label class="block w-[100px] text-black font-medium">1-Narx:</label>
                        <input type="number" v-model.number="putForm.sum1" required
                            class="w-full mb-4 text-black p-2 border rounded" />
                    </div>
                    <div class="flex gap-2 justify-center items-center mb-4">
                        <label class="block w-[100px] text-black font-medium">2-Narx:</label>
                        <input type="number" v-model.number="putForm.sum2" required
                            class="w-full mb-4 text-black p-2 border rounded" />
                    </div>
                    <div v-if="putError" class="text-red-500 mb-4">
                        <p>{{ putError }}</p>
                    </div>
                    <div class="flex justify-between">
                        <button type="button" @click="closePutModal"
                            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Bekor qilish
                        </button>
                        <button type="submit" :disabled="loading"
                            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                            {{ loading ? 'Yangilanmoqda...' : 'Yangilash' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- DELETE Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-80">
                <h3 class="text-lg font-bold text-black mb-4">Confirm Deletion</h3>
                <p class="mb-4 text-black">Are you sure you want to delete this record?</p>
                <div v-if="deleteError" class="text-red-500 mb-4">
                    <p>{{ deleteError }}</p>
                </div>
                <div class="flex justify-between">
                    <button @click="submitDelete" :disabled="loading"
                        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        {{ loading ? 'Deleting...' : 'Delete' }}
                    </button>
                    <button type="button" @click="closeDeleteModal"
                        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { URL } from '../../auth/url.js';

// Reactive state for records (GET), errors, and loading
const records = ref([]);
const getError = ref(null);
const postError = ref(null);
const putError = ref(null);
const deleteError = ref(null);
const loading = ref(false);

// Modal visibility states
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

const openDeleteModal = (id) => {
    deleteId.value = id;
    deleteError.value = null;
    showDeleteModal.value = true;
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

// DELETE: Delete a record
const submitDelete = async () => {
    deleteError.value = null;
    loading.value = true;
    try {
        await axios.delete(`${URL}/monthly-cost/${deleteId.value}`);
        closeDeleteModal();
        fetchRecords(); // Refresh the list
    } catch (err) {
        deleteError.value = err.response?.data?.message || 'Failed to delete record!';
    } finally {
        loading.value = false;
    }
};

// Automatically fetch records when the component is mounted
onMounted(() => {
    fetchRecords();
});
</script>

<style scoped>
/* Remove all custom styles since Tailwind CSS is used */
</style>