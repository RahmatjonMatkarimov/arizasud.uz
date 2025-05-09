<template>
    <div class="flex flex-col pr-2 items-end">
        <button @click="showModal = true" class="create-section-btn">{{ dat === 'datakril' ? translateText('Yangi bo\'lim yaratish') : 'Yangi bo\'lim yaratish' }}</button>
    </div>
    <div class="content-container">
        <div v-if="clientData" class="p-2">
            <div v-for="(section, index) in clientData.ClientSectionBody" :key="index" class="client-section m-2 flex flex-wrap">
                <div v-for="item in section.clientSections">
                    <img
                    @click="item.type !== 'datastatus' ? router.push('/lists/' + id + '/' + item.id) : router.push('/room-statusAdmin/' + id + '/' + item.id)"
                      src="../../../public/folder.ico" alt="">
                    <h1 class="text-center">{{ dat === 'datakril' ? translateText(item.name) : item.name }}</h1>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for creating a new client section -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <h3>{{ dat === 'datakril' ? translateText('Yangi bo\'lim yaratish') : 'Yangi bo\'lim yaratish' }}</h3>
            <input v-model="newSectionName" type="text" :placeholder="dat === 'datakril' ? translateText('Bo\'lim nomini kiriting') : 'Bo\'lim nomini kiriting'" />
            <div class="modal-actions">
                <button @click="createClientSection">{{ dat === 'datakril' ? translateText('Yaratish') : 'Yaratish' }}</button>
                <button @click="showModal = false">{{ dat === 'datakril' ? translateText('bekor qilish') : 'Bekor qilish' }}</button>
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
import { is } from 'date-fns/locale';

const route = useRoute();
const isLoading = inject('isLoading');
const dat = inject('dat');
const router = useRouter();
const id = parseInt(route.params.id); // Ensure id is a number
const clientData = ref(null);
const showModal = ref(false);
const newSectionName = ref("");

const fetchClientById = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${URL}/client/${id}`);
        clientData.value = response.data;
        console.log(response.data)
    } catch (error) {
        console.error("Error fetching client data:", error);
    } finally {
        isLoading.value = false;
    }
};

// Function to create a new client section
const createClientSection = async () => {
    isLoading.value = true;
    try {
        if (!newSectionName.value.trim()) {
            alert("Section name cannot be empty.");
            return;
        }
        const newSection = { clientId: id, name: newSectionName.value,type: "other" };
        const response = await axios.post(`${URL}/client-sections`, newSection);
        clientData.value.ClientSection.push(response.data);
        newSectionName.value = "";
        showModal.value = false;
    } catch (error) {
        console.error("Error creating client section:", error);
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
