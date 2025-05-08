<template>
    <div class="flex justify-center mt-8 items-center">
        <h1
            class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
            {{ dat === 'datakril' ? translateText("Shartnomalar") : "Shartnomalar" }}
        </h1>
    </div>
    <div class="max-w-[900px] mx-auto mt-5">"

        <div class="flex mb-2 items-center space-x-2 mt-4">

            <input v-model="searchQuery" type="text"
                :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
                class="border p-[5px] rounded text-black w-full focus:outline-none focus:ring focus:ring-blue-300" />
            <!-- 🖐️ Button -->
            <button @click="isOpen = true"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2 rounded-md shadow-md transition duration-300 text-sm whitespace-nowrap">
                {{ dat === 'datakril'? translateText('Barmoq izi bilan qidirish'):'Barmoq izi bilan qidirish' }}
            </button>
        </div>
        <div v-if="filteredData.length > 0">
            <div v-if="role === 'yurist' || role === 'bigAdmin'" class="flex space-x-2 justify-end mb-4">
                <div v-if="showCheckboxes" class="flex items-center space-x-2">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="hidden"
                        id="selectAll" />
                    <label for="selectAll"
                        class="bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
                        {{ dat === 'datakril' ? translateText("Barchasini belgilash") : "Barchasini belgilash" }}
                    </label>
                </div>
                <button v-if="showCheckboxes" @click="deleteSelectedClients"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                    {{ dat === 'datakril' ? translateText("Belgilanganlarni o'chirish") : "Belgilanganlarni o'chirish"
                    }}
                </button>
                <button @click="toggleCheckboxes"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    {{ dat === 'datakril' ? translateText(showCheckboxes ? 'Bekor qilish' : 'O\'chirish') :
                        (showCheckboxes ? 'Bekor qilish' : 'O\'chirish') }}
                </button>
            </div>
            <div v-for="(item, index) in filteredData" :key="item.id" @click="router.push('/Check/' + item.id)"
                class="p-3">
                <div
                    class="flex justify-between border-black items-center p-4 border rounded-lg shadow bg-gray-200 hover:bg-gray-300 transition">
                    <div class="flex items-center space-x-2">
                        <input v-if="showCheckboxes" type="checkbox" v-model="selectedClientIds" :value="item.id"
                            class=" form-checkbox h-4 w-4 text-blue-500 focus:ring focus:ring-blue-300" @click.stop />
                        <b class="text-black text-lg">{{ index + 1 }}</b>
                        <h1 class="text-gray-900 text-lg font-medium cursor-pointer">
                            {{ dat === 'datakril'
                                ? translateText(item.name) + ' ' + translateText(item.surname) + ' ' +
                                translateText(item.dadname)
                                : item.name + ' ' + item.surname + ' ' + item.dadname }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal :isOpen="isOpen" @close="isOpen = false"></modal>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";
import modal from "./fingerSearch.vue"

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
    color: black;
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
</style>
