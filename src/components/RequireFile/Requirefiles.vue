<template>
  <div
    class="min-h-screen bg-gray-200 dark:bg-gradient-to-br from-gray-900 via-slate-900 pt-10 to-gray-800"
  >
    <div
      class="max-w-[95%] mx-auto p-6 dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50"
    >
      <!-- Action Buttons -->
      <div class="flex gap-3 mb-6">
        <button
          v-if="data === 'yurist' || data === 'bigAdmin'"
          @click="toggleDeleteMode"
          class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          {{ deleteMode ? $t("cancel_delete") : $t("enable_delete") }}
        </button>

        <button
          v-if="deleteMode && selectedFiles.length > 0"
          @click="deleteSelectedFiles"
          class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          {{ $t("remove") }}
        </button>
      </div>

      <!-- Files List -->
      <div class="space-y-3">
        <div
          v-for="(file, index) in filteredFiles"
          @click="router.push('/Require-signing/' + file.id)"
          :key="index"
          class="group dark:bg-gradient-to-r from-gray-800/60 to-gray-700/40 hover:from-blue-900/30 hover:to-purple-900/30 border border-gray-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1"
        >
          <div class="flex items-center justify-between">
            <!-- User Info and File Name -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <!-- User Avatar -->
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
                >
                  {{ dat === 'datakril' ? translateText(file.User.name.charAt(0)) : file.User.name.charAt(0) }}{{ dat === 'datakril' ? translateText(file.User.surname.charAt(0)) : file.User.surname.charAt(0) }}
                </div>

                <!-- User Details -->
                <div class="flex-1 min-w-0">
                  <h3 class="dark:text-gray-100 font-medium text-lg">
                   {{ dat === 'datakril' ? translateText(`${file.User.surname} ${file.User.name}`):`${file.User.surname} ${file.User.name}` }}
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{
                      dat === 'datakril' ? translateText(file.User.lavozimi):file.User.lavozimi
                    }}</span>
                  </h3>
                  <p
                    class="dark:text-blue-400 text-blue-500 font-semibold dark:hover:text-blue-300 transition-colors cursor-pointer text-sm mt-1"
                  >
                    {{ dat === 'datakril'? translateText(file.name):file.name }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Status and Actions -->
            <div class="flex items-center gap-4">
              <!-- Status Badge -->
              <span
                :class="getStatusClass(file.status)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ $t("holat") }}: {{ dat === 'datakril' ? translateText(getStatusText(file.status)) : getStatusText(file.status) }}
              </span>

              <!-- Reason Button -->
              <button
                v-if="file.statusReason"
                @click.stop="qwenn(file.statusReason)"
                class="hidden group-hover:flex transition-opacity duration-300 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                {{ $t("sababni") }}
              </button>

              <!-- Checkbox for Delete Mode -->
              <label
                @click.stop
                v-if="deleteMode"
                class="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="selectedFiles"
                  :value="file.id"
                  class="sr-only"
                />
                <div
                  class="relative w-6 h-6 rounded-md border-2 bg-gray-200 border-gray-500 dark:bg-gray-700 transition-all duration-300 hover:border-blue-500"
                >
                  <div
                    v-if="selectedFiles.includes(file?.id)"
                    class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-white"
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
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="qwen" @click="qwen = false"
    class="fixed inset-0 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-40"
  >
    <div @click.stop
      class="dark:bg-gray-800 border border-gray-600 p-8 relative rounded-2xl bg-white shadow-2xl w-full max-w-lg mx-4"
    >
      <button
        @click="qwen = false"
        class="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
      >
        <svg
          class="w-5 h-5 text-gray-400"
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
      </button>

      <h1 class="dark:text-gray-100 text-xl font-semibold mb-4 pr-8">Sababi</h1>
      <p class="dark:text-gray-300 text-base leading-relaxed break-words">
        {{ dat === 'datakril' ? translateText(statusReason) : statusReason }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed, onUnmounted } from "vue";
import axios from "axios";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";
import { useSearchStore } from "@/components/Templates/searchQuary";
const searchStore = useSearchStore();
const router = useRouter();
const API_URL = `${URL}/signingFiles`;
const qwen = ref(false);
const selectedFiles = ref([]);
const files = ref([]);
const showModal = ref(false);
const showPdfModal = ref(false);
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

const asd = ref(false);
const asds = ref(false);
const deleteMode = ref(false);
const data = ref("");
const userID = ref(parseInt(localStorage.getItem("id")));
const role = ref(localStorage.getItem("role"));
const statusReason = ref("");

const filteredFiles = computed(() => {
  if (!searchStore.query) {
    return files.value;
  }
  const query = searchStore.query.toLowerCase();
  return files.value.filter(
    (file) =>
      file.name.toLowerCase().includes(query) ||
      file.User.name.toLowerCase().includes(query) ||
      file.User.surname.toLowerCase().includes(query)
  );
});

const isLoading = inject("isLoading");

function qwenn(file) {
  statusReason.value = file;
  qwen.value = !qwen.value;
}

const getStatusText = (status) => {
  if (status === "waiting") return "Kutish";
  if (status === "signaturePending") return "Imzo kutulmoqda";
  if (status === "signed") return "imzolangan";
  if (status === "rejected") return "Rad etilgan";
  if (status === "revision") return "Qayta korib chiqish talab etiladi";
  return status;
};

const getStatusClass = (status) => {
  if (status === "waiting")
    return "dark:bg-yellow-900/50 bg-yellow-900/80 text-yellow-300 border border-yellow-600/50";
  if (status === "signaturePending")
    return "dark:bg-blue-900/50 bg-blue-900/80 text-blue-300 border border-blue-600/50";
  if (status === "signed")
    return "dark:bg-green-900/50 bg-green-900/80 text-green-300 border border-green-600/50";
  if (status === "rejected") return "dark:bg-red-900/50 bg-red-900/80 text-red-300 border border-red-600/50";
  if (status === "revision")
    return "dark:bg-orange-900/50 bg-orange-900/80 text-orange-300 border border-orange-600/50";
  return "dark:bg-gray-900/50 bg-gray-900/80 text-gray-300 border border-gray-600/50";
};

const getdata = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/${role.value}/${userID.value}`);
    data.value = response.data.role;
  } catch (error) {
    console.error("Fayllarni olishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchFiles = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}`);
    if (data.value === "bigAdmin") {
      files.value = response.data
        .filter((item) => item.status == "signaturePending")
        .filter((item) => item.status !== "archive");
    } else {
      files.value = response.data
        .filter((item) => item.status !== "signed")
        .filter((item) => item.status !== "archive");
    }
  } catch (error) {
    console.error("Fayllarni olishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteSelectedFiles = async () => {
  if (selectedFiles.value.length === 0) return;
  isLoading.value = true;
  try {
    await axios.delete(`${API_URL}/delete`, { data: { ids: selectedFiles.value } });
    selectedFiles.value = [];
    deleteMode.value = false;
    fetchFiles();
  } catch (error) {
    console.error("Fayllarni o'chirishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getdata);
onMounted(fetchFiles);
function toggleDeleteMode() {
  if (deleteMode.value) {
    selectedFiles.value = [];
    deleteMode.value = false;
  } else {
    deleteMode.value = true;
  }
}

watch(
  [qwen, asd, asds, showModal, showPdfModal],
  ([qwen, asd, asds, showModal, showPdfModal]) => {
    if (qwen || asd || asds || showModal || showPdfModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>