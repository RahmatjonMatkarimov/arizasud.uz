<template>
  <!-- Background with gradient -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center animate-fade-in">
        <div class="relative">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 flex items-center justify-center animate-bounce">
            <svg class="w-10 h-10 text-indigo-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 tracking-wide">
            {{ dat === 'datakril' ? translateText('Yuklanmoqda...') : 'Yuklanmoqda...' }}
          </h2>
          <div class="w-64 h-2 bg-white/30 dark:bg-gray-700/50 rounded-full mx-auto overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- PDF Content -->
      <div v-else-if="pdfPages.length" class="w-full max-w-6xl animate-slide-up">
        <!-- Header with buttons -->
        <div class="mb-8 p-6 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl">
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              {{ dat === 'datakril' ? translateText(`Shartnoma`):`Shartnoma` }}
            </h1>
            <div class="flex flex-wrap gap-3">
              <button @click="downloadPdf"
                      class="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 font-medium">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {{ dat === 'datakril' ? translateText('PDF-ni Yuklab Olish') : 'PDF-ni Yuklab Olish' }}
                </span>
              </button>
              
              <button v-if="docxFileUrl" @click="downloadDocx"
                      class="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 font-medium">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {{ dat === 'datakril' ? translateText('Docx-ni Yuklab Olish') : 'Docx-ni Yuklab Olish' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- PDF Pages Grid -->
        <div class="space-y-8">
          <div v-for="(page, index) in pdfPages" :key="index" 
               class="group relative animate-fade-in rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-blue-400/20"
               :style="{ animationDelay: index * 0.1 + 's' }">
            
            <!-- Page Number Badge -->
            <div class="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-white/20 dark:border-gray-600/50">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                {{ dat === 'datakril' ? translateText(`Sahifa`):`Sahifa` }} {{ index + 1 }}
              </span>
            </div>
            
            <!-- Page Image Container -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 group-hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <img :src="page" 
                   class="w-full rounded-xl shadow-md object-cover transition-all duration-500 border border-gray-200/30 dark:border-gray-600/30"
                   :alt="'PDF Sahifa ' + (index + 1)" 
                   loading="lazy" />
            </div>
            
            <!-- Hover Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-full border border-white/20 dark:border-gray-700/50">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              {{ dat === 'datakril' ? translateText(`Jami`):`Jami` }} {{ pdfPages.length }} {{ dat === 'datakril' ? translateText(`sahifa yuklandi`):`sahifa yuklandi` }}
            </p>
          </div>
          <div class="mt-6 flex justify-center">
            <div class="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center animate-fade-in">
        <div class="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {{ dat === 'datakril' ? translateText(`PDF fayl topilmadi`):`PDF fayl topilmadi` }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-lg mb-6">
          {{ dat === 'datakril' ? translateText(`Yuklash uchun PDF faylni tanlang`):`Yuklash uchun PDF faylni tanlang` }}
        </p>
        <button class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium">
          {{ dat === 'datakril' ? translateText(`Fayl tanlash`):`Fayl tanlash` }}
        </button>
      </div>
    </main>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, inject, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import * as pdfjsLib from 'pdfjs-dist';
  import { URL } from '@/auth/url.js';
  import translateText from '@/auth/Translate';
  
  // Set the PDF.js worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  
const dat = ref(localStorage.getItem("til") || "datalotin");
  const route = useRoute();
  const id = route.params.id; // Client ID
  const id2 = Number(route.params.id2); // File ID as a number
  const clientData = ref(null);
  const selectedFileName = ref(null); // Will hold the file object with filePath
  const pdfPages = ref([]); // Store rendered PDF pages
  const fileUrl = ref(''); // Store the full file URL
  const isLoading = inject(`isLoading`); // Loading state
  const docxFileUrl = ref(''); // Docx fayl yo'li

  // Fetch client data by ID
  const fetchClientById = async () => {
    isLoading.value = true
    try {
      const response = await axios.get(`${URL}/client-files/${id}`);
      clientData.value = response.data;
      // Directly set the file URL from the response
      if (clientData.value.filePath) {
        fileUrl.value = clientData.value.filePath.startsWith('http')
          ? clientData.value.filePath
          : `${URL}${clientData.value.filePath}`;
      }

      if (clientData.value.docxFilePath) {
        docxFileUrl.value = clientData.value.docxFilePath.startsWith('http')
          ? clientData.value.docxFilePath
          : `${URL}${clientData.value.docxFilePath}`;
      } else {
        docxFileUrl.value = '';
      }

    } catch (error) {
      console.error('Error fetching client data:', error.message);
      console.error('Full error details:', error); // Log full error for debugging
      clientData.value = null; // Reset clientData to avoid further issues
      fileUrl.value = ''; // Reset fileUrl in case of error
    } finally{
      isLoading.value = false
    }
  };
  
  // Render PDF pages as images
  const renderPdf = async (url) => {
    isLoading.value = true
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      pdfPages.value = [];
  
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
  
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        await page.render({ canvasContext: context, viewport }).promise;
  
        const imageDataUrl = canvas.toDataURL('image/png');
        pdfPages.value.push(imageDataUrl);
      }
    } catch (error) {
      console.error('PDF yuklashda xatolik:', error);
      pdfPages.value = [];
    } finally{
      isLoading.value = false
    }
  };
  
  // Download PDF function
  const downloadPdf = () => {
    if (fileUrl.value) {
      const link = document.createElement('a');
      link.href = fileUrl.value;
      link.download = `document_${id2}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No file URL available for download');
    }
  };
  // Docx faylni yuklab olish funksiyasi
  const downloadDocx = () => {
    if (docxFileUrl.value) {
      const link = document.createElement('a');
      link.href = docxFileUrl.value;
      link.download = `document_${id2}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('Docx fayl yo‘li mavjud emas');
    }
  };
  // Main logic to fetch and render PDF
  const getDataAndRender = async () => {
    isLoading.value = true;
    await fetchClientById(); // Fetch client data and set fileUrl
    if (fileUrl.value) {
      await renderPdf(fileUrl.value); // Render the PDF if fileUrl is available
    } else {
      console.error('No file URL found for the given ID');
    }
    isLoading.value = false;
  };
  
  onMounted(() => {
    getDataAndRender();
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
  </style>