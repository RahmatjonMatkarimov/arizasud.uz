<template>
    <div class="flex flex-col pr-2 items-end">
        <button @click="showModal = true" class="create-section-btn">Yangi bo'lim yaratish</button>
    </div>
    <div class="content-container">
        <div v-if="clientData" class="flex p-5">
            <div v-for="(section, index) in clientData.ClientSection" :key="index" class="client-section">
                <img @click="router.push('/lists/'+ section.id)" src="../../../public/folder.ico" alt="">
                <h1 class="text-center">{{ section.name }}</h1>
            </div>
        </div>
        <p v-else>Loading client data...</p>
    </div>

    <!-- Modal for creating a new client section -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <h3>Create New Section</h3>
            <input v-model="newSectionName" type="text" placeholder="Enter section name" />
            <div class="modal-actions">
                <button @click="createClientSection">Create</button>
                <button @click="showModal = false">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';

const route = useRoute();
const router = useRouter();
const id = parseInt(route.params.id); // Ensure id is a number
const clientData = ref(null);
const showModal = ref(false);
const newSectionName = ref("");

const fetchClientById = async () => {
    try {
        const response = await axios.get(`${URL}/client/${id}`);
        clientData.value = response.data;
        console.log("Client Data:", clientData.value); // Debugging: Log the client data
    } catch (error) {
        console.error("Error fetching client data:", error);
    }
};

// Function to create a new client section
const createClientSection = async () => {
    try {
        if (!newSectionName.value.trim()) {
            alert("Section name cannot be empty.");
            return;
        }
        const newSection = { clientId: id, name: newSectionName.value,type: "other" };
        const response = await axios.post(`${URL}/client-sections`, newSection);
        console.log("New Section Created:", response.data);
        clientData.value.ClientSection.push(response.data);
        newSectionName.value = "";
        showModal.value = false;
    } catch (error) {
        console.error("Error creating client section:", error);
    }
};

onMounted(() => {
    fetchClientById();
});
</script>

<style scoped>
* {
    color: #000;
}
.create-section-btn {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.create-section-btn:hover {
    background-color: #0056b3;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
}
.modal input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.modal-actions {
    display: flex;
    justify-content: space-between;
}
.modal-actions button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.modal-actions button:first-child {
    background-color: #007bff;
    color: #fff;
}
.modal-actions button:first-child:hover {
    background-color: #0056b3;
}
.modal-actions button:last-child {
    background-color: #ccc;
}
.modal-actions button:last-child:hover {
    background-color: #aaa;
}
</style>
