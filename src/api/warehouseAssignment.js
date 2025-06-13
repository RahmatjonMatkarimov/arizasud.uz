import axios from 'axios';

const API_URL = 'https://backend.arizasud.uz'; // API bazaviy URL

// Omborni foydalanuvchiga topshirish
export const assignWarehouse = async (data) => {
  try {
    // Ma'lumotlarni tekshirish
    if (!data.warehouseId || !data.userId || !data.condition) {
      throw new Error('warehouseId, userId va condition maydonlari majburiy');
    }
    // Raqamlarni aniq raqam sifatida yuborish
    const payload = {
      ...data,
      warehouseId: Number(data.warehouseId),
      userId: Number(data.userId),
    };
    const response = await axios.post(`${API_URL}/warehouse-assignment/assign`, payload);
    console.log(response.data)
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Topshiriq yaratishda xatolik';
    console.error('API xatosi:', error.response?.data || error);
    throw new Error(errorMessage);
  }
};

// Omborni o'tkazish
export const transferWarehouse = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/warehouse-assignment/transfer`, data);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Barcha topshiriqlarni olish
export const getAllAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Faol topshiriqlarni olish
export const getActiveAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment/active`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Bugungi topshiriqlarni olish
export const getTodayAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment/today`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Foydalanuvchi bo'yicha topshiriqlarni olish
export const getAssignmentsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment/user/${userId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Ombor bo'yicha topshiriqlarni olish
export const getAssignmentsByWarehouseId = async (warehouseId) => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment/warehouse/${warehouseId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Bitta topshiriqni olish
export const getAssignmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/warehouse-assignment/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Yangi topshiriq yaratish
export const createAssignment = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/warehouse-assignment`, data);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Topshiriqni yangilash
export const updateAssignment = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/warehouse-assignment/${id}`, data);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Yangi ombor yaratish
export const createWarehouse = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/warehouse`, data);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};