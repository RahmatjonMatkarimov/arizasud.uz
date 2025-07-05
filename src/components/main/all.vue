<script setup>
import { ref, inject, onMounted, computed, onUnmounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faBuilding, faUserTie, faUserPlus, faFileAlt, faListAlt, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import translateText from '@/auth/Translate'

library.add(faUsers, faBuilding, faUserTie, faUserPlus, faFileAlt, faListAlt, faCopy)

import { useRouter } from 'vue-router'
import axios from 'axios'
import { URL } from '@/auth/url'
const router = useRouter()
const dat = ref(localStorage.getItem("til") || "datalotin");
const id = localStorage.getItem("id");
const newId = parseInt(id);
const data = ref({});


const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[response.data.permissions.length - 1];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};


const cards = ref([
    {
        title: 'Sud hujjatlarini yozish',
        icon: faFileAlt, // Tanlangan icon
        bgColor1: '#4F46E5',
        bgColor: '#4F46E530',
        iconColor: '#ffffff',
        routerLink: '/admin',
        condition: true
    },
    {
        title: 'Interaktiv xizmatlar roʻyxati',
        icon: faListAlt, // Tanlangan icon
        bgColor1: '#10B981',
        bgColor: '#10B98130',
        iconColor: '#ffffff',
        routerLink: '/appealAdmin',
        condition: true
    },
    {
        title: 'Tizimni nusxalash xizmatlari',
        icon: faCopy, // Tanlangan icon
        bgColor1: '#F59E0B',
        bgColor: '#F59E0B30',
        iconColor: '#ffffff',
        routerLink: '/scanersAdmin',
        condition: true
    },
    {
        title: 'Hamkorlar roʻyxati',
        icon: faUserPlus, // Tanlangan icon
        bgColor1: '#14B8A6',
        bgColor: '#14B8A630',
        iconColor: '#ffffff',
        routerLink: '/partners',
        condition: true
    }
])
const filteredMenu = computed(() => {
  return cards.value.filter(item =>
    typeof item.condition === "function" ? item.condition() : item.condition
  );
});

onMounted(fetchAdminData);
</script>

<template>
    <div class="dark:bg-gray-800 dark:text-gray-200/70 min-h-screen bg-gray-200">
        <div class="mx-auto p-4">
                        <div class="flex justify-center pt-4 items-center">
                <h1
                    class=" text-[40px] font-bold text-center bg-gradient-to-r from-blue-800/50 to-purple-500/50 text-white border-2 mb-4 border-white rounded-lg py-2 px-[100px]">
                        {{ dat === 'datakril' ? translateText('Sud hujjatlari bo\'limi') : 'Sud hujjatlari bo\'limi' }}
                </h1>
            </div>

            <!-- Cards Grid -->
            <div class=" mx-auto grid grid-cols-3 gap-6 p-4">
                <div 
                    v-for="(card, index) in filteredMenu" 
                    :key="index" 
                    class="rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                    @click="router.push(`${card.routerLink}`)"
                    :style="{ 
                        backgroundColor: card.bgColor,
                        '--border-color': card.bgColor1 
                    }"
                >
                    <div class="relative z-10 flex flex-col h-full">
                        <!-- Icon Container -->
                        <div 
                            class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-black/30"
                            :style="{ backgroundColor: card.bgColor1 }"
                        >
                            <font-awesome-icon :icon="card.icon" class="text-4xl text-white" />
                        </div>
                        
                        <!-- Title -->
                        <h3 class="text-xl font-semibold mb-3 leading-snug">
                            {{ dat === 'datakril' ? translateText(card.title) : card.title }}
                        </h3>
                    </div>
                    <!-- Bottom border animation -->
                    <div class="absolute bottom-0 left-0 w-0 h-1 transition-all duration-400 group-hover:w-full" :style="{ backgroundColor: card.bgColor1 }"></div>
                </div>
            </div>
        </div>
    </div>
</template>