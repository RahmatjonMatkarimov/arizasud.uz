<script setup>
import { ref, onMounted, computed, inject, onUnmounted } from 'vue';
import axios from 'axios';
import { URL1 } from '@/auth/url';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useSearchStore } from "@/components/Templates/searchQuary";
const searchStore = useSearchStore();
const data = ref([]);
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

const gotToPath = (id) => {
  router.push('/fileProfile/' + id);
};

const fetchData = async () => {
  try {
    const response = await axios.get(URL1 + '/commoners');
    console.log(response.data);
    data.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'd-MMMM, yyyy, HH:mm', { locale: uz });
};

const filteredData = computed(() => {
  if (!searchStore.query) return data.value;
  
  const query = searchStore.query.toLowerCase();
  return data.value.filter((item) => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.surname.toLowerCase().includes(query) ||
      item.uniqueCode.toLowerCase().includes(query)
    );
  });
});

import translateText from "@/auth/Translate";

onMounted(fetchData);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <!-- Header with Search -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 v-if="dat==='datalotin'" class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ dat==='datakril' ? translateText(`Foydalanuvchilar ro'yxati`):`Foydalanuvchilar ro'yxati` }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {{ filteredData.length }} {{ dat === `datakril`?  translateText(`ta foydalanuvchi`):`ta foydalanuvchi` }}
            </p>
          </div>

        </div>
      </div>

      <!-- Users List -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Empty State -->
        <div v-if="!filteredData.length" class="p-12 text-center">
          <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ dat === 'datakril' ? translateText(`Foydalanuvchi topilmadi`) : `Foydalanuvchi topilmadi` }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ dat === `datakril`?translateText(`Qidiruvga mos keladigan foydalanuvchi mavjud emas`):`Qidiruvga mos keladigan foydalanuvchi mavjud emas` }}
          </p>
        </div>

        <!-- Users List -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(item, index) in filteredData" 
            :key="index" 
            @click="gotToPath(item.id)"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Avatar -->
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {{ item.name?.charAt(0)?.toUpperCase() || '' }}
                </div>
                
                <!-- User Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 v-if="dat ==='datalotin'" class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ item.name }} {{ item.surname }}
                    </h3>
                    <h3 v-if="dat ==='datakril'" class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ translateText(item.name) }} {{ translateText(item.surname) }}
                    </h3>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {{ dat === 'datakril' ? translateText(item.uniqueCode) :item.uniqueCode}}
                    </span>
                  </div>
                  
                  <!-- Created Date -->
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>
                      {{ dat === 'datakril' ? translateText('Yaratilgan vaqti:'):'Yaratilgan vaqti:' }} <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatDate(item.createdAt) }}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Arrow Icon -->
              <div class="ml-4">
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Stats -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{{ dat === 'datakril' ?translateText(`Jami foydalanuvchilar`):`Jami foydalanuvchilar` }}: <span class="font-semibold text-gray-900 dark:text-white">{{ data.length }}</span></span>
          <span v-if="searchStore.query">{{dat === 'datakril' ?translateText(`Filtrlangan`):`Filtrlangan`}}: <span class="font-semibold text-gray-900 dark:text-white">{{ filteredData.length }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>