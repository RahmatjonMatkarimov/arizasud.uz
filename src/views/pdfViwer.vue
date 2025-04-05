<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// pdfjs-dist importlari
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry"; // Bu worker entry point

// PDF.js worker sozlash
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const isLoading = inject("isLoading", ref(false));
const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref("");
const pdfPages = ref([]);

const getData = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${URL}/signingFiles/signing/${fileId}`);
    fileUrl.value = res.data.filePath.startsWith("http")
      ? res.data.filePath
      : `${URL}${res.data.filePath}`;

    await renderPdf(fileUrl.value);
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const renderPdf = async (url) => {
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
      pdfPages.value.push(canvas.toDataURL("image/png"));
    }
  } catch (error) {
    console.error("PDF yuklashda xatolik:", error);
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="bg-gray-100">
    <div class="my-12 flex justify-center items-center md:justify-between px-3 w-full h-[100px] md:h-[150px] lg:h-[200px] opacity-[88%] relative bg-[#0033FF]">
      <div id="particles-js" class="absolute top-0 left-0 w-full h-full"></div>
      <b class="lg:text-[25px] text-center w-full md:w-[40%] lg:w-[35%] z-0 uppercase hidden lg:block" style="text-shadow: 2px 2px 50px white;">
        {{ $t('header') }}
      </b>
      <div class="flex justify-center relative ml-2 sm:mx-10 mt-2 z-10">
        <img src="../../public/logo.png" class="w-[200px] md:w-[250px] lg:w-[300px]" alt="Logo" />
      </div>
      <b class="lg:text-[25px] md:text-[16px] text-[10px] text-center w-[80%] md:w-[60%] lg:w-[35%] z-0 uppercase" style="text-shadow: 2px 2px 50px white;">
        {{ $t('header') }}
      </b>
    </div>
    <main class="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
      <div v-if="isLoading" class="text-gray-600 text-lg md:text-xl animate-pulse tracking-wide">
        Yuklanmoqda...
      </div>
      <div v-else-if="pdfPages.length" class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 transition-transform duration-300 hover:scale-[1.01]">
        <!-- Download Button -->
        <button @click="downloadPdf" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
          PDF-ni Yuklab Olish
        </button>
        <!-- PDF Pages -->
        <img v-for="(page, index) in pdfPages" :key="index" :src="page" class="w-full rounded-lg mb-4 last:mb-0 shadow-md object-cover transition-transform duration-300 hover:scale-105" alt="PDF Page" />
      </div>
      <div v-else class="text-gray-500 text-base md:text-lg text-center italic">
        Hech qanday sahifa topilmadi.
      </div>
    </main>
  </div>
</template>

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