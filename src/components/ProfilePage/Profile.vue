<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { uz } from 'date-fns/locale';
import { URL } from '@/auth/url.js';
import { Icon } from '@iconify/vue';
import { inject } from 'vue';

const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const id = ref(route.params.id);
const onlineAdmins = ref([]);
const socket = io(URL);
const isLoading = inject('isLoading');
const newId = parseInt(id.value);

const data = ref({
  admins: false,
  yurists: false,
  call_centres: false,
  userFiles: false,
  workDone: false,
  companyDocs: false,
  ticket: false
});

const fetchPermissions = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/permissions/user/${newId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);

    if (response.data.length > 0) {
      data.value = response.data[0];
    } else {
      data.value = { admins: false, yurists: false, call_centres: false, workDone: false, ticket: false, companyDocs: false, userFiles: false };
    }
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

const togglePermission = async (permission) => {
  isLoading.value = true;
  try {
    const updatedValue = !data.value[permission];

    const response = await axios.put(`${URL}/permissions/${newId}`,
      { [permission]: updatedValue },
      { headers: { Authorization: ` Bearer ${localStorage.getItem("token")}` } }
    );

    if (response.status === 200) {
      data.value[permission] = updatedValue;
    }
    console.log(response);
    
  } catch (error) {
    console.error(`Failed to update ${permission}:`, error);
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

onMounted(fetchPermissions);
const dat = localStorage.getItem('til');
let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat) {
    dat = currentLang;
  }
};
onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    loading.value = true;
    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${id.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data;
    console.log('User data fetched successfully:', userInfo.value);
  } catch (err) {
    error.value = 'Failed to load user data';
    console.error('Error fetching user data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : '/default-avatar.png';
};

const getAdminStatus = (admin) => {
  if (!admin || !admin.id) {
    return { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
  }
  const currentAdminId = id.value.toString();
  if (onlineAdmins.value.includes(currentAdminId)) {
    return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
  }
  if (admin.lastSeen) {
    const lastSeenDate = new Date(admin.lastSeen);
    const minutesDifference = differenceInMinutes(new Date(), lastSeenDate);
    if (minutesDifference < 1) {
      return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
    } else {
      return {
        status: `${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: uz })} tarmoqda edi`,
        color: "text-red-500",
        dotColor: "bg-red-500",
      };
    }
  }
  return { status: "Oflayn", color: "text-red-500", dotColor: "bg-red-500" };
};

const adminStatus = computed(() => {
  return userInfo.value ? getAdminStatus(userInfo.value) : { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
});

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((adminId) => adminId.toString());
};

onMounted(() => {
  fetchUserData();
  socket.emit('joinAdmin', id.value);
  socket.on('adminOnlineUpdate', checkOnlineStatus);
});

onUnmounted(() => {
  socket.off('adminOnlineUpdate');
  socket.disconnect();
});
</script>

<template>
  <div class="min-h-screen dark:bg-gray-800 bg-gray-200 dark:text-gray-100 text-gray-800">
    <div class="max-w-[1140px] mx-auto p-6">
      <div class="bg-gradient-to-r from-purple-900 to-purple-600 w-full h-[200px] rounded-t-lg"></div>
      <div class="relative bg-white dark:bg-gray-700 rounded-b-lg shadow-lg">
        <div class="absolute -top-16 left-6">
          <img
            :src="userInfo ? getImageUrl(userInfo.img) : '/default-avatar.png'"
            class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700"
          />
        </div>
        <div class="pt-20 px-6 pb-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {{ userInfo ? `${userInfo.name} ${userInfo.surname}` : 'Noma\'lum Foydalanuvchi' }}
              </h1>
            </div>
            <div :class="adminStatus.color" class="flex items-center">
              <span :class="adminStatus.dotColor" class="w-4 h-4 rounded-full mr-2"></span>
              <span>{{ adminStatus.status }}</span>
            </div>
          </div>
<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="flex items-center text-gray-700 dark:text-gray-200">
    <Icon icon="mdi:phone" class="w-5 h-5 mr-2 text-blue-500" />
    <span>{{ userInfo?.phone || '+1 (555) 123-4567' }}</span>
  </div>

  <div class="flex items-center text-gray-700 dark:text-gray-200">
    <Icon icon="mdi:calendar-clock" class="w-5 h-5 mr-2 text-blue-500" />
    <span>Ish boshlagan vaqti: {{ userInfo?.startWork }}</span>
  </div>

  <div class="flex items-center text-gray-700 dark:text-gray-200">
    <Icon icon="mdi:card-account-details-outline" class="w-5 h-5 mr-2 text-blue-500" />
    <span>ID karta raqami: {{ userInfo.userCode }}</span>
  </div>

  <div class="flex items-center text-gray-700 dark:text-gray-200">
    <Icon icon="mdi:barcode" class="w-5 h-5 mr-2 text-blue-500" />
    <span>JSHSHIT: {{ userInfo.uniqueCode }}</span>
  </div>
</div>

        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-4">Ruxsatlar</h2>
  <div class="p-[10px]">
    <ul>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Adminlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.admins" @change="() => togglePermission('admins')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Yuristlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.yurists" @change="() => togglePermission('yurists')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Devonxona Mudirlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.call_centres" @change="() => togglePermission('call_centres')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Ishchilarni bajargan ishlarini ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.ticket" @change="() => togglePermission('ticket')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Kampaniya fayllarini ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.workDone" @change="() => togglePermission('workDone')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>imzolanadigan fayllar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.userFiles" @change="() => togglePermission('userFiles')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
    </ul>
  </div>
        </div>
        <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-4">Qo'shimcha ma'lumotlar</h2>

        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #09FF52;
}

input:checked+.slider:before {
  transform: translateX(14px);
}
</style>