<template>
    <!-- File Upload Modal -->
    <div v-if="togle" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ isEditing ? $t('Edit File') : $t('Upload File') }}
                </h3>
                <button @click="back()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <iconify-icon icon="mdi:close" class="text-gray-500 dark:text-gray-400 text-xl"></iconify-icon>
                </button>
            </div>
            
            <div class="flex flex-col gap-4">
                <div class="relative">
                    <iconify-icon icon="mdi:file-document-outline" class="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500"></iconify-icon>
                    <input 
                        v-model="selectedName" 
                        type="text" 
                        class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        :placeholder="$t('bolimname')"
                    >
                </div>
                
                <div class="relative">
                    <input 
                        type="file" 
                        id="fileInput" 
                        @change="handleFileChange" 
                        accept=".pdf,.doc,.docx"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    >
                    <div class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                        <iconify-icon icon="mdi:cloud-upload" class="text-blue-500 text-2xl"></iconify-icon>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ selectedFile ? selectedFile.name : $t('Choose file') }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end gap-3 mt-6">
                    <button 
                        @click="back()" 
                        class="px-6 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                    >
                        <iconify-icon icon="mdi:close"></iconify-icon>
                        {{ $t('Bekor_qilish') }}
                    </button>
                    <button 
                        @click="isEditing ? updateFile() : uploadFile()" 
                        class="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center gap-2"
                    >
                        <iconify-icon icon="mdi:upload"></iconify-icon>
                        {{ $t('yuklash') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="asd" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                    <iconify-icon icon="mdi:delete-alert" class="text-red-600 dark:text-red-400 text-2xl"></iconify-icon>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ $t('Confirm Delete') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {{ $t('Are you sure you want to delete this file?') }}
                </p>
                <div class="flex justify-center gap-3">
                    <button 
                        @click="func(null)" 
                        class="px-6 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                    >
                        <iconify-icon icon="mdi:close"></iconify-icon>
                        {{ $t('Bekor_qilish') }}
                    </button>
                    <button 
                        @click="removeSelectedItems" 
                        class="px-6 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center gap-2"
                    >
                        <iconify-icon icon="mdi:delete"></iconify-icon>
                        {{ $t('remove') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPdfModal" class="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-30">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl mx-4 flex flex-col transition-all duration-300"
            :class="{ 'w-screen h-screen max-w-none rounded-none mx-0': isFullScreen }">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ $t('File Preview') }}
                </h3>
                <div class="flex items-center gap-2">
                    <button 
                        v-if="type === true" 
                        @click="updateEFile()"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
                        :disabled="isLoading"
                    >
                        <iconify-icon 
                            :icon="isLoading ? 'mdi:loading' : 'mdi:draw-pen'" 
                            :class="{ 'animate-spin': isLoading }"
                        ></iconify-icon>
                        {{ isLoading ? 'Imzolash jarayonda...' : $t('Imzolash') }}
                    </button>
                    <button 
                        @click="isFullScreen = !isFullScreen"
                        class="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                    >
                        <iconify-icon 
                            :icon="isFullScreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" 
                            class="text-gray-600 dark:text-gray-300 text-xl"
                        ></iconify-icon>
                    </button>
                    <button 
                        @click="showPdfModal = !showPdfModal"
                        class="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                    >
                        <iconify-icon icon="mdi:close" class="text-gray-600 dark:text-gray-300 text-xl"></iconify-icon>
                    </button>
                </div>
            </div>
            
            <!-- PDF Viewer -->
            <div class="flex-1 p-4">
                <iframe 
                    :src="pdfUrl" 
                    class="w-full border-0 rounded-xl bg-white dark:bg-gray-900 shadow-inner transition-all duration-300"
                    :class="isFullScreen ? 'h-full' : 'h-[600px]'"
                ></iframe>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div class="max-w-6xl mx-auto px-4 py-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ $t('File Management') }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">
                        {{ $t('Manage your documents and files') }}
                    </p>
                </div>
                <button 
                    @click="back" 
                    class="px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                    <iconify-icon icon="mdi:plus"></iconify-icon>
                    {{ $t('create') }}
                </button>
            </div>

            <!-- Files Grid -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div v-if="ServiceData.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div 
                        v-for="(item, index) in ServiceData" 
                        :key="item.id" 
                        class="group flex items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                        @click="goToCard(item.id)"
                    >
                        <!-- Index -->
                        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                            <span class="font-semibold text-blue-600 dark:text-blue-400">{{ index + 1 }}</span>
                        </div>
                        
                        <!-- File Icon -->
                        <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                            <iconify-icon 
                                :icon="getFileIcon(item.name)" 
                                class="text-orange-600 dark:text-orange-400 text-2xl"
                            ></iconify-icon>
                        </div>
                        
                        <!-- File Info -->
                        <div class="flex-1 min-w-0">
                            <h3 class="font-medium text-gray-900 dark:text-white truncate">
                                {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {{ $t('Document') }} • {{ formatDate(item.createdAt) }}
                            </p>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                                @click.stop="editFile(item)"
                                class="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                                :title="$t('Edit')"
                            >
                                <iconify-icon icon="mdi:pencil" class="text-lg"></iconify-icon>
                            </button>
                            <button 
                                @click.stop="func(item.id)"
                                class="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                                :title="$t('Delete')"
                            >
                                <iconify-icon icon="mdi:delete" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../auth/url.js";
import axios from "axios";

const ServiceId = ref(null);
const ServiceData = ref([]);
const selectedFile = ref(null);
const selectedName = ref('');
const togle = ref(false);
const asd = ref(false);
const isEditing = ref(false);
const editingFileId = ref(null);
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));
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

const showPdfModal = ref(false);
const pdfUrl = ref('');
const isFullScreen = ref(false);
const selectedFileId = ref(null);
const isLoading = ref(false);
import translateText from "@/auth/Translate";

onMounted(async () => {
    ServiceId.value = numericId.value;
    await getCourtsData();
});

const type = ref('');

// Helper function to get file icon based on file extension
const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'mdi:file-pdf-box';
        case 'doc':
        case 'docx':
            return 'mdi:file-word-box';
        case 'xls':
        case 'xlsx':
            return 'mdi:file-excel-box';
        case 'ppt':
        case 'pptx':
            return 'mdi:file-powerpoint-box';
        default:
            return 'mdi:file-document-outline';
    }
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getCourtsData = async () => {
    try {
        const response = await fetch(`${URL}/enterprise/${ServiceId.value}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const res = await response.json();

        if (!res.files || !Array.isArray(res.files)) {
            console.error("Files massivi topilmadi yoki massiv emas:", res);
            throw new Error("Serverdan kutilgan files massivi topilmadi!");
        }

        const filteredFiles = res.files.filter(file => file.status === "active");
        ServiceData.value = filteredFiles;
        type.value = res.sign || '';
    } catch (error) {
        console.error("Xatolik yuz berdi:", error.message);
        alert("Ma'lumotni olishda xatolik yuz berdi: " + error.message);
    }
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['doc', 'docx', 'pdf'];

        if (allowedExtensions.includes(fileExtension)) {
            selectedFile.value = file;
        } else {
            alert("Faqat PDF yoki Word fayllarni yuklash mumkin (.pdf, .doc, .docx).");
            event.target.value = '';
            selectedFile.value = null;
        }
    }
};

const uploadFile = async () => {
    if (!selectedFile.value) {
        alert("Iltimos, fayl tanlang!");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("enterpriseId", numericId.value);
    formData.append("name", selectedName.value);

    try {
        const response = await fetch(`${URL}/enterprise-file`, {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            togle.value = false;
            selectedName.value = '';
            selectedFile.value = null;
            await getCourtsData();
        } else {
            throw new Error("Upload failed");
        }
    } catch (error) {
        console.error("Fayl yuklashda xatolik:", error);
    }
};

const editFile = (item) => {
    isEditing.value = true;
    editingFileId.value = item.id;
    selectedName.value = item.name;
    selectedFile.value = null;
    togle.value = true;
};

const updateFile = async () => {
    const formData = new FormData();
    formData.append("name", selectedName.value);
    if (selectedFile.value) {
        formData.append("file", selectedFile.value);
    }

    try {
        const response = await fetch(`${URL}/enterprise-file/${editingFileId.value}`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            togle.value = false;
            isEditing.value = false;
            selectedName.value = '';
            selectedFile.value = null;
            editingFileId.value = null;
            await getCourtsData();
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        console.error("Fayl yangilashda xatolik:", error);
    }
};

const back = () => {
    togle.value = !togle.value;
    if (!togle.value) {
        isEditing.value = false;
        selectedName.value = '';
        selectedFile.value = null;
        editingFileId.value = null;
    }
};

const func = (id) => {
    numericId.value = id;
    asd.value = id !== null;
};

const removeSelectedItems = async () => {
    try {
        const response = await fetch(`${URL}/enterprise-file/${numericId.value}`, {
            method: "DELETE",
        });

        if (response.ok) {
            asd.value = false;
            await getCourtsData();
            alert("Fayl muvaffaqiyatli o'chirildi!");
        } else {
            const errorText = await response.text();
            console.error("O'chirishda xatolik:", errorText);
            alert(`Xatolik: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error("Xatolik:", error);
        alert("Server bilan bog'lanishda xatolik yuz berdi!");
    }
};

const goToCard = (id) => {
    const file = ServiceData.value.find(item => item.id === id);
    if (file && file.filePath) {
        selectedFileId.value = id;
        const BASE_URL = `${URL}`;
        pdfUrl.value = `${BASE_URL}${file.filePath}`;
        showPdfModal.value = true;
    } else {
        alert("Fayl topilmadi yoki filePath mavjud emas!");
    }
};

const updateEFile = async () => {
    if (!selectedFileId.value) {
        alert("Fayl tanlanmagan!");
        return;
    }

    isLoading.value = true;
    try {
        const response = await axios.put(`${URL}/enterprise-file/sign/${selectedFileId.value}`);
        if (response.status === 200) {
            const baseUrl = pdfUrl.value.split('?')[0];
            pdfUrl.value = `${baseUrl}?t=${new Date().getTime()}`;
            await getCourtsData();
        }
    } catch (error) {
        console.error("Imzolashda xatolik:", error);
        alert("Imzolashda xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500;
}

/* Smooth transitions for theme changes */
* {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>