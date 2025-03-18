<template>
  <div v-if="togle" class="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
    <div class="absolute flex flex-col items-center justify-center p-10 bg-gray-900 rounded-[15px] opacity-[90%]">
      <div class="file-upload-container">
        <div class="file-upload-area">
          <input type="text" class="w-full p-2 my-2 text-black rounded-[25px] bg-gray-200" :placeholder="$t('filename')"
            v-model="selectedName" />
          <input v-if="!isFolderCreation" type="file" id="fileInput" @change="handleFileChange" />
          <label v-if="!currentFolderId" class="flex items-center mt-4 text-white">
            <input type="checkbox" v-model="isFolderCreation" class="mr-2" :disabled="hasFilesAtRoot" />
            {{ $t('bolim_yaratish') }}
          </label>
          <div class="flex gap-5 mt-4">
            <button @click="back()" class="px-9 py-[10px] text-white bg-gray-600 rounded-[5px] hover:bg-gray-700">
              {{ $t('Bekor_qilish') }}
            </button>
            <button v-if="!isFolderCreation" @click="isEditing ? updateFile() : uploadFile()"
              class="px-9 py-[10px] text-white bg-[#2196f3] border-none rounded-[5px] cursor-pointer hover:bg-[#1e88e5]"
              :disabled="hasFoldersAtRoot && !currentFolderId">
              {{ $t('yuklash') }}
            </button>
            <button v-if="isFolderCreation" @click="isEditing ? updateFolder() : createFolder()"
              class="px-9 py-[10px] text-white bg-[#2196f3] border-none rounded-[5px] cursor-pointer hover:bg-[#1e88e5]"
              :disabled="hasFilesAtRoot">
              {{ isEditing ? $t('editModal.updateButton') : $t('bolim_yaratish') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="asd" class="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
    <div class="absolute flex flex-col items-center justify-center p-10 bg-gray-900 rounded-[15px] opacity-[90%]">
      <div class="flex justify-evenly w-[300px] mt-4">
        <button @click="removeSelectedItems"
          class="px-7 py-2 text-white duration-500 bg-teal-500 rounded-[25px] hover:bg-teal-600">
          {{ $t('remove') }}
        </button>
        <button @click="func(null)"
          class="px-6 py-2 text-white duration-500 bg-red-600 rounded-[25px] hover:bg-red-700">
          {{ $t('Bekor_qilish') }}
        </button>
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <button @click="promptForFolderOrFile" id="add"
      class="px-4 py-2 mr-6 text-[20px] text-white duration-500 bg-teal-500 rounded-[25px] hover:bg-teal-600">
      {{ $t('create') }}
    </button>
  </div>
  <div class="flex flex-col items-center justify-center mt-16 text-black">
    <div v-if="!isFolders" class="w-full max-w-[80rem] p-10 mb-16 bg-gray-300 rounded-[20px] shadow-2xl opacity-[98%]">
      <div v-for="(item, index) in ServiceData" :key="item.id" class="mb-1">
        <div @click="toggleFolder(item)"
          class="flex items-center justify-between h-[70px] p-2 mt-[14px] text-xl bg-white border-2 border-blue-700 rounded-[10px] shadow-2xl cursor-pointer hover:bg-lime-500 duration-300">
          <b class="w-[35px] text-[20px] text-black text-center">{{ index + 1 }}</b>
          <img :src="item.isFolder ? '/folder.png' : '/word.png'" width="25px" class="mr-5" alt="" />
          <h1 class="flex-1 text-black" @click.stop="item.isFolder ? null : goToCard(item.id)">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
          </h1>
          <div class="flex gap-2">
            <img @click.stop="editFile(item)" class="w-4 h-4 cursor-pointer" src="/pen.png" :alt="$t('tahrirlash')" />
            <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="/reject.png" :alt="$t('remove')" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full max-w-[80rem]">
      <div v-for="(item, index) in ServiceData" :key="item.id" class="mb-1">
        <div v-if="item.isFolder" class="flex mb-5 justify-center">
          <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
            class="text-black text-[20px] lg:text-[30px] xl:text-[40px] max-w-[9000px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
          </h1>
          <div class="-ml-5 mt-2">
            <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="/reject.png" :alt="$t('remove')" />
          </div>
        </div>
        <div v-if="item.isFolder"
          class="w-full max-w-[80rem] p-10 mb-16 bg-gray-300 rounded-[20px] shadow-2xl opacity-[98%]">
          <div v-if="!item.isFolder" @click="toggleFolder(item)"
            class="flex items-center justify-between h-[70px] p-2 mt-[14px] text-xl bg-white border-2 border-blue-700 rounded-[10px] shadow-2xl cursor-pointer hover:bg-lime-500 duration-300">
            <b class="w-[35px] text-[20px] text-black text-center">{{ index + 1 }}</b>
            <img :src="item.isFolder ? '/folder.png' : '/word.png'" width="25px" class="mr-5" alt="" />
            <h1 class="flex-1 text-black" @click.stop="item.isFolder ? null : goToCard(item.id)">
              {{ dat === 'datakril' ? translateText(item.name) : item.name }}
            </h1>
            <div class="flex gap-2">
              <img @click.stop="editFile(item)" class="w-4 h-4 cursor-pointer" src="/pen.png" :alt="$t('tahrirlash')" />
              <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="/reject.png" :alt="$t('remove')" />
            </div>
          </div>

          <div v-if="item.isFolder" class="mt-2 ml-10">
            <button @click="promptForFileInFolder(item.id)"
              class="px-3 py-1 mb-2 text-[16px] text-white duration-500 bg-blue-500 rounded-[25px] hover:bg-blue-600">
              {{ $t('create') }}
            </button>
            <div v-for="(file, fileIndex) in folderContents[item.id]" :key="file.id"
              class="flex items- my-1 justify-between items-center min-h-[50px] p-2 text-lg bg-white border border-blue-500 rounded-[10px] shadow-md cursor-pointer hover:bg-lime-500 duration-300">
              <b class="w-[35px] text-[18px] text-black text-center">{{ fileIndex + 1 }}</b>
              <img src="/word.png" width="20px" class="mr-5" alt="" />
              <h1 class="flex-1 text-black" @click="goToCard(file.id)">
                {{ dat === 'datakril' ? translateText(file.name) : file.name }}
              </h1>
              <div class="flex gap-2">
                <img @click.stop="editFile(file)" class="w-4 h-4 cursor-pointer" src="/pen.png"
                  :alt="$t('tahrirlash')" />
                <img @click.stop="func(file.id)" class="w-4 h-4 cursor-pointer" src="/reject.png" :alt="$t('remove')" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'; 
import { URL } from "../../../auth/url.js";
const { t } = useI18n();
const ServiceId = ref(null);
const ServiceData = ref([]);
const selectedFile = ref(null);
const selectedName = ref('');
const togle = ref(false);
const asd = ref(false);
const isEditing = ref(false);
const isFolderCreation = ref(false);
const editingFileId = ref(null);
const currentFolderId = ref(null);
const folderContents = ref({});
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));
const dat = inject('dat');

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const hasFilesAtRoot = computed(() => ServiceData.value.some(item => !item.isFolder));
const hasFoldersAtRoot = computed(() => ServiceData.value.some(item => item.isFolder));

