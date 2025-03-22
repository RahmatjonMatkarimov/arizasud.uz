<template>
  <div>
    <div class="w-full flex flex-col px-[15px] justify-center items-center mt-10">
      <div class="rounded-2xl w-full p-10 mb-16 bg-gray-200">
        <div class="flex justify-center">
          <b class="mb-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">{{
            $t('hamkor') }}</b>
        </div>
        <div class="flex justify-center flex-wrap gap-4 mx-auto">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
            class="bg-white border-[#223B9E] flex flex-col justify-start items-center gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2  ">
            <div class="flex justify-center items-center p-2 h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="size-fit w-[150px]" />
            </div>
            <h3 class="text-lg mb-5 font-medium text-center text-black">{{ item.translatedName }}</h3>

            <div v-if="item.isActive"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
            class="bg-white border-[#223B9E] flex flex-col justify-start items-center  gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2 ">
            <div class="flex justify-center items-center p-2 h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="size-fit w-[150px]" />
            </div>
            <h3 class="text-lg mb-5 font-medium text-center text-black">{{ item.name }}</h3>

            <div v-if="item.isActive"
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
import { ref, onMounted, onUnmounted, inject } from "vue";
import { URL } from "../../auth/url";
import translateText from "@/auth/Translate";

const isLoading = inject('isLoading');
const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');
const imageBaseUrl = `${URL}/upload`;


const getData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      const sortedItems = result.sort((a, b) => a.id - b.id);
      datakril.value = sortedItems
        .filter((item) => item.status === "active")
        .map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = sortedItems.filter((item) => item.status === "active").sort((a, b) => a.id - b.id);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

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

<style scoped></style>