<template>
  <div class="w-full flex flex-col px-2 sm:px-4 justify-center items-center mt-6 sm:mt-10">
    <div class="rounded-2xl w-full relative p-3 sm:p-6 md:p-10 mb-10 sm:mb-16 overflow-hidden bg-gray-200 dark:bg-gray-800">
      <div class="flex relative justify-center">
        <button @click="func()" class="bg-lime-500 md:text-[20px] rounded-lg py-2 absolute top-0 right-2 px-4">barchasini ko'rish</button>
        <b class="my-6 sm:my-10 block text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase text-[#223B9E] dark:text-blue-300">
          {{ $t('hamkor') }}
        </b>
      </div>

      <!-- Flex layout for all cards (not carousel) -->
      <div class="flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 mx-auto" v-if="!asd">
        <div v-for="item in data" :key="item.id"
          class="bg-white dark:bg-gray-700 border-2 sm:border-3 md:border-4 border-[#223B9E] dark:border-blue-400 flex flex-col justify-start items-center gap-2 border-solid break-words w-72 min-h-full rounded-xl relative hover:-translate-y-2 duration-300 hover:shadow-lg p-2 sm:p-3 md:p-4 cursor-pointer transition-all">
          <div class="flex justify-center items-center p-2 h-[120px] sm:h-[160px]">
            <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="object-cover rounded-md w-[90px] sm:w-[120px] md:w-[150px] h-[90px] sm:h-[120px] md:h-[150px]" />
          </div>
          <h3 class="text-base sm:text-lg md:text-xl mb-3 sm:mb-5 font-bold text-center text-black dark:text-white capitalize leading-tight px-1">{{ item.translatedName || item.name }}</h3>
          <div v-if="item.isActive"
            class="bg-blue-200 dark:bg-blue-800 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
            <b class="text-black dark:text-white font-bold text-sm sm:text-base md:text-lg lg:text-[20px] px-2 text-center">Tez orada</b>
          </div>
        </div>
      </div>
      <!-- Carousel layout for all cards -->
      <Carousel v-if="asd" :items-to-show="4" :autoplay="1500" :wrap-around="true" :breakpoints="breakpoints" class="p-2 sm:p-4 md:p-[20px] w-full">
        <Slide v-for="item in currentData" :key="item.id">
          <div
            class="bg-white dark:bg-gray-700 border-2 sm:border-3 md:border-4 border-[#223B9E] dark:border-blue-400 flex flex-col justify-start items-center gap-2 border-solid break-words w-[400px] min-h-full rounded-xl relative hover:-translate-y-2 duration-300 hover:shadow-lg p-2 sm:p-3 md:p-4 cursor-pointer transition-all mx-2">
            <div class="flex justify-center items-center p-2 h-[120px] sm:h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="object-cover rounded-md w-[90px] sm:w-[120px] md:w-[150px] h-[90px] sm:h-[120px] md:h-[150px]" />
            </div>
            <h3 class="text-base sm:text-lg md:text-xl mb-3 sm:mb-5 font-bold text-center text-black dark:text-white capitalize leading-tight px-1">{{ item.translatedName || item.name }}</h3>
            <div v-if="item.isActive"
              class="bg-blue-200 dark:bg-blue-800 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black dark:text-white font-bold text-sm sm:text-base md:text-lg lg:text-[20px] px-2 text-center">Tez orada</b>
            </div>
          </div>
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css"; // 🔹 Stil qo'shish
import { URL } from "../../auth/url";
import translateText from "@/auth/Translate";

const isLoading = inject('isLoading');
const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');
const imageBaseUrl = `${URL}/upload`;
const asd = ref(true);

// Define responsive breakpoints for the carousel
const breakpoints = {
  // For screens smaller than 640px (mobile), show 1 item
  0: {
    itemsToShow: 1,
    snapAlign: 'center',
  },
  // For screens between 640px and 1024px (tablet), show 2 items
  640: {
    itemsToShow: 2,
    snapAlign: 'center',
  },
  // For screens 1024px and larger (desktop), show 4 items
  1024: {
    itemsToShow: 4,
    snapAlign: 'center',
  },
};

function func() {
  asd.value = !asd.value;
}

const getData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      const sortedItems = result.sort((a, b) => a.id - b.id);
      datakril.value = sortedItems
        .filter(item => item.status === "active")
        .map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = sortedItems.filter(item => item.status === "active");
    }
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const currentData = computed(() => (dat.value === "datakril" ? datakril.value : data.value));

onMounted(() => {
  getData();
});

</script>

<style scoped>
::v-deep(.carousel__viewport) {
  overflow: visible !important;
}

::v-deep(.carousel__track) {
  overflow: visible !important;
}
</style>