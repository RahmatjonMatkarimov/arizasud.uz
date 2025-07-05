<template>
    <!-- Modal Overlay with enhanced backdrop -->
    <div v-if="isOpen" 
         class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm 
                flex items-center justify-center p-4 transition-all duration-300">
        
        <!-- Modal Container -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-gray-900/50 
                    w-full max-w-md mx-auto relative transform transition-all duration-300 
                    border-2 border-gray-200 dark:border-gray-700
                    hover:shadow-3xl dark:hover:shadow-gray-900/70">
            
            <!-- Close Button -->
            <button @click="$emit('close')"
                    class="absolute top-4 right-4 p-2 rounded-full 
                           bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                           text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                           transition-all duration-200 transform hover:scale-110 active:scale-95
                           z-10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <!-- Header -->
            <div class="px-8 pt-8 pb-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div class="mb-4">
                    <div class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 
                                dark:from-blue-600 dark:to-indigo-700 rounded-full 
                                flex items-center justify-center shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                        </svg>
                    </div>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ dat === 'datakril' ? translateText('Barmoq izini bilan qidirish') : 'Barmoq izini bilan qidirish' }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                    {{ dat === 'datakril' ? translateText('Barmoq izingizni skanerlang va qidiring') : 'Barmoq izingizni skanerlang va qidiring' }}
                </p>
            </div>

            <!-- Content Area -->
            <div class="px-8 py-6">
                
                <!-- Fingerprint Image Display -->
                <div v-if="imageData" 
                     class="flex justify-center mb-6 group">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 
                                    rounded-2xl blur-sm opacity-30 group-hover:opacity-50 
                                    transition-opacity duration-300"></div>
                        <img :src="`data:image/png;base64,${imageData}`" 
                             alt="Barmoq izi rasmi"
                             class="relative w-40 h-48 object-contain border-2 border-gray-300 dark:border-gray-600 
                                    rounded-2xl shadow-lg bg-white dark:bg-gray-700 p-2
                                    transform group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full 
                                    flex items-center justify-center shadow-md animate-pulse">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <!-- Scan Fingerprint Button -->
                    <button @click="fingerGet"
                            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                                   dark:from-blue-500 dark:to-indigo-500
                                   hover:from-blue-700 hover:to-indigo-700 
                                   dark:hover:from-blue-600 dark:hover:to-indigo-600
                                   text-white font-semibold py-3 px-6 rounded-xl 
                                   shadow-lg hover:shadow-xl dark:shadow-blue-900/25
                                   transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                                   flex items-center justify-center space-x-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                        </svg>
                        <span>{{ dat === 'datakril' ? translateText('Barmoq izini olish (oʻng tomoni)') : 'Barmoq izini olish (oʻng tomoni)' }}</span>
                    </button>

                    <!-- Search Button -->
                    <button v-if="imageData" 
                            @click="fingerPost"
                            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                                   dark:from-green-500 dark:to-emerald-500
                                   hover:from-green-700 hover:to-emerald-700 
                                   dark:hover:from-green-600 dark:hover:to-emerald-600
                                   text-white font-semibold py-3 px-6 rounded-xl 
                                   shadow-lg hover:shadow-xl dark:shadow-green-900/25
                                   transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                                   flex items-center justify-center space-x-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span>{{ dat === 'datakril' ? translateText('Barmoq izini qidirish') : 'Barmoq izini qidirish' }}</span>
                    </button>

                    <!-- Close Button -->
                    <button @click="$emit('close')"
                            class="w-full bg-gray-500 dark:bg-gray-600 
                                   hover:bg-gray-600 dark:hover:bg-gray-700
                                   text-white font-semibold py-3 px-6 rounded-xl 
                                   shadow-lg hover:shadow-xl
                                   transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                                   flex items-center justify-center space-x-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span>{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}</span>
                    </button>
                </div>

                <!-- Success Result -->
                <div v-if="result" 
                     class="mt-6 transform transition-all duration-500">
                    <div @click="router.push('/Check/' + usserIds)"
                         class="cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 
                                dark:from-green-900/20 dark:to-emerald-900/20
                                border-2 border-green-200 dark:border-green-700
                                hover:border-green-300 dark:hover:border-green-600
                                px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl 
                                transition-all duration-300 transform hover:scale-[1.02]
                                group">
                        
                        <!-- Success Icon -->
                        <div class="flex items-center justify-center mb-4">
                            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 
                                        rounded-full flex items-center justify-center shadow-lg
                                        group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                                {{ dat === 'datakril' ? translateText('✅ Foydalanuvchi topildi:') : '✅ Foydalanuvchi topildi:' }}
                            </p>
                            <p class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {{ dat === 'datakril' ? translateText(result) : result }}
                            </p>
                            <p class="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1">
                                <span>{{ dat === 'datakril' ? translateText('(Bosish orqali batafsil ko\'rish)') : '(Bosish orqali batafsil ko\'rish)' }}</span>
                                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Error Result -->
                <div v-if="error" 
                     class="mt-6 transform transition-all duration-500">
                    <div class="bg-gradient-to-r from-red-50 to-pink-50 
                               dark:from-red-900/20 dark:to-pink-900/20
                               border-2 border-red-200 dark:border-red-700
                               px-6 py-6 rounded-2xl shadow-lg">
                        
                        <!-- Error Icon -->
                        <div class="flex items-center justify-center mb-4">
                            <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 
                                        rounded-full flex items-center justify-center shadow-lg
                                        animate-pulse">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="text-lg font-bold text-red-800 dark:text-red-300">
                                {{ dat === 'datakril' ? translateText(error) : error }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="Loading && Loading.value" 
                     class="mt-6 flex flex-col items-center justify-center py-8">
                    <div class="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 
                                border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
                    <p class="text-gray-600 dark:text-gray-400 font-medium">
                        {{ dat === 'datakril' ? translateText('Jarayon davom etmoqda...') : 'Jarayon davom etmoqda...' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, onUnmounted, ref, toRef } from "vue"
import axios from "axios"
import { URL } from '@/auth/url.js'
import { useRouter } from "vue-router"
import translateText from "@/auth/Translate"
import { onMounted } from "vue"

const dat = ref(localStorage.getItem("til") || "datalotin");
const props = defineProps(['isOpen'])
const isOpen = toRef(props, 'isOpen')
const bioId = ref("")
const result = ref("")
const error = ref("")
const imageData = ref("")
const Loading = inject('isLoading')
const router = useRouter()
const usserIds = ref(null)

// ✅ POST: Barmoq izini qidirish
const fingerPost = async () => {
    Loading.value = true
    result.value = ""
    error.value = ""
    try {
        const response = await axios.post("http://localhost:2181/search", {
            bio_id: bioId.value
        }, {
            headers: { "Content-Type": "application/json" }
        })

        if (response.data.user_id) {
            usserIds.value = response.data.user_id
            await clientGet(response.data.user_id)
        } else {
            error.value = "❌ Kechirasiz, ushbu barmoq izi bo'yicha hech qanday foydalanuvchi topilmadi."
        }
    } catch (e) {
        error.value = "❌ Qidiruvda xatolik yuz berdi. Iltimos, internet ulanishingizni tekshirib, qayta urinib ko'ring."
    } finally {
        Loading.value = false
    }
}

// ✅ GET: Foydalanuvchini olish
const clientGet = async (id) => {
    try {
        const res = await axios.get(URL + '/client/' + id)
        result.value = `${res.data.name} ${res.data.surname} ${res.data.dadname}`
    } catch (e) {
        error.value = "❌ Foydalanuvchi haqida maʼlumotlarni yuklashda xatolik yuz berdi."
        result.value = ""
    }
}

// ✅ GET: Barmoq izini olish
const fingerGet = async () => {
    Loading.value = true
    result.value = ""
    error.value = ""
    try {
        const response = await axios.get("http://localhost:2181")
        bioId.value = response.data.bio_id || ""
        imageData.value = response.data.image || ""
    } catch (e) {
        error.value = "❌ Barmoq izini olishda xatolik yuz berdi. Iltimos, skaner ulangani va dastur ishga tushganini tekshiring."
        imageData.value = ""
    } finally {
        Loading.value = false
    }
}
</script>

<style scoped>
/* Enhanced backdrop blur */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

/* Custom animation for success/error states */
@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slideInUp {
    animation: slideInUp 0.3s ease-out;
}

/* Enhanced shadows */
.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

.dark .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.4);
}

/* Pulsing success indicator */
@keyframes pulse-success {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
}

.animate-pulse-success {
    animation: pulse-success 2s infinite;
}

/* Smooth transitions for all interactive elements */
button {
    transform-origin: center;
}

button:active {
    transform: scale(0.95);
}

/* Custom focus states */
button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark button:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Loading spinner enhancement */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Hover glow effects */
.hover-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.dark .hover-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}
</style>