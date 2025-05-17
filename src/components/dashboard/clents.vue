<template>
    <div class="animated-gradient">
    <div class="max-w-[900px]  mx-auto mt-5">
        <div class="flex mb-2 items-center space-x-2 mt-4">
            <input v-model="searchQuery" type="text"
                :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
                class="border p-[5px] rounded  bg-[#fff0] w-full focus:outline-none focus:ring focus:ring-blue-300" />
            <button @click="isOpen = true"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2 rounded-md shadow-md transition duration-300 text-sm whitespace-nowrap">
                {{ dat === 'datakril'? translateText('Barmoq izi bilan qidirish'):'Barmoq izi bilan qidirish' }}
            </button>
        </div>
            <div v-for="(item, index) in filteredData" :key="item.id" @click="router.push('/Check/' + item.id)"
                class="p-3 ">
                <div
                    class="flex justify-between cardGradient border-black items-center p-4 border rounded-lg shadow bg-gray-200 hover:bg-gray-300 transition">
                    <div class="flex items-center space-x-2">
                        <b class="text-lg">{{ index + 1 }}</b>
                        <h1 class="text-lg font-medium cursor-pointer">
                            {{ dat === 'datakril'
                                ? translateText(item.name) + ' ' + translateText(item.surname) + ' ' +
                                translateText(item.dadname)
                                : item.name + ' ' + item.surname + ' ' + item.dadname }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    <modal :isOpen="isOpen" @close="isOpen = false"></modal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";
import modal from "../contract/fingerSearch.vue"

const modalFinger = ref(false)
const dat = inject("dat");
const router = useRouter();
const data = ref([]);
const searchQuery = ref("");
const selectedClientIds = ref([]);
const selectAll = ref(false);
const showCheckboxes = ref(false);
const role = localStorage.getItem("role")
const isOpen = ref(false)


const GetClient = async () => {
    try {
        const response = await axios.get(`${URL}/client`);
        data.value = response.data.sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};

const deleteSelectedClients = async () => {
    if (selectedClientIds.value.length === 0) {
        alert("Iltimos, o'chirish uchun mijozlarni belgilang!");
        return;
    }

    try {
        await axios.delete(`${URL}/client/deleteMany`, { data: { ids: selectedClientIds.value } });
        data.value = data.value.filter(item => !selectedClientIds.value.includes(item.id));
        selectedClientIds.value = [];
        alert("Belgilangan mijozlar muvaffaqiyatli o'chirildi!");
    } catch (error) {
        console.error("Mijozlarni o'chirishda xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedClientIds.value = filteredData.value.map(item => item.id);
    } else {
        selectedClientIds.value = [];
    }
};

const toggleCheckboxes = () => {
    showCheckboxes.value = !showCheckboxes.value;
    if (!showCheckboxes.value) {
        // Reset selection when checkboxes are hidden
        selectedClientIds.value = [];
        selectAll.value = false;
    }
};

watch(selectedClientIds, (newVal) => {
    selectAll.value = newVal.length === filteredData.value.length && newVal.length > 0;
});

const filteredData = computed(() => {
    if (!searchQuery.value) return data.value;

    const query = searchQuery.value.toLowerCase();
    return data.value.filter((item) => {
        return (
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.surname && item.surname.toLowerCase().includes(query)) ||
            (item.dadname && item.dadname.toLowerCase().includes(query)) ||
            (item.phone && item.phone.toLowerCase().includes(query)) ||
            (item.uniqueCode && item.uniqueCode.toLowerCase().includes(query)) ||
            (item.userCode && item.userCode.toLowerCase().includes(query))
        );
    });
});

onMounted(GetClient);
</script>

<style scoped>
input {
    transition: all 0.3s ease;
    border-color: #d1d5db;
}

input:focus {
    border-color: #3b82f6;
    outline: none;
}

button {
    transition: all 0.3s ease;
}

button:hover {
    transform: scale(1.02);
}

div.transition:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
}

/* Simplified modal styles */
div.fixed {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
}

div.bg-white {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.animated-gradient {
    background: linear-gradient(45deg, #3A4C76, #23385F, #56688F, #23385F);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    padding: 1.75rem;
    min-height: 100vh;
}

.cardGradient {
    background: linear-gradient(45deg,   #23385F ,#56688F,#23385F, #3A4C76);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    padding: 1rem;
}

@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
