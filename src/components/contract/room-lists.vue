<template>
    <div class="flex justify-end">
        <input v-model="searchQuery" type="text"
            :placeholder="dat === 'datakril' ? translateText($t('qidiruv')) : $t('qidiruv')"
            class="border p-2 rounded text-black focus:outline-none border-black mt-4 mr-4 focus:ring focus:ring-blue-300" />
    </div>
    <div class="flex justify-center p-5 rounded-lg max-w-full overflow-x-auto">
        <div class="w-full max-w-3xl bg-gray-300 p-4 rounded-lg">
            <!-- File List -->
            <ul class="list-none p-0 m-0">
                <li v-for="file in filteredFiles" @click="router.push('/room-file/' + file.id)" :key="file.id"
                    class="py-2 flex justify-between items-center relative z-20 bg-white p-2 my-2">
                    <a target="_blank" class="text-gray-800 hover:underline">
                        {{ dat === 'datakril' ? translateText(file.name) : file.name }}
                    </a>
                    <div class="flex items-center relative z-50 gap-4">
                        <div v-if="file.ClientPayment && file.ClientPayment.length" class="text-sm">
                            <span class="text-green-600"
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
                        <div class="text-black">
                            {{ formatDate(file.createdAt) }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <!-- Payment Details Modal -->
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
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

const dat = inject('dat');
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const clientFiles = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const paymentDetailsModal = ref(false);
const selectedPaymentDetails = ref(null);
const modalPosition = ref({ top: 0, left: 0 });
const data = ref(null);

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

const openPaymentDetailsModal = (file, event) => {
    selectedPaymentDetails.value = file.ClientPayment;
    const rect = event.target.getBoundingClientRect();
    modalPosition.value = {
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX,
    };
    paymentDetailsModal.value = true;
};

const closePaymentDetailsModal = (event) => {
    if (event.target === event.currentTarget) {
        paymentDetailsModal.value = false;
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
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
/* Print styles are removed since they are related to receipt printing */
</style>