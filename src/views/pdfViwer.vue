<template>
  <div class="bg-gray-100">
    <div class="my-12 flex justify-center items-center md:justify-between px-3 w-full h-[100px] md:h-[150px] lg:h-[200px] opacity-[88%] relative bg-[#0033FF]">
      <div id="particles-js" class="absolute top-0 left-0 w-full h-full"></div>
      <b class="lg:text-[25px] text-center w-full md:w-[40%] lg:w-[35%] z-0 uppercase hidden lg:block" style="text-shadow: 2px 2px 50px white;">
        {{ $t('header') }}
      </b>
      <div class="flex justify-center relative ml-2 sm:mx-10 mt-2 z-10">
        <img src="/logo1.png" class="w-[250px] md:w-[300px] lg:w-[350px]" alt="Logo" />
      </div>
      <b class="lg:text-[25px] md:text-[16px] text-[10px] text-center w-[80%] md:w-[60%] lg:w-[35%] z-0 uppercase" style="text-shadow: 2px 2px 50px white;">
        {{ $t('header') }}
      </b>
    </div>
    <main class="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
      <div v-if="isLoading" class="text-gray-600 text-lg md:text-xl animate-pulse tracking-wide">
        Yuklanmoqda...
      </div>
      <div v-else-if="pdfPages.length" class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6">
        <!-- Download Button -->
        <button @click="downloadPdf" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
          PDF-ni Yuklab Olish
        </button>
        <!-- PDF Pages as Images -->
        <div v-for="(page, index) in pdfPages" :key="index" class="mb-4">
          <img :src="page" class="w-full rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105" alt="PDF Page" />
        </div>
      </div>
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
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"; // Updated to match API version

  const isLoading = inject('isLoading');
const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref("");
const pdfPages = ref([]);

const BASE_URL = 'https://backend.arizasud.uz'; // Replace with your actual API base URL

const getData = async () => {
  isLoading.value = true;
  try {
    const requestUrl = `${BASE_URL}/signingFiles/signing/${fileId}`;

    const res = await axios.get(requestUrl, {
      validateStatus: (status) => status < 500, // Accept only non-server-error responses
    });

    // Check for HTTP status errors
    if (res.status !== 200) {
      console.error(`HTTP Error: ${res.status} - ${res.statusText}`);
      throw new Error(`Failed to fetch data. HTTP Status: ${res.status}`);
    }

    // Validate API response format
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
    // Fallback: Display a user-friendly message
    pdfPages.value = [];
    alert("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."); // Notify the user
  } finally {
    isLoading.value = false;
  }
};

// Render PDF pages as images
const renderPdf = async (url) => {
  isLoading.value = false
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    pdfPages.value = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page into the canvas
      await page.render({ canvasContext: context, viewport }).promise;

      // Convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL("image/png");
      pdfPages.value.push(imageDataUrl);
    }
  } catch (error) {
    console.error("PDF yuklashda xatolik:", error);
  } finally{
    isLoading.value = false
  }
};

// Download PDF function
const downloadPdf = () => {
  if (fileUrl.value) {
    const link = document.createElement("a");
    link.href = fileUrl.value;
    link.download = `document_${fileId}.pdf`; // Default filename
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