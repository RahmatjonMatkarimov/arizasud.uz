<template>
    <div class="monthly-cost-container">
        <h2>Monthly Cost Manager</h2>

        <!-- Buttons to trigger modals for POST, and to fetch data with GET -->
        <div class="action-buttons">
            <button @click="openPostModal">Add New Record (POST)</button>
            <button @click="fetchRecords">Fetch Records (GET)</button>
        </div>

        <!-- Display GET results in a table -->
        <div v-if="records.length" class="records-table">
            <h3>Records:</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sum 1</th>
                        <th>Sum 2</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="record in records" :key="record.id">
                        <td>{{ record.id }}</td>
                        <td>{{ record.sum1 }}</td>
                        <td>{{ record.sum2 }}</td>
                        <td>
                            <button @click="openPutModal(record)">Edit (PUT)</button>
                            <button @click="openDeleteModal(record.id)">Delete (DELETE)</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Display error for GET -->
        <div v-if="getError" class="error">
            <p>Error: {{ getError }}</p>
        </div>

        <!-- POST Modal -->
        <div v-if="showPostModal" class="modal">
            <div class="modal-content">
                <h3>Add New Record</h3>
                <form @submit.prevent="submitPost">
                    <div class="form-group">
                        <label for="post-sum1">Sum 1:</label>
                        <input type="number" id="post-sum1" v-model.number="postForm.sum1" required
                            placeholder="Enter first sum" />
                    </div>
                    <div class="form-group">
                        <label for="post-sum2">Sum 2:</label>
                        <input type="number" id="post-sum2" v-model.number="postForm.sum2" required
                            placeholder="Enter second sum" />
                    </div>
                    <div v-if="postError" class="error">
                        <p>Error: {{ postError }}</p>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" :disabled="loading">
                            {{ loading ? 'Submitting...' : 'Submit' }}
                        </button>
                        <button type="button" @click="closePostModal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- PUT Modal -->
        <div v-if="showPutModal" class="modal">
            <div class="modal-content">
                <h3>Edit Record</h3>
                <form @submit.prevent="submitPut">
                    <div class="form-group">
                        <label for="put-sum1">Sum 1:</label>
                        <input type="number" id="put-sum1" v-model.number="putForm.sum1" required
                            placeholder="Enter first sum" />
                    </div>
                    <div class="form-group">
                        <label for="put-sum2">Sum 2:</label>
                        <input type="number" id="put-sum2" v-model.number="putForm.sum2" required
                            placeholder="Enter second sum" />
                    </div>
                    <div v-if="putError" class="error">
                        <p>Error: {{ putError }}</p>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" :disabled="loading">
                            {{ loading ? 'Updating...' : 'Update' }}
                        </button>
                        <button type="button" @click="closePutModal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- DELETE Modal -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this record?</p>
                <div v-if="deleteError" class="error">
                    <p>Error: {{ deleteError }}</p>
                </div>
                <div class="modal-buttons">
                    <button @click="submitDelete" :disabled="loading">
                        {{ loading ? 'Deleting...' : 'Delete' }}
                    </button>
                    <button type="button" @click="closeDeleteModal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
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
</script>

<style scoped>
* {
    color: black;
}

.monthly-cost-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h2 {
    text-align: center;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 10px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.records-table {
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f0f0f0;
}

td button {
    margin-right: 5px;
    padding: 5px 10px;
    font-size: 14px;
}

.error {
    margin-top: 20px;
    padding: 10px;
    background-color: #ffcccc;
    border-radius: 4px;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
}

.modal-content h3 {
    margin-top: 0;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.modal-buttons button {
    flex: 1;
}

.modal-buttons button:last-child {
    background-color: #6c757d;
}
</style>