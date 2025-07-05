<template>
    <div class="flex items-center min-h-screen justify-center bg-white dark:bg-gray-900 p-4 transition-colors duration-300">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-[450px] border border-gray-300 dark:border-gray-700 transition-all duration-300">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center transition-colors duration-300">
                {{ formattedTitle }}
            </h2>
            
            <div v-for="(item, index) in localizedPaymentItems" :key="item.name" 
                 class="flex justify-between items-center p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer
                        transition-all duration-300 shadow-sm bg-white dark:bg-gray-700 
                        hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md dark:hover:shadow-lg
                        hover:border-gray-400 dark:hover:border-gray-500">
                <div>
                    <h1 class="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        {{ item.name }}
                    </h1>
                    <h1 class="text-sm text-gray-800 dark:text-gray-300 transition-colors duration-300">
                        {{ item.info }}
                    </h1>
                </div>
                
                <a :href="item.link" 
                   class="text-sm font-semibold bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md
                          hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 
                          hover:shadow-lg transform hover:scale-105 active:scale-95">
                    {{ formattedButtonText }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'

const dat = ref("datalotin")

const formattedTitle = computed(() => {
    if (dat.value === 'datalotin') {
        return "To'lov qilinadigan mahsulotlar"
    } else if (dat.value === 'datakril') {
        return "Тўлов қилинадиган маҳсулотлар"
    } else {
        return "To'lov qilinadigan mahsulotlar"
    }
})

const formattedButtonText = computed(() => {
    return dat.value === 'datakril' ? "Тўлов қилиш" : "To'lov qilish"
})

const paymentItems = [
    {
        name: "eskiz.uz",
        link: "https://eskiz.uz/",
        infoLat: "SMS habarlar uchun to'lov",
        infoKril: "SMS хабарлар учун тўлов"
    },
    {
        name: "beget.com",
        link: "https://beget.com/",
        infoLat: "Server uchun to'lov",
        infoKril: "Сервер учун тўлов"
    }
]

const localizedPaymentItems = computed(() => {
    return paymentItems.map(item => ({
        name: item.name,
        link: item.link,
        info: dat.value === 'datakril' ? item.infoKril : item.infoLat
    }))
})
</script>