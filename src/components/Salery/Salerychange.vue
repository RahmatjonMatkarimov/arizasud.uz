<template>
    <div class="animated-gradient p-7 min-h-screen">
        <div class="bg-black bg-opacity-20 container mx-auto rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6 pb-4 border-b">
                <div class="text-blue-400 font-medium cursor-pointer" @click="router.push('/salary')">
                    {{ dat === 'datakril' ? translateText('← Orqaga qaytish') : '← Orqaga qaytish' }}
                </div>
            </div>
            <div>
                <div v-for="item in users" :key="item.id">
                    <div class="flex gap-4">
                        <div class="flex relative justify-between w-full">
                            <div class="flex flex-col gap-1">
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
                            <div class="flex gap-4">
                                <div v-for="card in cards" :key="card.title"
                                    @click="card.modal ? openRejectModal() : null"
                                    class="bg-white w-[300px] h-[180px] rounded-xl shadow p-6">
                                    <div class="flex items-center gap-2">
                                        <img class="w-[30px] " :src="card.icon" alt="{{ dat === 'datakril' ? translateText('Belgi') : 'Belgi' }}">
                                        <div class="flex items-center gap-2 mb-2">
                                            <h2 class="text-xl font-semibold text-gray-800">{{ dat === 'datakril' ? translateText(card.title) : card.title }}</h2>
                                        </div>
                                    </div>
                                    <p :class="card.colorClass + ' text-3xl font-bold'">{{ card.value }} {{ dat === 'datakril' ? translateText('so\'m') : 'so\'m' }}</p>
                                    <p class="text-sm text-gray-500 mt-1">
                                        <span class="font-semibold text-md text-gray-500">{{ dat === 'datakril' ? translateText(card.increase) : card.increase }}</span>
                                    </p>
                                </div>
                            </div>
                            <div></div>
                            <div class="flex absolute right-3 bottom-3 items-end">
                                <div class="flex items-end gap-4">
                                <button @click="bonus(item)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {{ dat === 'datakril' ? translateText('Bonus maoshni qo\'shish') : 'Bonus maoshni qo\'shish' }}
                                </button>
                                <button @click="handleCalculateSalary(item)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {{ dat === 'datakril' ? translateText('Oylik maoshni hisoblash') : 'Oylik maoshni hisoblash' }}
                                </button>
                                    <select v-model="selectedYear" class="border bg-[#fff0] rounded-md p-2">
                                        <option class="text-black" value="">{{ dat === 'datakril' ? translateText('Yil tanlang') : 'Yil tanlang' }}</option>
                                        <option class="text-black" v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                    </select>
                                    <select v-model="selectedMonth" class="border bg-[#fff0] rounded-md p-2">
                                        <option class="text-black" value="">{{ dat === 'datakril' ? translateText('Oy tanlang') : 'Oy tanlang' }}</option>
                                        <option class="text-black" v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="w-full border-collapse mt-4">
                        <thead>
                            <tr class="w-full grid cardGradient object-cover grid-cols-6 gap-2 items-center">
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
                                    <div class="flex justify-between rounded-md py-2 cardGradient items-center">
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
                </div>
            </div>
            <div class="flex justify-end mt-4 gap-4">
                <button @click="downloadExcel" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    {{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}
                </button>
            </div>
            <div v-if="salary" class="bg-black inset-0 flex fixed bg-opacity-70 justify-center items-center">
                <div v-if="salary" class="p-6 max-w-md mx-auto bg-white rounded-xl w-[400px] shadow-md space-y-4">
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Oy:') : 'Oy:' }}</strong> {{ salary.month }}</p>
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jami soat:') : 'Jami soat:' }}</strong> {{ salary.totalHours }}</p>
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jami maosh:') : 'Jami maosh:' }}</strong> {{ salary.totalSalary }}</p>
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Bonus:') : 'Bonus:' }}</strong> {{ salary.bonus }}</p>
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Jarimalar:') : 'Jarimalar:' }}</strong> {{ salary.deductions }}</p>
                    <p class="text-black text-[20px]"><strong class="text-black text-[20px]">{{ dat === 'datakril' ? translateText('Yakuniy maosh:') : 'Yakuniy maosh:' }}</strong> {{ salary.finalSalary }}</p>
                    <button class="w-full py-2 bg-gray-300 text-[20px] text-gray-800 rounded hover:bg-gray-400"
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
                        <input v-model="total" type="number"
                            class="w-full border border-gray-300 text-black rounded text-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="dat === 'datakril' ? translateText('Masalan: 50000') : 'Masalan: 50000'" />
                        <label class="block text-md font-medium text-gray-600">{{ dat === 'datakril' ? translateText('Sabab') : 'Sabab' }}</label>
                        <input v-model="sabab" type="text"
                            class="w-full border border-gray-300 text-black rounded text-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="bg-gray-700 top-20 relative h-[85%] w-full mx-auto max-w-[70%] rounded-lg shadow-lg overflow-y-auto">
            <h1 class="text-2xl border-b-2 p-4 border-gray-500 text-white font-semibold">{{ dat === 'datakril' ? translateText('Bonuslar ro\'yxati') : 'Bonuslar ro\'yxati' }}</h1>
            <img @click="reject = false" src="../../../public/reject-White.png"
                class="w-[20px] absolute top-4 right-4 cursor-pointer" alt="{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}">
            <div class="p-4 space-y-3">
                <div v-for="(item, index) in users[0].Bonus" :key="item.id"
                    class="bg-gray-600 text-white rounded-lg p-4 shadow flex justify-between items-center hover:bg-gray-500 transition">
                    <div>
                        <p class="text-md text-gray-300">#{{ index + 1 }}</p>
                        <p class="text-xl font-medium">{{ item.description }}</p>
                    </div>
                    <p class="text-green-400 font-semibold text-xl">{{ item.amount }} {{ dat === 'datakril' ? translateText('so\'m') : 'so\'m' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { URL } from '@/auth/url'
import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalary } from './index.js'
import * as XLSX from 'xlsx'
import translateText from '@/auth/Translate.js'
import { ChartBar, CalendarDays, Users, Dot } from 'lucide-vue-next';
const router = useRouter()
const route = useRoute()
const id = route.query.id
const role = route.query.role
const users = ref([])
const modals = ref(false)
const sabab = ref('')
const total = ref(null)
const workdayId = ref(null)
const dat = inject('dat')
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
const addBonus = async () => {
    try {
        const res = await axios.post(URL + '/bonus', {
            userId: parseInt(id),
            workDayId: parseInt(workdayId.value),
            amount: parseFloat(total.value),
            description: sabab.value,
        });
        console.log('Bonus added:', res.data);
        modals.value = false; // Close modal after successful addition
        total.value = null; // Reset input
        sabab.value = ''; // Reset input
        getSalery()
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
        colorClass: 'text-red-500',
        modal: false,
        icon: '/money.png',
    },
    {
        title: 'Bonus',
        value: '',
        increase: 'Faollik ko\'rsatganligi uchun shu kungacha yigilgan rag\'batlantirish summasi',
        colorClass: 'text-yellow-500',
        modal: true,
        icon: '/bonus.png'
    },
    {
        title: 'Oylik daromad',
        value: '',
        increase: 'Shu oyda ushchi uchun hisoblangan jami oylik daromad',
        colorClass: 'text-green-500',
        modal: false,
        icon: '/coin.png'
    },
]);
function formatNumberWithDots(number) {
  // Raqamni stringga aylantiramiz
  const str = number.toString();
  
  // Stringni teskari qilib, har 3ta belgidan keyin nuqta qo‘shamiz
  const reversed = str.split('').reverse().join('');
  const withDots = reversed.replace(/(\d{3})(?=\d)/g, '$1.');
  
  // Oxirgi natijani yana teskari qilib qaytaramiz
  return withDots.split('').reverse().join('');
}

const getSalery = async () => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-based bo‘lganligi uchun +1

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
                value: Math.floor(res.data.finalSalary)
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
        console.log(dateString) // Should log e.g., "2025-01"
        await calculateSalary(item.id, dateString)
        alert('Maosh hisoblandi!')
    } catch (err) {
        console.error('Error calculating salary:', err)
        alert('Maosh hisoblashda xatolik yuz berdi!')
    }
}



// Uzbek month names for display
const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel',
    'May', 'Iyun', 'Iyul', 'Avgust',
    'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
]

// Compute unique years from workDays
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

// Compute unique months from workDays
const months = computed(() => {
    const allMonths = new Set()
    users.value.forEach(user => {
        user.workDays?.forEach(day => {
            const date = new Date(day.createdAt)
            if (!isNaN(date.getTime())) {
                allMonths.add(date.getMonth() + 1) // 1-based month
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

// Filter workDays based on selected year and month
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
        // Ishchi ismini sarlavha sifatida qo'shish
        excelRows.push([
            { v: `${item.name} ${item.surname}  ${item.dadname}`, s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }
        ])

        // Ustun nomlari
        excelRows.push([
            'Ishga kelgan', 'Tushlikka ketgan', 'Tushlikdan kelgan', 'Ishdan chiqqan', 'Sana'
        ])

        // Ish kunlarini tekshirish
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

        // Bo'sh qator qo'shish
        excelRows.push([])
    })

    // Excelga aylantirish
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