const translateText = (text) => {
  if (!text) return '';
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};

onMounted(async () => {
  ServiceId.value = numericId.value;
  await getCourtsData();
  for (const item of ServiceData.value) {
    if (item.isFolder) {
      await getFolderContents(item.id);
    }
  }
});
const isFolders = ref(Boolean)
const getCourtsData = async () => {
  try {
    const response = await fetch(`${URL}/applications/${ServiceId.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    isFolders.value = data.isFolder
    ServiceData.value = [
      ...(data.files || []).map(item => ({ ...item, isFolder: false })),
      ...(data.folders || []).map(item => ({ ...item, isFolder: true })),
    ]
      .filter(item => item.status === 'active')
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    alert("Error fetching data!");
  }
};

const getFolderContents = async (folderId) => {
  try {
    const response = await fetch(`${URL}/folders/${folderId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    folderContents.value[folderId] = data.files.map(item => ({ ...item, isFolder: false })).filter(item => item.status === 'active');
  } catch (error) {
    console.error("Error fetching folder contents:", error.message);
    alert("Error fetching folder contents!");
  }
};

const toggleFolder = async (item) => {
  if (!item.isFolder) return;
  if (!folderContents.value[item.id]) {
    await getFolderContents(item.id);
  }
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const promptForFolderOrFile = () => {
  isFolderCreation.value = hasFilesAtRoot.value ? false : isFolderCreation.value;
  currentFolderId.value = null;
  selectedName.value = '';
  selectedFile.value = null;
  togle.value = true;
};

const promptForFileInFolder = (folderId) => {
  isFolderCreation.value = false;
  currentFolderId.value = folderId;
  selectedName.value = '';
  togle.value = true;
};

const createFolder = async () => {
  if (!selectedName.value.trim()) {
    alert("Iltimos nom kiriting!");
    return;
  }
  if (hasFilesAtRoot.value) {
    alert("file yaratib bo'lmadi, chunki fayllar ildiz darajasida allaqachon mavjud!");
    return;
  }

  try {
    const folderData = {
      name: selectedName.value,
      applicationsId: parseInt(ServiceId.value),
    };

    const response = await fetch(`${URL}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folderData),
    });

    if (!response.ok) throw new Error(await response.text());
    togle.value = false;
    isFolderCreation.value = false;
    selectedName.value = '';
    await getCourtsData();
    ("Folder successfully created!");
  } catch (error) {
    console.error("Folder creation error:", error);
    alert("Error creating folder!");
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !selectedName.value.trim()) {
    alert("Iltimos nom kiriting!");
    return;
  }
  if (hasFoldersAtRoot.value && !currentFolderId.value) {
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("name", selectedName.value);
  currentFolderId.value
    ? formData.append("folderId", String(currentFolderId.value))
    : formData.append("applicationsId", String(ServiceId.value));

  try {
    const response = await fetch(`${URL}/files`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    togle.value = false;
    selectedName.value = '';
    selectedFile.value = null;
    currentFolderId.value ? await getFolderContents(currentFolderId.value) : await getCourtsData();
  } catch (error) {
    console.error("File upload error:", error);
    alert("Error uploading file!");
  }
};

const editFile = (item) => {
  isEditing.value = true;
  editingFileId.value = item.id;
  selectedName.value = item.name;
  selectedFile.value = null;
  isFolderCreation.value = item.isFolder;
  currentFolderId.value = item.folderId || null;
  togle.value = true;
};

const updateFile = async () => {
  if (!selectedName.value.trim() || !editingFileId.value) {
    alert("Iltimos, nom kiriting va elementni tanlang!");
    return;
  }

  const formData = new FormData();
  formData.append("name", selectedName.value);
  if (selectedFile.value) formData.append("file", selectedFile.value);
  if (currentFolderId.value) {
    formData.append("folderId", String(currentFolderId.value));
  } else {
    formData.append("applicationsId", String(ServiceId.value));
  }

  try {
    const response = await fetch(`${URL}/files/${editingFileId.value}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    resetForm();
    currentFolderId.value ? await getFolderContents(currentFolderId.value) : await getCourtsData();
  } catch (error) {
    console.error("File update error:", error);
    alert("Error updating file!");
  }
};

const updateFolder = async () => {
  try {
    const folderData = {
      name: selectedName.value,
      applicationsId: parseInt(ServiceId.value),
    };

    const response = await fetch(`${URL}/folders/${editingFileId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folderData),
    });
    if (!response.ok) throw new Error(await response.text());
    resetForm();
    await getCourtsData();
  } catch (error) {
    console.error("Folder update error:", error);
    alert("Error updating folder!");
  }
};

const removeSelectedItems = async () => {
  try {
    const item = ServiceData.value.find(item => item.id === numericId.value) ||
      Object.values(folderContents.value).flat().find(file => file.id === numericId.value);
    const endpoint = item?.isFolder ? `${URL}/folders/${numericId.value}` : `${URL}/files/${numericId.value}`;
    const response = await fetch(endpoint, { method: "DELETE" });
    if (!response.ok) throw new Error(await response.text());
    asd.value = false;
    currentFolderId.value ? await getFolderContents(currentFolderId.value) : await getCourtsData();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting item!");
  }
};

const resetForm = () => {
  togle.value = false;
  isEditing.value = false;
  isFolderCreation.value = false;
  selectedName.value = '';
  selectedFile.value = null;
  editingFileId.value = null;
  currentFolderId.value = null;
};

const back = resetForm;

const func = (id) => {
  numericId.value = id;
  asd.value = id !== null;
};

const goToCard = (id) => {
  router.push(`/edit/${id}`);
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

input[type="file"] {
  margin: 10px 0;
  color: white;
}
</style>