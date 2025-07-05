<template>
    <!-- Main Container with responsive background -->
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
        <!-- Header Section -->
        <div class="flex justify-center pt-8 pb-6 items-center">
            <h1 class="text-gray-900 dark:text-white text-[40px] font-bold text-center 
                       bg-gradient-to-r from-lime-400 to-lime-500 dark:from-lime-500 dark:to-lime-600
                       border-2 border-lime-600 dark:border-lime-400 rounded-xl py-3 px-[100px] 
                       shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {{ dat === 'datakril' ? translateText("Shartnomalar") : "Shartnomalar" }}
            </h1>
        </div>

        <!-- Main Content Container -->
        <div class="max-w-[900px] mx-auto px-4">
            <!-- Search and Filter Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 
                        border border-gray-200 dark:border-gray-700 transition-all duration-300">
                
                <!-- Search Bar -->
                <div class="flex m items-center space-x-3">
                    <div class="relative flex-1">
                        <input 
                            v-model="searchQuery" 
                            type="text"
                            :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
                            class="w-full pl-4 pr-10 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-500 dark:placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                   focus:border-transparent transition-all duration-300
                                   hover:border-gray-400 dark:hover:border-gray-500" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Fingerprint Search Button -->
                    <button 
                        @click="isOpen = true"
                        class="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500
                               hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600
                               text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg
                               transition-all duration-300 transform hover:scale-105 active:scale-95
                               text-sm whitespace-nowrap flex items-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                        </svg>
                        <span>{{ dat === 'datakril'? translateText('Barmoq izi bilan qidirish'):'Barmoq izi bilan qidirish' }}</span>
                    </button>
                </div>

                <!-- Admin Controls -->
                <div v-if="role === 'yurist' || role === 'bigAdmin'" 
                     class="flex flex-wrap gap-3 justify-end">
                    
                    <!-- Select All Checkbox -->
                    <div v-if="showCheckboxes" class="flex items-center">
                        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" 
                               class="hidden" id="selectAll" />
                        <label for="selectAll"
                               class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                                      border-2 border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg 
                                      hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer
                                      transition-all duration-300 transform hover:scale-105 active:scale-95
                                      flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{{ dat === 'datakril' ? translateText("Barchasini belgilash") : "Barchasini belgilash" }}</span>
                        </label>
                    </div>

                    <!-- Delete Selected Button -->
                    <button v-if="showCheckboxes" 
                            @click="deleteSelectedClients"
                            class="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700
                                   hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800
                                   text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg
                                   transition-all duration-300 transform hover:scale-105 active:scale-95
                                   flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>{{ dat === 'datakril' ? translateText("Belgilanganlarni o'chirish") : "Belgilanganlarni o'chirish" }}</span>
                    </button>

                    <!-- Toggle Checkboxes Button -->
                    <button @click="toggleCheckboxes"
                            class="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700
                                   hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800
                                   text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg
                                   transition-all duration-300 transform hover:scale-105 active:scale-95
                                   flex items-center space-x-2">
                        <svg v-if="!showCheckboxes" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span>{{ dat === 'datakril' ? translateText(showCheckboxes ? 'Bekor qilish' : 'O\'chirish') : (showCheckboxes ? 'Bekor qilish' : 'O\'chirish') }}</span>
                    </button>
                </div>
            </div>

            <!-- Content List -->
            <div v-if="filteredData.length > 0" class="space-y-4">
                <div v-for="(item, index) in filteredData" :key="item.id" 
                     @click="router.push('/Check/' + item.id)"
                     class="group cursor-pointer">
                    
                    <div class="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 
                               rounded-xl p-5 shadow-md hover:shadow-xl
                               transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1
                               group-hover:border-blue-300 dark:group-hover:border-blue-500
                               group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50
                               dark:group-hover:from-gray-700 dark:group-hover:to-gray-600">
                        
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">
                                <!-- Checkbox -->
                                <input v-if="showCheckboxes" 
                                       type="checkbox" 
                                       v-model="selectedClientIds" 
                                       :value="item.id"
                                       class="form-checkbox h-5 w-5 text-blue-500 dark:text-blue-400 
                                              rounded border-2 border-gray-300 dark:border-gray-600
                                              bg-white dark:bg-gray-700
                                              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                              transition-all duration-200" 
                                       @click.stop />

                                <!-- Index Number -->
                                <div class="flex items-center justify-center w-10 h-10 
                                           bg-gradient-to-r from-lime-400 to-lime-500 dark:from-lime-500 dark:to-lime-600
                                           rounded-full shadow-md group-hover:shadow-lg
                                           transition-all duration-300 transform group-hover:scale-110">
                                    <span class="text-white font-bold text-lg">{{ index + 1 }}</span>
                                </div>

                                <!-- Name -->
                                <div class="flex flex-col">
                                    <h1 class="text-gray-900 dark:text-white text-xl font-semibold 
                                              group-hover:text-blue-600 dark:group-hover:text-blue-400
                                              transition-colors duration-300">
                                        {{ dat === 'datakril'
                                            ? translateText(item.name) + ' ' + translateText(item.surname) + ' ' + translateText(item.dadname)
                                            : item.name + ' ' + item.surname + ' ' + item.dadname }}
                                    </h1>
                                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                        {{ item.phone || item.userCode || 'ID: ' + item.id }}
                                    </p>
                                </div>
                            </div>

                            <!-- Arrow Icon -->
                            <div class="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400
                                        transition-all duration-300 transform group-hover:translate-x-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 
                           border-2 border-gray-200 dark:border-gray-700">
                    <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {{ dat === 'datakril' ? translateText("Hech qanday shartnoma topilmadi") : "Hech qanday shartnoma topilmadi" }}
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400">
                        {{ dat === 'datakril' ? translateText("Qidiruv mezonlarini o'zgartiring yoki yangisini qo'shing") : "Qidiruv mezonlarini o'zgartiring yoki yangisini qo'shing" }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <modal :isOpen="isOpen" @close="isOpen = false"></modal>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, onUnmounted } from "vue";
import axios from "axios";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";
import modal from "./fingerSearch.vue"

const modalFinger = ref(false)
const dat = ref(localStorage.getItem("til") || "datalotin");
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
/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded-lg;
}

::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400 dark:bg-gray-500;
}

/* Smooth transitions for all elements */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

/* Enhanced focus states */
input:focus,
button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Animation for loading states */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Gradient text effect */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Glass morphism effect for cards */
.glass-effect {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.75);
}

.dark .glass-effect {
    background-color: rgba(17, 25, 40, 0.75);
}

/* Smooth hover animations */
.hover-lift:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .hover-lift:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}
</style>