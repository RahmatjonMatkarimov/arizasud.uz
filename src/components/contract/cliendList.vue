<template>
    <div class="max-w-[900px] mx-auto mt-5">
        <div class="flex justify-between items-center mb-4">
            <input v-model="searchQuery" type="text" 
                :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
                class="border p-2 rounded text-black focus:outline-none focus:ring focus:ring-blue-300" />
            <div v-if="showCheckboxes" class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="hidden" id="selectAll" />
                <label for="selectAll"
                    class="bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
                    {{ dat === 'datakril' ? translateText("Barchasini belgilash") : "Barchasini belgilash" }}
                </label>
            </div>
        </div>

        <div v-if="filteredData.length > 0">
            <div class="flex space-x-2 mb-4">
                <button @click="toggleCheckboxes"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    {{ dat === 'datakril' ? translateText(showCheckboxes ? 'Bekor qilish' : 'O\'chirish') : (showCheckboxes ? 'Bekor qilish' : 'O\'chirish') }}
                </button>
                <button v-if="showCheckboxes" @click="deleteSelectedClients"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                    {{ dat === 'datakril' ? translateText("Belgilanganlarni o'chirish") : "Belgilanganlarni o'chirish" }}
                </button>
            </div>
            <div v-for="item in filteredData" :key="item.id" class="p-3">
                <div
                    class="flex justify-between items-center p-4 border rounded-lg shadow bg-gray-200 hover:bg-gray-300 transition">
                    <div class="flex items-center space-x-2">
                        <input v-if="showCheckboxes" type="checkbox" v-model="selectedClientIds" :value="item.id"
                            class="form-checkbox h-4 w-4 text-blue-500 focus:ring focus:ring-blue-300" />
                        <h1 @click="router.push('/Check/' + item.id)"
                            class="text-gray-900 text-lg font-medium cursor-pointer">
                            {{ dat === 'datakril' 
                                ? translateText(item.name) + ' ' + translateText(item.surname) + ' ' + translateText(item.dadname) 
                                : item.name + ' ' + item.surname + ' ' + item.dadname }}
                        </h1>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click="openModal(item)"
                            :class="item.price <= 0 ? 'hidden' : 'bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'">
                            {{ dat === 'datakril' ? translateText("Qarzlarni to'lash") : "Qarzlarni to'lash" }}
                        </button>
                        <h1 :class="item.price <= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                            {{ item.price <= 0 
                                ? (dat === 'datakril' ? translateText("To'liq to'langan") : "To'liq to'langan") 
                                : (dat === 'datakril' 
                                    ? translateText("To'liq to'lanmagan: ") + formatNumberWithDots(item.price) + translateText(" so'm") 
                                    : "To'liq to'lanmagan: " + formatNumberWithDots(item.price) + " so'm") }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded shadow-lg w-80">
            <h2 class="text-lg font-medium mb-4 text-center">
                {{ dat === 'datakril' ? translateText("Qarzni to'lash") : "Qarzni to'lash" }}
            </h2>
            <input v-model="summa" type="number"
                :placeholder="dat === 'datakril' ? translateText('To\'langan summa') : 'To\'langan summa'"
                class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300" />
            <div class="flex justify-end space-x-2">
                <button @click="submitPayment"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    {{ dat === 'datakril' ? translateText("To'lash") : "To'lash" }}
                </button>
                <button @click="closeModal"
                    class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate.js";

const dat = inject("dat");
const router = useRouter();
const data = ref([]);
const modal = ref(false);
const searchQuery = ref("");
const summa = ref(null);
const selectedItem = ref(null);
const showReceipt = ref(false);
const receiptData = ref({});
const selectedClientIds = ref([]);
const selectAll = ref(false);
const showCheckboxes = ref(false);

