<template>
  <div class="dark:bg-[#1a2642] dark:text-gray-200 min-h-screen">
    <div class="flex justify-center p-5 rounded-lg min-w-full overflow-x-auto">
      <div class="w-full p-4 rounded-lg">
        <!-- File List with Animation -->
        <transition-group
          name="slide-up"
          tag="ul"
          class="list-none container mx-auto p-0 m-0"
        >
          <li
            v-for="file in filteredFiles"
            @click="
              router.push(
                file.type === 'video'
                  ? '/video-open/' + file.id
                  : '/lists-view/' + file.id
              )
            "
            :key="file.id"
            class="my-2 bg-[#8a8a8a36] w-full flex justify-between items-center relative z-10 px-6 py-4 rounded-lg"
          >
            <a target="_blank" class="text-[17px]">
              {{ dat === "datakril" ? translateText(file.name) : file.name }}
            </a>
            <div class="flex items-center relative z-50 gap-2">
              <div
                v-if="file.ClientPayment && file.ClientPayment.length"
                @click.stop="openPaymentDetailsModal(file, $event)"
                class="text-sm bg-green-500 flex justify-center items-center cursor-pointer gap-2 px-4 py-[7px] hover:bg-green-600 rounded-lg"
              >
                <div
                  class="text-black cursor-pointer"
                  @click.stop="file.showDetails = !file.showDetails"
                >
                  <span
                    class="text-green-600"
                    v-if="
                      file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0
                    "
                  >
                    {{ dat === "datakril" ? translateText("To'langan") : "To'langan" }}
                  </span>
                  <span
                    class="text-red-500 cursor-pointer"
                    v-else
                    @click.stop="openPaymentDetailsModal(file, $event)"
                  >
                    {{ dat === "datakril" ? translateText("Qarzi") : "Qarzi" }}:
                    {{
                      formatNumberWithDots(
                        file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum ||
                          0
                      )
                    }}
                    {{ dat === "datakril" ? translateText("so'm") : "so'm" }}
                  </span>
                </div>
                <Icon
                  icon="prime:arrow-down"
                  width="20"
                  height="20"
                  style="color: #fff"
                />
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
                  class="ml-1 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {{ dat === "datakril" ? translateText("To'lash") : "To'lash" }}
                </button>
              </div>
              <div>
                {{ formatDate(file.createdAt) }}
              </div>
            </div>
          </li>
        </transition-group>
      </div>
      <!-- File Upload Modal -->
      <div
        v-if="showModal"
        @click="showModal = false"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <div
          @click.stop
          class="bg-gray-200 dark:bg-gray-600 p-6 rounded-lg w-full max-w-lg shadow-lg relative"
        >
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
            {{ dat === "datakril" ? translateText("Fayl yuklash") : "Fayl yuklash" }}
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
            <input type="file" @change="handleFileUpload" class="text-black" required />
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {{ dat === "datakril" ? translateText("Yuklash") : "Yuklash" }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- Region and District Selection Modal -->
<div
  v-if="showRegionModal"
  class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
    <button
      @click="closeRegionModal"
      class="absolute top-4 right-4 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
    >
      <iconify-icon icon="mdi:close" class="w-5 h-5"></iconify-icon>
    </button>

    <div>
      <h2 class="text-lg font-semibold mb-4">
        {{ dat === 'datakril' ? translateText('To\'lov qaysi filialda amalga oshirilmoqda?') : 'To\'lov qaysi filialda amalga oshirilmoqda?' }}
      </h2>

      <div class="space-y-4">
        <select
          v-model="ofis"
          class="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {{ dat === 'datakril' ? translateText('Ofisni tanlang') : 'Ofisni tanlang' }}
          </option>
          <option value="Xorazm viloyati Urganch shaxar 1-son filiali">
            {{ dat === 'datakril' ? translateText('Xorazm viloyati Urganch shaxar 1-son filiali') : 'Xorazm viloyati Urganch shaxar 1-son filiali' }}
          </option>
          <option value="Xorazm viloyati Xiva shaxar markaziy binosi">
            {{ dat === 'datakril' ? translateText('Xorazm viloyati Xiva shaxar markaziy binosi') : 'Xorazm viloyati Xiva shaxar markaziy binosi' }}
          </option>
        </select>

        <select
          v-model="paymentType"
          class="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {{ dat === 'datakril' ? translateText("To'lov turini tanlang") : "To'lov turini tanlang" }}
          </option>
          <option value="naqt">{{ dat === 'datakril' ? translateText("Naqd pul") : "Naqd pul" }}</option>
          <option value="bank">{{ dat === 'datakril' ? translateText("Bank orqali") : "Bank orqali" }}</option>
        </select>

        <div v-if="paymentType === 'bank'">
          <input
            type="file"
            @change="handleFileChange"
            accept=".pdf,.jpg,.jpeg,.png"
            class="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="closeRegionModal"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
          </button>
          <button
            @click="submitRegionSelection"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      <!-- Payment Modal -->
      <div
        v-if="modal"
        @click="modal = false"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          @click.stop
          class="bg-gray-200 dark:bg-gray-600 p-[15px] flex flex-col gap-3 rounded shadow-lg w-[450px]"
        >
          <input
            v-model="summa"
            type="number"
            :placeholder="
              dat === 'datakril' ? translateText('To\'langan summa') : 'To\'langan summa'
            "
            required
            class="w-full p-2 border text-black border-black rounded bg-white dark:bg-gray-500 dark:text-gray-300 text-[20px] focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div class="flex gap-3">
            <button
              @click="modal = false"
              class="bg-gray-500 w-full text-white text-[20px] px-3 py-1 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
            >
              {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
            </button>
            <button
              @click="submitPayment"
              class="bg-blue-500 text-white w-full text-[20px] px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {{ dat === "datakril" ? translateText("To'lash") : "To'lash" }}
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
          :style="{
            top: modalPosition.top + 10 + 'px',
            left: modalPosition.left - 143 + 'px',
          }"
          @click.stop
          class="absolute bg-gray-200 dark:bg-gray-600 dark:text-gray-300 p-6 rounded-lg max-h-[450px] shadow-lg overflow-y-auto"
        >
          <h2 class="text-xl font-semibold mb-4">
            {{
              dat === "datakril"
                ? translateText("To'lov tafsilotlari")
                : "To'lov tafsilotlari"
            }}
          </h2>
          <ul class="list-none p-0 m-0">
            <li
              v-for="payment in selectedPaymentDetails"
              :key="payment.id"
              class="mt-1 border p-2 dark:border-white border-black"
            >
              <div class="">
                {{ dat === "datakril" ? translateText("Jami summa") : "Jami summa" }}:
                {{ formatNumberWithDots(payment.TotalSum) }}
                {{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="">
                {{ dat === "datakril" ? translateText("Qoldiq summa") : "Qoldiq summa" }}:
                {{ formatNumberWithDots(payment.remainingSum) }}
                {{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="">
                {{
                  dat === "datakril"
                    ? translateText("To'langan summa")
                    : "To'langan summa"
                }}:
                {{ formatNumberWithDots(payment.paidSum) }}
                {{ dat === "datakril" ? translateText("so'm") : "so'm" }}
              </div>
              <div class="">
                {{ dat === "datakril" ? translateText("Vaqt") : "Vaqt" }}:
                {{ formatDate(payment.createdAt) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, onUnmounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import html2pdf from "html2pdf.js";
import { URL } from "@/auth/url.js";
import translateText from "@/auth/Translate";
import { useSearchStore } from "@/components/Templates/searchQuary";
import { Icon } from "@iconify/vue";
const dat = ref(localStorage.getItem("til") || "datalotin");

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const SectionId = ref(null);
const clientFiles = ref([]);
const isLoading = inject("isLoading");
const showModal = ref(false);
const showRegionModal = ref(false);
const summa = ref(0);
const modal = ref(false);
const searchQuery = useSearchStore();
const totalsumma = ref(null);
const districts = ref([]);
const formData = ref({
  name: "",
  file: null,
});

const selectedItem = ref(null);
const receiptData = ref({});
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const data = ref(null);
const modalPosition = ref({ top: 0, left: 0 });
const selectedRegionForPrint = ref({ regionName: "", districtName: "" });
const pendingPrint = ref(false);
const ofis = ref("");
const paymentType = ref('')
const checkFile = ref(null)

onMounted(() => {
  fetchClientFiles();
});

function handleFileChange(event) {
  checkFile.value = event.target.files[0]
  console.log(checkFile.value) // Fayllarni ko'rish
}

const closeRegionModal = () => {
  showRegionModal.value = false;
  ofis.value = "";
  districts.value = [];
  // If pending print, cancel the print process
  if (pendingPrint.value) {
    pendingPrint.value = false;
  }
};

const submitRegionSelection = async () => {
  showRegionModal.value = false;
      if (paymentType.value === 'naqt') {
    await generateCheckFile();
    if (pendingPrint.value) {
    pendingPrint.value = false;
    printReceipt();
  }
    } else if (paymentType.value == 'bank') {
        isLoading.value = true
        try {
          const formData = new FormData();
          formData.append('check', checkFile.value);
          formData.append('contractId', String(clientFiles.value[0]?.contractId || ''));
          formData.append('remainingDebt', String(receiptData.value.remainingDebt));

          await axios.post(`${URL}/client/add-check/${SectionId.value}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (error) {
          console.error('Error generating or sending the check file:', error);
        } finally{
          isLoading.value = false
        }
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
    const response = await axios.get(`${URL}/client-files`);
    clientFiles.value = response.data || [];
  } catch (error) {
    console.error("Error fetching client files:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = (event) => {
  formData.value.file = event.target.files[0];
};

const uploadFile = async () => {
  isLoading.value = true;
  const uploadData = new FormData();
  uploadData.append("name", formData.value.name);
  uploadData.append("file", formData.value.file);
  uploadData.append("clientSectionId", parseInt(id));

  try {
    await axios.post(`${URL}/client-files`, uploadData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchClientFiles();
    showModal.value = false;
    formData.value = {
      name: "",
      file: null,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    isLoading.value = false;
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
isLoading.value = true
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
    const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}.${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}.${currentDate.getFullYear()}`;
    totalsumma.value = latestPayment.TotalSum;
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
    data.value = selectedItem.value.clientSection.clientSectionBody.client;
    SectionId.value = selectedItem.value.clientSection.clientSectionBody.client.id;
    // Open region modal before printing
    showRegionModal.value = true;
    pendingPrint.value = true;
    modal.value = false;
  } catch (error) {
    console.error("To'lovni yangilashda xatolik yuz berdi:", error);
    alert("Xatolik yuz berdi: " + error.message);
  } finally{
    isLoading.value = false
  }
};

function numberToUzbekWords(n) {
  const ones = [
    "",
    "bir",
    "ikki",
    "uch",
    "to'rt",
    "besh",
    "olti",
    "yetti",
    "sakkiz",
    "to'qqiz",
  ];
  const tens = [
    "",
    "o'n",
    "yigirma",
    "o'ttiz",
    "qirq",
    "ellik",
    "oltmish",
    "yetmish",
    "sakson",
    "to'qson",
  ];
  const hundreds = [
    "",
    "bir yuz",
    "ikki yuz",
    "uch yuz",
    "to'rt yuz",
    "besh yuz",
    "olti yuz",
    "yetti yuz",
    "sakkiz yuz",
    "to'qqiz yuz",
  ];

  if (typeof n !== "number" || isNaN(n)) return "Noto'g'ri qiymat";
  if (n === 0) return "nol";
  if (n < 0) return "manfiy " + numberToUzbekWords(-n);
  if (n > 999_999_999_999) return "Milliardgacha son kiriting.";

  const getThreeDigitWords = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;

    let parts = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t > 0 || o > 0) parts.push(tens[t] + (o > 0 ? " " + ones[o] : ""));
    return parts.join(" ").trim();
  };

  let result = "";

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;

  if (billions > 0) result += getThreeDigitWords(billions) + " milliard ";
  if (millions > 0) result += getThreeDigitWords(millions) + " million ";
  if (thousands > 0) result += getThreeDigitWords(thousands) + " ming ";
  if (rest > 0) result += getThreeDigitWords(rest);

  return result.trim();
}

const printReceipt = () => {
  // If region selection is pending, do not proceed until modal is closed
  if (pendingPrint.value) return;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const images = [
    { src: `${window.location.origin}/telegram-cloud.jpg`, key: "telegram-cloud" },
    { src: `${window.location.origin}/https___arizasud.uz_.png`, key: "arizasud" },
    { src: `${window.location.origin}/telegram.png`, key: "telegram" },
  ];
  const receiptHTML = `
    <table style="border: 1px solid black; border-collapse: collapse;">
        <tr>
            <td rowspan="8" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${
              window.location.origin
            }/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${
              window.location.origin
            }/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">№${
            clientFiles.value[0]?.contractId || "Mavjud emas"
          }</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formatNumberWithDots(
            totalsumma.value
          )} so'm</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(
              receiptData.value.paymentAmount
            )} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${
            receiptData.value.remainingDebt <= 0
              ? "To'landi"
              : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"
          }</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${
              data.value.name
            } ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${
              ofis.value || "Tanlanmagan"
            }</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(
              receiptData.value.paymentAmount
            )} so'm</td>
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
  const style = document.createElement("style");
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
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
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
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">№${
            clientFiles.value[0]?.contractId || "Mavjud emas"
          }</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${formatNumberWithDots(
            totalsumma.value
          )} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
          <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;height:15px;">${formatNumberWithDots(
            receiptData.value.paymentAmount
          )} so'm</td>
          </tr>
          <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
            <td colspan="2" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${
              receiptData.value.remainingDebt <= 0
                ? "To'landi"
                : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"
            }</td>
          </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; border: 1px solid black;">${
              data.value.name
            } ${data.value.surname} ${data.value.dadname}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">${
              ofis.value || "Tanlanmagan"
            }</td>
            <td colspan="3" style="width: 100px; text-align: center;font-size:12px; padding-bottom: 12px; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; font-size:12px; padding-bottom: 12px;color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px;font-size:12px; padding-bottom: 12px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(
              receiptData.value.paymentAmount
            )} so'm</td>
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

  const element = document.createElement("div");
  element.innerHTML = receiptHTML;

  const options = {
    margin: [0, 0, 0, 0],
    filename: `receipt-${receiptData.value.uniqueCode || "unknown"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
isLoading.value = true

  try {
    const pdfBlob = await html2pdf().from(element).set(options).outputPdf("blob");
    const formData = new FormData();
    formData.append(
      "check",
      pdfBlob,
      `receipt-${receiptData.value.uniqueCode || "unknown"}.pdf`
    );
    formData.append("contractId", String(clientFiles.value[0]?.contractId || ""));
    formData.append("remainingDebt", String(receiptData.value.remainingDebt));

    await axios.post(`${URL}/client/add-check/${SectionId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error generating or sending the check file:", error);
  } finally{
    isLoading.value = false
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
  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const formatNumberWithDots = (number) => {
  if (isNaN(number) || number === null || number === undefined) {
    return "0";
  }
  return Number(number)
    .toLocaleString("uz-UZ", { minimumFractionDigits: 0 })
    .replace(/,/g, ".");
};

const filteredFiles = computed(() => {
  const query = searchQuery.query.toLowerCase();
  return clientFiles.value.filter((file) => {
    // Qarz borligini tekshirish
    const hasDebt =
      file.ClientPayment &&
      file.ClientPayment.length > 0 &&
      file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum > 0;

    // Qidiruv so'rovi bo'yicha moslik
    const nameMatch = file.name?.toLowerCase().includes(query);
    const contractIdMatch = file.contractId?.toString().includes(query);

    // Faqat qarzi bor va qidiruvga mos keladigan fayllarni qaytarish
    return hasDebt && (nameMatch || contractIdMatch);
  });
});
</script>
<style scoped>
.animated-gradient {
  background: linear-gradient(45deg, #3a4c76, #23385f, #56688f, #23385f);

  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 1.75rem;
  min-height: 100vh;
}

/* Slide-up animation */
.slide-up-enter-active,
.slide-up-move {
  transition: all 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger the animation for each item */
.slide-up-enter-active {
  transition-delay: calc(0.1s * var(--i));
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
    font-family: "Courier New", Courier, monospace;
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
