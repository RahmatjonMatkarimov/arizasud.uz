<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { URL1 } from '@/auth/url';
import { useRouter } from 'vue-router';

const data = ref([]);
const router = useRouter();

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

onMounted(fetchData);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <h1 class="text-xl font-semibold text-gray-800 p-4 bg-gray-50 border-b">
        Foydalanuvchilar
      </h1>
      
      <ul class="divide-y divide-gray-200">
        <li 
          v-for="(item, index) in data" 
          :key="index" 
          @click="gotToPath(item.id)"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
        >
          <span class="text-gray-700">{{ item.name }}</span>
          <span class="text-gray-400 text-sm">→</span>
        </li>
      </ul>

      <div v-if="!data.length" class="p-4 text-gray-500 text-center">
        Foydalanuvchilar mavjud emas
      </div>
    </div>
  </div>
</template>