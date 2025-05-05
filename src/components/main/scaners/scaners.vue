<template>
    <h1 class="text-2xl sm:text-4xl mt-10 font-bold text-center text-blue-800 mb-6">
        {{ $t('nusxa_olish') }}
    </h1>
    <div class="bg-gray-200 rounded-lg p-10 mx-[15px]">
        <div class="flex  justify-center ">
            <b class="text-xl w-[950px] sm:text-2xl block font-extrabold text-blue-800 text-center mb-6">
                {{ $t('nusxa') }}
            </b>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="scanner in scanners" :key="scanner.id"
                class="scanner-card relative flex border-4 border-blue-800 rounded-lg hover:bg-lime-500 bg-white p-[45px] items-center gap-5 text-center shadow-md hover:shadow-lg transition">
                <img v-if="scanner.img" :src="URL + scanner.img" alt="Scanner image"
                    class="scanner-image w-16 h-16 object-cover" />
                <h3 v-if="dat === 'datalotin'" class="text-lg font-semibold text-gray-800 mb-2">{{ scanner.name }}</h3>
                <h3 v-if="dat === 'datakril'" class="text-lg font-semibold text-gray-800 mb-2">{{
                    translateText(scanner.name) }}</h3>
                <div v-if="scanner.isActive"
                    class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
                    <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';

let intervalId = null;
const scanners = ref([]);
const API_URL = URL + '/scanners';
const dat = ref(localStorage.getItem('til') || 'datalotin');
const checkLanguageChange = () => {
    const currentLang = localStorage.getItem('til') || 'datalotin';
    if (currentLang !== dat.value) {
        dat.value = currentLang;
    }
};

const fetchScanners = async () => {
    try {
        const response = await axios.get(API_URL);
        scanners.value = response.data;
    } catch (error) {
        console.error('Error fetching scanners:', error);
    }
};

onMounted(() => {
    fetchScanners()
    intervalId = setInterval(checkLanguageChange, 0);
})
onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped></style>