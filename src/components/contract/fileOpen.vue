<template>
    <div class="content-container min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div v-if="clientData" class="p-6">
            <div v-for="(section, index) in clientData.ClientSectionBody" :key="index" 
                 class="client-section relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 m-4 border border-gray-200 dark:border-gray-700">
                
                <!-- Section Items Grid -->
                <div class="client-section grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div v-for="item in section.clientSections" :key="item.id"
                         class="flex flex-col items-center p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
                        <div class="relative mb-4">
                            <div
                                @click="item.type !== 'datastatus' ? router.push('/lists/' + id + '/' + item.id) : router.push('/room-statusAdmin/' + id + '/' + item.id)"
                                class="w-20 h-20 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:from-blue-100 dark:group-hover:from-blue-800/50 group-hover:to-blue-200 dark:group-hover:to-blue-700/50 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md">
                                <iconify-icon 
                                    :icon="item.type === 'datastatus' ? 'material-symbols:monitoring' : 'material-symbols:folder-open'"
                                    class="text-4xl text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                                </iconify-icon>
                            </div>
                            <div class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <iconify-icon icon="material-symbols:check" class="text-xs text-white"></iconify-icon>
                            </div>
                        </div>
                        <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 max-w-24 truncate">
                            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                        </h3>
                    </div>
                </div>

                <!-- Section Actions -->
                <div class="flex justify-between items-end">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ section.clientSections.length }} {{ dat==='datakril' ? translateText(`ta`):`ta` }}
                        </span>
                    </div>
                    
                    <div class="flex flex-col items-end space-y-2">
                        <button @click="openModal(section.id)" 
                                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-3">
                            <iconify-icon icon="material-symbols:add-circle-outline" class="text-lg"></iconify-icon>
                            <span class="text-sm font-medium">
                                {{ dat === 'datakril' ? translateText('Yangi bo\'lim yaratish') : 'Yangi bo\'lim yaratish' }}
                            </span>
                        </button>
                        
                        <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <iconify-icon icon="material-symbols:calendar-today" class="text-base"></iconify-icon>
                            <span>{{ formatDate(section.createdAt) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Enhanced Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm" 
             @click="showModal = false"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center">
                            <iconify-icon icon="material-symbols:create-new-folder" class="text-xl text-blue-600 dark:text-blue-400"></iconify-icon>
                        </div>
                        <span>{{ dat === 'datakril' ? translateText('Yangi bo\'lim yaratish') : 'Yangi bo\'lim yaratish' }}</span>
                    </h3>
                    <button @click="showModal = false" 
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2">
                        <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ dat === 'datakril' ? translateText('Bo\'lim nomi') : 'Bo\'lim nomi' }}
                        </label>
                        <div class="relative">
                            <input v-model="newSectionName" 
                                   type="text" 
                                   :placeholder="dat === 'datakril' ? translateText('Bo\'lim nomini kiriting') : 'Bo\'lim nomini kiriting'"
                                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200" />
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4  dark:bg-gray-750 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-end space-x-3">
                    <button @click="showModal = false" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2">
                        <iconify-icon icon="material-symbols:cancel-outline" class="text-base"></iconify-icon>
                        <span>{{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}</span>
                    </button>
                    <button @click="createClientSection" 
                            class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2">
                        <iconify-icon icon="material-symbols:check-circle-outline" class="text-base"></iconify-icon>
                        <span>{{ dat === 'datakril' ? translateText('Yaratish') : 'Yaratish' }}</span>
                    </button>
                </div>
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
const router = useRouter();
const id = parseInt(route.params.id);
const clientData = ref(null);
const showModal = ref(false);
const newSectionName = ref("");
const sectionId = ref(0);

const openModal = async (item) => {
    showModal.value = true;
    sectionId.value = item;
};

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
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

const createClientSection = async () => {
    isLoading.value = true;
    try {
        if (!newSectionName.value.trim()) {
            alert("Section name cannot be empty.");
            return;
        }
        const newSection = { 
            sectionBodyId: sectionId.value, 
            name: newSectionName.value,
            type: "other" 
        };
        const response = await axios.post(`${URL}/client-sections`, newSection);
        await fetchClientById();
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
/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400 dark:bg-gray-500;
}

/* Custom focus styles */
.modal input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions for theme switching */
* {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
.client-section:hover {
    transform: translateY(-2px);
}

/* Custom gradient backgrounds */
.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>