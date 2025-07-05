<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
    <!-- Main Container -->
    <main class="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
          {{ dat === 'datakril' ? translateText('Iltimos kuting, video yuklanmoqda...') : 
            'Iltimos kuting, video yuklanmoqda...' }}
        </p>
      </div>

      <!-- Video Player and Controls -->
      <div v-else-if="videoUrl" class="p-4 sm:p-6 space-y-6">
        <!-- Video Player -->
        <div class="relative aspect-video rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900">
          <video controls class="w-full h-full object-contain rounded-xl">
            <source :src="videoUrl" type="video/mp4">
            {{ dat === 'datakril' ? translateText('Sizning brauzeringiz video formatini qoʻllab-quvvatlamaydi.') :
              'Sizning brauzeringiz video formatini qoʻllab-quvvatlamaydi.' }}
          </video>
        </div>
      </div>

      <!-- Error Message -->
      <div v-else class="text-center py-12">
        <p class="text-red-500 dark:text-red-400 text-lg font-medium">
          {{ dat === 'datakril' ? translateText('Videoni yuklashda xatolik yuz berdi.') : 
            'Videoni yuklashda xatolik yuz berdi.' }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

const dat = ref(localStorage.getItem("til") || "datalotin");
const route = useRoute();
const id = route.params.id;
const videoUrl = ref('');
const isLoading = ref(false);

const fetchVideoById = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${URL}/client-files/${id}`);
    const filePath = response.data.filePath;

    if (filePath) {
      videoUrl.value = filePath.startsWith('http')
        ? filePath
        : `${URL}${filePath}`;
    } else {
      console.error('No filePath found in the API response');
      videoUrl.value = '';
    }
  } catch (error) {
    console.error('Error fetching video data:', error.message);
    videoUrl.value = '';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchVideoById();
});
</script>

<style scoped>
/* Tailwind CSS bilan barcha stillar template ichida yozildi */
</style>. 