<template>
  <div class="w-full flex flex-col px-[15px] justify-center items-center mt-10">
    <div class="rounded-2xl w-full relative p-10 mb-16 overflow-hidden bg-gray-200">
      <div class="flex relative justify-center">
        <button @click="func()" class="bg-lime-500 md:text-[20px] rounded-lg py-2 absolute top-0 right-2 px-4">barchasini ko'rish</button>
        <b class="my-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">
          {{ $t('hamkor') }}
        </b>
      </div>

      <div class="flex justify-center flex-wrap gap-4 mx-auto">
        <div v-if="!asd" v-for="item in data" :key="item.id"
          class="bg-white border-[#223B9E] flex flex-col justify-start items-center gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2">
          <div class="flex justify-center items-center p-2 h-[160px]">
            <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="size-fit w-[150px]" />
          </div>
          <h3 class="text-lg mb-5 font-medium text-center text-black">{{ item.translatedName || item.name }}</h3>
          <div v-if="item.isActive"
            class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
            <b class="text-black font-bold text-[20px]">Tez orada</b>
          </div>
        </div>
      </div>
      <Carousel v-if="asd" :items-to-show="4" :autoplay="1500" :wrap-around="true" :breakpoints="breakpoints" class="p-[20px] w-full">
        <Slide v-for="item in currentData" :key="item.id" class="">
          <div
            class="bg-white border-[#223B9E] flex flex-col justify-start items-center gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2 mx-2">
            <div class="flex justify-center items-center p-2 h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
            </div>
            <h3 class="text-lg mb-5 font-medium text-center text-black">{{ item.translatedName || item.name }}</h3>
            <div v-if="item.isActive"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">Tez orada</b>
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

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) dat.value = currentLang;
};

onMounted(() => {
  getData();
  intervalId = setInterval(checkLanguageChange, 500);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
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