<template>
    <div class="relative min-h-screen">
        <!-- Upload Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div class="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <button @click="toggleModal" class="absolute top-0 right-0 p-2">
                    <img src="/reject.png" alt="Close" class="w-8 h-8" />
                </button>
                <form @submit.prevent="uploadCourt" class="space-y-6">
                    <h2 class="text-2xl font-semibold text-white text-center">{{ $t('bolim_yaratish') }}</h2>
                    <input v-model="courtName" type="text" :placeholder="$t('bolimname')"
                        class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                        required />
                    <input @change="onFileChange" type="file" accept="image/*"
                        class="w-full p-2 text-gray-300 bg-gray-700 rounded-lg border border-gray-600" required />
                    <div class="flex items-center space-x-2">
                        <input v-model="isSignable" type="checkbox" id="signable"
                            class="w-4 h-4 text-lime-600 bg-gray-700 border-gray-600 rounded focus:ring-lime-500" />
                        <label for="signable" class="text-white capitalize">{{ $t('imzo') }}</label>
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-lime-600 text-white rounded-full hover:bg-lime-700 transition-colors">
                        {{ $t('yuklash') }}
                    </button>
                    <p v-if="successMessage" class="text-green-400 text-center">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="text-red-400 text-center">{{ errorMessage }}</p>
                </form>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showModalfile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div class="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <button @click="toggle(null)" class="absolute top-0 right-0 p-2">
                    <img src="/reject.png" alt="Close" class="w-8 h-8" />
                </button>
                <form @submit.prevent="updateFile" class="space-y-6">
                    <input v-model="courtName" type="text" :placeholder="$t('bolimname')"
                        class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                        required />
                    <input @change="onFileChange" type="file" accept="image/*"
                        class="w-full p-2 text-gray-300 bg-gray-700 rounded-lg border border-gray-600" />
                    <div class="flex items-center space-x-2">
                        <input v-model="isSignable" type="checkbox" id="signable-edit"
                            class="w-4 h-4 text-lime-600 bg-gray-700 border-gray-600 rounded focus:ring-lime-500" />
                        <label for="signable-edit" class="text-white capitalize">{{ $t('imzo') }}</label>
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-lime-600 text-white rounded-full hover:bg-lime-700 transition-colors">
                        {{ $t('tahrirlash') }}
                    </button>
                    <p v-if="successMessage" class="text-green-400 text-center">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="text-red-400 text-center">{{ errorMessage }}</p>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div class="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <button @click="toggleDeleteModal(null)" class="absolute top-0 right-0 p-2">
                    <img src="/reject.png" alt="Close" class="w-8 h-8" />
                </button>
                <div class="text-center space-y-6">
                    <div class="flex justify-center space-x-4">
                        <button @click="removeSelectedItems"
                            class="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                            {{ $t('remove') }}
                        </button>
                        <button @click="toggleDeleteModal(null)"
                            class="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                            {{ $t('Bekor_qilish') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex justify-end mb-8">
                <button @click="toggleModal"
                    class="px-6 py-2 bg-lime-500 text-white rounded-full hover:bg-lime-600 transition-colors text-lg font-medium">
                    {{ $t('bolim_yaratish') }}
                </button>
            </div>

            <div class="bg-gray-100 rounded-2xl p-8 shadow-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="item in data" :key="item.id"
                        class="bg-blue-700 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer relative">
                        <div class="absolute top-4 right-4">
                            <button @click.stop="toggleMenu(item.id)" class="p-2 hover:bg-blue-800 rounded-full">
                                <img src="/ellipsis.png" alt="Menu" class="w-5 h-5" />
                            </button>
                            <div v-if="showMenu && selectedId === item.id"
                                class="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-10">
                                <button @click.stop="toggle(item.id)"
                                    class="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">
                                    {{ $t('tahrirlash') }}
                                </button>
                                <button @click.stop="toggleDeleteModal(item.id)"
                                    class="block w-full text-left px-4 py-2 text-white hover:bg-red-700">
                                    {{ $t('remove') }}
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4" @click="Navigate(item.id)">
                            <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image"
                                class="w-16 h-16 object-cover rounded-md" />
                            <h1 v-if="dat === 'datalotin'"
                                class="text-white text-xl font-medium truncate flex-1 text-center">
                                {{ item.name }}
                            </h1>
                            <h1 v-if="dat === 'datakril'"
                                class="text-white text-xl font-medium truncate flex-1 text-center">
                                {{ translateText(item.name) }}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter()
