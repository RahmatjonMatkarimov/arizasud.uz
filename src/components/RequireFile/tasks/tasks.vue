<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans antialiased dark:bg-gradient-to-br dark:from-gray-950 pt-8 dark:via-indigo-900 dark:to-teal-950 dark:text-gray-50">
    <!-- Main Content -->
    <div class="max-w-[95%] mx-auto p-8 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl  border border-gray-200/30 dark:border-gray-800/30">
      <!-- Create Button -->
      <div class="flex justify-end">
        <button
          v-if="data === 'manager'"
          @click="showModal = true"
          class="relative bg-blue-500 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-cyan-500 text-white font-semibold py-2.5 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group"
        >
          <span class="relative z-10">{{ $t('create') }}</span>
          <div class="absolute inset-0 bg-blue-600 dark:bg-gradient-to-r dark:from-emerald-600 dark:to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-4 mb-8">
        <button
          v-if="data === 'yurist' || data === 'bigAdmin'"
          @click="toggleDeleteMode"
          class="bg-blue-500 dark:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:bg-blue-600 dark:hover:bg-indigo-800 hover:shadow-lg transition-all duration-300"
        >
          {{ deleteMode ? $t('cancel_delete') : $t('enable_delete') }}
        </button>
        <button
          v-if="deleteMode && selectedFiles.length > 0"
          @click="deleteSelectedFiles"
          class="bg-red-500 dark:bg-rose-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 hover:shadow-lg transition-all duration-300"
        >
          {{ $t('remove') }}
        </button>
      </div>

      <!-- File List -->
      <ul class="space-y-2">
        <li
          v-if="dat === 'datakril'"
          v-for="(file, index) in filteredFiles"
          :key="index"
          class="flex items-center justify-between p-4 rounded-xl bg-gray-100/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 group hover:bg-blue-50/30 dark:hover:bg-gradient-to-r dark:hover:from-emerald-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 dark:animate-pulse-glow"
        >
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
              {{ translateText(file.User.surname) }} {{ translateText(file.User.name) }}
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ translateText(file.User.lavozimi) }}</span>
            </h1>
            <p
              @click="openFile(file)"
              class="text-blue-600 dark:text-cyan-400 cursor-pointer font-medium hover:text-blue-500 dark:hover:text-cyan-300 hover:underline truncate transition-colors duration-200"
            >
              {{ translateText(file.name) }}
            </p>
          </div>
          <span
            :class="file.status === 'signed' ? 'text-teal-600 dark:text-emerald-400' : 'text-red-500 dark:text-rose-400'"
            class="text-sm font-medium px-3 py-1 rounded-full bg-gray-200/40 dark:bg-gray-700/40"
          >
            {{ $t('holat') }}: {{ translateText(getStatusText(file.status)) }}
          </span>
          <button
            v-if="file.statusReason"
            @click="qwenn(file.statusReason)"
            class="hidden group-hover:block py-1.5 px-4 bg-red-500 dark:bg-rose-700 text-white rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 transition-all duration-300 ml-4"
          >
            {{ $t('sababni') }}
          </button>
          <label
            v-if="deleteMode"
            class="flex items-center cursor-pointer ml-4"
          >
            <input
              type="checkbox"
              v-model="selectedFiles"
              :value="file.id"
              class="hidden peer"
            >
            <div
              class="w-5 h-5 rounded-md border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center peer-checked:bg-teal-500 dark:peer-checked:bg-emerald-500 peer-checked:border-teal-500 dark:peer-checked:border-emerald-500 transition-all duration-200"
            >
              <svg
                v-if="selectedFiles.includes(file.id)"
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </label>
        </li>
        <li
          v-if="dat === 'datalotin'"
          v-for="(file, index) in filteredFiles"
          :key="index"
          class="flex items-center justify-between p-4 rounded-xl bg-gray-100/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 group hover:bg-blue-50/30 dark:hover:bg-gradient-to-r dark:hover:from-emerald-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 dark:animate-pulse-glow"
        >
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
              {{ file.User.surname }} {{ file.User.name }}
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ file.User.lavozimi }}</span>
            </h1>
            <p
              @click="openFile(file)"
              class="text-blue-600 dark:text-cyan-400 cursor-pointer font-medium hover:text-blue-500 dark:hover:text-cyan-300 hover:underline truncate transition-colors duration-200"
            >
              {{ file.name }}
            </p>
          </div>
          <span
            :class="file.status === 'signed' ? 'text-teal-600 dark:text-emerald-400' : 'text-red-500 dark:text-rose-400'"
            class="text-sm font-medium px-3 py-1 rounded-full bg-gray-200/40 dark:bg-gray-700/40"
          >
            {{ $t('holat') }}: {{ getStatusText(file.status) }}
          </span>
          <button
            v-if="file.statusReason"
            @click="qwenn(file.statusReason)"
            class="hidden group-hover:block py-1.5 px-4 bg-red-500 dark:bg-rose-700 text-white rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 transition-all duration-300 ml-4"
          >
            {{ $t('sababni') }}
          </button>
          <label
            Fund v-if="deleteMode"
            class="flex items-center cursor-pointer ml-4"
          >
            <input
              type="checkbox"
              v-model="selectedFiles"
              :value="file.id"
              class="hidden peer"
            >
            <div
              class="w-5 h-5 rounded-md border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center peer-checked:bg-teal-500 dark:peer-checked:bg-emerald-500 peer-checked:border-teal-500 dark:peer-checked:border-emerald-500 transition-all duration-200"
            >
              <svg
                v-if="selectedFiles.includes(file.id)"
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </label>
        </li>
      </ul>
    </div>

    <!-- Upload Modal -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showModal" @click="showModal = false"
        class="fixed inset-0 bg-gray-200/80 dark:bg-black/80 flex justify-center items-center z-40"
      >
        <div @click.stop
          class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-300/30 dark:border-gray-700/30 transform transition-all duration-300"
        >
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">Yangi fayl yuklash</h3>
          <input
            type="text"
            v-model="fileName"
            :placeholder="$t('filename')"
            class="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-all"
          />
          <input
            type="file"
            @change="e => newFile = e.target.files[0]"
            class="w-full bg-gray-100/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-50 rounded-lg p-2 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 dark:file:bg-cyan-500 file:text-white file:hover:bg-blue-600 dark:file:hover:bg-cyan-600"
          />
          <div class="flex justify-between gap-4">
            <button
              @click="showModal = false"
              class="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-5 rounded-full shadow-md hover:bg-gray-400 dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300"
            >
              {{ $t('Bekor_qilish') }}
            </button>
            <button
              @click="uploadFile"
              class="flex-1 bg-blue-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-500 text-white py-2 px-5 rounded-full shadow-md hover:bg-blue-600 dark:hover:shadow-xl transition-all duration-300"
            >
              {{ $t('yuklash') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Revision Modal -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="asd" @click="asd = false"
        class="fixed inset-0 bg-gray-200/80 dark:bg-black/80 flex justify-center items-center z-40"
        @mousedown="startDrag('asd', $event)"
      >
        <div @click.stop
          class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-300/30 dark:border-gray-700/30"
        >
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">{{ $t('korib_chiqish') }}</h1>
          <input
            v-model="massage"
            type="text"
            class="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
            :placeholder="$t('sabab')"
          />
          <div class="flex justify-between gap-4">
            <button
              @click="asd = false"
              class="flex-1 bg-red-500 dark:bg-rose-700 text-white py-2 px-5 rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 transition-all duration-300"
            >
              {{ $t('Bekor_qilish') }}
            </button>
            <button
              @click="updateeFile('revision')"
              class="flex-1 bg-blue-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-500 text-white py-2 px-5 rounded-full shadow-md hover:bg-blue-600 dark:hover:shadow-xl transition-all duration-300"
            >
              {{ $t('jonatish') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Reject Modal -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="asds" @click="asds = false"
        class="fixed inset-0 bg-gray-200/80 dark:bg-black/80 flex justify-center items-center z-40"
        @mousedown="startDrag('asds', $event)"
      >
        <div @click.stop
          class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-300/30 dark:border-gray-700/30"
        >
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">{{ $t('rad_etish') }}</h1>
          <input
            v-model="massages"
            type="text"
            class="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
            :placeholder="$t('sabab')"
          />
          <div class="flex justify-between gap-4">
            <button
              @click="asds = false"
              class="flex-1 bg-red-500 dark:bg-rose-700 text-white py-2 px-5 rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 transition-all duration-300"
            >
              {{ $t('Bekor_qilish') }}
            </button>
            <button
              @click="updateeFile('rejected')"
              class="flex-1 bg-blue-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-500 text-white py-2 px-5 rounded-full shadow-md hover:bg-blue-600 dark:hover:shadow-xl transition-all duration-300"
            >
              {{ $t('jonatish') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- PDF Viewer Modal -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showPdfModal" @click="showPdfModal = false"
        class="fixed inset-0 flex items-center justify-center bg-gray-200/80 dark:bg-black/80 z-40"
      >
        <div @click.stop
          class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col items-end border border-gray-300/30 dark:border-gray-700/30 transition-all duration-300"
          :class="{ 'w-screen h-screen max-w-none rounded-none': isFullScreen }"
        >
          <div class="flex space-x-3 mb-4">
            <button
              v-if="data === 'yurist'"
              @click="updateeFile('signaturePending')"
              class="bg-blue-500 dark:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 dark:hover:bg-indigo-800 transition-all duration-300"
            >
              {{ $t('Imzolash_uchun_yuborish') }}
            </button>
            <button
              v-if="data === 'bigAdmin'"
              @click="updateFile()"
              class="bg-blue-500 dark:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 dark:hover:bg-indigo-800 transition-all duration-300"
            >
              {{ $t('Imzolash') }}
            </button>
            <button
              v-if="data === 'bigAdmin' || data === 'yurist'"
              @click="toggleModal"
              class="bg-yellow-400 dark:bg-amber-500 text-gray-900 py-2 px-6 rounded-full shadow-md hover:bg-yellow-300 dark:hover:bg-amber-400 transition-all duration-300"
            >
              {{ $t('Qayta') }}
            </button>
            <button
              v-if="data === 'bigAdmin' || data === 'yurist'"
              @click="toggleModas"
              class="bg-red-500 dark:bg-rose-700 text-white py-2 px-6 rounded-full shadow-md hover:bg-red-600 dark:hover:bg-rose-800 transition-all duration-300"
            >
              {{ $t('Rad') }}
            </button>
            <button
              @click="isFullScreen = !isFullScreen"
              class="p-2.5 bg-gray-300 dark:bg-gray-400 rounded-full shadow-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
            >
              <img src="/interface.png" alt="Toggle Full Screen" class="w-5 h-5" />
            </button>
            <button
              @click="showPdfModal = !showPdfModal"
              class="p-2.5 bg-gray-300 dark:bg-gray-400 rounded-full shadow-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
            >
              <img src="/reject.png" alt="Close" class="w-5 h-5" />
            </button>
          </div>
          <iframe
            :src="pdfUrl"
            class="w-full h-[600px] border-none bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-200"
            :class="{ 'h-full': isFullScreen }"
          ></iframe>
        </div>
      </div>
    </transition>

    <!-- Status Reason Modal -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="qwen" @click="qwen = false"
        class="fixed inset-0 bg-gray-200/80 dark:bg-black/80 flex justify-center items-center z-40"
      >
        <div @click.stop
          class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl relative max-w-lg w-full border border-gray-300/30 dark:border-gray-700/30"
        >
          <button
            @click="qwen = false"
            class="absolute top-4 right-4 p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <img src="/reject.png" alt="Close" class="w-5 h-5" />
          </button>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-50 break-all">
            {{ statusReason }}
          </h1>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Glow animation for dark mode list items */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(6, 182, 212, 0.3); }
  50% { box-shadow: 0 0 12px rgba(6, 182, 212, 0.5); }
}

.dark .animate-pulse-glow {
  animation: pulse-glow 2s infinite ease-in-out;
}

/* Button micro-interaction */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-track {
  background: #1e1b4b;
}

::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #22d3ee;
}

/* Font optimization */
@font-face {
  font-family: 'Inter';
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
}
</style>
<script setup>
import { ref, onMounted, inject, computed, watch, onUnmounted } from 'vue'
import axios from 'axios'
import { URL } from '../../../auth/url.js'
import { useRoute } from 'vue-router'
const API_URL = `${URL}/signingFiles`
const selectedFiles = ref([]);
const files = ref([])
const newFile = ref(null)
const fileName = ref('')
const showModal = ref(false)
const showPdfModal = ref(false)
const pdfUrl = ref('')
const isloading = inject('isLoading')
const selectedFileId = ref(null)
const isFullScreen = ref(false)
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
const asd = ref(false)
const asds = ref(false)
const massage = ref('')
const massages = ref('')
const deleteMode = ref(false)
const route = useRoute()
const data = ref('')
const userID = ref(parseInt(route.params.id))
const qwen = ref(false)
const statusReason = ref('')
import { useSearchStore } from "@/components/Templates/searchQuary";
const searchStore = useSearchStore();
const filteredFiles = computed(() => {
  if (!searchStore.query) {
    return files.value;
  }
  const query = searchStore.query.toLowerCase();
  return files.value.filter(file =>
    file.name.toLowerCase().includes(query) ||
    file.User.name.toLowerCase().includes(query) ||
    file.User.surname.toLowerCase().includes(query)
  );
});


function qwenn(file) {
  statusReason.value = file
  qwen.value = !qwen.value
}

watch([qwen, asd, asds, showModal, showPdfModal], ([qwen, asd, asds, showModal, showPdfModal]) => {
  if (qwen || asd || asds || showModal || showPdfModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
const getStatusText = (status) => {
  if (status === 'waiting') return 'Kutish';
  if (status === 'signaturePending') return 'Imzo kutulmoqda';
  if (status === 'signed') return 'imzolangan';
  if (status === 'rejected') return 'Rad etilgan';
  if (status === 'revision') return 'Qayta korib chiqish talab etiladi';
  return status;
};
import translateText from "@/auth/Translate";

const getdata = async () => {
  isloading.value = true
  try {
    const managerID = ref(parseInt(localStorage.getItem("id")))
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${managerID.value}`)
    data.value = response.data.role

  } catch (error) {
    console.error('Fayllarni olishda xatolik:', error)
  }finally{
    isloading.value = false
  }
}
const fetchFiles = async () => {
  isloading.value = true
  try {
    const response = await axios.get(`${API_URL}/${userID.value}`)
    files.value = response.data.userFiles.filter(item => item.type == 'tasks').filter(item => item.status !== 'archive')
  } catch (error) {
    console.error('Fayllarni olishda xatolik:', error)
  }finally{
    isloading.value = false
  }
}
fetchFiles()
const uploadFile = async () => {
  if (!newFile.value || !fileName.value) return
  const formData = new FormData()
  formData.append('file', newFile.value)
  formData.append('name', fileName.value)
  formData.append('userId', userID.value)
  formData.append('type', 'tasks')

  isloading.value = true
  try {
    await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    fileName.value = ''
    newFile.value = null
    showModal.value = false
    fetchFiles()
  } catch (error) {
    console.error('Fayl yuklashda xatolik:', error)
  }finally{
    isloading.value = false
  }
}
const updateFile = async () => {
  const id = selectedFileId.value;
  if (!id) return;
  isloading.value = true
  try {
    await axios.put(`${URL}/signingFiles/${id}`);
    const baseUrl = pdfUrl.value.split('?')[0];
    pdfUrl.value = `${baseUrl}?t=${new Date().getTime()}`;
  } catch (error) {
    console.error("Xatolik:", error);
  }finally{
    isloading.value = false
  }
};


const updateeFile = async (status) => {
  isloading.value = true
  try {
    await axios.put(`${API_URL}/${selectedFileId.value}/status`, {
      status: status,
      statusReason: massage.value || massages.value
    });
    fileName.value = '';
    newFile.value = null;
    asd.value = false;
    asds.value = false;
    showPdfModal.value = false

    fetchFiles();
  } catch (error) {
    console.error('Faylni yangilashda xatolik:', error);
  }finally{
    isloading.value = false
  }
};

const deleteSelectedFiles = async () => {
  if (selectedFiles.value.length === 0) return;
  isloading.value = true
  try {
    await axios.delete(`${API_URL}/delete`, { data: { ids: selectedFiles.value } });
    selectedFiles.value = [];
    deleteMode.value = false;
    fetchFiles();
  } catch (error) {
    console.error('Fayllarni o‘chirishda xatolik:', error);
  }finally{
    isloading.value = false
  }
};
const openFile = (file) => {
  pdfUrl.value = '';
  setTimeout(() => {
    pdfUrl.value = `${URL}${file.filePath}`;
    selectedFileId.value = file.id;
    showPdfModal.value = true;
  }, 100);
};

onMounted(() => {
  getdata();
  fetchFiles();
});
const isDragging = ref(false);
const currentModal = ref(null);
const dragOffset = ref({ x: 0, y: 0 });

const startDrag = (modalType, event) => {
  isDragging.value = true;
  currentModal.value = modalType;
  if (modalType === 'asd') {
    dragOffset.value.x = event.clientX - modalPositionAsd.value.x;
    dragOffset.value.y = event.clientY - modalPositionAsd.value.y;
  } else if (modalType === 'asds') {
    dragOffset.value.x = event.clientX - modalPositionAsds.value.x;
    dragOffset.value.y = event.clientY - modalPositionAsds.value.y;
  }
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (!isDragging.value) return;
  if (currentModal.value === 'asd') {
    modalPositionAsd.value.x = event.clientX - dragOffset.value.x;
    modalPositionAsd.value.y = event.clientY - dragOffset.value.y;
  } else if (currentModal.value === 'asds') {
    modalPositionAsds.value.x = event.clientX - dragOffset.value.x;
    modalPositionAsds.value.y = event.clientY - dragOffset.value.y;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  currentModal.value = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};


function toggleModal() {
  modalPositionAsd.value = {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 150
  }
  asds.value = false
  asd.value = true
}

function toggleModas() {
  modalPositionAsds.value = {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 150
  }
  asds.value = true
  asd.value = false
}

function toggleDeleteMode() {
  if (deleteMode.value) {
    selectedFiles.value = []
    deleteMode.value = false
  } else {
    deleteMode.value = true
  }
}
</script>