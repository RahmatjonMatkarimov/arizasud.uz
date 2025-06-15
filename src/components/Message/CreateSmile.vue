<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import axios from "axios";
import { URL } from '@/auth/url';

const file = ref(null);
const uploadSuccess = ref(null);
const uploadError = ref(null);
const smileys = ref([]);
const isUploadModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSmiley = ref(null);
const isLoading = inject('isLoading');
const isDragging = ref(false);

const dat = ref(localStorage.getItem("til") || "datalotin");
let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 100);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (selectedFile.type.startsWith('image/')) {
      file.value = selectedFile;
      uploadError.value = null;
    } else {
      uploadError.value = 'Faqat rasm fayllari qabul qilinadi!';
    }
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const droppedFile = files[0];
    if (droppedFile.type.startsWith('image/')) {
      file.value = droppedFile;
      uploadError.value = null;
    } else {
      uploadError.value = 'Faqat rasm fayllari qabul qilinadi!';
    }
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
};

import translateText from "@/auth/Translate";

const uploadFile = async () => {
  if (!file.value) {
    uploadError.value = 'Iltimos, fayl tanlang!';
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await axios.post(`${URL}/smileys`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 201 || response.status === 200) {
      uploadSuccess.value = 'Fayl muvaffaqiyatli yuklandi!';
      uploadError.value = null;
      file.value = null;
      await fetchSmileys();
      
      setTimeout(() => {
        closeUploadModal();
      }, 1500);
    } else {
      throw new Error('Yuklashda xatolik yuz berdi');
    }
  } catch (error) {
    uploadError.value = error.response?.data?.message || error.message || 'Yuklashda xatolik yuz berdi';
    uploadSuccess.value = null;
  } finally {
    isLoading.value = false;
  }
};

