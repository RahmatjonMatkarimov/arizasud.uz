<template>
    <div class="content-container">
        <div v-if="clientData" class="p-2">
            <div v-for="(section, index) in clientData.ClientSectionBody" :key="index" class="client-section relative bg-gray-300 rounded-md p-5 justify-between m-2 flex flex-wrap">
                <div class="client-section flex flex-wrap">
                    <div v-for="item in section.clientSections">
                        <img
                        @click="item.type !== 'datastatus' ? router.push('/lists/' + id + '/' + item.id) : router.push('/room-statusAdmin/' + id + '/' + item.id)"
                        src="../../../public/folder.ico" alt="">
                        <h1 class="text-center">{{ dat === 'datakril' ? translateText(item.name) : item.name }}</h1>
                    </div>
                </div>
                <div>
                    <button @click="openModal(section.id)" class="create-section-btn absolute top-2 right-2">{{ dat === 'datakril' ? translateText('Yangi bo\'lim yaratish') : 'Yangi bo\'lim yaratish' }}</button><br>
                    <h1 class="absolute bottom-2 right-3">{{ formatDate(section.createdAt) }}</h1>
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
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import { inject } from 'vue';

const route = useRoute();
const isLoading = inject('isLoading');
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
const router = useRouter();
const id = parseInt(route.params.id); // Ensure id is a number
const clientData = ref(null);
const showModal = ref(false);
const newSectionName = ref("");
const sectionId = ref(0)

const openModal = async (item) =>{
    showModal.value = true
    sectionId.value = item
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Oylar 0dan boshlanadi
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

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

// Function to create a new client section
const createClientSection = async (id) => {
    isLoading.value = true;
    try {
        if (!newSectionName.value.trim()) {
            alert("Section name cannot be empty.");
            return;
        }
        const newSection = { sectionBodyId: sectionId.value, name: newSectionName.value,type: "other" };
        const response = await axios.post(`${URL}/client-sections`, newSection);
        await fetchClientById()
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
