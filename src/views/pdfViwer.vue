<template>
  <div :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-100'" class="min-h-screen transition-colors duration-300">
    <!-- Sticky Action Header -->
    <header class="sticky top-0 z-50 transition-colors duration-300 shadow-lg"
            :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
            <!-- Download Button -->
            <button 
              v-if="pdfPages.length && !isLoading"
              @click="downloadPdf" 
              :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'"
              class="px-4 py-2 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 font-medium text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Yuklab Olish
            </button>

            <!-- Theme Toggle Button -->
            <button 
              @click="toggleTheme" 
              :class="isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
              class="p-2 rounded-lg transition-all duration-300 border"
              title="Theme o'zgartirish"
            >
              <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-gray-600 text-lg md:text-xl animate-pulse tracking-wide">
        Yuklanmoqda...
      </div>

      <!-- PDF Content -->
      <div v-else-if="pdfPages.length" class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6">
        <!-- PDF Pages Container -->
        <div v-for="(page, index) in pdfPages" :key="index" class="mb-4">
          <img :src="page" class="w-full rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105" alt="PDF Page" />
        </div>
      </div>

      <!-- No Content State -->
      <div v-else class="text-gray-500 text-base md:text-lg text-center italic">
        Hech qanday sahifa topilmadi.
      </div>
    </main>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import * as pdfjsLib from "pdfjs-dist";

// Explicitly set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

// Theme management
const isDarkMode = ref(false);

// Check for saved theme preference or default to light mode
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    // Check system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

const isLoading = inject('isLoading') || ref(false);
const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref("");
const pdfPages = ref([]);

const BASE_URL = 'https://backend.arizasud.uz';

const getData = async () => {
  isLoading.value = true;
  try {
    const requestUrl = `${BASE_URL}/signingFiles/signing/${fileId}`;

    const res = await axios.get(requestUrl, {
      validateStatus: (status) => status < 500,
    });

    if (res.status !== 200) {
      console.error(`HTTP Error: ${res.status} - ${res.statusText}`);
      throw new Error(`Failed to fetch data. HTTP Status: ${res.status}`);
    }

    if (!res.data || typeof res.data !== "object" || !res.data.filePath) {
      if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
        console.error("API returned an HTML document. Response:", res.data);
        throw new Error("API response returned an HTML document instead of JSON. Check the API endpoint.");
      }
      throw new Error("API response is missing filePath or invalid");
    }

    fileUrl.value = res.data.filePath.startsWith("http")
      ? res.data.filePath
      : `${BASE_URL}${res.data.filePath}`;

    await renderPdf(fileUrl.value);
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
    pdfPages.value = [];
    alert("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
  } finally {
    isLoading.value = false;
  }
};

const renderPdf = async (url) => {
  isLoading.value = false;
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    pdfPages.value = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageDataUrl = canvas.toDataURL("image/png");
      pdfPages.value.push(imageDataUrl);
    }
  } catch (error) {
    console.error("PDF yuklashda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const downloadPdf = () => {
  if (fileUrl.value) {
    const link = document.createElement("a");
    link.href = fileUrl.value;
    link.download = `document_${fileId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
.pdf-container {
  width: 99%;
  max-width: 800px;
  overflow-y: auto;
}

.pdf-page {
  width: 100%;
  margin-bottom: 5px;
  display: block;
}

#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

b {
  color: white;
  font-weight: bold;
}
</style>