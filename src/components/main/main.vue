<template>
  <div class="flex relative text-white w-full flex-col items-center pb-10">
    <div class="w-full h-[360px] absolute -top-24 bg-blue-100"></div>
    <div class="flex flex-col items-center w-full mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl relative font-bold text-center text-blue-800 mb-6">
        {{ $t('murojaat') }}
      </h1>
      <div class="w-full rounded-lg p-6 sm:p-10">
        <b 
          class="text-xl sm:text-2xl block relative font-extrabold text-blue-800 text-center mb-6">
          {{ $t('sud') }}
        </b>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in data" :key="item.id" @click="goToPath(item)"
            class="hover:bg-lime-500 relative duration-500 active:duration-500 bg-white border-4 border-blue-800 rounded-lg p-[45px]">
            <div class="flex items-center justify-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 v-if="dat === 'datalotin'" class="md:text-lg font-bold text-center text-black capitalize">{{
                item.name }}</h3>
              <h3 v-if="dat === 'datakril'" class="md:text-lg font-bold text-center text-black capitalize">{{
                translateText(item.name) }}</h3>
            </div>
            <div v-if="item.workStatus"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { URL } from "../../auth/url.js";

const router = useRouter();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');

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

const getData = async () => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      const activeItems = result.filter(item => item.status === "active");
      datakril.value = activeItems
        .sort((a, b) => a.id - b.id)
        .map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = activeItems;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (item) => {
  if (!item.workStatus) { // Only navigate if workStatus is false or undefined
    router.push(`/path/${item.id}`);
  }
};

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  getData();
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>