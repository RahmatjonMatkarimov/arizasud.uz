<template>
    <div v-if="isOpen" class="absolute z-40 inset-0 flex justify-center items-center bg-black bg-opacity-80">
        <div class="container">
            <!-- 🖼️ Base64 rasm -->
            <div v-if="imageData" class="image-preview">
                <img :src="`data:image/png;base64,${imageData}`" alt="Barmoq izi rasmi" />
            </div>

            <!-- 🔘 Tugmalar -->
            <div class="buttons">
                <button @click="fingerPost">Barmoq izini qidirish</button>
                <button @click="fingerGet">Barmoq izini olish (ong tomoni)</button>
                <button @click="$emit('close')">Yopish</button>
            </div>

            <!-- 📋 Natija -->
            <div class="result">
                <h2 class="text-black">Natija:</h2>
                <pre class="text-black">{{ result }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from "vue"
import axios from "axios"
import { URL } from '@/auth/url.js'
import { toRef } from 'vue'
const props = defineProps(['isOpen'])
const isOpen = toRef(props, 'isOpen')
const bioId = ref("")
const result = ref("")
const imageData = ref("") // Rasm uchun base64 ma'lumot
const Loading = inject('isLoading');


const fingerPost = async () => {
    Loading.value= true
    try {
        const response = await axios.post(`http://localhost:2181/search`, {
            bio_id: bioId.value
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        result.value = JSON.stringify(response.data, null, 2)
    } catch (error) {
        result.value = "Xatolik: " + error.message
    } finally {
        Loading.value = false
    }
}

const fingerGet = async () => {
    Loading.value = true
    try {
        const response = await axios.get("http://localhost:2181")
        result.value = JSON.stringify(response.data, null, 2)
        bioId.value = response.data.bio_id || ""

        if (response.data.image) {
            imageData.value = response.data.image
        } else {
            imageData.value = ""
        }
    } catch (error) {
        result.value = "Xatolik: " + error.message
        imageData.value = ""
    } finally {
        Loading.value = false
    }
}
</script>

<style scoped lang="scss">
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border: 5px solid #2980b9;
    background: #f9f9f9;
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.image-preview {
    margin-bottom: 1.5rem;
    img {
        margin: 0 auto;
        max-width: 100%;
        max-height: 300px;
        border-radius: 0.5rem;
        border: 2px solid #ccc;
    }
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;

    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: none;
        background-color: #3498db;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #2980b9;
        }
    }
}

.result {
    background-color: #fff;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
