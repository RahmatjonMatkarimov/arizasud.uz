<template>
  <div class="dark:bg-[#1a2642] bg-gray-300 pt-6">
    <div class="p-6 mx-auto">
      <div class="flex flex-col gap-2">
        <div 
          @click="router.push({ path: '/salaryChange', query: { id: item.id, role: item.role } })" 
          v-for="(item, index) in users" 
          class="card-item dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl bg-white opacity-0 translate-y-12" 
          :key="item.id"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <div class="flex items-center justify-between gap-4 px-4 py-2">
            <div class="flex items-center gap-4">
              <div>
                <img :src="URL+'/upload/'+item.img" alt="" class="max-w-[70px] object-cover min-w-[70px] min-h-[70px] max-h-[70px] rounded-full">
              </div>
              <div>
                <h1 class="text-black dark:text-white text-[18px]">{{ dat === 'datakril' ? translateText( `${item.name} ${item.surname} ${item.dadname}`) :  `${item.name} ${item.surname} ${item.dadname}` }}</h1>
                <p class=" text-white/50">{{ item.lavozimi }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <h1 class="text-black dark:text-white text-[18px]">{{ dat === 'datakril' ? translateText('Ish boshlagan vaqti') : 'Ish boshlagan vaqti' }}</h1>
              <h1 class="text-black dark:text-white text-[18px]">{{ filteridTime(item.createdAt) }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import translateText from '@/auth/Translate';
import { URL } from '@/auth/url.js';
import axios from 'axios';
import { inject, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
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
const router = useRouter()
const users = ref([])
const isLoading = inject('isLoading')

const filteridTime = (date) => {
  let years = date.slice(0, 4)
  let month = date.slice(5, 7)
  let day = date.slice(8, 10)
  return `${day}.${month}.${years}`
}

const getUsers = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/deliverer/allUsers`);
    const filteredUsers = [];
    response.data.forEach(user => {
      if (user.role !== "bigAdmin") {
        filteredUsers.push(user);
      }
    });
    users.value = filteredUsers;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    if (error.response?.data) {
      console.error("Server response:", error.response.data);
    }
  } finally{
    isLoading.value = false
  }
};

const animateCards = () => {
  const cards = document.querySelectorAll('.card-item');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('card-animate');
    }, index * 100); // 100ms delay between each card
  });
};

onMounted(() => {
  getUsers();
});
</script>

<style scoped>
.animated-gradient {
  background: linear-gradient(45deg, #1a3c34, #4a5568, #2f855a, #2d3748);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 1.75rem;
  min-height: 100vh;
}

.cardGradent {
  background: linear-gradient(45deg, #007d60, #004131, #00b58b, #004131);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.card-item {
  animation: slideUpFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slideUpFromBottom {
  0% {
    opacity: 0;
    transform: translateY(80px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>