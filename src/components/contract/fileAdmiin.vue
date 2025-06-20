<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
    <!-- Header Section -->
    <header class="flex justify-center pt-10 pb-8 px-4">
      <div class="relative z-10">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 animate-gradient px-8 py-4 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg shadow-2xl">
          {{
            dat === "datakril"
              ? translateText("Shartnoma hujjatlari")
              : "Shartnoma hujjatlari"
          }}
        </h1>
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl blur-xl opacity-50 animate-pulse-slow"></div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="container mx-auto p-4 sm:p-8 max-w-7xl">
      <!-- Add Document Button -->
      <div v-if="role === 'yurist' || role === 'bigAdmin'" class="flex justify-end mb-10">
        <button
          @click="openModal('post')"
          :disabled="isLoading"
          class="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="relative z-10 flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>
              {{
                dat === "datakril"
                  ? translateText("Yangi hujjat qo'shish")
                  : "Yangi hujjat qo'shish"
              }}
            </span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <!-- Document List -->
      <section class="bg-white/70 dark:bg-gray-800/70 p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-lg">
        <div v-if="getResponse" class="space-y-6">
          <div v-if="items.length > 0" class="grid gap-6">
            <article
              @click="router.push('/ContractAdmin/' + item.id)"
              v-for="(item, index) in items"
              :key="item.id"
              class="group relative flex items-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-2 dark:border-gray-700/50 hover:bg-gray-50/70 dark:hover:bg-gray-700/70 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
              :style="{ transitionDelay: `${index * 50}ms` }"
            >
              <!-- Document Icon and Info -->
              <div class="flex items-center space-x-6 flex-1">
                <div class="flex-shrink-0">
                  <div class="w-14 h-14 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 truncate">
                    {{ dat === "datakril" ? translateText(item.name) : item.name }}
                  </h2>
                  <div class="flex items-center space-x-6 mt-3">
                    <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <span class="font-medium mr-2">{{
                        dat === "datakril" ? translateText("Hajmi:") : "Hajmi:"
                      }}</span>
                      <span class="px-3 py-1 bg-gray-100/70 dark:bg-gray-700/70 rounded-full text-xs font-mono">
                        {{ formatFileSize(item.fileSize) }}
                      </span>
                    </p>
                    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{{ formatDate(item.uploadedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                v-if="role === 'yurist' || role === 'bigAdmin'"
                class="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <button
                  @click.stop="openPutModal(item)"
                  :disabled="isLoading"
                  class="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span class="text-sm">{{ dat === "datakril" ? translateText("Yangilash") : "Yangilash" }}</span>
                </button>
                <button
                  @click.stop="handleDelete(item.id)"
                  :disabled="isLoading"
                  class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="text-sm">{{ dat === "datakril" ? translateText("O'chirish") : "O'chirish" }}</span>
                </button>
              </div>

              <!-- Arrow Icon -->
              <div class="ml-6 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-200">
                <svg class="w-7 h-7 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </article>
          </div>
          <div v-else class="text-center py-20">
            <div class="w-28 h-28 mx-auto mb-8 bg-gray-100/50 dark:bg-gray-700/50 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-14 h-14 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {{
                dat === "datakril"
                  ? translateText("Hech qanday ma'lumot topilmadi")
                  : "Hech qanday ma'lumot topilmadi"
              }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-lg">
              {{
                dat === "datakril"
                  ? translateText("Hujjatlar qo'shish uchun yuqoridagi tugmani bosing")
                  : "Hujjatlar qo'shish uchun yuqoridagi tugmani bosing"
              }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 dark:border-cyan-400 border-t-transparent"></div>
          </div>
          <span class="text-gray-700 dark:text-gray-300 text-xl font-medium">{{
            dat === "datakril" ? translateText("Yuklanmoqda...") : "Yuklanmoqda..."
          }}</span>
        </div>
      </section>

      <!-- Modal for POST and PUT -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-lg transition-all duration-500"
      >
        <div class="bg-white/90 dark:bg-gray-800/90 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-lg transform transition-all duration-300 scale-100">
          <header class="text-center mb-8">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ dat === "datakril" ? translateText(modalTitle) : modalTitle }}
            </h3>
          </header>
          
          <form @submit.prevent="handleModalSubmit" class="space-y-8">
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {{ dat === "datakril" ? translateText("Nomi:") : "Nomi:" }}
              </label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                class="w-full p-4 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all duration-300"
                :placeholder="
                  dat === 'datakril'
                    ? translateText('Hujjat nomini kiriting')
                    : 'Hujjat nomini kiriting'
                "
              />
            </div>
            
            <div>
              <label for="file" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {{ dat === "datakril" ? translateText("Fayl:") : "Fayl:" }}
              </label>
              <div class="relative">
                <input
                  type="file"
                  id="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  :required="modalType === 'post'"
                  class="w-full p-4 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-2xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-white file:border-none file:py-3 file:px-6 file:rounded-lg file:font-semibold file:cursor-pointer hover:file:from-cyan-600 hover:file:to-blue-600 transition-all duration-300"
                />
              </div>
              
              <div v-if="selectedFileSize" class="mt-6 p-5 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-2xl border border-cyan-200/50 dark:border-cyan-700/50">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-cyan-500 dark:bg-cyan-400 rounded-lg flex items-center justify-center shadow-md">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-cyan-800 dark:text-cyan-200">
                      {{ dat === "datakril" ? translateText("Fayl hajmi:") : "Fayl hajmi:" }}
                    </p>
                    <p class="text-lg font-bold text-cyan-900 dark:text-cyan-100">
                      {{ selectedFileSize }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-4 pt-8">
              <button
                type="button"
                @click="closeModal"
                :disabled="isLoading"
                class="px-8 py-3.5 text-gray-700 dark:text-gray-300 bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 rounded-2xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
              </button>
              <button
                type="submit"
                :disabled="isLoading || !name.trim() || (modalType === 'post' && !file)"
                class="px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-400 dark:to-teal-400 dark:hover:from-emerald-500 dark:hover:to-teal-500 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center space-x-3"
              >
                <div
                  v-if="isLoading"
                  class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"
                ></div>
                <span>
                  {{
                    isLoading
                      ? dat === "datakril"
                        ? translateText("Yuborilmoqda...")
                        : "Yuborilmoqda..."
                      : dat === "datakril"
                      ? translateText("Yuborish")
                      : "Yuborish"
                  }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toast Notifications -->
      <div
        v-if="toastMessage"
        class="fixed top-8 right-8 z-50 animate-slide-in max-w-md"
      >
        <div
          :class="[
            'p-5 rounded-2xl shadow-2xl text-white flex items-center space-x-4 backdrop-blur-lg border border-opacity-30',
            toastType === 'success'
              ? 'bg-emerald-600/90 dark:bg-emerald-500/90 border-emerald-500/40'
              : 'bg-red-600/90 dark:bg-red-500/90 border-red-500/40',
          ]"
        >
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                v-if="toastType === 'success'"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-base font-semibold">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";

const router = useRouter();
const name = ref("");
const file = ref(null);
const fileInput = ref(null);
const selectedItem = ref(null);
const isLoading = inject('isLoading');
const items = ref([]);
const getResponse = ref(null);
const showModal = ref(false);
const modalType = ref("");
const modalTitle = ref("");
const modalResponse = ref(null);
const dat = ref(localStorage.getItem("til") || "datalotin");
const selectedFileSize = ref("");
const toastMessage = ref("");
const toastType = ref("success");

let intervalId = null;
let toastTimeout = null;

const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 100);
  handleGet();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (toastTimeout) clearTimeout(toastTimeout);
});

