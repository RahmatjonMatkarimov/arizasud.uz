<template>
  <div class="bg-gray-100">
    <main class="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
      <div v-if="isLoading" class="text-gray-600 text-lg md:text-xl animate-pulse tracking-wide">
        Yuklanmoqda...
      </div>
      <div v-else-if="pdfPages.length" class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6">
        <!-- Download Button -->
        <button @click="downloadPdf"
          class="mb-4 px-4 py-2 m-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
          PDF-ni Yuklab Olish
        </button>
        <button @click="downloadDocx"
          class="mb-4 px-4 m-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Docx-ni Yuklab Olish
        </button>

        <!-- PDF Pages as Images -->
        <div v-for="(page, index) in pdfPages" :key="index" class="mb-4">
          <img :src="page" class="w-full rounded-lg shadow-md object-cover transition-transform duration-300"
            alt="PDF Page" />
        </div>
      </div>
    </main>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import * as pdfjsLib from 'pdfjs-dist';
  import { URL } from '@/auth/url.js';
  
  // Set the PDF.js worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  
  const route = useRoute();
  const id = route.params.id; // Client ID
  const id2 = Number(route.params.id2); // File ID as a number
  const clientData = ref(null);
  const selectedFileName = ref(null); // Will hold the file object with filePath
  const pdfPages = ref([]); // Store rendered PDF pages
  const fileUrl = ref(''); // Store the full file URL
  const isLoading = ref(false); // Loading state
  const docxFileUrl = ref(''); // Docx fayl yo'li

  // Fetch client data by ID
  const fetchClientById = async () => {
    try {
      const response = await axios.get(`${URL}/client-files/${id}`);
      clientData.value = response.data;
console.log(response.data)
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
    }
  };
  
  // Render PDF pages as images
  const renderPdf = async (url) => {
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