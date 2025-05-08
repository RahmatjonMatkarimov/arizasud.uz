<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <!-- Main Container -->
    <main class="container mx-auto px-4 py-10 max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center text-gray-600 text-lg md:text-xl animate-pulse tracking-wide py-10">
        <p>{{ dat === 'datakril' ? translateText('Iltimos kuting video yuklanmoqda...') : 
        'Iltimos kuting video yuklanmoqda...' }}</p>
      </div>

      <!-- Video Player and Controls -->
      <div v-else-if="videoUrl" class="p-6 space-y-6">
        <!-- Video Player -->
        <div class="rounded-lg overflow-hidden shadow-lg">
          <video controls class="w-full h-auto rounded-lg">
            <source :src="videoUrl" type="video/mp4">
            {{ dat === 'datakril' ? translateText('Sizning brauzeringiz video formatini qoʻllab-quvvatlamaydi.') :
             'Sizning brauzeringiz video formatini qoʻllab -quvvatlamaydi.' }}
          </video>
        </div>

        <!-- Download Button -->
        <button @click="downloadVideo"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold">
          {{ dat === 'datakril' ? translateText('Videoni Yuklab Olish') : 'Videoni Yuklab Olish' }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-else class="text-center text-red-500 text-lg py-10">
        <p>{{ dat === 'datakril' ? translateText('Videoni yuklashda xatolik yuz berdi.') : 
        'Videoni yuklashda xatolik yuz berdi.' }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

const dat = inject('dat')
const route = useRoute();
const id = route.params.id; // Client ID
const videoUrl = ref(''); // Store the video URL
const isLoading = ref(false); // Loading state

// Fetch video URL by ID
const fetchVideoById = async () => {
  try {
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
    console.error('Full error details:', error); // Log full error for debugging
    videoUrl.value = ''; // Reset videoUrl in case of error
  }
};

// Download video function
const downloadVideo = () => {
  if (videoUrl.value) {
    const link = document.createElement('a');
    link.href = videoUrl.value;
    link.download = `video_${id}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.warn('No video URL available for download');
  }
};

// Main logic to fetch video
const getDataAndRender = async () => {
  isLoading.value = true;
  await fetchVideoById(); // Fetch video URL
  isLoading.value = false;
};

onMounted(() => {
  getDataAndRender();
});
</script>

<style scoped>
/* Styling */
.container {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 1rem;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
</style>