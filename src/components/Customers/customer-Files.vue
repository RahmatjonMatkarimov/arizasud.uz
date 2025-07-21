<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <!-- Header va Dark Mode Toggle -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {{ translateText('Mijoz Fayllarini Boshqarish') }}
        </h1>
        <div></div>
      </div>

      <!-- Yangi Fayl Yaratish Tugmasi -->
      <div class="mb-6">
        <button
          @click="openCreateModal"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          {{ translateText('Yangi Fayl Yaratish') }}
        </button>
      </div>

      <!-- Mavjud Fayllar Ro'yxati -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {{ translateText('Mavjud Fayllar') }}
          </h2>
        </div>
        <div class="p-6">
          <div v-if="files.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">{{ translateText('Hech qanday fayl topilmadi') }}</p>
          </div>
          <div v-else class="grid gap-4">
            <div
              v-for="file in files"
              :key="file.id"
              @click="$router.push('/customer-open/'+file.id)"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 relative"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                    {{ translateText(file.name) }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {{ translateText('Yaratilgan') }}: {{ formatDate(file.createdAt) }}
                  </p>
                </div>
                <!-- More Options Menu -->
                <div class="relative">
                  <button
                    @click="toggleMenu(file.id)"
                    class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01"></path>
                    </svg>
                  </button>
                  <div
                    v-if="activeMenu === file.id"
                    class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10"
                  >
                    <button
                      @click="openEditModal(file)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {{ translateText('Tahrirlash') }}
                    </button>
                    <button
                      @click="openDeleteModal(file)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {{ translateText("O'chirish") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Yaratish Modali -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ translateText('Yangi Fayl Yaratish') }}
          </h3>
        </div>
        <form @submit.prevent="createFile" class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Nom') }}:
            </label>
            <input
              type="text"
              v-model="newFile.name"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              :placeholder="translateText('Fayl nomini kiriting')"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Fayl') }}:
            </label>
            <input
              type="file"
              @change="handleFileUpload"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {{ translateText('Bekor qilish') }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              {{ translateText('Yaratish') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tahrirlash Modali -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ translateText('Faylni Tahrirlash') }}
          </h3>
        </div>
        <form @submit.prevent="updateFile" class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Nom') }}:
            </label>
            <input
              type="text"
              v-model="editingFile.name"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ translateText('Fayl (ixtiyoriy)') }}:
            </label>
            <input
              type="file"
              @change="handleFileUploadForEdit"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {{ translateText('Bekor qilish') }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
            >
              {{ translateText('Yangilash') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- O'chirish Modali -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ translateText('Faylni O\'chirish') }}
          </h3>
        </div>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <svg class="w-12 h-12 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <p class="text-gray-800 dark:text-gray-100 font-medium">
                {{ translateText('Siz haqiqatan ham bu faylni o\'chirmoqchimisiz?') }}
              </p>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                "{{ translateText(fileToDelete?.name) }}"
              </p>
              <p class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ translateText('Bu amalni qaytarib bo\'lmaydi!') }}
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {{ translateText('Bekor qilish') }}
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              {{ translateText('O\'chirish') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import translateText from '@/auth/Translate copy';
import { URL } from '@/auth/url';

// State Variables
const files = ref([]);
const isDark = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const isLoading = inject('isLoading');
const activeMenu = ref(null); // Track open menu
const errorMessage = ref(''); // Store translated error messages

const newFile = ref({
  name: '',
  customerSectionId: '',
  file: null,
});

const editingFile = ref(null);
const editedFile = ref({
  file: null,
});

const fileToDelete = ref(null);

// Route
const route = useRoute();

// Toggle Menu
const toggleMenu = (fileId) => {
  activeMenu.value = activeMenu.value === fileId ? null : fileId;
};

// Dark Mode Toggle
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

// Initialize Dark Mode
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
};

// Format Date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('uz-UZ');
};

// Modal Functions
const openCreateModal = () => {
  newFile.value = {
    name: '',
    customerSectionId: route.params?.id || '',
    file: null,
  };
  showCreateModal.value = true;
  errorMessage.value = '';
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const openEditModal = (file) => {
  editingFile.value = { ...file };
  editedFile.value = { file: null };
  showEditModal.value = true;
  activeMenu.value = null;
  errorMessage.value = '';
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingFile.value = null;
  editedFile.value = { file: null };
  errorMessage.value = '';
};

const openDeleteModal = (file) => {
  fileToDelete.value = file;
  showDeleteModal.value = true;
  activeMenu.value = null;
  errorMessage.value = '';
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  fileToDelete.value = null;
  errorMessage.value = '';
};

// API Functions
const fetchFiles = async () => {
  try {
    const response = await axios.get(URL + '/customer-sections/'+route.params.id);
    files.value = response.data.Files.map(file => ({
      ...file,
      name: translateText(file.name), // Translate backend-provided name
    }));
  } catch (error) {
    errorMessage.value = translateText(error.response?.data?.message || 'Fayllarni olishda xatolik');
  }
};

const createFile = async () => {
  if (!newFile.value.name.trim() || !newFile.value.file || !newFile.value.customerSectionId) {
    errorMessage.value = translateText('Iltimos, barcha maydonlarni to\'ldiring');
    return;
  }
  const formData = new FormData();
  formData.append('name', newFile.value.name.trim());
  formData.append('customerSectionId', newFile.value.customerSectionId);
  if (newFile.value.file) {
    formData.append('file', newFile.value.file);
  }
  isLoading.value = true;
  try {
    await axios.post(URL + '/customer-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await fetchFiles();
    closeCreateModal();
  } catch (error) {
    errorMessage.value = translateText(error.response?.data?.message || 'Fayl yaratishda xatolik');
  } finally {
    isLoading.value = false;
  }
};

const updateFile = async () => {
  if (!editingFile.value?.id || !editingFile.value?.name?.trim()) {
    errorMessage.value = translateText('Iltimos, fayl nomini kiriting');
    return;
  }
  isLoading.value = true;
  try {
    let response;
    if (editedFile.value?.file) {
      const formData = new FormData();
      formData.append('name', editingFile.value.name.trim());
      formData.append('file', editedFile.value.file);
      response = await axios.put(
        URL + `/customer-files/${editingFile.value.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else {
      const jsonPayload = { name: editingFile.value.name.trim() };
      response = await axios.put(
        URL + `/customer-files/${editingFile.value.id}`,
        jsonPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    await fetchFiles();
    closeEditModal();
  } catch (error) {
    errorMessage.value = translateText(error.response?.data?.message || 'Faylni yangilashda xatolik');
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (!fileToDelete.value) {
    errorMessage.value = translateText('O\'chirish uchun fayl tanlanmagan');
    return;
  }
  isLoading.value = true;
  try {
    await axios.delete(URL + `/customer-files/${fileToDelete.value.id}`);
    await fetchFiles();
    closeDeleteModal();
  } catch (error) {
    errorMessage.value = translateText(error.response?.data?.message || 'Faylni o\'chirishda xatolik');
  } finally {
    isLoading.value = false;
  }
};

// File Upload Handlers
const handleFileUpload = (event) => {
  newFile.value.file = event.target.files[0];
};

const handleFileUploadForEdit = (event) => {
  editedFile.value.file = event.target.files[0];
};

// Reset Form
const resetForm = () => {
  newFile.value = {
    name: '',
    customerSectionId: route.params?.id || '',
    file: null,
  };
  errorMessage.value = '';
};

// Lifecycle
onMounted(() => {
  initializeDarkMode();
  fetchFiles();
});
</script>