import { ref } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';

const API_URL = URL;

export function useWorkDay() {
  const workDay = ref(null);
  const error = ref(null);
  const loading = ref(false);

  // Check-in
  const checkIn = async (userId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `${API_URL}/work-day/check-in`,
        { userId },
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

  // Tushlik boshlanishi
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

  // Tushlik tugashi
  const endLunch = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `${API_URL}/work-day/${id}/lunch-end`,
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

  // Check-out
  const checkOut = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `${API_URL}/work-day/${id}/check-out`,
        {},
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

  // WorkDayni olish
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