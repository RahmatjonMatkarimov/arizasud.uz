<template>
  <div class="flex my-10 justify-center items-center">
    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
      class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
      {{ dat === 'datakril' ? translateText("O'chirilgan elementlar") : "O'chirilgan elementlar" }}</h1>
  </div>

  <div class="flex gap-5 justify-center flex-wrap">
    <div v-for="item in sections" :key="item.path" @click="goToPath(item.path)"
      class="hover:bg-lime-500 duration-300 bg-white w-64 flex justify-center items-center border-4 border-blue-800 rounded-lg p-4 cursor-pointer">
      <h3 class="text-lg font-medium text-center text-black capitalize">{{ dat === 'datakril' ? translateText(item.title)
        : item.title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate';
import { inject, onUnmounted } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
const router = useRouter();
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
const sections = [
  { path: 'courts', title: '1-bolim' },
  { path: 'services', title: '2-bolim' },
  { path: 'applications', title: '3-bolim' },
  { path: 'admin', title: 'Adminlar' },
  { path: 'yurist', title: 'Yuristlar' },
  { path: 'manager', title: 'Devonxona Mudirlari' },
  { path: 'partners', title: 'Hamkorlar' },
  { path: 'appeal', title: 'Interaktif xizmatlar' },
  { path: 'files', title: 'Filelar' },
  { path: 'signingFiles', title: 'Imzolangan va imzolanmagan filelar' },
];

function goToPath(path) {
  router.push(`/archiveBody/${path}`);
}
</script>