const data = ref([]);
const showModal = ref(false);
const showModalfile = ref(false);
const showDeleteModal = ref(false);
const showMenu = ref(false);
const courtName = ref("");
const file = ref(null);
const isSignable = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const selectedId = ref(null);
const editingFileId = ref(null);
const imageBaseUrl = `${URL}/uploads`;
const dat = inject('dat');

const translitMap = {
    "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
    "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
    "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
    "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
    let translated = text.toLowerCase();
    for (const key in translitMap) {
        translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
    }
    return translated;
};

const Navigate = (id) => {
    router.push(`/companyFile-view/${id}`);
};

const onFileChange = (event) => {
    file.value = event.target.files[0];
};

const uploadCourt = async () => {
    const formData = new FormData();
    formData.append("name", courtName.value);
    formData.append("img", file.value);
    formData.append("sign", isSignable.value);

    try {
        await axios.post(`${URL}/enterprise`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        successMessage.value = "Court muvaffaqiyatli yuklandi!";
        errorMessage.value = "";
        resetForm();
        getData();
        showModal.value = false;
    } catch (error) {
        errorMessage.value = "Xatolik yuz berdi!";
    }
};

const updateFile = async () => {
    try {
        const formData = new FormData();
        formData.append("name", courtName.value);
        if (file.value) formData.append("img", file.value);
        formData.append("isSignable", isSignable.value);

        const response = await fetch(`${URL}/enterprise/${editingFileId.value}`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            showModalfile.value = false;
            resetForm();
            await getData();
            successMessage.value = "Fayl muvaffaqiyatli yangilandi!";
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        errorMessage.value = "Faylni yangilashda xatolik yuz berdi!";
    }
};

const removeSelectedItems = async () => {
    if (!selectedId.value) return;

    try {
        const response = await fetch(`${URL}/enterprise/${selectedId.value}`, { method: "DELETE" });
        if (response.ok) {
            showDeleteModal.value = false;
            showMenu.value = false;
            selectedId.value = null;
            await getData();
            successMessage.value = "Muvaffaqiyatli o'chirildi!";
        } else {
            throw new Error("Delete failed");
        }
    } catch (error) {
        errorMessage.value = "O'chirishda xatolik yuz berdi!";
        console.error("Xatolik:", error);
    }
};

function toggleModal() {
    showModal.value = !showModal.value;
    if (!showModal.value) resetForm();
}

function toggle(id) {
    editingFileId.value = id;
    showModalfile.value = !showModalfile.value;
    showMenu.value = false;

    if (id) {
        const item = data.value.find(item => item.id === id);
        if (item) {
            courtName.value = item.name;
            isSignable.value = item.isSignable || false;
        }
    } else {
        resetForm();
    }
}

function toggleDeleteModal(id) {
    selectedId.value = id;
    showDeleteModal.value = !showDeleteModal.value;
    if (!showDeleteModal.value) {
        selectedId.value = null;
        showMenu.value = false;
    }
}

function toggleMenu(id) {
    if (showMenu.value && selectedId.value === id) {
        showMenu.value = false;
    } else {
        selectedId.value = id;
        showMenu.value = true;
    }
}

function resetForm() {
    courtName.value = "";
    file.value = null;
    isSignable.value = false;
    successMessage.value = "";
    errorMessage.value = "";
}

const getData = async () => {
    try {
        const response = await fetch(`${URL}/enterprise`);
        if (response.ok) {
            const res = await response.json();
            const fileteradData = res.filter(item => item.status === "active");
            data.value = fileteradData
        }
    } catch (error) {
        console.error("Xatolik:", error);
    }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

getData();
</script>