<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { io } from "socket.io-client";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js";
import { Icon } from "@iconify/vue";
import { inject } from "vue";
import translateText from "@/auth/Translate";
import { Timeee } from "@/auth/url";

const router = useRouter();
const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const id = ref(route.params.id);
const onlineAdmins = ref([]);
const socket = io(URL);
const isLoading = inject("isLoading");
const newId = parseInt(id.value);

const data = ref({
  admins: false,
  call_centres: false,
  yurists: false,
  userFiles: false,
  accauntant: false,
  chiefAccauntant: false,
  warehouseman: false,
  yuristAssistant: false,
  companyDocs: false,
  carrier: false,
  ticket: false,
  workDone: false
});

const fetchPermissions = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/permissions/user/${newId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.length > 0) {
      data.value = response.data[0];
    } else {
      data.value = {
        admins: false,
        yurists: false,
        call_centres: false,
        workDone: false,
        ticket: false,
        companyDocs: false,
        userFiles: false,
        accauntant: false,
        chiefAccauntant: false,
        warehouseman: false,
        yuristAssistant: false,
        carrier: false,
      };
    }
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  } finally {
    isLoading.value = false;
  }
};

const togglePermission = async (permission) => {
  isLoading.value = true;
  try {
    const updatedValue = !data.value[permission];
    const response = await axios.put(
      `${URL}/permissions/${newId}`,
      { [permission]: updatedValue },
      { headers: { Authorization: ` Bearer ${localStorage.getItem("token")}` } }
    );
    if (response.status === 200) {
      data.value[permission] = updatedValue;
    }
  } catch (error) {
    console.error(`Failed to update ${permission}:`, error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPermissions);
const dat = ref(localStorage.getItem("til"));

const fetchUserData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    loading.value = true;
    const response = await axios.get(
      `${URL}/${localStorage.getItem("role")}/${id.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    userInfo.value = response.data;
  } catch (err) {
    error.value = "Failed to load user data";
    console.error("Error fetching user data:", err);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
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
        status: `${formatDistanceToNow(lastSeenDate, {
          addSuffix: true,
          locale: uz,
        })} tarmoqda edi`,
        color: "text-red-500",
        dotColor: "bg-red-500",
      };
    }
  }
  return { status: "Oflayn", color: "text-red-500", dotColor: "bg-red-500" };
};

const adminStatus = computed(() => {
  return userInfo.value
    ? getAdminStatus(userInfo.value)
    : { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
});

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((adminId) => adminId.toString());
};

const permissions = [
  { key: "admins", label: "Adminlar ro'yxatini ko'rish uchun ruxsat" },
  { key: "yurists", label: "Yuristlar ro'yxatini ko'rish uchun ruxsat" },
  { key: "call_centres", label: "Devonxona Mudirlar ro'yxatini ko'rish uchun ruxsat" },
  { key: "ticket", label: "Taklif va shikoyatlar ro'yxatini ko'rish uchun ruxsat" },
  { key: "workDone", label: "Ishchilarni bajargan ishlarini ro'yxatini ko'rish uchun ruxsat" },
  { key: "userFiles", label: "Imzolanadigan fayllar ro'yxatini ko'rish uchun ruxsat" },
  { key: "accauntant", label: "Xisobchilar ro'yxatini ko'rish uchun ruxsat" },
  { key: "chiefAccauntant", label: "Bosh xisobchilar ro'yxatini ko'rish uchun ruxsat" },
  { key: "warehouseman", label: "Omborchilar ro'yxatini ko'rish uchun ruxsat" },
  { key: "yuristAssistant", label: "Yurist yordamchilari ro'yxatini ko'rish uchun ruxsat" },
  { key: "carrier", label: "Yetkazib beruvchilar ro'yxatini ko'rish uchun ruxsat" },
];

const info = [
  { key: "/info", label: "Hodim ma'lumotlari" },
  { key: "/tasks", label: "Hodim vazifalari" },
  { key: "/obligations", label: "Hodim majburiyatlari" },
];

onMounted(() => {
  fetchUserData();
  socket.emit("joinAdmin", id.value);
  socket.on("adminOnlineUpdate", checkOnlineStatus);
});

onUnmounted(() => {
  socket.off("adminOnlineUpdate");
  socket.disconnect();
});
</script>

<template>
  <div class="min-h-screen dark:bg-gray-800 bg-gray-200 dark:text-gray-100 text-gray-800">
    <div class="max-w-[1140px] mx-auto p-6">
      <div class="bg-gradient-to-r relative from-purple-900 to-purple-600 w-full h-[200px] rounded-t-lg">
        <div :class="adminStatus.color" class="flex items-center absolute top-4 right-4">
          <span :class="adminStatus.dotColor"
            class="w-[25px] border-2 border-white h-[25px] rounded-full shadow-md"></span>
        </div>
      </div>
      <div class="relative bg-white dark:bg-gray-700 rounded-b-lg shadow-lg">
        <div class="absolute -top-16 left-[40px]">
          <img :src="userInfo ? getImageUrl(userInfo.img) : '/default-avatar.png'"
            class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700" />
        </div>
        <div class="pt-20 px-6 pb-6">
          <div :class="adminStatus.color" class="flex items-center">
            <span>{{
              dat === "datakril" ? translateText(adminStatus.status) : adminStatus.status
              }}</span>
          </div>
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {{
                  dat === "datakril"
                    ? translateText(`${userInfo.name} ${userInfo.surname}`)
                    : `${userInfo.name} ${userInfo.surname}`
                }}
              </h1>
            </div>
          </div>
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Telefon raqami -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:phone" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{
                dat === "datakril" ? translateText(userInfo?.phone) : userInfo?.phone
                }}</span>
            </div>

            <!-- Tug‘ilgan sana -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:cake-variant" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{
                dat === "datakril"
                  ? translateText(Timeee(userInfo?.birthday))
                  : Timeee(userInfo?.birthday)
              }}</span>
            </div>

            <!-- Lavozimi -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:briefcase-account" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{
                dat === "datakril"
                  ? translateText(userInfo?.lavozimi)
                  : userInfo?.lavozimi
              }}</span>
            </div>

            <!-- Ish boshlagan vaqti -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:calendar-clock" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{
                dat === "datakril"
                  ? translateText(`Ish boshlagan vaqti: ${Timeee(userInfo?.startWork)}`)
                  : `Ish boshlagan vaqti: ${Timeee(userInfo?.startWork)}`
              }}</span>
            </div>

            <!-- ID karta raqami -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:card-account-details-outline" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{
                dat === "datakril"
                  ? translateText("ID karta raqami:")
                  : "ID karta raqami:"
              }}
                {{ userInfo.userCode }}</span>
            </div>

            <!-- JSHSHIR -->
            <div class="flex items-center text-gray-700 dark:text-gray-200">
              <Icon icon="mdi:barcode" class="w-5 h-5 mr-2 text-blue-500" />
              <span>{{ dat === "datakril" ? translateText("JSHSHIR:") : "JSHSHIR:" }}
                {{ userInfo.uniqueCode }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-4">
            {{ dat === "datakril" ? translateText("Ruxsatlar") : "Ruxsatlar" }}
          </h2>
          <ul class="space-y-4">
            <li v-for="item in permissions" :key="item.key"
              class="flex flex-col md:flex-row md:items-center justify-between border-2 border-black/20 dark:border-white/20 p-4 rounded-xl shadow-md transition hover:shadow-lg">
              <div class="text-base font-medium mb-2 md:mb-0 md:mr-4">
                {{ dat === "datakril" ? translateText(item.label) : item.label }}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold">On</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="data[item.key]"
                    @change="() => togglePermission(item.key)" />
                  <div
                    class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 transition-all duration-300">
                  </div>
                  <div
                    class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-all duration-300">
                  </div>
                </label>
                <span class="text-sm font-semibold">Off</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-4">
            {{
              dat === "datakril"
                ? translateText("Qo'shimcha ma'lumotlar")
                : "Qo'shimcha ma'lumotlar"
            }}
          </h2>
          <ul class="space-y-4">
            <li v-for="item in info" :key="item.key" @click="router.push(item.key + `/${newId}`)"
              class="flex flex-col md:flex-row md:items-center justify-between border-2 border-black/20 dark:border-white/20 p-4 rounded-xl shadow-md transition hover:shadow-lg">
              <div class="text-base font-medium mb-2 md:mb-0 md:mr-4">
                {{ dat === "datakril" ? translateText(item.label) : item.label }}
              </div>
            </li>
          </ul>
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
  transition: 0.4s;
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
  transition: 0.4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #09ff52;
}

input:checked+.slider:before {
  transform: translateX(14px);
}
</style>