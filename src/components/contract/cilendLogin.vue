<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-800">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Kirish</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Foydalanuvchi nomi</label>
                    <input type="text" id="username" v-model="username" placeholder="Foydalanuvchi nomini kiriting"
                        class="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div class="mb-6 relative">
                    <label for="password" class="block text-sm font-medium text-gray-700">Parol</label>
                    <div class="relative flex items-center">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="Parolni kiriting"
                            class="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 flex items-center">
                            <img :src="showPassword ? '/eyes.png' : '/eye.png'" alt="Ko'rinishni almashtirish"
                                class="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
                <button type="submit"
                    class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Kirish
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { URL } from '@/auth/url';
import { useRouter } from 'vue-router';
import { ref, inject } from 'vue';
import translateText from '@/auth/Translate';

const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
    errorMessage.value = ''; // Clear any previous error message
    if (username.value && password.value) {
        try {
            const response = await fetch(URL + '/client/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username.value,
                    password: password.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            const id = data.client?.id; // Extract the id from the response
            if (id) {
                router.push('/clientOpenRoom/' + id); // Use the id in the route
            } else {
                throw new Error('ID not found in response');
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.value = 'Kirish amalga oshmadi. Foydalanuvchi nomi yoki parolni tekshiring.';
        }
    } else {
        errorMessage.value = 'Iltimos, barcha maydonlarni to‘ldiring.';
    }
};
</script>