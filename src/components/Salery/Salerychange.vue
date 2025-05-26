<template>
    <div class="dark:bg-[#1a2642] bg-gray-200 dark:text-gray-200 p-7 min-h-screen">
        <div class="dark:bg-black dark:bg-opacity-20 bg-white container mx-auto rounded-lg shadow-2xl p-6">
            <div class="flex justify-between items-center mb-6 pb-4 border-b">
                <div class="dark:text-white text-black dark:text-blue-400 font-medium cursor-pointer" @click="router.push('/salary')">
                    {{ dat === 'datakril' ? translateText('← Orqaga qaytish') : '← Orqaga qaytish' }}
                </div>
            </div>
            <div>
                <div v-for="item in users" :key="item.id">
                    <div class="flex gap-4">
                        <div class="flex relative justify-between w-full">
                            <div class="flex flex-col w-full gap-1">
                                <img :src="URL + '/upload/' + item.img" class="size-[200px] border-2" alt="{{ dat === 'datakril' ? translateText('Ishchi rasmi') : 'Ishchi rasmi' }}">
                                <h1 class="text-md">
                                    <span class="text-md font-bold">{{ dat === 'datakril' ? translateText('F.I.O:') : 'F.I.O:' }} </span> {{ dat === 'datakril' ? translateText(`${item.name} ${item.surname} ${item.dadname}`) : `${item.name} ${item.surname} ${item.dadname}` }}
                                </h1>
                                <h1 class="text-md">
                                    <span class="text-md font-bold">{{ dat === 'datakril' ? translateText('Ishchini telefon raqami:') : 'Ishchini telefon raqami:' }} </span> {{ item.phone }}
                                </h1>
                                <h1 class="text-md">
                                    <span class="text-md font-bold">{{ dat === 'datakril' ? translateText('Ishchini lavozimi:') : 'Ishchini lavozimi:' }} </span> {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                                </h1>
                            </div>
                            <div class="flex gap-6">
                                <div v-for="card in cards" :key="card.title"
                                    @click="card.modal ? openRejectModal() : null ,card.modal1 ? openModal('To\'liq hisob', $event) : null"
                                    :class="`w-[400px] h-[180px] rounded-xl shadow p-6 ${card.bg}`">
                                    <div class="flex items-center gap-2">
                                        <img class="w-[30px] " :src="card.icon" alt="{{ dat === 'datakril' ? translateText('Belgi') : 'Belgi' }}">
                                        <div class="flex items-center gap-2 mb-2">
                                            <h2 class="text-xl font-semibold dark:text-white text-gray-800">{{ dat === 'datakril' ? translateText(card.title) : card.title }}</h2>
                                        </div>
                                    </div>
                                    <p :class="card.colorClass + ' text-3xl font-bold' ">{{ dots(card.value) }} {{ dat === 'datakril' ? translateText('so\'m') : 'so\'m' }}</p>
                                    <p class="text-sm dark:text-white text-black mt-1">
                                        <span class="font-semibold text-md">{{ dat === 'datakril' ? translateText(card.increase) : card.increase }}</span>
                                    </p>
                                </div>
                            </div>
                            <div></div>
                            <div class="flex absolute flex-wrap right-3 bottom-3 items-end">
                                <div class="flex flex-wrap items-end gap-4">
                                <button @click="bonus(item)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {{ dat === 'datakril' ? translateText('Bonus maoshni qo\'shish') : 'Bonus maoshni qo\'shish' }}
                                </button>
                                <button @click="handleCalculateSalary(item)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {{ dat === 'datakril' ? translateText('Oylik maoshni hisoblash') : 'Oylik maoshni hisoblash' }}
                                </button>
                                    <select v-model="selectedYear" class="border border-gray-500 dark:border-gray-200 bg-[#fff0] rounded-md p-2">
                                        <option class="dark:text-white text-black" value="">{{ dat === 'datakril' ? translateText('Yil tanlang') : 'Yil tanlang' }}</option>
                                        <option class="dark:text-white text-black" v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                    </select>
                                    <select v-model="selectedMonth" class="border border-gray-500 dark:border-gray-200 bg-[#fff0] rounded-md p-2">
                                        <option class="dark:text-white text-black" value="">{{ dat === 'datakril' ? translateText('Oy tanlang') : 'Oy tanlang' }}</option>
                                        <option class="dark:text-white text-black" v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="w-full border-collapse mt-4">
                        <thead>
                            <tr class="w-full grid dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg border-black/50 border shadow-lg hover:shadow-blue-500/5  duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl bg-white object-cover grid-cols-6 gap-2 items-center">
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Ishga kelgan') : 'Ishga kelgan' }}</th>
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Tushlikga ketgan') : 'Tushlikga ketgan' }}</th>
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Tushlikdan kelgan') : 'Tushlikdan kelgan' }}</th>
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Ishdan chiqgan') : 'Ishdan chiqgan' }}</th>
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Ishchi kuni') : 'Ishchi kuni' }}</th>
                                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Jarimalar') : 'Jarimalar' }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="history in filteredWorkDays(item.workDays)" :key="history.id"
                                class="text-center">
                                <td colspan="3" class="pt-2">
                                    <div class="flex justify-between rounded-md py-2 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] border border-black/50 hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl bg-white items-center">
                                        <div class="w-full grid grid-cols-6 gap-2 items-center">
                                            <div class="text-center text-[16px]">{{ filteridTime(history.checkIn) }}</div>
                                            <div class="text-center text-[16px]">{{ filteridTime(history.lunchStart) }}</div>
                                            <div class="text-center text-[16px]">{{ filteridTime(history.lunchEnd) }}</div>
                                            <div class="text-center text-[16px]">{{ filteridTime(history.checkOut) }}</div>
                                            <div class="text-center text-[16px]">{{ isoToUzbekistanTime(history.createdAt) }}</div>
                                            <div class="text-center text-[16px]">{{ formatNumberWithDots(history.lateDeduction) }} {{ dat === 'datakril' ? translateText('so\'m') : 'so\'m' }}</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!filteredWorkDays(item.workDays).length">
                                <td colspan="5" class="text-center py-4">{{ dat === 'datakril' ? translateText('Ma\'lumot topilmadi') : 'Ma\'lumot topilmadi' }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-between items-center mt-4 gap-4">
                        <div>
                        {{ dat === 'datakril' ? translateText('Jami') : 'Jami' }}: {{ filteredWorkDays(item.workDays).length }}
                        </div>
                        <button @click="downloadExcel" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            {{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="salary" class="bg-black inset-0 flex fixed bg-opacity-70 justify-center items-center">
                <div v-if="salary" class="p-6 max-w-md mx-auto bg-white dark:bg-gray-700 rounded-xl w-[400px] shadow-md space-y-4">
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Oy:') : 'Oy:' }}</strong> {{ salary.month }}</p>
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jami soat:') : 'Jami soat:' }}</strong> {{ salary.totalHours }}</p>
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jami maosh:') : 'Jami maosh:' }}</strong> {{ salary.totalSalary }}</p>
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Bonus:') : 'Bonus:' }}</strong> {{ salary.bonus }}</p>
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jarimalar:') : 'Jarimalar:' }}</strong> {{ salary.deductions }}</p>
                    <p class="dark:text-white text-black text-[20px]"><strong class="dark:text-white text-black text-[20px]">{{ dat === 'datakril' ? translateText('Yakuniy maosh:') : 'Yakuniy maosh:' }}</strong> {{ salary.finalSalary }}</p>
                    <button class="w-full py-2 dark:bg-gray-900 bg-gray-300 text-[20px] text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400"
                        @click="salary = false">
                        {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                    </button>
                </div>
            </div>

            <!-- Modal oynasi -->
            <div v-if="modals" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
                    <h2 class="text-md font-semibold text-gray-700">{{ dat === 'datakril' ? translateText('Bonus yoki jarima qo‘shish') : 'Bonus yoki jarima qo‘shish' }}</h2>
                    <div class="space-y-2">
                        <label class="block text-md font-medium text-gray-600">{{ dat === 'datakril' ? translateText('Summa') : 'Summa' }}</label>
                        <input
                          v-model="formattedTotal"
                          type="text"
                          class="w-full border border-gray-300 dark:text-white text-black rounded text-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          :placeholder="dat === 'datakril' ? translateText('Masalan: 50.000') : 'Masalan: 50.000'"
                        />
                        <label class="block text-md font-medium text-gray-600">{{ dat === 'datakril' ? translateText('Sabab') : 'Sabab' }}</label>
                        <input v-model="sabab" type="text"
                            class="w-full border border-gray-300 dark:text-white text-black rounded text-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="dat === 'datakril' ? translateText('Sabab kiriting') : 'Sabab kiriting'" />
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button class="px-4 py-2 bg-gray-300 text-xl text-gray-800 rounded hover:bg-gray-400"
                            @click="modals = false">
                            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                        </button>
                        <button class="px-4 py-2 bg-blue-600 text-xl text-white rounded hover:bg-blue-700"
                            @click="addBonus">
                            {{ dat === 'datakril' ? translateText('Qo‘shish') : 'Qo‘shish' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="reject" class="fixed inset-0 bg-black flex justify-center z-40 bg-opacity-70">
        <div
            class="dark:bg-gray-700 bg-gray-300  text-gray-800 dark:text-gray-200 top-20 relative h-[85%] w-full mx-auto max-w-[70%] rounded-lg shadow-lg overflow-y-auto">
            <h1 class="text-2xl border-b-2 p-4 border-gray-500 font-semibold">{{ dat === 'datakril' ? translateText('Bonuslar ro\'yxati') : 'Bonuslar ro\'yxati' }}</h1>
    <button @click="reject = false"
          class="text-[50px] absolute -top-2 right-4 cursor-pointer dark:text-gray-400 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in">
          ×
    </button>
            <div class="p-4 space-y-3">
                <div v-for="(item, index) in users[0].Bonus" :key="item.id"
                    class="dark:bg-gray-600 bg-white rounded-lg p-4 shadow flex justify-between items-center dark:hover:bg-gray-500 transition">
                    <div class="flex items-center gap-4">
                        <p class="text-md ">#{{ index + 1 }}</p>
                        <p class="text-xl font-medium">{{ item.description }}</p>
                    </div>
                    <p class="dark:text-green-400 text-green-700 font-semibold text-xl">{{ item.amount }} {{ dat === 'datakril' ? translateText('so\'m') : 'so\'m' }}</p>
                </div>
            </div>
        </div>
    </div>
        <div 
          v-if="isModalOpen" 
          class="modal fixed bg-white dark:bg-slate-800 rounded-xl p-8  shadow-xl z-50 border border-gray-100 dark:border-slate-700 bg-opacity-100 dark:bg-opacity-100 transition-all duration-300"
          :style="{ top: `${modalPosition.top - 40}px`, left: `${modalPosition.left - 400 }px` }"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {{ dat === 'datakril'? translateText(selectedKpiTitle) : selectedKpiTitle }}
            </h2>
            <button 
              @click="isModalOpen = false" 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex gap-2">
                      <div class="space-y-4">
                        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {{ dat === 'datakril' ? translateText("Bonus") : "Bonus" }}
            </h1>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText('Umumiy foyda:') : 'Umumiy foyda:' }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(cards[1].value) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Jismoniy shaxs daromad solig'i (JShDS) – 12%") : "Jismoniy shaxs daromad solig'i (JShDS) – 12%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(cards[1].value, 12)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Majburiy pensiya badali (shaxsiy jamg'arma) – 1%") : "Majburiy pensiya badali (shaxsiy jamg'arma) – 1%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(cards[1].value, 1)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-green-50 dark:bg-green-900/50 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Sof foyda:") : "Sof foyda:" }}</span>
             <span class="ml-auto font-bold text-yellow-600 dark:text-yellow-400">
                {{ formatNumberWithDots(cards[1].value - hisoblaFoiz(cards[1].value, 13)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {{ dat === 'datakril' ? translateText("Oylik daromat") : "Oylik daromat" }}
            </h1>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText('Umumiy foyda:') : 'Umumiy foyda:' }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(cards[2].value) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Jismoniy shaxs daromad solig'i (JShDS) – 12%") : "Jismoniy shaxs daromad solig'i (JShDS) – 12%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(cards[2].value, 12)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Majburiy pensiya badali (shaxsiy jamg'arma) – 1%") : "Majburiy pensiya badali (shaxsiy jamg'arma) – 1%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(cards[2].value, 1)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-green-50 dark:bg-green-900/50 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText("Sof foyda:") : "Sof foyda:" }}</span>
              <span class="ml-auto font-bold text-yellow-600 dark:text-yellow-400">
                {{ formatNumberWithDots(cards[2].value - hisoblaFoiz(cards[2].value, 13)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
          </div>

          </div>
            <div>
            <div class="flex items-center mt-4 p-3 bg-red-50 dark:bg-green-900/50 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[200px]">{{ dat === 'datakril' ? translateText('Umumiy oylik:') : 'Umumiy oylik:' }}</span>
              <span class="ml-auto font-semibold text-green-600 dark:text-green-400">
                {{ formatNumberWithDots(cards[2].value - hisoblaFoiz(cards[2].value, 13) + cards[1].value - hisoblaFoiz(cards[2].value, 13)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            </div>
          <div class="mt-6 flex justify-end">
            <button 
              @click="isModalOpen = false" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
            </button>
          </div>
        </div>
</template>

<script setup>
import { URL } from '@/auth/url'
import axios from 'axios'
import { ref, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalary } from './index.js'
import * as XLSX from 'xlsx'
import translateText from '@/auth/Translate.js'
import dots from '@/auth/dots'
import { ChartBar, CalendarDays, Users, Dot } from 'lucide-vue-next';
import { onUnmounted } from 'vue'
const router = useRouter()
const route = useRoute()
const id = route.query.id
const role = route.query.role
const users = ref([])
const modals = ref(false)
const sabab = ref('')
const total = ref(null)
const workdayId = ref(null)
const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};
onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
const reject = ref(false)

const openRejectModal = () => {
    reject.value = true
}

const bonus = (item) => {
    if (!item.workDays || !Array.isArray(item.workDays) || item.workDays.length === 0) {
        console.error('No workDays available for this user');
        alert('Ish kunlari ma\'lumotlari topilmadi!');
        return;
    }
    workdayId.value = item.workDays[item.workDays.length - 1].id;
    modals.value = true;
};

const formattedTotal = computed({
  get() {
    if (total.value === null || total.value === '') return ''
    return formatNumberWithDots(total.value)
  },
  set(value) {
    const cleanValue = value.replace(/\D/g, '')
    total.value = cleanValue ? parseFloat(cleanValue) : null
  }
});

const addBonus = async () => {
    try {
        const res = await axios.post(URL + '/bonus', {
            userId: parseInt(id),
            workDayId: parseInt(workdayId.value),
            amount: parseFloat(total.value),
            description: sabab.value,
        });
        console.log('Bonus added:', res.data);
        modals.value = false;
        total.value = null;
        sabab.value = '';
        getSalery();
    } catch (err) {
        console.error('Error adding bonus:', err);
        alert('Bonus qo\'shishda xatolik yuz berdi!');
    }
};

const cards = ref([
    {
        title: 'Jarima summasi',
        value: '',
        increase: 'Belgilangan vaqtdan kechga qolganligi uchun oylikidan kesilgan jarima summasi',
        colorClass: 'text-red-600',
        bg: 'bg-red-500/20',
        modal: false,
        modal1: false,
        icon: '/money.png',
    },
    {
        title: 'Bonus',
        value: '',
        increase: 'Faollik ko\'rsatganligi uchun shu kungacha yigilgan rag\'batlantirish summasi',
        colorClass: 'text-yellow-600',
        modal: true,
        bg: 'bg-yellow-500/20',
        modal1: false,
        icon: '/bonus.png'
    },
    {
        title: 'Oylik daromad',
        value: '',
        bg: 'bg-green-500/20',
        increase: 'Shu oyda ushchi uchun hisoblangan jami oylik daromad',
        colorClass: 'text-green-600',
        modal1: true,
        modal: false,
        icon: '/coin.png'
    },
]);

function formatNumberWithDots(number) {
  if (!number) return ''
  const str = Math.floor(number).toString()
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const isModalOpen = ref(false)
const selectedKpiTitle = ref('')
const modalPosition = ref({ top: 0, left: 0 })
const openModal = (title, event) => {
  selectedKpiTitle.value = title
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  modalPosition.value = {
    top: rect.bottom + scrollY + 10,
    left: rect.left + scrollX
  }
  isModalOpen.value = true
  gsap.fromTo('.modal', 
    { opacity: 0, y: -20 }, 
    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
  )
}
const getSalery = async () => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');

        const res = await axios.get(
            URL + '/salary/preview',
            {
                params: {
                    userId: parseInt(id),
                    month: `${year}-${month}`
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        cards.value = [
            {
                ...cards.value[0],
                value: Math.floor(res.data.lateDeductions)
            },
            {
                ...cards.value[1],
                value: Math.floor(res.data.totalBonus)
            },
            {
                ...cards.value[2],
                value: Math.floor(res.data.baseSalary)
            }
        ];
        console.log(res.data)
    } catch (err) {
        console.error('Error fetching user:', err);
    }
}

getSalery()

const { calculateSalary, salary, error, loading } = useSalary()

const form = ref({
    userId: null,
    month: null,
})

const selectedYear = ref('')
const data = ref(null)
const selectedMonth = ref('')

const handleCalculateSalary = async (item) => {
    try {
        if (!selectedYear.value || !selectedMonth.value) {
            alert('Iltimos, yil va oy tanlang!')
            return
        }
        const month = Number(selectedMonth.value) < 10 ? `0${selectedMonth.value}` : selectedMonth.value
        const dateString = `${selectedYear.value}-${month}`
        console.log(dateString)
        await calculateSalary(item.id, dateString)
        alert('Maosh hisoblandi!')
    } catch (err) {
        console.error('Error calculating salary:', err)
        alert('Maosh hisoblashda xatolik yuz berdi!')
    }
}
function hisoblaFoiz(value, percent) {
  return (value * percent) / 100;
}
const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel',
    'May', 'Iyun', 'Iyul', 'Avgust',
    'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
]

const years = computed(() => {
    const allYears = new Set()
    users.value.forEach(user => {
        user.workDays?.forEach(day => {
            const date = new Date(day.createdAt)
            if (!isNaN(date.getTime())) {
                allYears.add(date.getFullYear())
            }
        })
    })
    return Array.from(allYears).sort((a, b) => a - b)
})

const months = computed(() => {
    const allMonths = new Set()
    users.value.forEach(user => {
        user.workDays?.forEach(day => {
            const date = new Date(day.createdAt)
            if (!isNaN(date.getTime())) {
                allMonths.add(date.getMonth() + 1)
            }
        })
    })
    return Array.from(allMonths)
        .sort((a, b) => a - b)
        .map(month => ({
            value: month,
            name: monthNames[month - 1]
        }))
})

const filteredWorkDays = (workDays) => {
    if (!workDays) return []
    return workDays.filter(day => {
        const date = new Date(day.createdAt)
        if (isNaN(date.getTime())) return false
        const yearMatch = selectedYear.value ? date.getFullYear() === Number(selectedYear.value) : true
        const monthMatch = selectedMonth.value ? (date.getMonth() + 1) === Number(selectedMonth.value) : true
        return yearMatch && monthMatch
    })
}

const downloadExcel = () => {
    const excelRows = []

    users.value.forEach((item) => {
        excelRows.push([
            { v: `${item.name} ${item.surname}  ${item.dadname}`, s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }
        ])

        excelRows.push([
            'Ishga kelgan', 'Tushlikka ketgan', 'Tushlikdan kelgan', 'Ishdan chiqqan', 'Sana'
        ])

        if (Array.isArray(item.workDays)) {
            item.workDays.forEach((history) => {
                excelRows.push([
                    filteridTime(history.checkIn),
                    filteridTime(history.lunchStart),
                    filteridTime(history.lunchEnd),
                    filteridTime(history.checkOut),
                    isoToUzbekistanTime(history.createdAt)
                ])
            })
        }

        excelRows.push([])
    })

    const ws = XLSX.utils.aoa_to_sheet(excelRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ish kunlari')
    XLSX.writeFile(wb, 'ish_kunlari.xlsx')
}

function isoToUzbekistanTime(isoStr) {
    const monthsUz = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel',
        'May', 'Iyun', 'Iyul', 'Avgust',
        'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ]
    const daysUz = [
        'Dushanba', 'Seshanba', 'Chorshanba',
        'Payshanba', 'Juma', 'Shanba', 'Yakshanba'
    ]
    const dateUtc = new Date(isoStr)
    if (isNaN(dateUtc.getTime())) {
        return "Noto'g'ri sana formati"
    }
    const utcOffsetMinutes = 5 * 60
    const dateUz = new Date(dateUtc.getTime() + utcOffsetMinutes)
    const day = dateUz.getDate()
    const month = monthsUz[dateUz.getMonth()]
    const year = dateUz.getFullYear()
    const hour = String(dateUz.getHours()).padStart(2, '0')
    const minute = String(dateUz.getMinutes()).padStart(2, '0')
    const weekday = daysUz[dateUz.getDay()]
    return `${day}-${month} ${year}-yil`
}

function filteridTime(isoStr) {
    const dateUtc = new Date(isoStr)
    if (isNaN(dateUtc.getTime())) {
        return "Noto'g'ri sana formati"
    }
    const utcOffsetMinutes = 5 * 60
    const dateUz = new Date(dateUtc.getTime() + utcOffsetMinutes)
    const hour = String(dateUz.getHours()).padStart(2, '0')
    const minute = String(dateUz.getMinutes()).padStart(2, '0')
    return `${hour}:${minute}`
}

const getUser = async () => {
    try {
        const res = await axios.get(URL + '/' + role + '/' + id)
        users.value = [res.data]
        console.log(users.value)
    } catch (err) {
        console.error('Error fetching user:', err)
    }
}

getUser()
</script>

<style scoped>
.animated-gradient {
    background: linear-gradient(45deg, #23385F, #3A4C76, #56688F, #23385F);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    padding: 1.75rem;
    min-height: 100vh;
}

.cardGradient {
    background: linear-gradient(45deg, #3A4C76, #23385F, #56688F, #23385F);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    border-radius: 0.5rem;
    padding: 0.5rem;
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