const modalResponseMessage = ref("");
const role = localStorage.getItem("role");

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0 || bytes === null || bytes === undefined) {
    return "Noma'lum";
  }

  const numBytes = typeof bytes === "string" ? parseInt(bytes) : bytes;

  if (isNaN(numBytes) || numBytes <= 0) {
    return "Noma'lum";
  }

  const mb = numBytes / (1024 * 1024);
  if (mb < 0.01) {
    const kb = numBytes / 1024;
    if (kb < 0.01) {
      return `${numBytes} Bytes`;
    }
    return `${kb.toFixed(2)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Noma'lum";
  let years = dateString?.slice(0, 4);
  let month = dateString?.slice(5, 7);
  let day = dateString?.slice(8, 10);
  return `${day}.${month}.${years}`;
};

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  file.value = selectedFile;

  if (selectedFile) {
    selectedFileSize.value = formatFileSize(selectedFile.size);

    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast(
        dat.value === "datakril"
          ? translateText("Ogohlantirish: Fayl hajmi 10MB dan katta")
          : "Ogohlantirish: Fayl hajmi 10MB dan katta",
        "error"
      );
    }
  } else {
    selectedFileSize.value = "";
  }
};

const modalResponseClass = computed(() =>
  modalResponse.value === "success" ? "success" : "error"
);

const handleGet = async () => {
  isLoading.value = true;
  getResponse.value = null;
  try {
    const response = await fetch(`${URL}/contract-file`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    getResponse.value = "success";
    items.value = result.map((item) => ({
      ...item,
      originalName: item.name,
    }));
  } catch (error) {
    console.error("Xatolik:", error);
    getResponse.value = "error";
    showToast(
      dat.value === "datakril"
        ? translateText("Ma'lumotlarni yuklashda xatolik yuz berdi")
        : "Ma'lumotlarni yuklashda xatolik yuz berdi",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value = type === "post" ? "Yangi hujjat qo'shish" : "Hujjatni yangilash";
  showModal.value = true;
  name.value = "";
  file.value = null;
  selectedFileSize.value = "";
  modalResponse.value = null;
  modalResponseMessage.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const openPutModal = (item) => {
  selectedItem.value = item;
  openModal("put");
  name.value = item.name || item.originalName;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
  name.value = "";
  file.value = null;
  selectedFileSize.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const handleDelete = async (id) => {
  const confirmMessage =
    dat.value === "datakril"
      ? translateText("Haqiqatan ham ushbu hujjatni o'chirmoqchimisiz?")
      : "Haqiqatan ham ushbu hujjatni o'chirmoqchimisiz?";

  if (!confirm(confirmMessage)) return;

  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/contract-file/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      items.value = items.value.filter((item) => item.id !== id);
      showToast(
        dat.value === "datakril"
          ? translateText("Hujjat muvaffaqiyatli o'chirildi")
          : "Hujjat muvaffaqiyatli o'chirildi"
      );
    } else {
      const result = await response.json();
      throw new Error(result.message || "Xatolik yuz berdi");
    }
  } catch (error) {
    console.error("O'chirishda xatolik:", error);
    showToast(
      dat.value === "datakril"
        ? translateText(`Xatolik: ${error.message}`)
        : `Xatolik: ${error.message}`,
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

const handleModalSubmit = async () => {
  if (!name.value.trim()) {
    showToast(
      dat.value === "datakril"
        ? translateText("Hujjat nomini kiriting")
        : "Hujjat nomini kiriting",
      "error"
    );
    return;
  }

  if (modalType.value === "post" && !file.value) {
    showToast(
      dat.value === "datakril" ? translateText("Faylni tanlang") : "Faylni tanlang",
      "error"
    );
    return;
  }

  isLoading.value = true;
  modalResponse.value = null;

  try {
    const formData = new FormData();
    formData.append("name", name.value.trim());
    if (file.value) {
      formData.append("file", file.value);
    }

    const url =
      modalType.value === "post"
        ? `${URL}/contract-file`
        : `${URL}/contract-file/${selectedItem.value.id}`;
    const method = modalType.value === "post" ? "POST" : "PUT";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      modalResponseMessage.value = `Muvaffaqiyat: ${JSON.stringify(result, null, 2)}`;

      showToast(
        dat.value === "datakril"
          ? translateText(
              modalType.value === "post"
                ? "Hujjat muvaffaqiyatli qo'shildi"
                : "Hujjat muvaffaqiyatli yangilandi"
            )
          : modalType.value === "post"
          ? "Hujjat muvaffaqiyatli qo'shildi"
          : "Hujjat muvaffaqiyatli yangilandi"
      );

      closeModal();
      await handleGet();
    } else {
      const result = await response.json();
      throw new Error(result.message || "Xatolik yuz berdi");
    }
  } catch (error) {
    console.error("Yuborishda xatolik:", error);
    showToast(
      dat.value === "datakril"
        ? translateText(`Xatolik: ${error.message}`)
        : `Xatolik: ${error.message}`,
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Enhanced Animations */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.3; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base Styles */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover {
  transform: translateY(-3px);
}

/* Typography */
h1, h2, h3 {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Buttons */
button:not(:disabled):hover {
  transform: translateY(-2px);
}

/* File Input */
input[type="file"]::file-selector-button {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
}

input[type="file"]::file-selector-button:hover {
  background: linear-gradient(135deg, #0891b2, #2563eb);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.3);
}

.dark input[type="file"]::file-selector-button {
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
}

.dark input[type="file"]::file-selector-button:hover {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
}

/* Focus States */
input:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.2);
}

/* Glassmorphism */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm { backdrop-filter: blur(8px); }
  .backdrop-blur-lg { backdrop-filter: blur(16px); }
}

/* Scrollbar */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Responsive Design */
@media (max-width: 640px) {
  .group:hover { transform: none; }
  button:hover:not(:disabled) { transform: none; }
  article { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .flex-1 { width: 100%; }
}

/* Shadows */
.shadow-md {
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.08);
}

.dark .shadow-md {
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.dark .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Accessibility */
:focus-visible {
  outline: 3px solid #06b6d4;
  outline-offset: 2px;
}
</style>