<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faBuilding, faUserTie, faUserPlus, faFileAlt, faClipboardList, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import translateText from '@/auth/Translate'

library.add(faUsers, faBuilding, faUserTie, faUserPlus, faFileAlt, faClipboardList, faDollarSign)

import { useRouter } from 'vue-router'
import axios from 'axios'
import { URL } from '@/auth/url'
const router = useRouter()
const dat = inject('dat')
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
        title: 'Mijozlar bilan shartnoma tuzish',
        icon: faUserPlus, // Tanlangan icon
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconColor: '#ffffff',
        routerLink: '/FileAdmin',
        condition: true
    },
    {
        title: 'Mijozlar bilan tuzilgan shartnomalar',
        icon: faClipboardList, // Tanlangan icon
        bgColor: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
        iconColor: '#ffffff',
        routerLink: '/CliendList',
        condition: true
    },
    {
        title: 'Lex.uz va QR-code xizmati uchun BXMni tahrirlash',
        icon: faDollarSign, // Tanlangan icon
        bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        iconColor: '#ffffff',
        routerLink: '/Sum',
        condition: true
    },
])

const filteredMenu = computed(() => {
  return cards.value.filter(item =>
    typeof item.condition === "function" ? item.condition() : item.condition
  );
});

onMounted(fetchAdminData);
</script>

<template>
    <div class="flex justify-center mt-8 items-center">
        <h1
            class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
            {{ dat === 'datakril' ? translateText('Shartnoma tushish bo\'limi') : 'Shartnoma tushish bo\'limi' }}
        </h1>
    </div>
    <div class="app-container">
        <div class="cards-container">
            <div v-for="(card, index) in filteredMenu" :key="index" class="card" @click="router.push(`${card.routerLink}`)"
                :style="{ background: card.bgColor }">
                <div class="card-content">
                    <font-awesome-icon :icon="card.icon" class="card-icon" :style="{ color: card.iconColor }" />
                    <h3 class="card-title">{{ dat === 'datakril' ? translateText(card.title) : card.title }}</h3>
                </div>
                <div class="card-overlay"></div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.app-container {
    min-height: 100vh;
    padding: 2rem;
    background: #f8f9fa;
}

.main-title {
    text-align: center;
    color: #2d3748;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.cards-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
}

.card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    padding: 2rem;
    min-height: 200px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.card:hover {
    /* background: white !important; */
    transform: translateY(-5px);
}

/* .card:hover .card-title {
    color: #2d3748;
} */
.card:nth-child(1):hover .card-icon {
    color: #667eea !important;
}

.card:nth-child(2):hover .card-icon {
    color: #2af598 !important;
}

.card:nth-child(3):hover .card-icon {
    color: #f6d365 !important;
}

.card:nth-child(4):hover .card-icon {
    color: #5ee7df !important;
}

.card-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
    transition: color 0.3s ease;
}

.card-title {
    color: white;
    font-size: 1.25rem;
    text-align: center;
    margin: 0;
    font-weight: 600;
    line-height: 1.4;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    transition: color 0.3s ease;
}

@media (max-width: 768px) {
    .app-container {
        padding: 1rem;
    }

    .main-title {
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .cards-container {
        grid-template-columns: 1fr;
    }

    .card {
        min-height: 180px;
    }
}
</style>