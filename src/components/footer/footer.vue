<template>
  <div>
    <div class="w-full flex text-white justify-center flex-col p-10 items-center mt-10 bg-blue-700">
      <div class="my-16 gap-4 flex items-center justify-between xl:flex-row flex-col w-full">
        <div class="flex flex-col items-start">
          <div v-for="item in data" :key="item.id"
            class="my-1 w-[330px] sm:w-[430px] md:w-[530px] border-[3px] rounded-xl p-[10px]">
            <div class="flex items-center">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[50px] h-auto rounded-md mr-5" />
              <div>
                <b>{{ item.name }}</b>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center my-10 items-center">
          <ul>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li><a class="text-3xl" href="">offering</a></li>
          </ul>
        </div>
        <MapAdmin />
      </div>
      <div>
        <h1 class="lg:text-4xl sm:text-xl md:text-2xl text-center">
          Yurist consul consalting.uz sayti OAB sahifasida 2025-yil 15-fevral kuni O’zbekiston Respublikasi Prezidenti
          adminstratsiyasi huzuridagi axborot va ommaviy kommunikatsiyasi agentligidan No00 raqami bilan ro’yxatga
          olingan
          Materialdan foydalanilgan taqdirda Yurist consul consalting.uz saytiga havola qilish majburiydir
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MapAdmin from "./map.vue";
import { URL } from "../../auth/url";

import latinToCyrillic from "@/auth/Translate";

const rawData = ref([]);
const data = ref([]);
const dat = ref(localStorage.getItem('til') || 'latin');

const fetchData = async () => {
  try {
    const response = await fetch(`${URL}/connection`);
    if (response.ok) {
      rawData.value = await response.json();
      updateDisplayedData();
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const updateDisplayedData = () => {
  if (dat.value === "datakril") {
    data.value = rawData.value.map(item => ({
      ...item,
      name: latinToCyrillic(item.name),
      desc: latinToCyrillic(item.desc)
    }));
  } else {
    data.value = [...rawData.value];
  }
};

const getImageUrl = (filename) => `${URL}/upload/${filename}`;

onMounted(() => {
  fetchData();
});
</script>