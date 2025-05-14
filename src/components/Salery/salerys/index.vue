<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Ish vaqti va maosh boshqaruvi</h1>

    <!-- Ish vaqti boshqaruvi -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Ish vaqti</h2>
      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Foydalanuvchi ID</label>
          <input
            v-model.number="userId"
            type="number"
            class="mt-1 block w-full p-2 border rounded-md"
            placeholder="User ID kiriting"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">WorkDay ID (yangilash uchun)</label>
          <input
            v-model.number="workDayId"
            type="number"
            class="mt-1 block w-full p-2 border rounded-md"
            placeholder="WorkDay ID kiriting"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <button
          @click="handleCheckIn"
          class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          :disabled="loading || !userId"
        >
          Ishga keldi
        </button>
        <button
          @click="handleStartLunch"
          class="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
          :disabled="loading || !workDayId"
        >
          Tushlikka chiqdi
        </button>
        <button
          @click="handleEndLunch"
          class="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
          :disabled="loading || !workDayId"
        >
          Tushlikdan keldi
        </button>
        <button
          @click="handleCheckOut"
          class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          :disabled="loading || !workDayId"
        >
          Ishdan ketdi
        </button>
      </div>
      <!-- Bonus qo‘shish -->
      <div class="flex items-center gap-4 mb-4">
        <input
          v-model.number="bonusAmount"
          type="number"
          class="block w-1/2 p-2 border rounded-md"
          placeholder="Bonus miqdori"
        />
        <button
          @click="handleAddBonus"
          class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Bonus qo‘shish
        </button>
      </div>
      <div v-if="error" class="mb-4 text-red-500">{{ error }}</div>
      <div v-if="workDay" class="mt-4 bg-gray-100 p-4 rounded-md">
        <p><strong>Ishga kirish:</strong> {{ formatDate(workDay.checkIn) }}</p>
        <p><strong>Tushlik boshlanishi:</strong> {{ formatDate(workDay.lunchStart) }}</p>
        <p><strong>Tushlik tugashi:</strong> {{ formatDate(workDay.lunchEnd) }}</p>
        <p><strong>Ishdan chiqish:</strong> {{ formatDate(workDay.checkOut) }}</p>
        <p><strong>Jami soat:</strong> {{ workDay.totalHours }}</p>
        <p><strong>Kunlik bonus:</strong> {{ workDay.dailyBonus }}</p>
        <p><strong>Kechikish (daqiqa):</strong> {{ workDay.lateMinutes }}</p>
      </div>
    </div>
    <!-- Maosh hisoblash -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Maosh hisoblash</h2>
      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Foydalanuvchi ID</label>
          <input
            v-model.number="salaryForm.userId"
            type="number"
            class="mt-1 block w-full p-2 border rounded-md"
            placeholder="User ID kiriting"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Oy (YYYY-MM)</label>
          <input
            v-model="salaryForm.month"
            type="text"
            class="mt-1 block w-full p-2 border rounded-md"
            placeholder="Masalan, 2025-05"
          />
        </div>
      </div>
      <button
        @click="handleCalculateSalary"
        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
    
      >
        {{ loading ? 'Yuklanmoqda...' : 'Hisoblash' }}
      </button>
      <div v-if="salaryError" class="mt-4 text-red-500">{{ salaryError }}</div>
      <div v-if="salary" class="mt-4 bg-gray-100 p-4 rounded-md">
        <p><strong>Oy:</strong> {{ salary.month }}</p>
        <p><strong>Jami soat:</strong> {{ salary.totalHours }}</p>
        <p><strong>Oylik maosh:</strong> {{ salary.monthlySalary }}</p>
        <p><strong>Jami bonus:</strong> {{ salary.totalBonus }}</p>
        <p><strong>Kechikish jarimasi:</strong> {{ salary.lateDeductions }}</p>
        <p><strong>Yakuniy maosh:</strong> {{ salary.finalSalary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';

const API_URL = URL;

// WorkDay bilan ishlash
const userId = ref(null);
const workDayId = ref(null);
const bonusAmount = ref(null);
const workDay = ref(null);
const error = ref(null);
const loading = ref(false);

// Salary bilan ishlash
const salaryForm = ref({
  userId: null,
  month: null,
});
const salary = ref(null);
const salaryError = ref(null);

// Vaqt formatlash
const formatDate = (date) => (date ? new Date(date).toLocaleString('uz-UZ') : 'Belgilanmagan');

// WorkDay funksiyalari
const checkIn = async (userId, dailyBonus = 0) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
     ` ${API_URL}/work-day/check-in`,
      { userId, dailyBonus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Ishga kirishda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

const startLunch = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
     ` ${API_URL}/work-day/${id}/lunch-start`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Tushlik boshlashda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

const endLunch = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
     ` ${API_URL}/work-day/${id}/lunch-end`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Tushlik tugatishda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};
const checkOut = async (id, dailyBonus = 0) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
     ` ${API_URL}/work-day/${id}/check-out`,
      { dailyBonus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Ishdan chiqishda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

const addDailyBonus = async (id, dailyBonus) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
      `${API_URL}/work-day/${id}/add-bonus`,
      { dailyBonus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Bonus qo‘shishda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

const fetchWorkDay = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_URL}/work-day/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    workDay.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Yozuvni olishda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

// Salary funksiyasi
const calculateSalary = async (userId, month) => {
  loading.value = true;
  salaryError.value = null;
  try {
    const response = await axios.post(
      `${API_URL}/salary/calculate`,
      { userId, month },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    salary.value = response.data;
    return response.data;
  } catch (err) {
    salaryError.value = err.response?.data?.message || 'Maosh hisoblashda xatolik';
    throw err;
  } finally {
    loading.value = false;
  }
};

// Handlerlar
const handleCheckIn = async () => {
  try {
    const newWorkDay = await checkIn(userId.value);
    workDayId.value = newWorkDay.id;
    alert('Ishga kirish yozildi!');
  } catch (err) {
    console.error(err);
  }
};

const handleStartLunch = async () => {
  try {
    await startLunch(workDayId.value);
    alert('Tushlik boshlanishi yozildi!');
  } catch (err) {
    console.error(err);
  }
};

const handleEndLunch = async () => {
  try {
    await endLunch(workDayId.value);
    alert('Tushlik tugashi yozildi!');
  } catch (err) {
    console.error(err);
  }
};

const handleCheckOut = async () => {
  try {
    await checkOut(workDayId.value);
    alert('Ishdan chiqish yozildi!');
  } catch (err) {
    console.error(err);
  }
};

const handleAddBonus = async () => {
  try {
    await addDailyBonus(workDayId.value, bonusAmount.value);
    alert('Bonus qo‘shildi!');
    bonusAmount.value = null;
  } catch (err) {
    console.error(err);
  }
};

const handleCalculateSalary = async () => {
  try {
    await calculateSalary(salaryForm.value.userId, salaryForm.value.month);
    alert('Maosh hisoblandi!');
  } catch (err) {
    console.error(err);
  }
};

// WorkDayId o‘zgarganda ma‘lumotlarni yuklash
watch(workDayId, async (newId) => {
  if (newId) {
    try {
      await fetchWorkDay(newId);
    } catch (err) {
      console.error(err);
    }
  }
});
</script>

<style scoped>
/* Tailwind CSS avtomatik qo‘llaniladi */
*{
    color: black;
}
</style>