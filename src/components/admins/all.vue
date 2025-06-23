<script setup>
import { ref, inject, onMounted, computed, onUnmounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faBuilding, faUserTie, faUserPlus, faFileText, faTruck, faCalculator } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import translateText from '@/auth/Translate'
library.add(faUsers, faBuilding, faUserTie, faUserPlus, faFileText, faTruck, faCalculator)

import { useRouter } from 'vue-router'
import axios from 'axios'
import { URL } from '@/auth/url'
import { Icon } from '@iconify/vue'
const router = useRouter()
const dat = ref(localStorage.getItem("til") || "datalotin");
const isLoading = inject('isLoading')
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
const id = parseInt(localStorage.getItem("id"));
const newId = parseInt(id);
const data = ref({});

const fetchAdminData = async () => {
    isLoading.value = true
    try {
        const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        data.value = response.data.permissions[response.data.permissions.length - 1];
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    } finally { 
        isLoading.value = false
    }
};

const cards = ref([
  {
    title: "Barcha Ishchilar Ro'yxati",
    description: "Tizimda ro'yxatdan o'tgan barcha hodimlarni ko'rish",
    icon: "mdi:account-group", // jamoa
    bgColor1: "#3B82F6",       // ko‘k
    bgColor: "#3B82F620",
    routerLink: "/all",
    condition: true,
  },
  {
    title: "Hujjatni Yaratuvchi Devonxona Mudiri",
    description: "Rasmiy hujjatlar va devonxona boshqaruvi",
    icon: "mdi:office-building", // devonxona
    bgColor1: "#10B981",         // yashil
    bgColor: "#10B98120",
    routerLink: "/operators",
    condition: () => data.value?.call_centres,
  },
  {
    title: "Yurist-Ekspert Yaratish Bo'limi",
    description: "Huquqiy masalalar va ekspert xulosalari",
    icon: "mdi:scale-balance",   // yurist
    bgColor1: "#F59E0B",         // to'q sariq
    bgColor: "#F59E0B20",
    routerLink: "/yurists",
    condition: () => data.value?.yurists,
  },
  {
    title: "Ishchi Hodimlarni Yaratish (Admin Yaratish)",
    description: "Yangi hodimlar qo'shish va admin huquqlari berish",
    icon: "mdi:account-plus-outline", // admin yaratish
    bgColor1: "#8B5CF6",              // binafsha
    bgColor: "#8B5CF620",
    routerLink: "/admins",
    condition: () => data.value?.admins,
  },
  {
    title: "Yurist Yordamchisini Yaratish Bo'limi",
    description: "Yurist yordamchilari va legal support",
    icon: "mdi:account-tie",         // yordamchi
    bgColor1: "#EC4899",            // pushti
    bgColor: "#EC489920",
    routerLink: "/asinstant",
    condition: () => data.value?.admins,
  },
  {
    title: "Kuryer Yaratish Bo'limi",
    description: "Kuryer xizmatlari va yetkazib berish",
    icon: "mdi:truck-fast-outline", // kuryer
    bgColor1: "#F97316",            // och to'q sariq
    bgColor: "#F9731620",
    routerLink: "/deliverer",
    condition: () => data.value?.admins,
  },
  {
    title: "Bugalter Yaratish Bo'limi",
    description: "Moliyaviy hisobotlar va buxgalteriya",
    icon: "mdi:calculator-variant-outline", // buxgalteriya
    bgColor1: "#0EA5E9",                   // moviy
    bgColor: "#0EA5E920",
    routerLink: "/bugalter",
    condition: () => data.value?.admins,
  },
  {
    title: "Ombor mudiri Bo'limi",
    description: "Omborlar va zaxiralarni boshqarish",
    icon: "mdi:warehouse",           // ombor
    bgColor1: "#A855F7",            // binafsha (farqli)
    bgColor: "#A855F720",
    routerLink: "/mudir",
    condition: () => data.value?.admins,
  },
]);


const filteredMenu = computed(() => {
    return cards.value.filter(item =>
        typeof item.condition === "function" ? item.condition() : item.condition
    );
});

onMounted(fetchAdminData);
</script>

<template>
    <div class="dark:bg-gray-800 dark:text-gray-200/70 min-h-screen bg-gray-200">
        <div class="mx-auto mb-4 p-4">
            <div class="flex justify-center pt-4 items-center">
                <h1
                    class=" text-[40px] font-bold text-center bg-gradient-to-r from-blue-800/50 to-purple-500/50 text-white border-2 mb-4 border-white rounded-lg py-2 px-[100px]">
                    {{ dat === 'datakril' ? translateText('Ishchi hodimlar bo\'limi') : 'Ishchi hodimlar bo\'limi' }}
                </h1>
            </div>

            <!-- Cards Grid -->
            <div class=" mx-auto grid grid-cols-3 gap-6 p-4">
                <div v-for="(card, index) in filteredMenu" :key="index"
                    class="rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                    @click="router.push(`${card.routerLink}`)" :style="{
                        backgroundColor: card.bgColor,
                        '--border-color': card.bgColor1
                    }">
                    <div class="relative z-10 flex flex-col h-full">
                        <!-- Icon Container -->
                        <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-black/30"
                            :style="{ backgroundColor: card.bgColor1 }">
                            <Icon :icon="card.icon" class="text-4xl text-white" />
                        </div>

                        <!-- Title -->
                        <h3 class="text-xl font-semibold mb-3 leading-snug">
                            {{ dat === 'datakril' ? translateText(card.title) : card.title }}
                        </h3>
                    </div>
                    <!-- Bottom border animation -->
                    <div class="absolute bottom-0 left-0 w-0 h-1 transition-all duration-400 group-hover:w-full"
                        :style="{ backgroundColor: card.bgColor1 }"></div>
                </div>
            </div>
        </div>
    </div>
</template>