<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";
import translateText from "@/auth/Translate.js";

const dat = inject('dat');
const items = ref([]);
const loading = ref(false);
const showCheckboxes = ref(false);
const selectedItems = ref([]);

const route = useRoute();
const data = route.params.data;

const fetchItems = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${URL}/${data}/archived`);
    items.value = res.data;
  } catch (error) {
    console.error('Xatolik:', error);
  } finally {
    loading.value = false;
  }
};

const toggleCheckboxMode = () => {
  showCheckboxes.value = !showCheckboxes.value;
  selectedItems.value = [];
};

const toggleSelection = (id) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
  } else {
    selectedItems.value.push(+id);
  }
};

// New function to select or deselect all items
const selectAllItems = () => {
  if (selectedItems.value.length === items.value.length) {
    selectedItems.value = []; // Deselect all if all are selected
  } else {
    selectedItems.value = items.value.map(item => item.id); // Select all
  }
};

const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) return;
  try {
    await axios.delete(`${URL}/${data}/archived`, {
      data: { ids: selectedItems.value }
    });

    items.value = items.value.filter(item => !selectedItems.value.includes(item.id));
    selectedItems.value = [];
    showCheckboxes.value = false;
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

const updateItem = async (id) => {
  try {
    const res = await axios.put(`${URL}/${data}/archived/${id}`, {
      status: "active"
    });

    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value[index] = res.data;
    }
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="p-6 w-[90%] mx-auto bg-white shadow-lg rounded-lg mt-6">
    <div class="flex justify-between items-center mb-4">
      {{ dat === 'datakril' ? translateText("O'chirilgan elementlar") : "O'chirilgan elementlar" }}
      <button @click="toggleCheckboxMode" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow">
        {{ dat === 'datakril' ? translateText(showCheckboxes ? "Bekor qilish" : "O'chirish rejimini yoqish") : (showCheckboxes ? "Bekor qilish" : "O'chirish rejimini yoqish") }}
      </button>
    </div>
    <div v-if="showCheckboxes" class="mb-4 flex gap-2">
      <!-- New Select All button -->
      <button @click="selectAllItems"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow">
        {{ dat === 'datakril' ? translateText(selectedItems.length === items.length ? 'Barchasini olib tashlash' : 'Barchasini belgilash') : (selectedItems.length === items.length ? 'Barchasini olib tashlash' : 'Barchasini belgilash') }}
      </button>
      <button v-if="selectedItems.length > 0" @click="deleteSelectedItems"
        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow">
        {{ dat === 'datakril' ? translateText("Belgilanganlarni o'chirish") : "Belgilanganlarni o'chirish" }}
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-4 text-lg">{{ dat === 'datakril' ? translateText("Yuklanmoqda...") : "Yuklanmoqda..." }}</div>
    <ul v-else class="space-y-4">
      <li v-for="(item, index) in items" :key="item.id"
        :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'flex items-center border justify-between p-2 hover:bg-gray-100 transition']">
        <div class="flex items-center">
          <input v-if="showCheckboxes" type="checkbox" :checked="selectedItems.includes(item.id)"
            @change="toggleSelection(item.id)"
            class="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-lg font-semibold text-gray-800 capitalize">{{ dat === 'datakril' ? translateText(item.name) : item.name }}</span>
        </div>
        <button @click="updateItem(item.id)"
          class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow">
          {{ dat === 'datakril' ? translateText("Tiklash") : "Tiklash" }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
body {
  background-color: #f9fafb;
}
</style>