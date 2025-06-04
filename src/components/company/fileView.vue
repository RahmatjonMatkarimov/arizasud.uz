<template>
    <!-- File Upload Modal -->
    <div v-if="togle" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div class="flex flex-col gap-4">
                <input v-model="selectedName" type="text" class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 
                    focus:outline-none focus:border-blue-500 transition-colors" :placeholder="$t('bolimname')">
                <input type="file" id="fileInput" @change="handleFileChange" accept=".pdf,.doc,.docx"
                    class="w-full text-gray-300 py-2">
                <div class="flex justify-center gap-4 mt-4">
                    <button @click="back()" class="px-6 py-2 rounded-lg font-medium bg-gray-600 text-white 
                        hover:bg-gray-700 transition-all duration-300">
                        {{ $t('Bekor_qilish') }}
                    </button>
                    <button @click="isEditing ? updateFile() : uploadFile()" class="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white 
                        hover:bg-blue-700 transition-all duration-300">
                        {{ $t('yuklash') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="asd" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div class="flex flex-col gap-4">
                <div class="flex justify-center gap-4 mt-4">
                    <button @click="removeSelectedItems" class="px-6 py-2 rounded-lg font-medium bg-red-600 text-white 
                        hover:bg-red-700 transition-all duration-300">
                        {{ $t('remove') }}
                    </button>
                    <button @click="func(null)" class="px-6 py-2 rounded-lg font-medium bg-gray-600 text-white 
                        hover:bg-gray-700 transition-all duration-300">
                        {{ $t('Bekor_qilish') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPdfModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div class="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-end transition-all duration-300"
            :class="{ 'w-screen h-screen max-w-none rounded-none': isFullScreen }">
            <div class="flex space-x-2 mb-4">
                <button v-if="type === true" @click="updateEFile()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                    :disabled="isLoading">
                    {{ isLoading ? 'Imzolash jarayonda...' : $t('Imzolash') }}
                </button>
                <img src="/interface.png" @click="isFullScreen = !isFullScreen"
                    class="w-[50px] p-2 bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer" />
                <img src="/reject.png" @click="showPdfModal = !showPdfModal"
                    class="w-[50px] p-2 bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer" />
            </div>
            <iframe :src="pdfUrl" class="w-full border-none transition-all duration-300"
                :class="isFullScreen ? 'h-full' : 'h-[600px]'"></iframe>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-end mb-6">
            <button @click="back" class="px-6 py-2 rounded-lg font-medium bg-teal-500 text-white 
                hover:bg-teal-600 transition-all duration-300">
                {{ $t('create') }}
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
            <div v-if="ServiceData.length" class="space-y-3">
                <div v-for="(item, index) in ServiceData" :key="item.id" class="flex items-center p-4 rounded-lg border border-gray-200 
                    hover:bg-gray-50 cursor-pointer transition-colors" @click="goToCard(item.id)">
                    <span class="w-10 text-center font-medium text-gray-700">{{ index + 1 }}</span>
                    <img src="/word.png" alt="Word" class="w-6 h-6 mr-4">
                    <span class="flex-1 text-gray-800 truncate">
                        {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                    </span>
                    <div class="flex gap-2">
                        <button @click.stop="editFile(item)"
                            class="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <img src="/pen.png" alt="Edit" class="w-4 h-4">
                        </button>
                        <button @click.stop="func(item.id)"
                            class="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <img src="/reject.png" alt="Delete" class="w-4 h-4">
                        </button>
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

const getCourtsData = async () => {
    try {
        const response = await fetch(`${URL}/enterprise/${ServiceId.value}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const res = await response.json();

        // Agar res obyekt bo'lsa, files massivini olish
        if (!res.files || !Array.isArray(res.files)) {
            console.error("Files massivi topilmadi yoki massiv emas:", res);
            throw new Error("Serverdan kutilgan files massivi topilmadi!");
        }

        // status === "active" bo'lgan fayllarni filter qilish
        const filteredFiles = res.files.filter(file => file.status === "active");

        // ServiceData ga filtered fayllarni yuklash
        ServiceData.value = filteredFiles;

        // sign ni olish
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
        alert("Server bilan bog‘lanishda xatolik yuz berdi!");
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

<style lang="scss" scoped>
.file-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.file-upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-button {
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.upload-button:hover {
    background-color: #d32f2f;
}

input[type="file"] {
    margin: 10px 0;
    color: white;
}
</style>