<template>
  <div class="flex justify-end gap-4">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
      class="border p-2 rounded text-black focus:outline-none border-black mt-4 mr-4 focus:ring focus:ring-blue-300"
    />
  </div>
  <div class="flex justify-center p-5 rounded-lg max-w-full overflow-x-auto">
    <div class="w-full max-w-3xl bg-gray-300 p-4 rounded-lg">
      <div class="flex justify-end gap-4">
        <button
          @click="showModal = true"
          class="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {{ dat === 'datakril' ? translateText('Fayl yuklash') : 'Fayl yuklash' }}
        </button>
      </div>
      <!-- File List -->
      <ul class="list-none p-0 m-0">
        <li
          v-for="file in filteredFiles"
          @click="router.push(file.type === 'video' ? '/video-open/' + file.id : '/lists-view/' + file.id)"
          :key="file.id"
          class="py-2 flex justify-between items-center relative z-20 bg-white p-2 my-2"
        >
          <a target="_blank" class="text-gray-800 hover:underline">
            {{ dat === 'datakril' ? translateText(file.name) : file.name }}
          </a>
          <div class="flex items-center relative z-50 gap-4">
            <div v-if="file.ClientPayment && file.ClientPayment.length" class="text-sm">
              <div
                class="text-black cursor-pointer"
                @click.stop="file.showDetails = !file.showDetails"
              >
                <span
                  @click.stop="openPaymentDetailsModal(file, $event)"
                  class="text-green-600"
                  v-if="
                    file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0
                  "
                >
                  {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                </span>
                <span
                  class="text-red-600 cursor-pointer"
                  v-else
                  @click.stop="openPaymentDetailsModal(file, $event)"
                >
                  {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                  {{ formatNumberWithDots(file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum || 0) }}
                  {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                </span>
              </div>
            </div>
            <div
              v-if="
                file.ClientPayment &&
                file.ClientPayment.length &&
                file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum > 0
              "
            >
              <button
                @click.stop="openPaymentModal(file)"
                class="ml-4 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}
              </button>
            </div>
            <div class="text-black">
              {{ formatDate(file.createdAt) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- File Upload Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
        <button
          @click="showModal = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ dat === 'datakril' ? translateText('Fayl yuklash') : 'Fayl yuklash' }}
        </h2>
        <form @submit.prevent="uploadFile" class="flex flex-col gap-4">
          <input
            type="text"
            v-model="formData.name"
            :placeholder="
              dat === 'datakril'
                ? translateText('Shartnoma nomini kiriting')
                : 'Shartnoma nomini kiriting'
            "
            class="p-3 border rounded-lg focus:outline-none text-black border-black focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="file"
            @change="handleFileUpload"
            class="text-black"
            required
          />
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {{ dat === 'datakril' ? translateText('Yuklash') : 'Yuklash' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Region and District Selection Modal -->
    <div
      v-if="showRegionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button
          @click="closeRegionModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">
          {{ dat === 'datakril' ? translateText('Qarzdorlik uchun to‘lov "YURIST KONSUL KONSALTING" kompaniyasining qaysi filialida amalga oshirilmoqda?') : 'Qarzdorlik uchun to‘lov "YURIST KONSUL KONSALTING" kompaniyasining qaysi filialida amalga oshirilmoqda?' }}
        </h2>
        <div class="flex flex-col gap-4">
          <!-- Region Dropdown -->
          <select
            v-model="ofis"
            class="p-3 border rounded-lg focus:outline-none text-black border-black focus:ring-2 focus:ring-blue-500"
          >
            <option class=" text-black" value="" disabled>
              {{ dat === 'datakril' ? translateText('To\'lov qaysi ofisdan amalga oshirilmoqda') : 'To\'lov qaysi ofisdan amalga oshirilmoqda' }}
            </option>
            <option class="text-black" value="Xorazm viloyati Urganch shaxar 1-son filiali">
              {{ dat === 'datakril' ? translateText('Xorazm viloyati Urganch shaxar 1-son filiali')
                : 'Xorazm viloyati Urganch shaxar 1-son filiali' }}
            </option>
            <option class="text-black" value="Xorazm viloyati Xiva shaxar markaziy binosi">
              {{ dat === 'datakril' ? translateText('Xorazm viloyati Xiva shaxar markaziy binosi')
                : 'Xorazm viloyati Xiva shaxar markaziy binosi' }}
            </option>
          </select>
          <div class="flex justify-end gap-3">
            <button
              @click="closeRegionModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
            </button>
            <button
              @click="submitRegionSelection"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Payment Modal -->
    <div
      v-if="modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-4 rounded shadow-lg w-80">
        <input
          v-model="summa"
          type="number"
          :placeholder="
            dat === 'datakril' ? translateText('To\'langan summa') : 'To\'langan summa'
          "
          class="w-full p-2 border text-black border-black rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div class="flex justify-end space-x-2">
          <button
            @click="submitPayment"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}
          </button>
          <button
            @click="modal = false"
            class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
          >
            {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
          </button>
        </div>
      </div>
    </div>
    <!-- Payment Details Modal -->
    <div
      v-if="paymentDetailsModal"
      @click="closePaymentDetailsModal($event)"
      class="absolute inset-0 z-50 flex justify-center items-start"
    >
      <div
        :style="{ top: modalPosition.top + 10 + 'px', left: modalPosition.left - 143 + 'px' }"
        @click.stop
        class="absolute bg-gray-200 p-6 rounded-lg max-h-[450px] shadow-lg overflow-y-auto"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ dat === 'datakril' ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
        </h2>
        <div class="mb-4">
          <span
            class="text-green-600 font-medium"
            v-if="
              selectedPaymentDetails &&
              selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0
            "
          >
            {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
          </span>
          <span class="text-red-600 font-medium" v-else>
            {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
            {{ formatNumberWithDots(selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum) }}
            {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
          </span>
        </div>
        <ul class="list-none p-0 m-0">
          <li
            v-for="payment in selectedPaymentDetails"
            :key="payment.id"
            class="mt-1 border p-2 border-black"
          >
            <div class="text-black">
              {{ dat === 'datakril' ? translateText("Jami summa") : "Jami summa" }}:
              {{ formatNumberWithDots(payment.TotalSum) }}
              {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-black">
              {{ dat === 'datakril' ? translateText("Qoldiq summa") : "Qoldiq summa" }}:
              {{ formatNumberWithDots(payment.remainingSum) }}
              {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-black">
              {{ dat === 'datakril' ? translateText("To'langan summa") : "To'langan summa" }}:
              {{ formatNumberWithDots(payment.paidSum) }}
              {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
            </div>
            <div class="text-black">
              {{ dat === 'datakril' ? translateText("Vaqt") : "Vaqt" }}:
              {{ formatDate(payment.createdAt) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
const dat = inject('dat');
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const SectionId = route.params.id1;
const clientFiles = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const showRegionModal = ref(false);
const summa = ref(0);
const modal = ref(false);
const searchQuery = ref('');
const totalsumma= ref(null)
const districts = ref([]);
const formData = ref({
  name: '',
  file: null,
});

const selectedItem = ref(null);
const receiptData = ref({});
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const data = ref(null);
const modalPosition = ref({ top: 0, left: 0});
const selectedRegionForPrint = ref({ regionName: '', districtName: '' });
const pendingPrint = ref(false);
const ofis = ref('')

onMounted(() => {
  fetchClientFiles();
});


const closeRegionModal = () => {
  showRegionModal.value = false;
ofis.value = ''
  districts.value = [];
  // If pending print, cancel the print process
  if (pendingPrint.value) {
    pendingPrint.value = false;
  }
};

const submitRegionSelection = () => {
  showRegionModal.value = false;
  
  if (pendingPrint.value) {
    pendingPrint.value = false;
    printReceipt();
  }
};

const closePaymentDetailsModal = (event) => {
  if (event.target === event.currentTarget) {
    paymentDetailsModal.value = false;
  }
};

const fetchClientFiles = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/client-sections/${id}`);
    clientFiles.value = response.data.ClientFile || [];
    data.value = response.data.clientSectionBody.client;
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching client files:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = (event) => {
  formData.value.file = event.target.files[0];
};

const uploadFile = async () => {
  const uploadData = new FormData();
  uploadData.append('name', formData.value.name);
  uploadData.append('file', formData.value.file);
  uploadData.append('clientSectionId', parseInt(id));

  try {
    await axios.post(`${URL}/client-files`, uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    fetchClientFiles();
    showModal.value = false;
    formData.value = {
      name: '',
      file: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const submitPayment = async () => {
  if (!selectedItem.value) {
    alert("Hech qanday fayl tanlanmadi!");
    return;
  }

  const paymentAmount = Number(summa.value);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    alert("Iltimos, to'g'ri summa kiriting!");
    return;
  }

  const clientPayments = selectedItem.value.ClientPayment || [];
  if (!clientPayments.length) {
    alert("To'lov ma'lumotlari topilmadi!");
    return;
  }

  const latestPayment = clientPayments[clientPayments.length - 1];
  if (!latestPayment || latestPayment.remainingSum === undefined) {
    alert("Oxirgi to'lov ma'lumotlari noto'g'ri!");
    return;
  }

  if (paymentAmount > latestPayment.remainingSum) {
    alert("To'lov miqdori qoldiq qarzdan oshib ketmoqda!");
    return;
  }

  const updatedRemainingSum = latestPayment.remainingSum - paymentAmount;

  try {
    const response = await axios.post(`${URL}/client-pay`, {
      clientFileId: parseInt(selectedItem.value.id),
      TotalSum: latestPayment.TotalSum || 0,
      paidSum: paymentAmount,
      remainingSum: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
    });

    latestPayment.paidSum = (latestPayment.paidSum || 0) + paymentAmount;
    latestPayment.remainingSum = updatedRemainingSum >= 0 ? updatedRemainingSum : 0;

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}.${currentDate.getFullYear()}`;
    totalsumma.value=latestPayment.TotalSum
    receiptData.value = {
      name: selectedItem.value.name,
      surname: selectedItem.value.surname,
      dadname: selectedItem.value.dadname,
      phone: selectedItem.value.phone,
      uniqueCode: selectedItem.value.contractId,
      paymentAmount: paymentAmount,
      totalSum: latestPayment.TotalSum || 0,
      remainingDebt: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
      date: formattedDate,
    };

    await generateCheckFile();
    // Open region modal before printing
    showRegionModal.value = true;
    pendingPrint.value = true;
    modal.value = false;
  } catch (error) {
    console.error("To'lovni yangilashda xatolik yuz berdi:", error);
    alert("Xatolik yuz berdi: " + error.message);
  }
};

function numberToUzbekWords(n) {
  const ones = [
    '',
    'bir',
    'ikki',
    'uch',
    "to'rt",
    'besh',
    'olti',
    'yetti',
    'sakkiz',
    "to'qqiz",
  ];
  const tens = [
    '',
    "o'n",
    'yigirma',
    "o'ttiz",
    'qirq',
    'ellik',
    'oltmish',
    'yetmish',
    'sakson',
    "to'qson",
  ];
  const hundreds = [
    '',
    'bir yuz',
    'ikki yuz',
    'uch yuz',
    "to'rt yuz",
    'besh yuz',
    'olti yuz',
    'yetti yuz',
    'sakkiz yuz',
    "to'qqiz yuz",
  ];

  if (typeof n !== 'number' || isNaN(n)) return "Noto'g'ri qiymat";
  if (n === 0) return 'nol';
  if (n < 0) return 'manfiy ' + numberToUzbekWords(-n);
  if (n > 999_999_999_999) return 'Milliardgacha son kiriting.';

  const getThreeDigitWords = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;

    let parts = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t > 0 || o > 0) parts.push(tens[t] + (o > 0 ? ' ' + ones[o] : ''));
    return parts.join(' ').trim();
  };

  let result = '';

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;

  if (billions > 0) result += getThreeDigitWords(billions) + ' milliard ';
  if (millions > 0) result += getThreeDigitWords(millions) + ' million ';
  if (thousands > 0) result += getThreeDigitWords(thousands) + ' ming ';
  if (rest > 0) result += getThreeDigitWords(rest);

  return result.trim();
}

const printReceipt = () => {
  // If region selection is pending, do not proceed until modal is closed
  if (pendingPrint.value) return;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const images = [
    { src: `${window.location.origin}/telegram-cloud.jpg`, key: 'telegram-cloud' },
    { src: `${window.location.origin}/https___arizasud.uz_.png`, key: 'arizasud' },
    { src: `${window.location.origin}/telegram.png`, key: 'telegram' },
  ];
  const receiptHTML = `
    <table style="border: 1px solid black; border-collapse: collapse;">
        <tr>
            <td rowspan="8" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${window.location.origin}/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">№${clientFiles.value[0]?.contractId || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${receiptData.value.remainingDebt <= 0 ? "To'landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${ofis.value || 'Tanlanmagan'}</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const originalContent = document.body.innerHTML;
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      @page { margin: 2px; }
      body { margin: 0; }
    }
    `;
  document.head.appendChild(style);

  let loadedImages = 0;
  const totalImages = images.length;

  const checkAllImagesLoaded = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      document.body.innerHTML = receiptHTML;
      window.print();
      document.body.innerHTML = originalContent;
      document.head.removeChild(style);
      window.location.reload();
    }
  };

  images.forEach((image) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      console.log(`${image.key} loaded successfully`);
      checkAllImagesLoaded();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${image.key}`);
      checkAllImagesLoaded();
    };
  });
};

const generateCheckFile = async () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  const receiptHTML = `
    <table style="border: 1px solid black; height:80px; width:100%; border-collapse: collapse;">
        <tr>
            <td rowspan="8" style="text-align: center; color: black; border: 1px solid black;"><img width="150px" src="/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">№${clientFiles.value[0]?.contractId || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
          <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</td>
          </tr>
          <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
            <td colspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${receiptData.value.remainingDebt <= 0 ? "To'landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
          </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${ofis.value || 'Tanlanmagan'}</td>
            <td colspan="3" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(receiptData.value.paymentAmount)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const element = document.createElement('div');
  element.innerHTML = receiptHTML;

  const options = {
    margin: [0, 0, 0, 0],
    filename: `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  try {
    const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');
    const formData = new FormData();
    formData.append('check', pdfBlob, `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`);
    formData.append('contractId', String(clientFiles.value[0]?.contractId || ''));
    formData.append('remainingDebt', String(receiptData.value.remainingDebt));

    await axios.post(`${URL}/client/add-check/${SectionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Error generating or sending the check file:', error);
  }
};

const openPaymentModal = (file) => {
  selectedItem.value = file;
  modal.value = true;
};

const openPaymentDetailsModal = (file, event) => {
  selectedPaymentDetails.value = file.ClientPayment;
  const rect = event.target.getBoundingClientRect();
  modalPosition.value = {
    top: rect.top + window.scrollY + rect.height,
    left: rect.left + window.scrollX,
  };
  paymentDetailsModal.value = true;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const formatNumberWithDots = (number) => {
  if (isNaN(number) || number === null || number === undefined) {
    return '0';
  }
  return Number(number)
    .toLocaleString('uz-UZ', { minimumFractionDigits: 0 })
    .replace(/,/g, '.');
};

const filteredFiles = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return clientFiles.value.filter((file) => {
    const nameMatch = file.name?.toLowerCase().includes(query);
    const contractIdMatch = file.contractId?.toString().includes(query);
    return nameMatch || contractIdMatch;
  });
});
</script>

<style>
@media print {
  @page {
    size: 80mm auto;
    padding-top: 5px;
    padding-right: 5px;
    padding-left: 170px;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px !important;
    text-align: left;
    line-height: 1.2 !important;
    white-space: pre-wrap !important;
    box-sizing: border-box;
  }

  h2 {
    text-align: center;
    font-size: 12px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 0 !important;
    vertical-align: top;
  }

  th {
    text-align: center;
  }

  .hidden,
  [hidden] {
    display: none !important;
  }

  * {
    box-sizing: border-box !important;
  }
}
</style>