const fetchSmileys = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/smileys`);
    smileys.value = response.data;
  } catch (error) {
    console.error('Smileylarni yuklashda xatolik:', error);
  } finally{
    isLoading.value = false
  }
};

const openUploadModal = () => {
  isUploadModalOpen.value = true;
  uploadSuccess.value = null;
  uploadError.value = null;
  file.value = null;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadSuccess.value = null;
  uploadError.value = null;
  file.value = null;
  isLoading.value = false;
};

const openDeleteModal = (smiley) => {
  selectedSmiley.value = smiley;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedSmiley.value = null;
};

const deleteSmiley = async () => {
  if (!selectedSmiley.value) return;
  
  try {
    await axios.delete(`${URL}/smileys/${selectedSmiley.value.id}`);
    await fetchSmileys();
    closeDeleteModal();
  } catch (error) {
    console.error('Smileyni o\'chirishda xatolik:', error);
  }
};

onMounted(fetchSmileys);
</script>

<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
    <!-- Main Container -->
    <div class="max-w-6xl mx-auto">
      <!-- Action Section -->
      <div class="bg-gray-100 dark:bg-gray-700 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
        <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">
                <span v-if="dat === 'datalotin'">Yangi Smiley Qo'shish</span>
                <span v-if="dat === 'datakril'">{{ translateText('Yangi Smiley Qo\'shish') }}</span>
              </h2>
              <p class="text-blue-100">
                <span v-if="dat === 'datalotin'">Kreativ smiley'laringizni yuklang va jamoa bilan ulashing</span>
                <span v-if="dat === 'datakril'">{{ translateText('Kreativ smiley\'laringizni yuklang va jamoa bilan ulashing') }}</span>
              </p>
            </div>
            <div class="hidden md:block">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span class="text-3xl">🎨</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-8 ">
          <button 
            @click="openUploadModal"
            class="group relative w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden">
            
            <!-- Animated background -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Content -->
            <div class="relative flex items-center justify-center space-x-3">
              <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>
                <span v-if="dat === 'datalotin'">Smiley Yuklash</span>
                <span v-if="dat === 'datakril'">{{ translateText('Smiley Yuklash') }}</span>
              </span>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </button>
        </div>
      </div>

      <!-- Smileys Gallery -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 p-8 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-2xl">🎭</span>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  <span v-if="dat === 'datalotin'">Smiley Galereyasi</span>
                  <span v-if="dat === 'datakril'">{{ translateText('Smiley Galereyasi') }}</span>
                </h3>
                <p class="text-gray-600 dark:text-gray-400">{{ smileys.length }} ta smiley mavjud</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-8 bg-gray-200 dark:bg-gray-700">
          <!-- Empty State -->
          <div v-if="smileys.length === 0" 
               class="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="relative inline-block mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-lg">
                <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-lg">😴</span>
              </div>
            </div>
            
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hozircha smiley yo'q</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Birinchi smileyingizni qo'shing va o'zingizning ajoyib kolleksiyangizni boshlang!</p>
            
            <button @click="openUploadModal" class="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Birinchi smiley qo'shish</span>
            </button>
          </div>
          
          <!-- Smileys Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <div v-for="smiley in smileys" :key="smiley.id" 
                 class="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
              
              <!-- Image Container -->
              <div class="relative aspect-square p-4">
                <div class="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 shadow-inner">
                  <img :src="`${URL}/${smiley.filePath}`" 
                       alt="Smiley" 
                       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110" />
                </div>
                
                <!-- Overlay -->
                <div class="absolute inset-4 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <!-- Delete Button -->
              <button @click="openDeleteModal(smiley)"
                      class="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform scale-0 group-hover:scale-75 active:scale-95 flex items-center justify-center border-3 border-white dark:border-gray-800 z-10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <!-- Hover Effect -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="isUploadModalOpen" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold">Fayl Yuklash</h3>
                <p class="text-blue-100 text-sm">Smiley rasmini tanlang</p>
              </div>
            </div>
            
            <button @click="closeUploadModal" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-8 space-y-6">
          <!-- Drag & Drop Area -->
          <div 
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            :class="[
              'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300',
              isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            ]">
            
            <div class="space-y-4">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              
              <div>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ isDragging ? 'Fayl qo\'yish uchun shu yerga tashlang' : 'Rasmingizni shu yerga tashlang' }}
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">yoki faylni tanlash uchun pastdagi tugmani bosing</p>
              </div>
            </div>
            
            <!-- File Input -->
            <input 
              type="file" 
              @change="handleFileChange"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          </div>
          
          <!-- Selected File Info -->
          <div v-if="file" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-green-800 dark:text-green-300 truncate">{{ file.name }}</p>
                <p class="text-xs text-green-600 dark:text-green-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
            </div>
          </div>
          
          <!-- Alternative File Selection -->
          <div class="relative">
            <label class="block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div class="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-medium">Fayl tanlash</span>
              </div>
              <input type="file" @change="handleFileChange" accept="image/*" class="sr-only" />
            </label>
          </div>
          
          <!-- Success/Error Messages -->
          <div v-if="uploadSuccess" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p class="text-emerald-800 dark:text-emerald-300 font-medium">{{ uploadSuccess }}</p>
            </div>
          </div>
          
          <div v-if="uploadError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p class="text-red-800 dark:text-red-300 font-medium">{{ uploadError }}</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button 
              @click="closeUploadModal" 
              :disabled="isLoading"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all duration-300 border border-gray-200 dark:border-gray-600 disabled:opacity-50">
              Bekor qilish
            </button>
            <button 
              @click="uploadFile" 
              :disabled="!file || isLoading"
              class="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden">
              
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-blue-600">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <span :class="{ 'opacity-0': isLoading }">
                {{ isLoading ? 'Yuklanmoqda...' : 'Yuklash' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" 
         class="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <!-- Modal Content -->
        <div class="p-8 text-center">
          <!-- Warning Icon -->
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          
          <!-- Title and Description -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Smileyni O'chirish</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">Haqiqatan ham bu smileyni o'chirmoqchimisiz?</p>
          <p class="text-sm text-red-600 dark:text-red-400 font-medium mb-8">Bu amalni ortga qaytarib bo'lmaydi!</p>
          
          <!-- Preview of item to be deleted -->
          <div v-if="selectedSmiley" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6 inline-block">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-gray-600 shadow-inner">
              <img :src="`${URL}/${selectedSmiley.filePath}`" 
                   alt="Smiley" 
                   class="w-full h-full object-cover" />
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-center space-x-4">
            <button 
              @click="closeDeleteModal" 
              class="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md">
              Bekor qilish
            </button>
            <button 
              @click="deleteSmiley" 
              class="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* Smooth animations */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text animation */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Floating animation for decorative elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Pulse animation for status indicators */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
  }
}

.animate-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:brightness-110 {
  filter: brightness(1.1);
}

/* File upload drag and drop styles */
.border-dashed {
  border-style: dashed;
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Button press effect */
.active\:scale-95:active {
  transform: scale(0.95);
}

.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

/* Smooth page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* Grid responsive improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 640px) {
  .sm\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced border radius */
.rounded-3xl {
  border-radius: 1.5rem;
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .dark\:from-gray-900 {
    --tw-gradient-from: rgb(17, 24, 39);
  }
  
  .dark\:to-gray-900 {
    --tw-gradient-to: rgb(17, 24, 39);
  }
  
  .dark\:bg-gray-800 {
    background-color: rgb(31, 41, 55);
  }
}
</style>