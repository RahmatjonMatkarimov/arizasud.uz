<script setup>
import { ref, onMounted, computed, inject } from "vue";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { useRoute } from "vue-router";
import translateText from "@/auth/Translate";
const isLoading = inject("isLoading"); // Global yuklanish holatini olish

const route = useRoute();
const id = localStorage.getItem("id");
const newId = parseInt(id);
const data = ref({});


const fetchAdminData = async () => {
  isLoading.value = true; // Yuklanishni boshlash
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[response.data.permissions.length - 1];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  } finally {
    isLoading.value = false; // Yuklanish tugashi
  }
};

onMounted(fetchAdminData);
const dat = inject('dat');

const menuItems = [
  { to: "/all", label: "Barcha ishchilar roʻyxati", condition: () => data.value?.admins },
  { to: "/operators", label: "ishchilarni hujjatini yaratuvchi devonxona mudiri", condition: () => data.value?.call_centres },
  { to: "/yurists", label: "Yurist-ekspert yaratish boʻlimi", condition: () => data.value?.yurists },
  { to: "/admins", label: "Ishchi hodimlarni yaratish ( Admin yaratish )", condition: () => data.value?.admins },
  { to: "/remindersAdmin", label: "Ishchilarni bajargan ishlari", condition: () => data.value?.workDone },
  { to: "/admin", label: "Sud hujjatlarini yozish", condition: true },
  { to: "/appealAdmin", label: "Interaktiv xizmatlar roʻyxati", condition: true },
  { to: "/scanersAdmin", label: "yangi bolim roʻyxati", condition: true },
  { to: "/partners", label: "Hamkorlar roʻyxati", condition: true },
  { to: "/Requirefiles", label: "Imzolanishi kerak boʻlgan fayllar", condition: () => data.value?.userFiles },
  { to: "/payments", label: "Tizim toʻlovlari", condition: true },
  { to: "/smile", label: "Stikker qoʻshish", condition: true },
  { to: "/companyFile", label: "Kampaniya fayllari", condition: () => data.value?.companyDocs },
  { to: "/commaners", label: "Tizimdagi foydalanuvchilar roʻyxati", condition: true },
  { to: "/archive", label: "Arxiv", condition: true },
];

const open = () => {
  window.open("https://github.com/");
};

const filteredMenu = computed(() => {
  return menuItems.filter(item => (typeof item.condition === "function" ? item.condition() : item.condition));
});
</script>

<template>
  <aside class="overflow-y-auto aside-nav bg-blue-800">
    <div class="mt-[200px]">
      <p v-if="isLoading" class="text-white text-center text-lg">Yuklanmoqda...</p>
      <template v-else>
        <router-link :to="item.to" v-for="(item, index) in filteredMenu" :key="index" class="mb-1 li"
          :class="{ 'active': route.path === item.to }">
          <b class="text-black block w-[30px]">{{ index + 1 }}</b>
          <h1 v-if="dat === 'datalotin'" class="text-black first-letter:uppercase">
            {{ item.label }}
          </h1>
          <h1 v-if="dat === 'datakril'" class="text-black first-letter:uppercase">
            {{ translateText(item.label) }}
          </h1>
        </router-link>
        <div @click="open()" class="text-black block li">
          <b class="text-black block w-[30px]">{{ filteredMenu.length + 1 }}</b>
          <h1 class="text-black">
            GitHub
          </h1>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.aside-nav {
  width: 420px;
  height: 100vh;
  color: black;
  position: fixed;
}

.li {
  padding: 15px 20px;
  background-color: #c4c4c4;
  transition: background-color 0.3s ease-in-out;
  display: flex;
}

.li:hover {
  background-color: rgba(229, 231, 235, 0.1);
  cursor: pointer;
}

.active {
  background-color: rgba(229, 231, 235, 0.1);
  color: white;
}
</style>
