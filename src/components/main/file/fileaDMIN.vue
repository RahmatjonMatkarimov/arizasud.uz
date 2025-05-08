<template>
  <div ref="docxContainer" class="custom-content"></div>
</template>

<style scoped>
/* Asosiy fon rangini kulrang qilish */
.custom-content {
  background-color: #c4c4c4;
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* Word hujjatini oq fon bilan chiqarish */
.docx {
  background-color: white !important;
  padding: 20px;
  border-radius: 10px; /* Burchaklarni yumshatish */
  box-shadow: none !important; /* Soyani butunlay olib tashlash */
  max-width: 80%;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as docxParser from 'docx-preview';

const API_URL = 'https://backend.arizasud.uz';

const route = useRoute();
const id = ref(route.params.id);
const docxContainer = ref(null);

const fetchWordFile = async () => {
  try {
    const response = await fetch(`${API_URL}/files/${id.value}`);
    if (!response.ok) throw new Error('File fetch failed');
    const resData = await response.json();

    const fileResponse = await fetch(`${API_URL}/uploads${resData.filePath}`);
    if (!fileResponse.ok) throw new Error('Word faylini yuklab bo‘lmadi');
    const blob = await fileResponse.blob();

    await docxParser.renderAsync(blob, docxContainer.value, null, {
      className: 'docx',
    });

    // Ichki barcha elementlarning fonini oq qilish va soyalarni olib tashlash
    const allElements = docxContainer.value.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.backgroundColor = 'white';
      el.style.color = 'black';
      el.style.boxShadow = 'none'; // Barcha elementlardan soya olib tashlash
      el.style.textShadow = 'none'; // Matn soyalarini ham olib tashlash
    });
  } catch (error) {
    console.error('Xatolik:', error);
    docxContainer.value.innerHTML =
      "<p class='text-red-500'>Faylni olishda xatolik yuz berdi!</p>";
  }
};

onMounted(() => {
  fetchWordFile();
});
</script>
