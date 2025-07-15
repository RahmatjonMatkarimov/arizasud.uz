<template>
  <div class="flex text-black dark:text-white flex-col items-center py-6 sm:py-10">
    <div class="flex flex-col items-center w-full mt-2 sm:mt-6 px-2 sm:px-4 lg:px-6">
      <h1 class="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-blue-800 dark:text-blue-300 mb-3 sm:mb-6 px-1">
        {{ $t('interaktiv') }}
      </h1>
      <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-lg p-3 sm:p-6 md:p-8 lg:p-10">
        <b class="text-base sm:text-xl md:text-2xl block font-extrabold text-blue-800 dark:text-blue-300 text-center mb-3 sm:mb-6">
          {{ $t('bolim') }}
        </b>
        <!-- Mobile Layout (1 column, flex row) -->
        <div class="block sm:hidden">
          <div class="space-y-3">
            <div v-for="item in dat === 'datakril' ? datakril : data" :key="item.id" @click="goToPath(item.id)"
              class="hover:bg-lime-500 dark:hover:bg-lime-600 relative duration-300 bg-white dark:bg-gray-700 border-2 border-blue-800 dark:border-blue-400 rounded-lg p-4 cursor-pointer transition-all active:scale-95 min-h-[120px] flex items-center">
              <div class="flex items-center w-full gap-3">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image"
                  class="h-[70px] w-[70px] object-cover rounded-md flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-bold text-black dark:text-white capitalize leading-tight">
                    {{ dat === 'datakril' ? item.translatedName : item.name }}
                  </h3>
                </div>
              </div>
              <div v-if="item.workStatus"
                class="bg-blue-200 dark:bg-blue-800 flex justify-center items-center animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
                <b class="text-black dark:text-white font-bold text-sm px-2 text-center">
                  {{ $t('tez_kunda') }}
                </b>
              </div>
            </div>
          </div>
        </div>
        <!-- Desktop Layout (2+ columns, grid) -->
        <div class="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          <div v-for="item in dat === 'datakril' ? datakril : data" :key="item.id" @click="goToPath(item.id)"
            class="hover:bg-lime-500 dark:hover:bg-lime-600 relative duration-500 active:duration-500 bg-white dark:bg-gray-700 border-2 sm:border-3 md:border-4 border-blue-800 dark:border-blue-400 rounded-lg p-2 sm:p-3 md:p-[10px] cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
            <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image"
                class="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px] w-full object-cover rounded-md" />
              <h3 class="text-sm sm:text-base md:text-lg my-2 sm:my-3 md:my-5 font-bold text-center text-black dark:text-white capitalize leading-tight px-1">
                {{ dat === 'datakril' ? item.translatedName : item.name }}
              </h3>
            </div>
            <div v-if="item.workStatus"
              class="bg-blue-200 dark:bg-blue-800 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black dark:text-white font-bold text-sm sm:text-base md:text-lg lg:text-[20px] px-2 text-center">
                {{ $t('tez_kunda') }}
              </b>
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