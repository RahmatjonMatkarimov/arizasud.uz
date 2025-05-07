<template>
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">
            <h2 class="text-xl font-semibold text-center text-gray-800 mb-4">Barmoq izini bilan qidirish</h2>

            <!-- 🖼️ Barmoq izi rasmi -->
            <div v-if="imageData" class="flex justify-center mb-4">
                <img :src="`data:image/png;base64,${imageData}`" alt="Barmoq izi rasmi"
                    class="w-40 h-48 object-contain border rounded-lg shadow" />
            </div>

            <!-- 🔘 Tugmalar -->
            <div class="flex flex-col space-y-3 mt-4">
                <button @click="fingerGet"
                    class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Barmoq izini olish (oʻng tomoni)
                </button>
                <button @click="fingerPost"
                    class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Barmoq izini qidirish
                </button>
                <button @click="$emit('close')"
                    class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Yopish
                </button>
            </div>
            <!-- ✅ Muvaffaqiyatli natija -->
            <div v-if="result" class="flex justify-center mt-4">
                <div @click="router.push('/Check/' + usserIds)"
                    class="cursor-pointer bg-green-500 w-full text-green-800 px-6 py-4 rounded-xl shadow-md text-center hover:bg-green-600 transition duration-300">
                    <p class="text-lg font-semibold">✅ Foydalanuvchi topildi:</p>
                    <p class="mt-2 text-xl font-bold">{{ result }}</p>
                    <p class="text-sm text-blue-600 mt-1">(Bosish orqali batafsil ko‘rish)</p>
                </div>
            </div>
            <div v-if="error" class="flex justify-center mt-4">
                <div
                    class="cursor-pointer bg-red-500 w-full text-red-800 px-6 py-4 rounded-xl shadow-md text-center hover:bg-red-600 transition duration-300">
                    <p class="mt-2 text-xl  font-bold">{{ error }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, toRef } from "vue"
import axios from "axios"
import { URL } from '@/auth/url.js'
import { useRouter } from "vue-router"

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
            error.value = "❌ Kechirasiz, ushbu barmoq izi bo‘yicha hech qanday foydalanuvchi topilmadi."
        }
    } catch (e) {
        error.value = "❌ Qidiruvda xatolik yuz berdi. Iltimos, internet ulanishingizni tekshirib, qayta urinib ko‘ring."
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
