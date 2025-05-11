<template>
    <div class="min-h-screen flex flex-col items-center p-4">
      <!-- Create Admin Modal -->
      <div v-if="qwe" class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
          <div class="flex justify-end">
            <img @click="qwe = false" class="w-8 -m-4 cursor-pointer absolute" src="/reject.png" :alt="t('createModal.closeAlt')" />
          </div>
          <input v-model="name" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.namePlaceholder')" />
          <input v-model="surname" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.surnamePlaceholder')" />
          <input v-model="fatherName" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.fatherNamePlaceholder')" />
          <input v-model="passport" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.passportPlaceholder')" />
          <input v-model="jshhr" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.jshhrPlaceholder')" />
          <input v-model="phone" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.phonePlaceholder')" />
          <input v-model="birthday" type="date" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.birthdayPlaceholder')" />
          <input v-model="role" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.rolePlaceholder')" />
          <input v-model="username" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.usernamePlaceholder')" />
          <div class="relative">
            <input v-model="password1" :type="showPassword ? 'text' : 'password'" class="w-full text-black p-2 mb-3 border rounded-lg pr-10" :placeholder="t('createModal.passwordPlaceholder')" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center">
              <img :src="showPassword ? '/eyes.png' : '/eye.png'" :alt="t('createModal.toggleVisibilityAlt')" class="w-5 h-5" />
            </button>
          </div>
          <div class="relative">
            <input v-model="password2" :type="showPassword1 ? 'text' : 'password'" class="w-full text-black p-2 mb-3 border rounded-lg pr-10" :placeholder="t('createModal.confirmPasswordPlaceholder')" />
            <button type="button" @click="showPassword1 = !showPassword1" class="absolute inset-y-0 right-3 flex items-center">
              <img :src="showPassword1 ? '/eyes.png' : '/eye.png'" :alt="t('createModal.toggleVisibilityAlt')" class="w-5 h-5" />
            </button>
          </div>
          <input type="file" @change="handleImageUpload" class="w-full text-black p-2 mb-3 border rounded-lg" />
          <p class="text-red-600 text-sm">{{ err }}</p>
          <button @click="post" class="bg-green-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-green-800 transition">
            {{ t('createModal.createButton') }}
          </button>
        </div>
      </div>
  
      <!-- Edit Admin Modal -->
      <div v-if="PutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
          <div class="flex justify-end">
            <img @click="PutModal = false" class="w-8 -m-4 cursor-pointer absolute" src="../../../public/reject.png" :alt="t('createModal.closeAlt')" />
          </div>
          <h2 class="text-xl font-semibold text-black mb-4">{{ t('editModal.title') }}</h2>
          <input v-model="updatedName" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.namePlaceholder')" />
          <input v-model="updatedSurname" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.surnamePlaceholder')" />
          <input v-model="updatedFatherName" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.fatherNamePlaceholder')" />
          <input v-model="updatedPassport" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.passportPlaceholder')" />
          <input v-model="updatedJshhr" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.jshhrPlaceholder')" />
          <input v-model="updatedPhone" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.phonePlaceholder')" />
          <input v-model="updatedBirthday" type="date" class="w-full text-black p-2 mb-3 border rounded-lg" :placeholder="t('createModal.birthdayPlaceholder')" />
          <input v-model="updatedrole" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.rolePlaceholder')" />
          <input v-model="updatedUsername" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('createModal.usernamePlaceholder')" />
          <input type="file" @change="handleImageUploadUpdate" class="w-full text-black p-2 mb-3 border rounded-lg" />
          <button @click="updateAdmin" class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-800 transition">
            {{ t('editModal.updateButton') }}
          </button>
        </div>
      </div>
  
      <!-- Password Update Modal -->
      <div v-if="asds" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
          <div class="flex justify-end">
            <img @click="asds = false" class="w-8 -m-4 cursor-pointer absolute" src="../../../public/reject.png" :alt="t('createModal.closeAlt')" />
          </div>
          <h2 class="text-xl font-semibold text-black mb-4">{{ t('passwordModal.title') }}</h2>
          <input v-model="updatednewPassword1" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('passwordModal.newPasswordPlaceholder')" />
          <input v-model="updatednewPassword2" class="w-full p-2 mb-3 border text-black rounded-lg" :placeholder="t('passwordModal.confirmNewPasswordPlaceholder')" />
          <p class="text-red-600 text-sm">{{ err }}</p>
          <button @click="updatepassword" class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-800 transition">
            {{ t('passwordModal.updateButton') }}
          </button>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="asd" class="fixed inset-0 flex items-center z-20 justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg w-11/12 max-w-sm text-center">
          <h2 class="text-lg text-black font-semibold">{{ t('deleteModal.confirmMessage') }}</h2>
          <div class="flex justify-center items-center gap-4 mt-4">
            <button @click="removeAdmin" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition">
              {{ t('deleteModal.deleteButton') }}
            </button>
            <button @click="asd = false" class="bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              {{ t('deleteModal.cancelButton') }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Admin List Header -->
      <div class="flex justify-center mb-16 mt-4 items-center">
        <h1 class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
           {{ dat === 'datakril' ? translateText('Bugalterlar ro\'yxati') : 'Bugalterlar ro\'yxati' }}<span v-if="Count" class="border-b-4 px-1 border-black text-black">{{ Count }}</span>
        </h1>
      </div>
  
      <!-- Create Admin Button -->
      <div class="flex justify-end w-full max-w-4xl">
        <button @click="qwe = true" class="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-full text-lg transition">
          {{ t('createAdminButton') }}
        </button>
      </div>
  
      <!-- Admin Cards -->
      <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
        <div v-for="item in data" :key="item.id" class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
            <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
              <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
            </div>
            <div class="ml-4 flex-grow">
              <h1 v-if="dat === 'datalotin'" class="text-2xl font-semibold text-gray-700">
                {{ t('adminCard.fioLabel') }} {{ item.surname }} {{ item.name }} {{ item.dadname }}
              </h1>
              <h1 v-if="dat === 'datakril'" class="text-2xl first-letter:uppercase font-semibold text-gray-700">
                <span class="uppercase">{{ t('adminCard.fioLabel') }}</span>
                {{ translateText(item.surname) }} {{ translateText(item.name) }} {{ translateText(item.dadname) }}
              </h1>
              <h1 v-if="dat === 'datakril'" class="text-lg text-gray-500 first-letter:uppercase">
                <span class="first-letter:uppercase">{{ t('adminCard.loginLabel') }}</span> {{ translateText(item.username) }}
              </h1>
              <h1 v-if="dat === 'datalotin'" class="text-lg text-gray-500 first-letter:uppercase">
                <span class="first-letter:uppercase">{{ t('adminCard.loginLabel') }}</span> {{ item.username }}
              </h1>
              <div class="mb-4 relative text-gray-700 flex w-fit break-words">
                <span v-if="dat === 'datalotin'" class="font-medium text-gray-700 first-letter:uppercase">{{ t('adminCard.roleLabel') }}</span>
                <span v-if="dat === 'datakril'" class="font-medium text-gray-700 first-letter:uppercase">{{ t('adminCard.roleLabel') }}</span>
                <span v-if="dat === 'datalotin'" class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                  {{ item.lavozimi }}
                  <span class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                    {{ item.lavozimi }}
                  </span>
                </span>
                <span v-if="dat === 'datakril'" class="block group truncate text-gray-700 max-w-[450px] first-letter:uppercase ml-2 cursor-pointer">
                  {{ translateText(item.lavozimi) }}
                  <span class="absolute left-0 top-full first-letter:uppercase mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                    {{ translateText(item.lavozimi) }}
                  </span>
                </span>
              </div>
              <div class="flex items-center">
                <span v-if="dat === 'datalotin'" class="mr-2 text-sm text-gray-500">{{ t('adminCard.statusLabel') }}</span>
                <span v-if="dat === 'datakril'" class="mr-2 text-sm text-gray-500">{{ t('adminCard.statusLabel') }}</span>
                <span :class="getAdminStatus(item).color">
                  {{ getAdminStatus(item).status }}
                </span>
                <div class="flex items-center gap-2 ml-2">
                  <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item.id) ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleModal(item.id)" class="text-gray-500 z-30 hover:text-gray-700 text-2xl p-2">⋮</button>
            <div v-if="modalOpen === item.id" class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-10">
              <button @click="openEditModal(item)" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                {{ t('adminCard.editButton') }}
              </button>
              <button @click="openDeleteModal(item.id)" class="w-full px-4 py-2 flex items-center text-left text-red-600 hover:bg-red-100">
                <h1 class="text-red-600 text-[30px] mr-1"></h1> {{ t('adminCard.deleteButton') }}
              </button>
              <button @click="openPassModal(item)" class="block w-full px-4 py-2 text-left text-lime-600 hover:bg-red-100">
                {{ t('adminCard.changePasswordButton') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted, inject } from "vue";
  import axios from "axios";
  import { formatDistanceToNow } from "date-fns";
  import { uz } from "date-fns/locale";
  import { URL } from "@/auth/url.js";
  import { useRouter } from "vue-router";
  import { io } from "socket.io-client";
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  
  const dat = inject('dat');
  const socket = io(URL);
  const data = ref([]);
  const onlineAdmins = ref([]);
  const modalOpen = ref(null);
  const qwe = ref(false);
  const PutModal = ref(false);
  const asd = ref(false);
  const err = ref("");
  const selectedId = ref(null);
  const showPassword = ref(false);
  const showPassword1 = ref(false);
  const name = ref("");
  const surname = ref("");
  const fatherName = ref("");
  const username = ref("");
  const passport = ref("");
  const jshhr = ref("");
  const phone = ref("");
  const birthday = ref("");
  const password1 = ref("");
  const password2 = ref("");
  const image = ref(null);
  const role = ref("");
  const updatedrole = ref("");
  const updatedName = ref("");
  const updatedSurname = ref("");
  const updatedFatherName = ref("");
  const updatedUsername = ref("");
  const updatedPassport = ref("");
  const updatedJshhr = ref("");
  const updatedPhone = ref("");
  const updatedBirthday = ref("");
  const updatedImage = ref(null);
  const updatedPassword = ref("");
  const updatednewPassword1 = ref("");
  const updatednewPassword2 = ref("");
  const Count = ref(null);
  const asds = ref(false);
  const router = useRouter();
  
  const path = (id) => {
    router.push(`/profile/${id}`);
  };
  
  const translitMap = {
    "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "o'": "ў", "g'": "ғ",
    "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
    "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
    "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ў"
  };
  
  const translateText = (text) => {
    let translated = text.toLowerCase();
    for (const key in translitMap) {
      const regex = new RegExp(key, "g");
      translated = translated.replace(regex, translitMap[key]);
    }
    return translated;
  };
  
  const toggleModal = (id) => {
    modalOpen.value = modalOpen.value === id ? null : id;
  };
  
  const openEditModal = (item) => {
    selectedId.value = item.id;
    updatedName.value = item.name;
    updatedSurname.value = item.surname;
    updatedFatherName.value = item.dadname;
    updatedUsername.value = item.username;
    updatedPassport.value = item.userCode;
    updatedJshhr.value = item.uniqueCode;
    updatedPhone.value = item.phone;
    updatedrole.value = item.lavozimi;
    updatedBirthday.value = item.birthday ? item.birthday.split("T")[0] : "";
    PutModal.value = true;
    asd.value = false;
  };
  
  const openDeleteModal = (id) => {
    selectedId.value = id;
    PutModal.value = false;
    asd.value = true;
  };
  
  const openPassModal = (item) => {
    selectedId.value = item.id;
    updatedName.value = item.name;
    updatedSurname.value = item.surname;
    updatedFatherName.value = item.dadname;
    updatedUsername.value = item.username;
    updatedPassport.value = item.userCode;
    updatedJshhr.value = item.uniqueCode;
    updatedPhone.value = item.phone;
    updatedrole.value = item.lavozimi;
    updatedBirthday.value = item.birthday;
    asds.value = true;
  };
  
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${URL}/accauntant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      data.value = response.data
        .filter(item => item.type === "active")
        .sort((a, b) => a.id - b.id);
      Count.value = data.value.length;
  
      checkOnlineStatus(); // Update online status after fetching data
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };
  
  const checkIsOnline = (adminId) => {
    const admin = data.value.find(item => item.id === adminId);
    if (!admin || !admin.lastSeen) return false;
  
    const lastSeenTime = new Date(admin.lastSeen).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - lastSeenTime) / (1000 * 60); // Convert to minutes
  
    return timeDifference < 5; // Online if less than 5 minutes
  };
  
  const getAdminStatus = (admin) => {
    if (!admin.lastSeen) {
      return { status: t('adminCard.offlineStatus'), color: "text-gray-500" };
    }
  
    const lastSeenTime = new Date(admin.lastSeen).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - lastSeenTime) / (1000 * 60); // Convert to minutes
  
    if (timeDifference < 5) {
      return { status: t('adminCard.onlineStatus'), color: "text-green-500" };
    } else {
      return {
        status: `${formatDistanceToNow(new Date(admin.lastSeen), {
          addSuffix: true,
          locale: uz,
        })} tarmoqda edi`,
        color: "text-red-500",
      };
    }
  };
  
  const checkOnlineStatus = () => {
    onlineAdmins.value = data.value
      .filter(admin => {
        if (!admin.lastSeen) return false;
        const lastSeenTime = new Date(admin.lastSeen).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);
        return timeDifference < 5;
      })
      .map(admin => admin.id.toString());
  };
  
  const getImageUrl = (img) => {
    return img ? `${URL}/upload/${img}` : "/default-avatar.png";
  };
  
  const updateAdmin = async () => {
    const formData = new FormData();
    formData.append("name", updatedName.value);
    formData.append("surname", updatedSurname.value);
    formData.append("dadname", updatedFatherName.value);
    formData.append("username", updatedUsername.value);
    formData.append("userCode", updatedPassport.value);
    formData.append("uniqueCode", updatedJshhr.value);
    formData.append("birthday", updatedBirthday.value);
    formData.append("phone", updatedPhone.value);
    formData.append("lavozimi", updatedrole.value);
  
    if (updatedImage.value) formData.append("image", updatedImage.value);
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${URL}/accauntant/${selectedId.value}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      getData();
      PutModal.value = false;
    } catch (error) {
      err.value = error.response?.data?.message || t('errors.updateError');
      console.error("Xatolik:", error);
    }
  };
  
  const updatepassword = async () => {
    if (updatednewPassword1.value !== updatednewPassword2.value) {
      err.value = t('errors.passwordMismatch');
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${URL}/accauntant/${selectedId.value}`,
        {
          password: updatednewPassword2.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getData();
      asds.value = false;
      err.value = "";
    } catch (error) {
      err.value = error.response?.data?.message || t('errors.passwordUpdateError');
      console.error("Xatolik:", error);
    }
  };
  
  const post = async () => {
    if (password1.value !== password2.value) {
      err.value = t('errors.passwordMismatch');
      return;
    }
  
    const createdAt = new Date().toISOString();
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("surname", surname.value);
    formData.append("dadname", fatherName.value);
    formData.append("username", username.value);
    formData.append("userCode", passport.value);
    formData.append("uniqueCode", jshhr.value);
    formData.append("birthday", birthday.value);
    formData.append("phone", phone.value);
    formData.append("password", password2.value);
    formData.append("startWork", createdAt);
    formData.append("lavozimi", role.value);
  
    if (image.value) {
      formData.append("img", image.value);
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${URL}/accauntant`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      getData();
      qwe.value = false;
    } catch (error) {
      console.error("Xatolik admin qo'shishda:", error.response?.data || error.message);
      err.value = error.response?.data?.message || t('errors.createError');
    }
  };
  
  const removeAdmin = async () => {
    if (!selectedId.value) {
      console.error("O'chirish uchun admin ID tanlanmagan");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/accauntant/${selectedId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getData();
      asd.value = false;
    } catch (error) {
      console.error("O‘chirishda xatolik:", error.response?.data || error.message);
    }
  };
  
  const handleImageUpload = (event) => {
    image.value = event.target.files[0];
  };
  
  const handleImageUploadUpdate = (event) => {
    updatedImage.value = event.target.files[0];
  };
  
  onMounted(() => {
    getData();
  
    socket.on("connect", () => {
      socket.emit("getOnlineAdmins");
    });
  
    socket.on("onlineAdmins", () => {
      checkOnlineStatus();
    });
  
    socket.on("adminOnlineUpdate", () => {
      checkOnlineStatus();
    });
  
    const interval = setInterval(() => {
      checkOnlineStatus(); // Periodically check online status
      data.value = [...data.value]; // Trigger reactivity
    }, 60000); // Update every minute
  
    watch([qwe, PutModal, asds, asd], ([modalOpen, editModal, passModal, deleteModal]) => {
      if (modalOpen || editModal || passModal || deleteModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  
    onUnmounted(() => {
      clearInterval(interval);
      socket.off("adminOnlineUpdate");
      socket.disconnect();
    });
  });
  </script>
  
  <style scoped>
  * {
    color: black;
  }
  </style>