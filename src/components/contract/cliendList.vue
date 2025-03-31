<template>
    <div class="max-w-[900px] mx-auto mt-5">
        <div class="flex justify-end">
            <input v-model="searchQuery" type="text" :placeholder="$t('qidiruv')"
                class="mb-4 border-2 p-2 rounded-lg text-black" />
        </div>

        <div v-if="filteredData.length > 0">
            <div v-for="item in filteredData" :key="item.id" class="p-3">
                <div
                    class="flex justify-between items-center p-4 border rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 transition">
                    <h1 @click="router.push('./CliendListAdmin/'+item.id)" class="text-gray-900 text-lg font-semibold">
                        {{ item.name }} {{ item.surname }} {{ item.dadname }}
                    </h1>
                    <div class="flex items-center space-x-2">
                        <button @click="openModal(item)"
                            :class="item.price <= 0 ? 'hidden' : 'flex bg-red-500 px-2 py-1 rounded-lg text-white'">
                            Qarzlarni to'lash
                        </button>
                        <h1 :class="item.price <= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                            {{ item.price <= 0 ? "To'liq to'langan" : `To'liq to'lanmagan: ` +
                                formatNumberWithDots(item.price) + ` so'm` }} </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-lg font-semibold mb-4">Qarzni to'lash</h2>
            <input v-model="summa" type="number" class="w-full p-2 border rounded mb-4" placeholder="To'langan summa" />
            <div class="flex justify-end space-x-2">
                <button @click="submitPayment"
                    class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                    To'lash
                </button>
                <button @click="closeModal" class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
                    Yopish
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { URL } from "../../auth/url.js";
import { useRouter } from "vue-router";

const router = useRouter(); 
const data = ref([]);
const modal = ref(false);
const searchQuery = ref("");
const summa = ref(null);
const selectedItem = ref(null);

const formatNumberWithDots = (number) => {
    if (!number || isNaN(number)) return "N/A";
    return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const GetClient = async () => {
    try {
        const response = await axios.get(`${URL}/client`);
        data.value = response.data;
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
    selectedItem.value = null;
    summa.value = null;
};

const submitPayment = async () => {
    if (!selectedItem.value) return;

    const paymentAmount = Number(summa.value);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert("Iltimos, to'g'ri summa kiriting!");
        return;
    }

    const newPrice = selectedItem.value.price - paymentAmount;
    if (newPrice < 0) {
        alert("To'langan summa qarzdan ko'p bo'lmasligi kerak!");
        return;
    }

    try {
        const response = await axios.put(`${URL}/client/${selectedItem.value.id}/price`, {
            price: newPrice,
        });
        console.log(response.data);
        

        const index = data.value.findIndex((item) => item.id === selectedItem.value.id);
        if (index !== -1) {
            data.value[index].price = newPrice;
        }
        closeModal();
    } catch (error) {
        console.error("To'lovni yangilashda xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

const filteredData = computed(() => {
    if (!searchQuery.value) return data.value;

    const query = searchQuery.value.toLowerCase();
    return data.value.filter((item) => {
        return (
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.surname && item.surname.toLowerCase().includes(query)) ||
            (item.dadname && item.dadname.toLowerCase().includes(query)) ||
            (item.phone && item.phone.toLowerCase().includes(query)) ||
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
    border-color: #a3aab5;
    color: black;
}

input:focus {
    border-color: #3b82f6;
}

div.transition:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
}
</style>