const formatNumberWithDots = (number) => {
    return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const GetClient = async () => {
    try {
        const response = await axios.get(`${URL}/client`);
        data.value = response.data;
        console.log("Client data:", data.value);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};

const openModal = (item) => {
    selectedItem.value = item;
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
    summa.value = null;
};

const printReceipt = () => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = "https://arizasud.uz/asd.jpg";
    img2.src = "https://arizasud.uz/https___arizasud.uz_.png";

    const receiptHTML = `
    <div style="font-size: 13px; width:100%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
        <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:20px;">To'lov cheki</h1>
        <table style="width: 100%; border-collapse: collapse; color: black;">
            <tr><td style="color: black;">Mijoz:</td><td style="color: black;">${receiptData.value.name} ${receiptData.value.surname} ${receiptData.value.dadname}</td></tr>
            <tr><td style="color: black;">Telefon Raqami:</td><td style="color: black;">+${receiptData.value.phone || "Mavjud emas"}</td></tr>
            <tr><td style="color: black;">Shartnoma idsi:</td><td style="color: black;">${receiptData.value.uniqueCode || "Mavjud emas"}</td></tr>
            <tr><td style="color: black;">To'langan:</td><td style="color: black;">${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</td></tr>
            <tr><td style="color: black;">To'lanishi Kerak:</td><td style="color: black;">${receiptData.value.remainingDebt <= 0 ? "To‘landi" : formatNumberWithDots(receiptData.value.remainingDebt) + " so'm"}</td></tr>
            <tr><td style="color: black;">Sana:</td><td style="color: black;">${receiptData.value.date}</td></tr>
        </table>
        <p style="text-align: center; color: black;">Tel: +998 99 999 99 99</p>
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
            @page {
                margin: 0;
            }
            body {
                margin: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = receiptHTML;

    img1.onload = img2.onload = () => {
        window.print();
        document.body.innerHTML = originalContent;
        document.head.removeChild(style);
        window.location.reload();
    };

    img1.onerror = img2.onerror = () => {
        console.error("Image failed to load");
        window.print();
        document.body.innerHTML = originalContent;
        document.head.removeChild(style);
        window.location.reload();
    };
};

const submitPayment = async () => {
    if (!selectedItem.value) return;

    const paymentAmount = Number(summa.value);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert("Iltimos, to'g'ri summa kiriting!");
        return;
    }

    const newPrice = selectedItem.value.price - paymentAmount;

    try {
        await axios.post(`${URL}/client/update-price/${selectedItem.value.id}`, { price: newPrice });
        const index = data.value.findIndex((item) => item.id === selectedItem.value.id);
        if (index !== -1) {
            data.value[index].price = newPrice;
        }

        const currentDate = new Date();
        receiptData.value = {
            name: selectedItem.value.name,
            surname: selectedItem.value.surname,
            dadname: selectedItem.value.dadname,
            phone: selectedItem.value.phone,
            uniqueCode: selectedItem.value.contractId,
            paymentAmount: paymentAmount,
            remainingDebt: newPrice,
            date: currentDate.toLocaleDateString("uz-UZ"),
        };

        const receiptHTML = `
    <html>
      <head>
        <title>To'lov Cheki</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: black;
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            width: 100%;
            max-width: 400px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          .receipt-header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .receipt-content p {
            margin: 5px 0;
          }
          .receipt-footer {
            text-align: right;
            margin-top: 20px;
            font-size: 12px;
            color: gray;
          }
          .receipt-images {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }
          .receipt-images img {
            max-width: 90%;
            height: auto;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <h2 class="receipt-header">To'lov Cheki</h2>
          <div class="receipt-content">
            <p><strong>Mijoz:</strong> ${receiptData.value.name} ${receiptData.value.surname} ${receiptData.value.dadname}</p>
            <p><strong>Telefon:</strong> ${receiptData.value.phone || "Mavjud emas"}</p>
            <p><strong>Shartnoma idsi:</strong> ${receiptData.value.uniqueCode || "Mavjud emas"}</p>
            <p><strong>To'langan Summa:</strong> ${formatNumberWithDots(receiptData.value.remainingDebt)} so'm</p>
            <p><strong>Qoldiq Qarz:</strong> ${formatNumberWithDots(receiptData.value.paymentAmount)} so'm</p>
            <p><strong>Sana:</strong> ${receiptData.value.date}</p>
          </div>
          <div class="receipt-images">
            <img src="https://arizasud.uz/asd.jpg" alt="Image 1">
            <img src="https://arizasud.uz/https___arizasud.uz_.png" alt="Image 2">
          </div>
          <div class="receipt-footer">
            "YURIST KONSUL KONSALTING"
          </div>
        </div>
      </body>
    </html>
  `;

        // Save receipt as an HTML file
        const blob = new Blob([receiptHTML], { type: "text/html" });
        const formData = new FormData();
        formData.append("check", blob, "receipt.html");

        // Send the file to the backend with the client's ID
        await axios.post(`${URL}/client/add-check/${selectedItem.value.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Print the receipt
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = receiptHTML;
        document.body.innerHTML = originalContent;
        printReceipt();
        closeModal();
        showReceipt.value = true;
    } catch (error) {
        console.error("To'lovni yangilashda yoki chekka saqlashda xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

const deleteSelectedClients = async () => {
    if (selectedClientIds.value.length === 0) {
        alert("Iltimos, o'chirish uchun mijozlarni belgilang!");
        return;
    }

    try {
        await axios.delete(`${URL}/client/deleteMany`, { data: { ids: selectedClientIds.value } });
        data.value = data.value.filter(item => !selectedClientIds.value.includes(item.id));
        selectedClientIds.value = [];
        alert("Belgilangan mijozlar muvaffaqiyatli o'chirildi!");
    } catch (error) {
        console.error("Mijozlarni o'chirishda xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedClientIds.value = filteredData.value.map(item => item.id);
    } else {
        selectedClientIds.value = [];
    }
};

const toggleCheckboxes = () => {
    showCheckboxes.value = !showCheckboxes.value;
    if (!showCheckboxes.value) {
        // Reset selection when checkboxes are hidden
        selectedClientIds.value = [];
        selectAll.value = false;
    }
};

watch(selectedClientIds, (newVal) => {
    selectAll.value = newVal.length === filteredData.value.length && newVal.length > 0;
});

const filteredData = computed(() => {
    if (!searchQuery.value) return data.value;

    const query = searchQuery.value.toLowerCase();
    return data.value.filter((item) => {
        return (
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.surname && item.surname.toLowerCase().includes(query)) ||
            (item.dadname && item.dadname.toLowerCase().includes(query)) ||
            (item.phone && item.phone.toLowerCase().includes(query)) ||
            (item.phone && item.contractId.toLowerCase().includes(query)) ||
            (item.price && item.price.toString().includes(query)) ||
            (item.uniqueCode && item.uniqueCode.toLowerCase().includes(query)) ||
            (item.userCode && item.userCode.toLowerCase().includes(query))
        );
    });
});

onMounted(GetClient);
</script>

<style scoped>
input {
    transition: all 0.3s ease;
    border-color: #d1d5db;
    color: black;
}

input:focus {
    border-color: #3b82f6;
    outline: none;
}

button {
    transition: all 0.3s ease;
}

button:hover {
    transform: scale(1.02);
}

div.transition:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
}

/* Simplified modal styles */
div.fixed {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
}

div.bg-white {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

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