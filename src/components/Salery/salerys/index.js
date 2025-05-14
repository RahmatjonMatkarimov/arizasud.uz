import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export function useWorkDay() {
  const workDay = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const checkIn = async (userId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/work-day/check-in`, { userId });
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
      const response = await axios.post(`${API_URL}/work-day/${id}/lunch-start`, {});
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
      const response = await axios.post(`${API_URL}/work-day/${id}/lunch-end`, {});
      workDay.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Tushlik tugatishda xatolik';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const checkOut = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/work-day/${id}/check-out`, {});
      workDay.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Ishdan chiqishda xatolik';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchWorkDay = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/work-day/${id}`);
      workDay.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Yozuvni olishda xatolik';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    workDay,
    error,
    loading,
    checkIn,
    startLunch,
    endLunch,
    checkOut,
    fetchWorkDay,
  };
}