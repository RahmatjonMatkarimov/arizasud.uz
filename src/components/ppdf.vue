<!-- src/views/UserProfile.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    <div v-else-if="pdfPages.length" class="pdf-container">
      <div class="pdf-pages">
        <img v-for="(page, index) in pdfPages" :key="index" :src="page" class="pdf-page" />
      </div>
      <button @click="downloadPDF" class="download-btn">
        PDF yuklab olish
      </button>
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-600">PDF yaratilmadi yoki sahifalar topilmadi.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { inject } from 'vue';
const isLoading = inject('isLoading');

// Worker manzili
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js '

const props = defineProps({
  filePath: {
    type: String,
    required: true
  }
})

const pdfPages = ref([])

const renderPdf = async (url) => {
  isLoading.value = true
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
  } catch (error) {
    console.error('PDF yuklashda xatolik:', error);
    emit('error', error);
    pdfPages.value = [];
  }finally {
    isLoading.value = false
  }
};

onMounted(() => {
  if (props.filePath) {
    renderPdf(props.filePath)
  }
})
</script>

<style scoped>
.pdf-container {
  text-align: center;
}
.pdf-pages {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.pdf-page {
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.download-btn {
  margin-top: 20px;
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