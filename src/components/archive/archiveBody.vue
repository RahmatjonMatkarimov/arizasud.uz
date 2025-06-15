<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";
import translateText from "@/auth/Translate.js";

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

const items = ref([]);
const loading = ref(false);
const showCheckboxes = ref(false);
const selectedItems = ref([]);
const isLoading = inject('isLoading')
const route = useRoute();
const data = route.params.data;

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${URL}/${data}/archived`);
    items.value = res.data;
  } catch (error) {
    console.error('Xatolik:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleCheckboxMode = () => {
  showCheckboxes.value = !showCheckboxes.value;
  selectedItems.value = [];
};

const toggleSelection = (id) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
  } else {
    selectedItems.value.push(+id);
  }
};

const selectAllItems = () => {
  if (selectedItems.value.length === items.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = items.value.map(item => item.id);
  }
};

const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) return;
  isLoading.value = true
  try {
    await axios.delete(`${URL}/${data}/archived`, {
      data: { ids: selectedItems.value }
    });

    items.value = items.value.filter(item => !selectedItems.value.includes(item.id));
    selectedItems.value = [];
    showCheckboxes.value = false;
    fetchItems()
  } catch (error) {
    console.error('Xatolik:', error);
  } finally{
    isLoading.value = false
  }
};

const updateItem = async (id) => {
  isLoading.value = true
  try {
    const res = await axios.put(`${URL}/${data}/archived/${id}`, {
      status: "active"
    });

    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value[index] = res.data;
    }
    fetchItems()
  } catch (error) {
    console.error('Xatolik:', error);
  } finally{
    isLoading.value = false
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ dat === 'datakril' ? translateText("O'chirilgan elementlar") : "O'chirilgan elementlar" }}
            </h1>
          </div>
          <button 
            @click="toggleCheckboxMode" 
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 dark:focus:ring-red-400/50"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>{{ dat === 'datakril' ? translateText(showCheckboxes ? "Bekor qilish" : "O'chirish rejimini yoqish") : (showCheckboxes ? "Bekor qilish" : "O'chirish rejimini yoqish") }}</span>
            </span>
          </button>
        </div>

        <!-- Action Buttons -->
        <div v-if="showCheckboxes" class="mt-6 flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <button 
            @click="selectAllItems"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ dat === 'datakril' ? translateText(selectedItems.length === items.length ? 'Barchasini olib tashlash' : 'Barchasini belgilash') : (selectedItems.length === items.length ? 'Barchasini olib tashlash' : 'Barchasini belgilash') }}</span>
            </span>
          </button>
          
          <button 
            v-if="selectedItems.length > 0" 
            @click="deleteSelectedItems"
            class="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/50 dark:focus:ring-red-400/50"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>{{ dat === 'datakril' ? translateText("Belgilanganlarni o'chirish") : "Belgilanganlarni o'chirish" }} ({{ selectedItems.length }})</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-4">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
            {{ dat === 'datakril' ? translateText("Yuklanmoqda...") : "Yuklanmoqda..." }}
          </p>
        </div>

        <!-- Items List -->
        <div v-else-if="items.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(item, index) in items" 
            :key="item.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
            :class="[
              showCheckboxes && selectedItems.includes(item.id) 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400' 
                : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1 min-w-0">
                <!-- Checkbox -->
                <div v-if="showCheckboxes" class="flex-shrink-0">
                  <input 
                    type="checkbox" 
                    :checked="selectedItems.includes(item.id)"
                    @change="toggleSelection(item.id)"
                    class="w-5 h-5 text-blue-600 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-colors duration-200"
                  >
                </div>

                <!-- Item Icon -->
                <div class="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200">
                  <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>

                <!-- Item Name -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate capitalize">
                    {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    #{{ item.id }}
                  </p>
                </div>
              </div>

              <!-- Restore Button -->
              <div class="flex-shrink-0 ml-4">
                <button 
                  @click="updateItem(item.id)"
                  class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 dark:focus:ring-green-400/50"
                >
                  <span class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>{{ dat === 'datakril' ? translateText("Tiklash") : "Tiklash" }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-16 px-4">
          <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ dat === 'datakril' ? translateText(`Hech qanday element topilmadi`) : `Hech qanday element topilmadi` }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-center">
            {{ dat === 'datakril' ? translateText(`Arxivlangan elementlar bu yerda ko'rsatiladi`):`Arxivlangan elementlar bu yerda ko'rsatiladi` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>