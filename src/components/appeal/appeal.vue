<template>
  <div class="flex text-white flex-col items-center py-10">
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        {{ $t('interaktiv') }}
      </h1>
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <b 
          class="text-xl block font-extrabold sm:text-2xl text-blue-800 text-center mb-6">
          {{ $t('bolim') }}
        </b>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
            class="relative bg-white border-4 hover:bg-lime-500 duration-500 border-blue-800 rounded-lg p-[45px]">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ item.translatedName }}</h3>
            </div>
            <div
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
            class="relative bg-white border-4 hover:bg-lime-500 duration-500 border-blue-800 rounded-lg p-[45px]">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            </div>
            <div
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
import { URL } from "../../auth/url.js";

const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');
const imageBaseUrl = `${URL}/upload`;

import translateText from "@/auth/Translate";


const getData = async () => {
  try {
    const response = await fetch(`${URL}/appeal`);
    if (response.ok) {
      const result = await response.json();
      const activeItems = result.filter(item => item.status === 'active').sort((a, b) => a.id - b.id);
      datakril.value = activeItems.map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = activeItems;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  window.open(id);
};
onMounted(() => {
  getData();
});

</script>