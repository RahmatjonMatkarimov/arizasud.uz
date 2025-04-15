<template>
    <div class="flex justify-end">
        <input v-model="searchQuery" type="text"
            :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
            class="border p-2 rounded text-black focus:outline-none border-black mt-4 mr-4 focus:ring focus:ring-blue-300" />
    </div>
    <div class="flex justify-center p-5 rounded-lg max-w-full overflow-x-auto">
        <div class="w-full max-w-3xl bg-gray-300 p-4 rounded-lg">
            <div class="flex justify-end">
                <button @click="showModal = true"
                    class="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    {{ dat === 'datakril' ? translateText('Fayl yuklash') : 'Fayl yuklash' }}
                </button>
            </div>
            <!-- File List -->
            <ul class="list-none p-0 m-0">
                <li v-for="file in filteredFiles" @click="router.push('/lists-view/' + file.id)" :key="file.id"
                    class="py-2 flex justify-between items-center relative z-20 bg-white p-2 my-2">
                    <a target="_blank" class="text-gray-800 hover:underline">
                        {{ dat === 'datakril' ? translateText(file.name) : file.name }}
                    </a>
                    <div class="flex items-center relative z-50 gap-4">
                        <div v-if="file.ClientPayment && file.ClientPayment.length" class="text-sm">
                            <div class="text-black cursor-pointer" @click.stop="file.showDetails = !file.showDetails">
                                <span @click.stop="openPaymentDetailsModal(file, $event)" class="text-green-600"
                                    v-if="file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum <= 0">
                                    {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                                </span>
                                <span class="text-red-600 cursor-pointer" v-else
                                    @click.stop="openPaymentDetailsModal(file, $event)">
                                    {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                                    {{ file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum || 0 }} {{ dat
                                        === 'datakril' ? translateText("so'm") : "so'm" }}
                                </span>
                            </div>
                        </div>
                        <div
                            v-if="file.ClientPayment && file.ClientPayment.length && file.ClientPayment[file.ClientPayment.length - 1]?.remainingSum > 0">
                            <button @click.stop="openPaymentModal(file)"
                                class="ml-4 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
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
        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
                <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    {{ dat === 'datakril' ? translateText("Fayl yuklash") : "Fayl yuklash" }}
                </h2>
                <form @submit.prevent="uploadFile" class="flex flex-col gap-4">
                    <input type="text" v-model="formData.name"
                        :placeholder="dat === 'datakril' ? translateText('Shartnoma nomini kiriting') : 'Shartnoma nomini kiriting'"
                        class="p-3 border rounded-lg focus:outline-none text-black border-black focus:ring-2 focus:ring-blue-500"
                        required />
                    <input type="file" @change="handleFileUpload" class="text-black absolute bottom-[26px] w-[200px]"
                        required />
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="showModal = false"
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                            {{ dat === 'datakril' ? translateText("Bekor qilish") : "Bekor qilish" }}
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            {{ dat === 'datakril' ? translateText("Yuklash") : "Yuklash" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded shadow-lg w-80">
            <input v-model="summa" type="number"
                :placeholder="dat === 'datakril' ? translateText('To\'langan summa') : 'To\'langan summa'"
                class="w-full p-2 border text-black border-black rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300" />
            <div class="flex justify-end space-x-2">
                <button @click="submitPayment"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    {{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}
                </button>
                <button @click="modal = false"
                    class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
                </button>
            </div>
        </div>
    </div>
    <div v-if="paymentDetailsModal" @click="closePaymentDetailsModal($event)"
        class="absolute inset-0 z-50 flex justify-center items-start">
        <div :style="{ top: modalPosition.top + 10 + 'px', left: modalPosition.left - 143 + 'px' }" @click.stop
            class="absolute bg-gray-200 p-6 rounded-lg max-h-[450px] shadow-lg overflow-y-auto">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
                {{ dat === 'datakril' ? translateText("To'lov tafsilotlari") : "To'lov tafsilotlari" }}
            </h2>
            <div class="mb-4">
                <span class="text-green-600 font-medium"
                    v-if="selectedPaymentDetails && selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum <= 0">
                    {{ dat === 'datakril' ? translateText("To'langan") : "To'langan" }}
                </span>
                <span class="text-red-600 font-medium" v-else>
                    {{ dat === 'datakril' ? translateText("Qarzi") : "Qarzi" }}:
                    {{ selectedPaymentDetails[selectedPaymentDetails.length - 1].remainingSum }}{{ dat === 'datakril' ?
                        translateText("so'm") : "so'm" }}
                </span>
            </div>
            <ul class="list-none p-0 m-0">
                <li v-for="payment in selectedPaymentDetails" :key="payment.id" class="mt-1 border p-2 border-black">
                    <div class="text-black">
                        {{ dat === 'datakril' ? translateText("Jami summa") : "Jami summa" }}: {{ payment.TotalSum }}{{
                            dat === 'datakril' ? translateText("so'm") : "so'm" }}
                    </div>
                    <div class="text-black">
                        {{ dat === 'datakril' ? translateText("Qoldiq summa") : "Qoldiq summa" }}: {{
                            payment.remainingSum }}{{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                    </div>
                    <div class="text-black">
                        {{ dat === 'datakril' ? translateText("To'langan summa") : "To'langan summa" }}: {{
                            payment.paidSum }}{{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
                    </div>
                    <div class="text-black">
                        {{ dat === 'datakril' ? translateText("Vaqt") : "Vaqt" }}: {{ formatDate(payment.createdAt) }}
                    </div>
                </li>
            </ul>
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
import { da, el } from 'date-fns/locale';

const dat = inject('dat');
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const SectionId = route.params.id1;
const clientFiles = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const summa = ref(0);
const modal = ref(false);
const searchQuery = ref('');
const formData = ref({
    name: '',
    file: null,
});
const selectedItem = ref(null);
const receiptData = ref({});
const showReceipt = ref(false);
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const data = ref(null);
const modalPosition = ref({ top: 0, left: 0 });

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
        data.value = response.data.client;
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
    const data = new FormData();
    data.append('name', formData.value.name);
    data.append('file', formData.value.file);
    data.append('clientSectionId', parseInt(id));
    try {
        await axios.post(`${URL}/client-files`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        fetchClientFiles();
        showModal.value = false;
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

const submitPayment = async () => {
    if (!selectedItem.value) return;
    const paymentAmount = Number(summa.value);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert("Iltimos, to'g'ri summa kiriting!");
        return;
    }

    const paymentToUpdate = selectedItem.value.ClientPayment.find(payment => payment.remainingSum > 0);
    if (!paymentToUpdate) {
        alert("To'lov uchun amal qiluvchi qarz topilmadi!");
        return;
    }

    if (paymentAmount > paymentToUpdate.remainingSum) {
        alert("To'lov miqdori qoldiq qarzdan oshib ketmoqda!");
        return;
    }

    const updatedRemainingSum = paymentToUpdate.remainingSum - paymentAmount;

    try {
        await axios.post(`${URL}/client-pay`, {
            clientFileId: parseInt(selectedItem.value.id),
            TotalSum: paymentToUpdate.TotalSum || 0,
            paidSum: paymentAmount,
            remainingSum: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
        });

        paymentToUpdate.paidSum = (paymentToUpdate.paidSum || 0) + paymentAmount;
        paymentToUpdate.remainingSum = updatedRemainingSum >= 0 ? updatedRemainingSum : 0;

        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

        receiptData.value = {
            name: selectedItem.value.name,
            surname: selectedItem.value.surname,
            dadname: selectedItem.value.dadname,
            phone: selectedItem.value.phone,
            uniqueCode: selectedItem.value.contractId,
            paymentAmount: paymentAmount,
            remainingDebt: updatedRemainingSum >= 0 ? updatedRemainingSum : 0,
            date: formattedDate,
        };

        await generateCheckFile();
        printReceipt();
        modal.value = false;
        showReceipt.value = true;
    } catch (error) {
        console.error("To'lovni yangilashda yoki chekka saqlashda xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

const printReceipt = () => {
    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();
    img1.src = "/asd.jpg";
    img2.src = "/https___arizasud.uz_.png";
    img3.src = "/telegram.png";

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const receiptHTML = `
    <div style="font-size: 12px; width:100%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
        <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:18px;">To'lov cheki</h1>
        <table style="width: 100%; border-collapse: collapse; color: black; table-layout: fixed;">
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Mijoz:</td>
                <td style="color: black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Telefon Raqami:</td>
                <td style="color: black; line-height: 1.2;">${data.value.phone || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Shartnoma idsi:</td>
                <td style="color: black; line-height: 1.2;">№${clientFiles.value[0]?.contractId || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">To'langan:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.paymentAmount} so'm</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Qoldiq qarz:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.remainingDebt <= 0 ? "To‘landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Sana:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.date}</td>
            </tr>
        </table>
        <p style="text-align: center; color: black; justify-content: center; gap:3px; align-items: center; display:flex; margin-top:10px;">
            <img src="${img3.src}" alt="" style="max-width: 7%; height: auto;">
            <span style="font-size: 10px; color: black;">Telegram: +998 99 106 70 35</span>
        </p>
        <p style="text-align: center; font-size:10px; color: black;">"YURIST KONSUL KONSALTING" х/к</p>
        <div style="display: flex; flex-direction:column; justify-content: center; align-items: center; margin-top: 20px;">
            <img src="${img1.src}" alt="" style="max-width: 90%; height: auto;">
            <img src="${img2.src}" alt="" style="max-width: 90%; height: auto;">
        </div>
    </div>
  `;

    const originalContent = document.body.innerHTML;
    const style = document.createElement("style");
    style.innerHTML = `
    @media print {
      @page { margin: 0; }
      body { margin: 0; }
    }
  `;
    document.head.appendChild(style);

    document.body.innerHTML = receiptHTML;

    img1.onload = img2.onload = img3.onload = () => {
        window.print();
        document.body.innerHTML = originalContent;
        document.head.removeChild(style);
        window.location.reload();
    };

    img1.onerror = img2.onerror = img3.onerror = () => {
        console.error("Image failed to load");
        window.print();
        document.body.innerHTML = originalContent;
        document.head.removeChild(style);
        window.location.reload();
    };
};

const generateCheckFile = async () => {
    const receiptHTML = `
    <div style="font-size: 12px; max-width:23%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
        <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:18px;">To'lov cheki</h1>
        <table style="width: 100%; border-collapse: collapse; color: black; table-layout: fixed;">
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Mijoz:</td>
                <td style="color: black;">${data.value.name} ${data.value.surname} ${data.value.dadname}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Telefon Raqami:</td>
                <td style="color: black; line-height: 1.2;">${data.value.phone || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Shartnoma idsi:</td>
                <td style="color: black; line-height: 1.2;">№${clientFiles.value[0]?.contractId || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">To'langan:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.paymentAmount} so'm</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Qoldiq qarz:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.remainingDebt <= 0 ? "To‘landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Sana:</td>
                <td style="color: black; line-height: 1.2;">${receiptData.value.date}</td>
            </tr>
        </table>
        <p style="text-align: center; color: black; justify-content: center; gap:3px; align-items: center; display:flex; margin-top:10px;">
            <img src="/telegram.png" alt="" style="max-width: 7%; height: auto;">
            <span style="font-size: 10px; color: black;">Telegram: +998 99 106 70 35</span>
        </p>
        <p style="text-align: center; font-size:10px; color: black;">"YURIST KONSUL KONSALTING" х/к</p>
        <div style="display: flex; flex-direction:column; justify-content: center; align-items: center; margin-top: 20px;">
            <img src="/asd.jpg" alt="" style="max-width: 90%; height: auto;">
            <img src="/https___arizasud.uz_.png" alt="" style="max-width: 90%; height: auto;">
        </div>
    </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = receiptHTML;

    const options = {
        margin: [0, 0, 0, 0],
        filename: `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');
        const formData = new FormData();
        formData.append('check', pdfBlob, `receipt-${receiptData.value.uniqueCode || 'unknown'}.pdf`);
        formData.append('contractId', string(clientFiles.value[0]?.contractId));

        await axios.post(`${URL}/client/add-check/${SectionId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        console.error("Error generating or sending the check file:", error);
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
    return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const filteredFiles = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return clientFiles.value.filter(file => {
        const nameMatch = file.name?.toLowerCase().includes(query);
        const contractIdMatch = file.contractId?.toString().includes(query);
        return nameMatch || contractIdMatch;
    });
});

onMounted(() => {
    fetchClientFiles();
});
</script>

<style>
@media print {
    @page {
        size: 58mm auto;
        margin: 0;
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