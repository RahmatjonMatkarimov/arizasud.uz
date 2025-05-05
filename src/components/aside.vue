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
const role = ref({});


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
  { to: "/admin-list", label: "Ishchi hodimlar ro'yxati", condition: true },
  { to: "/all-contract", label: "Shartnoma tuzish bo'limi", condition: true },
  { to: "/all-courts", label: "Sud hujjatlari", condition: true },
  { to: "/admin-task", label: "Yangi shartnomalar ", condition: localStorage.getItem('role')==='admin' },
  { to: "/yurist-tasks", label: "Yangi shartnomalar ", condition: localStorage.getItem('role')==='yurist' },
  { to: "/asisstant-task", label: "Yangi shartnomalar ", condition: localStorage.getItem('role')==='yuristAssistant' },
  { to: "/deliverer-task", label: "Yangi shartnomalar ", condition: localStorage.getItem('role')==='deliverer' },
  { to: "/remindersAdmin", label: "Ishchilarni bajargan ishlari", condition: () => data.value?.workDone },
  { to: "/Requirefiles", label: "Imzolanishi kerak boʻlgan fayllar", condition: () => data.value?.userFiles },
  { to: "/payment", label: "Tizim toʻlovlari", condition: true },
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
  <aside class="overflow-y-auto aside-nav">
    <div class="mt-[200px]">
      <p v-if="isLoading" class="text-white text-center text-lg">Yuklanmoqda...</p>
      <template v-else>
        <router-link :to="item.to" v-for="(item, index) in filteredMenu" :key="index" class="mb-1 group li" :class="{
          active: route.path === item.to
        }">
          <b :class="[
            'block group-hover:text-white w-[30px]',
            route.path === item.to ? 'text-white' : 'text-black'
          ]">
            {{ index + 1 }}
          </b>
          <h1 v-if="dat === 'datalotin'" :class="[
            'group-hover:text-white first-letter:uppercase',
            route.path === item.to ? 'text-white' : 'text-black'
          ]">
            {{ item.label }}
          </h1>
          <h1 v-if="dat === 'datakril'" :class="[
            'group-hover:text-white first-letter:uppercase',
            route.path === item.to ? 'text-white' : 'text-black'
          ]">
            {{ translateText(item.label) }}
          </h1>
        </router-link>

        <div @click="open()" class="text-black group block li">
          <b class="text-black block group-hover:text-white w-[30px]">{{ filteredMenu.length + 1 }}</b>
          <h1 class="text-black group-hover:text-white">
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
  --tw-bg-opacity: 1;
  background-color: rgba(30, 64, 175, var(--tw-bg-opacity));
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
  color: white !important;
}

.active:hover h1 {
  color: white !important;
}
</style>
