<template>
  <Header />
  <div class="flex flex-col items-center justify-center mt-16 text-black">
    <div v-if="!isFolders" class="w-full max-w-[80rem] p-10 mb-16 bg-gray-300 rounded-[20px] shadow-2xl opacity-[98%]">
      <div v-for="(item, index) in ServiceData" :key="item.id" class="mb-1">
        <div
          class="flex items-center justify-between h-[70px] p-2 mt-[14px] text-xl bg-white border-2 border-blue-700 rounded-[10px] shadow-2xl cursor-pointer hover:bg-lime-500 duration-300"
          @click="item.isFolder ? toggleFolder(item) : goToCard(item.id)">
          <b class="w-[35px] text-[20px] text-black text-center">{{ index + 1 }}</b>
          <img :src="item.isFolder ? '/folder.png' : '/word.png'" width="25px" class="mr-5" :alt="$t('file')" />
          <h1 class="flex-1 text-black">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
          </h1>
        </div>
      </div>
    </div>

    <div class="w-full max-w-[80rem]">
      <div v-for="(item, index) in ServiceData" :key="item.id" class="mb-1">
        <div v-if="item.isFolder" class="flex mb-5 justify-center">
          <h1 style="text-shadow: 0 0 5px #fff, 0 0 10px #fff;"
            class="text-black text-[20px] lg:text-[30px] xl:text-[40px] max-w-[9000px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
            {{ item.name }}
          </h1>
        </div>
        <div v-if="item.isFolder"
          class="w-full max-w-[80rem] p-10 mb-16 bg-gray-300 rounded-[20px] shadow-2xl opacity-[98%]">
          <div class="mt-2 ml-10">
            <div v-for="(file, fileIndex) in folderContents[item.id]" :key="file.id"
              class="flex items-center justify-between my-1 min-h-[50px] p-6 text-lg bg-white border border-blue-500 rounded-[10px] shadow-md cursor-pointer hover:bg-lime-500 duration-300"
              @click="goToCard(file.id)">
              <b class="w-[35px] text-[18px] text-black text-center">{{ fileIndex + 1 }}</b>
              <img src="/word.png" width="20px" class="mr-5" :alt="$t('word')" />
              <h1 class="flex-1 text-black">
                {{ dat === 'datakril' ? translateText(file.name) : file.name }}
              </h1>
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
import { useI18n } from 'vue-i18n'; 
import Header from "../../header.vue";
import { URL } from "../../../auth/url.js";
const { t } = useI18n();
const ServiceId = ref(null);
const ServiceData = ref([]);
const folderContents = ref({});
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));


const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return "";
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};

const isFolders = ref(Boolean);

onMounted(async () => {
  ServiceId.value = numericId.value;
  await getCourtsData();
  for (const item of ServiceData.value) {
    if (item.isFolder) {
      await getFolderContents(item.id);
    }
  }
});

const getCourtsData = async () => {
  try {
    const response = await fetch(`${URL}/applications/${ServiceId.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    isFolders.value = data.isFolder;
    ServiceData.value = [
      ...(data.files || []).map((item) => ({ ...item, isFolder: false })),
      ...(data.folders || []).map((item) => ({ ...item, isFolder: true })),
    ]
      .filter((item) => item.status === "active")
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const getFolderContents = async (folderId) => {
  try {
    const response = await fetch(`${URL}/folders/${folderId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    folderContents.value[folderId] = data.files.map((item) => ({ ...item, isFolder: false })).filter(item => item.status === 'active');
  } catch (error) {
    console.error("Error fetching folder contents:", error.message);
  }
};

const toggleFolder = async (item) => {
  if (!item.isFolder) return;
  if (!folderContents.value[item.id]) {
    await getFolderContents(item.id);
  }
};
const dat = ref(localStorage.getItem('til') || 'datalotin');
let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
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
const goToCard = (id) => {
  router.push(`/edit/${id}`);
};
</script>