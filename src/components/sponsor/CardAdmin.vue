<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex justify-center pt-8 items-center">
      <h1
        class="text-gray-900 dark:text-white text-[40px] font-bold text-center bg-gradient-to-r from-lime-500 to-green-500 dark:from-lime-400 dark:to-green-400 border-[3px] border-gray-300 dark:border-gray-600 rounded-xl py-3 px-[100px] shadow-lg hover:shadow-xl transition-all duration-300">
        {{ dat === 'datakril' ? translateText('Hamkorlar ro\'yxati') : 'Hamkorlar ro\'yxati' }}
      </h1>
    </div>
    
    <div>
      <!-- Upload Modal -->
      <div v-if="showModal"
        class="fixed z-50 top-0 inset-0 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-sm justify-center">
        <div class="relative">
          <button @click="toggleModal" 
            class="absolute -top-4 -right-4 z-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="w-96 bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bo'lim qo'shish</h3>
            
            <form @submit.prevent="uploadCourt" class="flex flex-col gap-5 w-full">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bo'lim nomi</label>
                <input v-model="courtName" 
                  class="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent outline-none transition-all duration-200" 
                  type="text" 
                  placeholder="Bo'lim nomini kiriting" 
                  required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rasm yuklash</label>
                <input @change="onFileChange" 
                  type="file" 
                  accept="image/*" 
                  required
                  class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600 file:transition-colors file:duration-200 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
              </div>
              
              <button class="w-full rounded-xl bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 dark:from-lime-400 dark:to-green-400 dark:hover:from-lime-500 dark:hover:to-green-500 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                type="submit">
                Yuklash
              </button>
            </form>
            
            <p v-if="successMessage" class="text-green-600 dark:text-green-400 mt-4 font-medium">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-red-600 dark:text-red-400 mt-4 font-medium">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Add Button -->
      <div class="w-full flex justify-end mt-6 px-6">
        <button @click="toggleModal" 
          class="flex items-center gap-2 text-lg font-semibold py-3 px-6 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 dark:from-lime-400 dark:to-green-400 dark:hover:from-lime-500 dark:hover:to-green-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Bo'lim yuklash
        </button>
      </div>

      <!-- Display Uploaded Items -->
      <div class="w-full flex flex-col justify-center items-center mt-10 px-4">
        <div class="rounded-3xl w-full max-w-[110rem] p-10 mb-16 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div class="flex justify-center mb-12">
            <h2 class="text-center text-[30px] sm:text-[35px] md:text-[40px] font-bold uppercase bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {{ $t('hamkor') }}
            </h2>
          </div>
          
          <div class="flex justify-center flex-wrap gap-6 max-w-[1600px] mx-auto">
            <!-- Datakril Items -->
            <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
              class="group bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col justify-start items-center gap-4 break-words w-80 min-h-full rounded-2xl relative hover:-translate-y-2 duration-500 hover:shadow-[0px_20px_40px_rgba(59,130,246,0.3)] dark:hover:shadow-[0px_20px_40px_rgba(59,130,246,0.2)] p-6 transition-all">
              
              <button @click.stop="func(item.id)" 
                class="opacity-0 group-hover:opacity-100 cursor-pointer absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200">
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              
              <div class="flex justify-center items-center p-4 h-[180px] w-full bg-gray-50 dark:bg-gray-700 rounded-xl">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" 
                  class="max-w-full max-h-full object-contain rounded-lg shadow-md" />
              </div>
              
              <h3 class="text-xl font-semibold text-center text-gray-900 dark:text-white leading-tight">
                {{ item.translatedName }}
              </h3>
              
              <div v-if="item.isActive"
                class="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex justify-center items-end animate-pulse rounded-xl inset-0 w-full absolute h-full backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 px-4 py-2 rounded-t-xl mb-4 shadow-lg">
                  <b class="text-blue-600 dark:text-blue-400 font-bold text-lg">{{ $t('tez_kunda') }}</b>
                </div>
              </div>
            </div>
            
            <!-- Datalotin Items -->
            <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
              class="group bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col justify-start items-center gap-4 break-words w-80 min-h-full rounded-2xl relative hover:-translate-y-2 duration-500 hover:shadow-[0px_20px_40px_rgba(59,130,246,0.3)] dark:hover:shadow-[0px_20px_40px_rgba(59,130,246,0.2)] p-6 transition-all">
              
              <button @click.stop="func(item.id)" 
                class="opacity-0 group-hover:opacity-100 cursor-pointer absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200">
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              
              <div class="flex justify-center items-center p-4 h-[180px] w-full bg-gray-50 dark:bg-gray-700 rounded-xl">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" 
                  class="max-w-full max-h-full object-contain rounded-lg shadow-md" />
              </div>
              
              <h3 class="text-xl font-semibold text-center text-gray-900 dark:text-white leading-tight">
                {{ item.name }}
              </h3>
              
              <div v-if="item.isActive"
                class="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex justify-center items-end animate-pulse rounded-xl inset-0 w-full absolute h-full backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 px-4 py-2 rounded-t-xl mb-4 shadow-lg">
                  <b class="text-blue-600 dark:text-blue-400 font-bold text-lg">{{ $t('tez_kunda') }}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="PutModal"
          class="fixed inset-0 z-50 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-sm justify-center">
          <div class="relative">
            <button @click="Modal" 
              class="absolute -top-4 -right-4 z-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div class="w-96 bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ma'lumotni o'zgartirish</h3>
              
              <form @submit.prevent="updateCourt" class="flex flex-col gap-5 w-full">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bo'lim nomi</label>
                  <input v-model="courtName" 
                    class="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent outline-none transition-all duration-200" 
                    type="text" 
                    required />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yangi rasm</label>
                  <input @change="onFileChange" 
                    type="file" 
                    accept="image/*" 
                    required
                    class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600 file:transition-colors file:duration-200 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                
                <button class="w-full rounded-xl bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 dark:from-lime-400 dark:to-green-400 dark:hover:from-lime-500 dark:hover:to-green-500 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                  type="submit">
                  Yangilash
                </button>
              </form>
              
              <p v-if="successMessage" class="text-green-600 dark:text-green-400 mt-4 font-medium">{{ successMessage }}</p>
              <p v-if="errorMessage" class="text-red-600 dark:text-red-400 mt-4 font-medium">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Action Modal (Edit/Delete/Toggle) -->
        <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-sm justify-center">
          <div class="relative w-[500px] bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <button @click="func(null)" 
              class="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full p-2 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Amallar</h3>
            
            <div class="flex flex-col gap-4 w-full">
              <button @click="Modal"
                class="flex items-center justify-start gap-4 py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-500 dark:hover:to-emerald-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                O'zgartirish
              </button>
              
              <button @click="removeSelectedItems"
                class="flex items-center justify-start gap-4 py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-400 dark:to-pink-400 dark:hover:from-red-500 dark:hover:to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                O'chirish
              </button>
              
              <div class="flex items-center justify-between py-4 px-6 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-4">
                  <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span class="text-gray-900 dark:text-white font-semibold text-lg">Ishga tushirish</span>
                </div>
                
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="selectedItem.isActive" @change="updateWorkStatus(selectedItem)" class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-lime-500 peer-checked:to-green-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url";
import translateText from "@/auth/Translate";
import { onMounted } from "vue";

