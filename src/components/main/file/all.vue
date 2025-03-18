<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import axios from 'axios';
import { URL1 } from '@/auth/url';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

const data = ref([]);
const searchQuery = ref('');
const router = useRouter();
const dat = inject('dat');


const gotToPath = (id) => {
  router.push('/fileProfile/' + id);
};

const fetchData = async () => {
  try {
    const response = await axios.get(URL1 + '/commoners');
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
  if (!searchQuery.value) return data.value;

  const query = searchQuery.value.toLowerCase();
  return data.value.filter((item) => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.surname.toLowerCase().includes(query) ||
      item.uniqueCode.toLowerCase().includes(query)
    );
  });
});
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return '';
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};
onMounted(fetchData);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-end">
      <input v-model="searchQuery" type="text" :placeholder="$t('qidiruv')"
        class="mb-4 border-2 p-2 rounded-lg text-black " />
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <h1 v-if="dat==='datalotin'" class="text-xl font-semibold text-gray-800 p-4 bg-gray-50 border-b">
        Foydalanuvchilar roʻyxati
      </h1>
      <h1 v-if="dat==='datakril'" class="text-xl font-semibold text-gray-800 p-4 bg-gray-50 border-b">
        {{translateText('Foydalanuvchilar roʻyxati')}}
      </h1>
      <ul class="divide-y divide-gray-200">
        <li v-for="(item, index) in filteredData" :key="index" @click="gotToPath(item.id)"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between">
          <span v-if="dat ==='datalotin'" class="text-gray-700">{{ item.name }} {{ item.surname }} {{ item.uniqueCode }}</span>
          <span v-if="dat ==='datakril'" class="text-gray-700">{{ translateText(item.name) }} {{ translateText(item.surname) }} {{ translateText(item.uniqueCode) }}</span>
          <span v-if="dat === 'datalotin'" class="text-gray-400 text-sm">
            Yaratilgan vaqti: <b class="text-red-700">{{ formatDate(item.createdAt) }}</b>
          </span>
          <span v-if="dat === 'datakril'" class="text-gray-400 text-sm">
            {{ translateText('Yaratilgan vaqti:') }} <b class="text-red-700">{{ translateText(formatDate(item.createdAt))
              }}</b>
          </span>
        </li>
      </ul>

      <div v-if="!filteredData.length" class="p-4 text-gray-500 text-center">
        Foydalanuvchilar mavjud emas yoki qidiruvga mos keladigan natija topilmadi
      </div>
    </div>
  </div>
</template>