<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error State -->
      <div
        v-if="error"
        class="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
      >
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-red-500 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
              {{
                dat === "datakril"
                  ? translateText(`Xatolik yuz berdi`)
                  : `Xatolik yuz berdi`
              }}
            </h3>
            <p class="text-red-600 dark:text-red-300">
              {{ dat === 'datakril' ?translateText(error):error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Multiple Files List -->
      <div v-if="files.length" class="mb-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z"
                ></path>
              </svg>
              {{ dat === 'datakril' ? translateText(`Barcha hujjatlar`):`Barcha hujjatlar` }} ({{ files.length }})
            </h2>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="(item, index) in files"
                :key="index"
                class="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 flex-1">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>
                    <div class="flex-1">
                      <a
                        :href="URL1 + item"
                        target="_blank"
                        class="block text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium text-lg transition-colors duration-200"
                      >
                        {{ dat === 'datakril' ? translateText(`Hujjat`):`Hujjat` }} #{{ index + 1 }}
                      </a>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ dat === 'datakril' ? translateText(`PDF fayli`):`PDF fayli` }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <a
                      :href="URL1 + item"
                      target="_blank"
                      class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      {{ dat === 'datakril' ? translateText(`Ko'rish`):`Ko'rish` }}
                    </a>

                    <button
                      @click="downloadAsPdf(index)"
                      class="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      {{ dat === 'datakril' ?translateText(`Yuklab olish`):`Yuklab olish` }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Videos Section -->
      <div v-if="data?.videos?.length" class="mb-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
              {{ dat === 'datakril' ? translateText(`Video galereya`):`Video galereya` }} ({{ data.videos.length }})
            </h2>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="item in data.videos"
                :key="item.id"
                class="group bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-600"
              >
                <div class="relative bg-black rounded-t-xl overflow-hidden">
                  <video
                    v-if="item.url"
                    controls
                    controlsList="nodownload"
                    :src="URL1 + item.url"
                    class="w-full h-48 object-contain bg-black"
                    preload="metadata"
                    @error="handleVideoError"
                    @loadstart="handleVideoLoadStart"
                    @canplay="handleVideoCanPlay"
                  >
                    <source :src="URL1 + item.url" type="video/mp4" />
                    <source :src="URL1 + item.url" type="video/webm" />
                    <source :src="URL1 + item.url" type="video/ogg" />
                    {{ dat === 'datakril' ? translateText(`Brauzeringiz video formatini qo'llab-quvvatlamaydi.`):`Brauzeringiz video formatini qo'llab-quvvatlamaydi.` }}
                  </video>
                  <div
                    v-else
                    class="w-full h-48 bg-gray-100 dark:bg-gray-600 flex items-center justify-center"
                  >
                    <div class="text-center">
                      <svg
                        class="w-12 h-12 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Video mavjud emas`):`Video mavjud emas` }}</p>
                    </div>
                  </div>

                  <!-- Video error state -->
                  <div
                    v-if="videoErrors[item.id]"
                    class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                  >
                    <div class="text-center p-4">
                      <svg
                        class="w-12 h-12 text-red-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p class="text-red-600 dark:text-red-400 text-sm">
                        {{
                          dat === "datakril"
                            ? translateText(`Video yuklanmadi`)
                            : `Video yuklanmadi`
                        }}
                      </p>
                      <a
                        :href="URL1 + item.url"
                        target="_blank"
                        class="text-blue-500 hover:text-blue-600 text-sm underline mt-1 block"
                      >
                        {{
                          dat === "datakril"
                            ? translateText(`Brauzerda ochish`)
                            : `Brauzerda ochish`
                        }}
                      </a>
                    </div>
                  </div>

                  <!-- Video loading state -->
                  <div
                    v-if="videoLoading[item.id]"
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <div class="text-center">
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"
                      ></div>
                      <p class="text-white text-sm">
                        {{
                          dat === "datakril"
                            ? translateText(`Yuklanmoqda`)
                            : `Yuklanmoqda`
                        }}...
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ dat === "datakril" ? translateText(`Video`) : `Video` }} #{{
                      item.id
                    }}
                  </h3>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {{
                      dat === "datakril" ? translateText(`Video fayli`) : `Video fayli`
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!files.length && !data?.videos?.length && !loading"
        class="text-center py-16"
      >
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{
            dat === "datakril"
              ? translateText(`Hech qanday fayl topilmadi`)
              : `Hech qanday fayl topilmadi`
          }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {{
            dat === "datakril"
              ? translateText(
                  `Hozircha PDF yoki video fayllar mavjud emas. Fayllar yuklanganidan so'ng bu yerda ko'rsatiladi.`
                )
              : `Hozircha PDF yoki video fayllar mavjud emas. Fayllar yuklanganidan so'ng bu yerda ko'rsatiladi.`
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URL1 } from "@/auth/url";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import * as pdfjsLib from "pdfjs-dist";
import translateText from "@/auth/Translate";
import { onUnmounted } from "vue";

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

// Set the worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const API_URL = URL1;
const data = ref({ videos: [] });
const files = ref([]);
const pdfPages = ref([]);
const loading = ref(false);
const error = ref(null);
const route = useRoute();
const id = ref(route.params.id);
const list = ref([]);
const isDarkMode = ref(false);
const videoErrors = ref({});
const videoLoading = ref({});

// Initialize dark mode
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  isDarkMode.value = savedMode ? savedMode === "true" : prefersDark;

  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
  }
};

// Ma'lumotlarni olish
async function getdata() {
  try {
    loading.value = true;
    error.value = null;

    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/commoners/${id.value}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    data.value = response.data;
    console.log("API Response:", JSON.stringify(response.data, null, 2));

    // Validate Common array
    if (!response.data.Common || !Array.isArray(response.data.Common)) {
      console.warn("Common array is missing or not an array:", response.data.Common);
      files.value = [];
      return;
    }

    files.value = response.data.Common.map((item) => item?.PDFUrl).filter(
      (url) => typeof url === "string" && url
    );
    list.value = [new Date(response.data.createdAt).toLocaleString()];
  } catch (err) {
    console.error("Ma'lumot olishda xato:", err);
    error.value = `Ma'lumot olishda xato: ${err.response?.data?.message || err.message}`;
  } finally {
    loading.value = false;
  }
}

// PDF yuklab olish funksiyasi
const downloadAsPdf = (index) => {
  const url = URL1 + files.value[index];
  const link = document.createElement("a");
  link.href = url;
  link.download = `document-${index + 1}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Video event handlers
const handleVideoError = (event) => {
  const videoElement = event.target;
  const videoSrc = videoElement.src;

  // Video ID ni topish
  const videoItem = data.value.videos?.find((v) => videoSrc.includes(v.url));
  if (videoItem) {
    videoErrors.value[videoItem.id] = true;
    videoLoading.value[videoItem.id] = false;
  }
  console.error("Video yuklashda xatolik:", videoSrc, event);
};

const handleVideoLoadStart = (event) => {
  const videoElement = event.target;
  const videoSrc = videoElement.src;

  const videoItem = data.value.videos?.find((v) => videoSrc.includes(v.url));
  if (videoItem) {
    videoLoading.value[videoItem.id] = true;
    videoErrors.value[videoItem.id] = false;
  }
};

const handleVideoCanPlay = (event) => {
  const videoElement = event.target;
  const videoSrc = videoElement.src;

  const videoItem = data.value.videos?.find((v) => videoSrc.includes(v.url));
  if (videoItem) {
    videoLoading.value[videoItem.id] = false;
    videoErrors.value[videoItem.id] = false;
  }
};

// Komponent yuklanganda
onMounted(async () => {
  initializeDarkMode();
  await getdata();

  // Faqat bitta fayl bo'lsa, uni render qilishga urinish
  if (files.value.length === 1) {
    // PDF render funksiyasi bu yerda qo'shilishi mumkin
  }
});
</script>

<style scoped>
/* Custom scrollbar */
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

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity,
    box-shadow, transform;
}
</style>
