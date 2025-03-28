<template>
  <div class="p-[10px]">
    <ul>
      <li v-for="admin in admins" :key="admin.id" class="flex items-center justify-between my-2 bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>{{ admin.name }} {{ admin.surname }}</h1>
          <h1>Lavozimi: {{ admin.lavozimi }}</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="admin.isAllowed" @change="() => toggleAdminAccess(admin)">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, inject } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";
const isLoading = inject('isLoading');
const route = useRoute();
const id = ref(null);
const admins = ref([]);
const allowedUsers = ref([]);
const qwe = ref(false);
const selectedAdminId = ref(null);

const getAdminsAndOthers = async () => {
    isLoading.value = true;
    try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const [adminsRes, yuristRes, managerRes] = await Promise.all([
      axios.get(`${URL}/admin`, config),
      axios.get(`${URL}/yurist`, config),
      axios.get(`${URL}/manager`, config),
    ]);
    const combinedData = [
      ...adminsRes.data,
      ...yuristRes.data,
      ...managerRes.data,
    ];
    admins.value = combinedData;
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAdminsAndOthers):", error);
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

getAdminsAndOthers();


const getAllowedUsers = async (courtId) => {
    isLoading.value = true;
    try {
    const response = await axios.get(`${URL}/allowed-users/${courtId}`);
    allowedUsers.value = response.data;
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAllowedUsers):", error);
  }
};

const updateAdminStatuses = () => {
  admins.value.forEach(admin => {
    admin.isAllowed = allowedUsers.value.some(user => user.userId === admin.id);
  });
};

const addUserToAllowed = async () => {
  if (!selectedAdminId.value) {
    console.error("Admin tanlanmagan!");
    return;
  }
  try {
    await axios.post(`${URL}/allowed-users/${id.value}/${selectedAdminId.value}`);
    getAllowedUsers(id.value);
    qwe.value = false;
  } catch (error) {
    console.error("Xatolik (addUserToAllowed):", error);
  }
};

const removeUserFromAllowed = async (admin) => {
    isLoading.value = true;
    try {
    await axios.delete(`${URL}/allowed-users/${id.value}/${admin.id}`);
    getAllowedUsers(id.value);
  } catch (error) {
    console.error("Xatolik (removeUserFromAllowed):", error);
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

const toggleAdminAccess = async (admin) => {
  try {
    if (admin.isAllowed) {
      await removeUserFromAllowed(admin);
    } else {
      selectedAdminId.value = admin.id;
      await addUserToAllowed();
    }
  } catch (error) {
    console.error("Xatolik (toggleAdminAccess):", error);
  }
};

const handleCheckbox = (adminId) => {
  selectedAdminId.value = adminId;
};

onMounted(() => {
  id.value = route.params.id;
  if (id.value) {
    getAdmins();
    getAllowedUsers(id.value);
  }
});

watchEffect(() => {
  if (route.params.id) {
    id.value = route.params.id;
    getAdmins();
    getAllowedUsers(id.value);
  }
});
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
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
  height: 19px;
  width: 19px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #09FF52;
}

input:checked + .slider:before {
  transform: translateX(24px);
}
</style>
