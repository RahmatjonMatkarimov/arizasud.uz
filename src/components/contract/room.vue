<template>
    <div class="content-container">
        <div v-if="clientData" class="flex p-5">
            <div v-for="(section, index) in clientData.ClientSection" :key="index" class="client-section">
                <img @click="router.push('/room-lists/' + id + '/' + section.id)" src="../../../public/folder.ico" alt="">
                <h1 class="text-center">{{ dat === 'datakril' ? translateText(section.name) : section.name }}</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import { inject } from 'vue';

const route = useRoute();
const isLoading = inject('isLoading');
const dat = inject('dat');
const router = useRouter();
const id = parseInt(route.params.id); // Ensure id is a number
const clientData = ref(null);

const fetchClientById = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${URL}/client/${id}`);
        clientData.value = response.data;
    } catch (error) {
        console.error("Error fetching client data:", error);
    } finally {
        isLoading.value = false;
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
