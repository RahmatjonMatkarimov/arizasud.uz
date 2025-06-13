<!-- src/views/UserProfile.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">PDF yuklanmoqda...</p>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    <div v-else-if="pdfPages.length" class="pdf-container">
      <div class="pdf-pages">
        <img v-for="(page, index) in pdfPages" :key="index" :src="page" class="pdf-page" />
      </div>
      <button @click="downloadPDF" class="download-btn">
        PDF yuklab olish
      </button>
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-600">PDF yaratilmadi yoki sahifalar topilmadi.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { uz } from 'date-fns/locale';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const onlineAdmins = ref([]);
const socket = io(URL);
const dat = ref(localStorage.getItem('til') || 'datalotin');
const pdfUrl = ref(null);
const pdfPages = ref([]);

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 1000); // Check every 1 second
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value); // Clean up Blob URL
  socket.off('adminOnlineUpdate');
  socket.disconnect();
});

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Autentifikatsiya tokeni topilmadi');

    loading.value = true;
    const response = await axios.get(`${URL}/admin/${id.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data;

    // Generate and render PDF after fetching data
    await generateAndRenderPDF();
  } catch (err) {
    error.value = err.response?.data?.message || 'Foydalanuvchi ma\'lumotlarini yuklab bo\'lmadi';
    console.error('Error fetching user data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : '/default-avatar.png';
};

const getAdminStatus = (admin) => {
  if (!admin?.id) {
    return { status: 'Noma\'lum', color: 'gray', dotColor: 'gray' };
  }

  const currentAdminId = id.value.toString();
  const lastSeenDate = admin.lastSeen ? new Date(admin.lastSeen) : null;
  const isOnline = onlineAdmins.value.includes(currentAdminId) ||
    (lastSeenDate && differenceInMinutes(new Date(), lastSeenDate) < 2);

  if (isOnline) {
    return { status: 'Onlayn', color: 'green', dotColor: 'green' };
  }

  if (lastSeenDate) {
    return {
      status: `${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: uz })} tarmoqda edi`,
      color: 'red',
      dotColor: 'red',
    };
  }

  return { status: 'Oflayn', color: 'red', dotColor: 'red' };
};

const adminStatus = computed(() =>
  userInfo.value ? getAdminStatus(userInfo.value) :
    { status: 'Noma\'lum', color: 'gray', dotColor: 'gray' }
);

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map(String);
};

const generateAndRenderPDF = async () => {
  if (!userInfo.value) return;

  // Generate PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Foydalanuvchi Profili', margin, y);
  y += 15;

  try {
    const imgUrl = getImageUrl(userInfo.value.img);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    await new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    doc.addImage(img, 'PNG', margin, y, 50, 50);
    y += 60;
  } catch (err) {
    console.error('PDF uchun rasm yuklashda xato:', err);
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const tableData = [
    ['Ism va familya', `${userInfo.value.name} ${userInfo.value.surname} ${userInfo.value.dadname}`],
    ['Passport raqami', userInfo.value.userCode],
    ['Fuqaroning JSHSHIR raqami', userInfo.value.uniqueCode],
    ['Fuqaroning logini', userInfo.value.username],
    ['Fuqaroning mobil telefon raqami', userInfo.value.phone],
    ['Fuqaroning lavozimi', dat.value === 'datakril' ? translateText(userInfo.value.lavozimi) : userInfo.value.lavozimi],
    ['Status', adminStatus.value.status],
  ];

  if (dat.value === 'datakril') {
    tableData.forEach(row => {
      row[0] = translateText(row[0]);
    });
  }

  autoTable(doc, {
    startY: y,
    head: [['Xususiyat', 'Qiymat']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Convert PDF to Blob URL
  const pdfBlob = doc.output('blob');
  pdfUrl.value = URL.createObjectURL(pdfBlob);

  // Render PDF as images
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl.value);
    const pdf = await loadingTask.promise;

    if (!pdf || !pdf.numPages) {
      throw new Error("PDF fayli yuklanmadi yoki noto'g'ri formatda.");
    }

    pdfPages.value = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageDataUrl = canvas.toDataURL('image/png');
      pdfPages.value.push(imageDataUrl);
    }
  } catch (err) {
    error.value = err.message || 'PDF ko\'rsatishda xatolik';
    console.error('PDF rendering error:', err);
  }
};

const downloadPDF = () => {
  if (!pdfUrl.value || !userInfo.value) return;
  const link = document.createElement('a');
  link.href = pdfUrl.value;
  link.download = `User_Profile_${userInfo.value.username}.pdf`;
  link.click();
};

onMounted(() => {
  fetchUserData();
  socket.emit('joinAdmin', id.value);
  socket.on('adminOnlineUpdate', checkOnlineStatus);
});
</script>

<style scoped>
.pdf-container {
  text-align: center;
}
.pdf-pages {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.pdf-page {
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.download-btn:hover {
  background-color: #2563eb;
}
</style>