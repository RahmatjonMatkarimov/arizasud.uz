<template>
  <div class="min-h-screen transition-all duration-300 p-4 sm:p-8 mx-auto bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
        {{ translateText('Ish O\'rinlari Boshqaruvi') }}
      </h1>
      <p class="text-lg font-medium text-gray-600 dark:text-slate-400">
        {{ translateText('Ishlarni qo\'shish, tahrirlash va boshqarish') }}
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-8 p-4 rounded-xl border flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300">
      <div class="text-xl">⚠️</div>
      <span class="font-medium">{{ translateText(error) }}</span>
    </div>

    <!-- Navigation Cards -->
    <div class="flex flex-col sm:flex-row gap-6 mb-8 justify-center">
      <div 
        @click="activeSection = 'jobs'" 
        class="cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        :class="[
          activeSection === 'jobs' 
            ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 shadow-blue-500/20' 
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400'
        ]"
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 text-center">
          {{ translateText('Ish O\'rinlari') }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-slate-400 text-center">
          {{ translateText('Ish o\'rinlarini boshqarish') }}
        </p>
      </div>
      <div 
        @click="activeSection = 'applications'" 
        class="cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        :class="[
          activeSection === 'applications' 
            ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 shadow-blue-500/20' 
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400'
        ]"
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 text-center">
          {{ translateText('Foydalanuvchi Arizalari') }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-slate-400 text-center">
          {{ translateText('Arizalarni ko\'rish') }}
        </p>
      </div>
    </div>

    <!-- Job List Section -->
    <div v-if="activeSection === 'jobs'">
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <button @click="openModal('create')" class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"/>
          </svg>
          {{ translateText('Q\'oshish') }}
        </button>
        <button 
          @click="handleActionButton" 
          class="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          :class="[
            selectionMode && ids.length > 0 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          ]"
          :disabled="selectionMode && ids.length === 0 && allSelected"
        >
          {{ 
            selectionMode 
              ? ids.length > 0 
                ? translateText(`O'chirish (${ids.length})`) 
                : allSelected ? translateText('Barchasini Bekor Qilish') : translateText('Barchasini Tanlash')
              : translateText('O\'chirish')
          }}
        </button>
      </div>

      <!-- Job List -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-if="data.length === 0 && !loading" class="col-span-full text-center py-16">
          <div class="text-6xl mb-6">📋</div>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-slate-300">
            {{ translateText('Hozircha ishlar yo\'q') }}
          </h3>
          <p class="text-base text-gray-500 dark:text-slate-400">
            {{ translateText('Yangi ish o\'rni qo\'shish uchun "Yangi Qo\'shish" tugmasini bosing') }}
          </p>
        </div>
        
        <div v-for="item in data" :key="item.id" class="relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl overflow-hidden border-2" :class="[
          ids.includes(item.id) 
            ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 shadow-blue-500/20'
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400'
        ]">
          <div v-if="ids.includes(item.id)" class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div class="p-6" @click="selectionMode ? toggleSelection(item.id) : null">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl break-words w-full font-bold text-gray-900 dark:text-slate-100">
                {{ translateText(item.title) }}
              </h3>
              <span class="text-xs break-words w-full px-2 py-1 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                #{{ item.id }}
              </span>
            </div>
            <div class="flex break-words w-full flex-wrap gap-4 mb-4">
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText(item.company) || 'Kompaniya nomi' }}
              </span>
              <span class="text-sm break-words w-full font-bold text-emerald-600">
                {{ item.salary ? `${item.salary}` : 'Maosh ko\'rsatilmagan' }}
              </span>
            </div>
            <p class="text-sm break-words w-full leading-relaxed text-gray-600 dark:text-slate-400">
              {{ translateText(item.description) || 'Tavsif mavjud emas' }}
            </p>
          </div>
          <div class="absolute top-4 right-4 flex gap-2">
            <button @click.stop="openModal('edit', item)" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white border border-gray-300 dark:border-slate-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <div v-if="selectionMode">
              <button @click.stop="toggleSelection(item.id)" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" :class="[
                ids.includes(item.id) 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white border border-gray-300 dark:border-slate-600'
              ]">
                <svg v-if="ids.includes(item.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Applications Section -->
    <div v-if="activeSection === 'applications'" class="mt-12">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-if="userApplications.length === 0 && !loading" class="col-span-full text-center py-16">
          <div class="text-6xl mb-6">📝</div>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-slate-300">
            {{ translateText('Hozircha arizalar yo\'q') }}
          </h3>
          <p class="text-base text-gray-500 dark:text-slate-400">
            {{ translateText('Foydalanuvchi arizalari bu yerda ko\'rsatiladi') }}
          </p>
        </div>
        <div v-for="application in userApplications" :key="application.id" class="relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl overflow-hidden border-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl break-words w-full font-bold text-gray-900 dark:text-slate-100">
                {{ translateText(application.job?.title) || 'Ish nomi' }}
              </h3>
              <span class="text-xs break-words w-full px-2 py-1 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                #{{ application.id }}
              </span>
            </div>
            <div class="flex break-words w-full flex-wrap gap-4 mb-4">
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText('Ariza beruvchi') }}: {{ translateText(application.fullName) || 'Ariza beruvchi' }}
              </span>
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText('Telefon') }}: {{ application.phone || 'Telefon ko\'rsatilmagan' }}
              </span>
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText('Email') }}: {{ application.email || 'Email ko\'rsatilmagan' }}
              </span>
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText('CV') }}: 
                <a :href="application.cvUrl" target="_blank" class="text-blue-600 hover:underline">
                  {{ application.cvUrl || 'CV ko\'rsatilmagan' }}
                </a>
              </span>
              <span class="text-sm break-words w-full font-medium text-gray-700 dark:text-slate-300">
                {{ translateText('Ariza sanasi') }}: {{ formatDate(application.appliedAt) || 'Sana ko\'rsatilmagan' }}
              </span>

            </div>
            <p class="text-sm break-words w-full leading-relaxed text-gray-600 dark:text-slate-400">
              {{ translateText(application.description) || 'Tavsif mavjud emas' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-10 h-10 border-4 border-t-blue-600 border-gray-300 dark:border-gray-600 rounded-full animate-spin mb-4"></div>
      <p class="text-base font-medium text-gray-600 dark:text-slate-400">
        {{ translateText('Yuklanmoqda...') }}
      </p>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" @click="closeModal"></div>
      <div class="relative w-full max-w-md mx-auto transform transition-all duration-300 scale-100 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <div class="rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {{ translateText(modalMode === 'create' ? 'Yangi Ish Qo\'shish' : 'Ishni Tahrirlash') }}
            </h2>
            <button @click="closeModal" class="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ translateText('Ish nomi') }} *
              </label>
              <input 
                v-model="formData.title" 
                type="text" 
                class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                :placeholder="translateText('Ish nomini kiriting')"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ translateText('Kompaniya nomi') }} *
              </label>
              <input 
                v-model="formData.company" 
                type="text" 
                class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                :placeholder="translateText('Kompaniya nomini kiriting')"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ translateText('Maosh (USD)') }}
              </label>
              <input 
                v-model="formData.salary" 
                type="number" 
                class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                :placeholder="translateText('Maoshni kiriting')"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ translateText('Tavsif') }}
              </label>
              <textarea 
                v-model="formData.description" 
                rows="4" 
                class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                :placeholder="translateText('Tavsifni kiriting')"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
            <button @click="closeModal" class="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300">
              {{ translateText('Bekor qilish') }}
            </button>
            <button @click="handleSubmit" :disabled="!formData.title || !formData.company || loading" class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ translateText(modalMode === 'create' ? 'Qo\'shish' : 'Yangilash') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate copy';

