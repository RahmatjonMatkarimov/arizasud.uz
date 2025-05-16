<template>
    <div class="animated-gradient">
      <div class="bg-black rounded-lg p-12 bg-opacity-15 container mx-auto">
        <div class="flex flex-col gap-2">
          <div @click="router.push({ path: '/salaryChange', query: { id: item.id, role:item.role } })" v-for="item in users" class="cardGradent" :key="item.id">
            <div class="flex items-center gap-4 p-2">
              <img :src="URL+'/upload/'+item.img" alt="" class="max-w-[100px] object-cover min-w-[100px] min-h-[100px] max-h-[100px] rounded-full">
              <h1 class="text-[18px]">{{ dat === 'datakril' ? translateText( `${item.name} ${item.surname} ${item.dadname}`) :  `${item.name} ${item.surname} ${item.dadname}` }}</h1>
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
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const dat = inject('dat')
const router = useRouter()
const users = ref([])

const getUsers = async () => {
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
      console.log("Server response:", error.response.data);
    }
  }
};
getUsers()
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

@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>