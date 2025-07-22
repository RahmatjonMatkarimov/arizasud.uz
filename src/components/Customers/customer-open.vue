<!-- src/views/UserProfile.vue -->
<template>
    <div class="download-buttons">
      <button class="download-btn" @click="downloadPDF">PDFni Yuklab Olish</button>
      <button v-if="docxFilePath" class="download-btn" @click="downloadDOCX">DOCXni Yuklab Olish</button>
    </div>
  <div class="min-w-full mx-auto p-6">
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    <div v-else-if="pdfPages.length" class="pdf-container">
      <div class="pdf-pages w-[80%]">
        <img v-for="(page, index) in pdfPages" :key="index" :src="page" class="pdf-page w-full" />
      </div>
    </div>
    <div v-else class="text-center py-8">
        <p class="text-gray-600">PDF yaratilmadi yoki sahifalar topilmadi.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { URL } from '@/auth/url';

const isLoading = inject('isLoading');
const error = ref(null);
const pdfPages = ref([]);
const docxFilePath = ref(null); // Store DOCX file path
const pdf = ref(null); // Store DOCX file path



const id = useRoute().params.id;

const renderPdf = async (url) => {
  isLoading.value = true;
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;

    if (!pdf || !pdf.numPages) {
      throw new Error("PDF fayli yuklanmadi yoki noto'g'ri formatda.");
    }

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
  } catch (err) {
    console.error('PDF yuklashda xatolik:', err);
    error.value = err.message || 'PDF faylini yuklashda xatolik yuz berdi.';
    pdfPages.value = [];
  } finally {
    isLoading.value = false;
  }
};

const getFiles = async () => {
  try {
    const res = await axios.get(`${URL}/customer-files/${id}`);
    console.log(res.data);
    docxFilePath.value = res.data.docxFilePath; // Store DOCX file path
    pdf.value = res.data.filePath; // Store DOCX file path
    await renderPdf(`${URL}${res.data.filePath}`);
  } catch (err) {
    console.error('Faylni olishda xatolik:', err);
    error.value = err.message || 'Faylni olishda xatolik yuz berdi.';
  }
};

const downloadPDF = () => {
  window.open(`${URL}${pdf.value}`, '_blank');
};

const downloadDOCX = () => {
  if (docxFilePath.value) {
    window.open(`${URL}${docxFilePath.value}`, '_blank');
  } else {
    error.value = 'DOCX fayli topilmadi.';
  }
};

onMounted(() => {
  getFiles();
});
</script>

<style scoped>
.pdf-container {
  text-align: center;
}
.pdf-pages {
  margin: auto;
  padding: 20px;
}
.pdf-page {
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.download-buttons {
  margin-top: 20px; display: flex;
  justify-self: end;
  margin-right: 20px;
}
.download-btn {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.download-btn:hover {
  background-color: #2563eb;
}
</style>