// Reactive state
const data = ref([]);
const userApplications = ref([]);
const ids = ref([]);
const error = ref(null);
const loading = ref(false);
const isDarkMode = ref(false);
const showModal = ref(false);
const modalMode = ref('create'); // 'create' or 'edit'
const editingItem = ref(null);
const selectionMode = ref(false);
const activeSection = ref('jobs'); // 'jobs' or 'applications'
const formData = ref({
  title: '',
  company: '',
  salary: '',
  description: ''
});

// Computed property to check if all items are selected
const allSelected = computed(() => {
  return data.value.length > 0 && ids.value.length === data.value.length;
});

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return 'Sana ko\'rsatilmagan';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Modal functions
const openModal = (mode, item = null) => {
  modalMode.value = mode;
  editingItem.value = item;
  if (mode === 'edit' && item) {
    formData.value = {
      title: item.title || '',
      company: item.company || '',
      salary: item.salary || '',
      description: item.description || ''
    };
  } else {
    formData.value = {
      title: '',
      company: '',
      salary: '',
      description: ''
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
  formData.value = {
    title: '',
    company: '',
    salary: '',
    description: ''
  };
};

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.company) {
    error.value = "Ish nomi va kompaniya nomi majburiy";
    return;
  }
  loading.value = true;
  try {
    if (modalMode.value === 'create') {
      await axios.post(`${URL}/jobs`, {
        title: formData.value.title,
        description: formData.value.description,
        company: formData.value.company,
        salary: formData.value.salary ? parseInt(formData.value.salary) : null,
      });
    } else {
      await axios.put(`${URL}/jobs/${editingItem.value.id}`, {
        title: formData.value.title,
        description: formData.value.description,
        company: formData.value.company,
        salary: formData.value.salary ? parseInt(formData.value.salary) : null,
      });
    }
    await getJobs();
    error.value = null;
    closeModal();
  } catch (err) {
    error.value = err.response?.data?.message || "Operatsiyada xatolik yuz berdi";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Theme toggle
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

// Handle action button (toggle selection mode, select all, or delete)
const handleActionButton = async () => {
  if (!selectionMode.value) {
    selectionMode.value = true;
  } else if (ids.value.length > 0) {
    await removeJob();
  } else if (!allSelected.value) {
    ids.value = data.value.map(item => item.id);
  } else {
    ids.value = [];
  }
};

// Toggle job selection
const toggleSelection = (id) => {
  const parsedId = parseInt(id);
  if (ids.value.includes(parsedId)) {
    ids.value = ids.value.filter((item) => item !== parsedId);
  } else {
    ids.value.push(parsedId);
  }
};

// API calls
const getUserApplications = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${URL}/user-applications`);
    userApplications.value = res.data || [];
    error.value = null;
  } catch (err) {
    error.value = err.response?.data?.message || "Arizalarni yuklashda xatolik";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getJobs = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${URL}/jobs`);
    data.value = res.data || [];
    error.value = null;
  } catch (err) {
    error.value = err.response?.data?.message || "Ishlarni yuklashda xatolik";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const removeJob = async () => {
  if (ids.value.length === 0) {
    error.value = "O'chirish uchun ishlar tanlanmagan";
    return;
  }
  loading.value = true;
  try {
    await axios.delete(`${URL}/jobs/archived`, {
      data: { ids: ids.value },
    });
    ids.value = [];
    await getJobs();
    error.value = null;
  } catch (err) {
    error.value = err.response?.data?.message || "Ishlarni o'chirishda xatolik";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  }
  getJobs();
  getUserApplications();
});
</script>

<style scoped>
/* Tailwind classes are used in the template, so no additional styles are needed */
</style>