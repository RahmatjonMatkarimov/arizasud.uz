<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-bold mb-4">Maosh hisoblash</h2>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Foydalanuvchi ID</label>
      <input
        v-model.number="form.userId"
        type="number"
        class="mt-1 block w-full p-2 border rounded-md"
        placeholder="User ID kiriting"
      />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Oy (YYYY-MM)</label>
      <input
        v-model="form.month"
        type="text"
        class="mt-1 block w-full p-2 border rounded-md"
        placeholder="Masalan, 2025-05"
      />
    </div>
    <button
      @click="handleCalculateSalary"
      class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
      {{ loading ? 'Yuklanmoqda...' : 'Hisoblash' }}
    </button>
    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-if="salary" class="mt-4">
      <p><strong>Oy:</strong> {{ salary.month }}</p>
      <p><strong>Jami soat:</strong> {{ salary.totalHours }}</p>
      <p><strong>Jami maosh:</strong> {{ salary.totalSalary }}</p>
      <p><strong>Bonus:</strong> {{ salary.bonus }}</p>
      <p><strong>Jarimalar:</strong> {{ salary.deductions }}</p>
      <p><strong>Yakuniy maosh:</strong> {{ salary.finalSalary }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSalary } from './index.js';

const { calculateSalary, salary, error, loading } = useSalary();

const form = ref({
  userId: null,
  month: null,
});

const handleCalculateSalary = async () => {
  try {
    await calculateSalary(form.value.userId, form.value.month);
    alert('Maosh hisoblandi!');
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
*{
    color: black;
}
</style>