const PutId = ref(null);
const PutModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const selectedItem = ref({ isActive: false }); // Store the selected item for the action modal
const imageBaseUrl = `${URL}/upload`;

const datakril = ref([]);
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
const isLoading = inject('isLoading');

// Fetch data from the backend
const getData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name)
        }))
        .filter((item) => item.status === "active");
      data.value = result.filter((item) => item.status === "active").sort((a, b) => a.id - b.id);
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

// Toggle upload modal
const toggleModal = () => {
  showModal.value = !showModal.value;
};

// Toggle edit and action modals
const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

// Open action modal and set selected item
const func = (id) => {
  PutId.value = id;
  asd.value = !asd.value;
  if (id) {
    const item = data.value.find(item => item.id === id) || datakril.value.find(item => item.id === id);
    selectedItem.value = { ...item }; // Set the selected item for the action modal
  } else {
    selectedItem.value = { isActive: false }; // Reset when closing
  }
};

// Handle file input change
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Upload new court
const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    await axios.post(`${URL}/partners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModal.value = false;
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi!";
  } finally {
    isLoading.value = false;
  }
};

// Update court
const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    const response = await axios.put(`${URL}/partners/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
      getData();
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

// Remove selected item
const removeSelectedItems = async () => {
  if (!PutId.value) return;
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners/${PutId.value}`, {
      method: "DELETE",
    });
    if (response.ok) {
      asd.value = false;
      await getData();
      successMessage.value = "Muvaffaqiyatli o'chirildi!";
      errorMessage.value = "";
    } else {
      errorMessage.value = "O'chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

// Update work status (isActive)
const updateWorkStatus = async (item) => {
  try {
    const endpoint = item.isActive ? `${URL}/partners/${item.id}/isActive` : `${URL}/partners/${item.id}/isFalse`;
    await axios.get(endpoint); // Adjust if your API uses PATCH/PUT instead of GET
    getData(); // Refresh the data after update
  } catch (error) {
    console.error('Error updating workStatus:', error);
  }
};

// Get image URL
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

// Watch modals to control body overflow
watch([showModal, PutModal, asd], ([modalOpen, editModalOpen, actionModalOpen]) => {
  if (modalOpen || editModalOpen || actionModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Initial data fetch
getData();
</script>

<style scoped>
/* Custom styles for better dark mode support */
.group:hover .opacity-0 {
  opacity: 1;
}

/* Smooth transitions for all elements */
* {
  transition: all 0.3s ease;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>