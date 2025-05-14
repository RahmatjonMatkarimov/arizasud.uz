import { ref } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';

const API_URL = URL;

export function useSalary() {
  const salary = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const calculateSalary = async (userId, month) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `${API_URL}/salary/calculate`,
        { userId, month },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      salary.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Maosh hisoblashda xatolik';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { salary, error, loading, calculateSalary };
}