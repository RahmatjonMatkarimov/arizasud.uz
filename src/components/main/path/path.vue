<template>
  <Header />
  <div v-if="data.length == 0" class="text-black flex flex-col justify-center mt-16 items-center">
    <div
      class="rounded-[20px] xl:max-w-[80rem] w-full 2xl:max-w-[90rem] p-10 mb-16 opacity-[98%] shadow-2xl bg-gray-300 ">
      <div v-if="dat == 'datakril'" v-for="(item, index) in ServiceData" :key="item.id"
        class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
        <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
        <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
        <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ translateText(item.fileName) }}</h1>
      </div>
      <div v-if="dat == 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
        class="flex items-center min-h-[70px] md:text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
        <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
        <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
        <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ item.fileName }}</h1>
      </div>
    </div>
  </div>
  <div v-if="data.length" class="flex flex-col items-center py-10">
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in data" :key="item.id" @click="goToPath(item)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-[45px]">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="md:text-lg font-medium text-center text-black capitalize">{{ translateText(item.name) }}</h3>
            </div>
            <div v-if="item.workStatus"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-[45px]">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="md:text-lg font-medium text-center text-black capitalize">{{ item.name }}</h3>
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
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../../auth/url.js";
import Header from "@/components/Others/header.vue";

const dat = ref(localStorage.getItem('til') || 'datalotin');
const router = useRouter();
const route = useRoute();
const id = route.params.id;
const data = ref([]);
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
import translateText from "@/auth/Translate";

const ServiceData = ref([]);

const getData = async () => {
  try {
    const response = await fetch(`${url}/${id}`);
    if (response.ok) {
      const result = await response.json();
      data.value = (result.services || [])
        .sort((a, b) => a.id - b.id)
        .filter(item => item.status === "active");
      ServiceData.value = result.files || [];
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (item) => {
  if (!item.workStatus) { // Only navigate if workStatus is false or undefined
    router.push(`/aplications/${item.id}`);
  }
};

const goToCard = (id) => {
  router.push(`/card/${id}`);
};

onMounted(() => {
  getData();
});

</script>