<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200/70">
    <div v-if="qwe" @click="qwe = false"
      class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative">
        <button @click="qwe = false"
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {{ dat === 'datakril' ? translateText("Yangi ishchi qo'shish") : "Yangi ishchi qo'shish" }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.namePlaceholder') }}
            </label>
            <input v-model="name" id="name"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.namePlaceholder')" />
            <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.surnamePlaceholder') }}
            </label>
            <input v-model="surname" id="surname"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.surnamePlaceholder')" />
            <label for="fatherName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.fatherNamePlaceholder') }}
            </label>
            <input v-model="fatherName" id="fatherName"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.fatherNamePlaceholder')" />
            <label for="passport" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passportPlaceholder') }}
            </label>
            <input v-model="passport" id="passport" @input="handlePassportInput" maxlength="9"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.passportPlaceholder')" />
            <label for="jshhr" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.jshhrPlaceholder') }}
            </label>
            <input v-model="jshhr" id="jshhr" @input="handleJshhrInput" type="text" maxlength="14"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.jshhrPlaceholder')" />
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.phonePlaceholder') }}
            </label>
            <input v-model="phone" id="phone" @focus="handlePhoneFocus" @input="handlePhoneInput" maxlength="17"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              placeholder="+998 91 999 99 99" />
          </div>
          <div>
            <label for="birthday" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.birthdayPlaceholder') }}
            </label>
            <input v-model="birthday" id="birthday" type="date"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.birthdayPlaceholder')" />
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.rolePlaceholder') }}
            </label>
            <input v-model="role" id="role"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.rolePlaceholder')" />
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.usernamePlaceholder') }}
            </label>
            <input v-model="username" id="username"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.usernamePlaceholder')" />
            <label for="password1" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passwordPlaceholder') }}
            </label>
            <div class="relative">
              <input v-model="password1" id="password1" :type="showPassword ? 'text' : 'password'"
                class="w-full p-3 mb-4 border rounded-xl pr-10 dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
                :placeholder="$t('createModal.passwordPlaceholder')" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                <img :src="showPassword ? '/eyes.png' : '/eye.png'" :alt="$t('createModal.toggleVisibilityAlt')"
                  class="w-5 h-5" />
              </button>
            </div>
            <label for="password2" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.confirmPasswordPlaceholder') }}
            </label>
            <div class="relative">
              <input v-model="password2" id="password2" :type="showPassword1 ? 'text' : 'password'"
                class="w-full p-3 mb-4 border rounded-xl pr-10 dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
                :placeholder="$t('createModal.confirmPasswordPlaceholder')" />
              <button type="button" @click="showPassword1 = !showPassword1"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                <img :src="showPassword1 ? '/eyes.png' : '/eye.png'" :alt="$t('createModal.toggleVisibilityAlt')"
                  class="w-5 h-5" />
              </button>
            </div>
            <input id="file-upload" type="file" @change="handleImageUpload" class="hidden" />
            <label for="file-upload"
              class="w-full block p-3 mt-[22px] mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition file:bg-gray-100 file:border-0 file:px-3 file:py-1 file:rounded">
              {{ dat === 'datakril' ? translateText("Rasmni yuklash") : "Rasmni yuklash" }}
            </label>
          </div>
        </div>
        <p v-if="err" class="text-center text-red-600 dark:text-red-400 mt-2 text-sm">{{ err }}</p>
        <button @click="post" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-6 rounded-xl transition">
          {{ $t('createModal.createButton') }}
        </button>
      </div>
    </div>
    <div v-if="PutModal" @click="PutModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative">
        <div class="absolute top-0 right-0 cursor-pointer" @click="PutModal = false">
          <button class="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
            +
          </button>
        </div>
        <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {{ dat === 'datakril' ? translateText("Yangilash") : "Yangilash" }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label for="updatedName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.namePlaceholder') }}
            </label>
            <input v-model="updatedName" id="updatedName" :placeholder="$t('createModal.namePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedSurname" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.surnamePlaceholder') }}
            </label>
            <input v-model="updatedSurname" id="updatedSurname" :placeholder="$t('createModal.surnamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedFatherName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.fatherNamePlaceholder') }}
            </label>
            <input v-model="updatedFatherName" id="updatedFatherName"
              :placeholder="$t('createModal.fatherNamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedPassport" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passportPlaceholder') }}
            </label>
            <input v-model="updatedPassport" id="updatedPassport" @input="handleUpdatedPassportInput" maxlength="9"
              :placeholder="$t('createModal.passportPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedJshhr" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.jshhrPlaceholder') }}
            </label>
            <input v-model="updatedJshhr" id="updatedJshhr" @input="handleUpdatedJshhrInput" type="text" maxlength="14"
              :placeholder="$t('createModal.jshhrPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
          </div>
          <div>
            <label for="updatedPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.phonePlaceholder') }}
            </label>
            <input v-model="updatedPhone" id="updatedPhone" @focus="handleUpdatedPhoneFocus"
              @input="handleUpdatedPhoneInput" maxlength="17" placeholder="+998 91 999 99 99"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedBirthday" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.birthdayPlaceholder') }}
            </label>
            <input v-model="updatedBirthday" id="updatedBirthday" type="date"
              :placeholder="$t('createModal.birthdayPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedrole" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.rolePlaceholder') }}
            </label>
            <input v-model="updatedrole" id="updatedrole" :placeholder="$t('createModal.rolePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedUsername" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.usernamePlaceholder') }}
            </label>
            <input v-model="updatedUsername" id="updatedUsername" :placeholder="$t('createModal.usernamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <input id="file-upload-update" type="file" @change="handleImageUploadUpdate" class="hidden" />
            <label for="file-upload-update"
              class="w-full block p-3 mt-[22px] mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition file:bg-gray-100 file:border-0 file:px-3 file:py-1 file:rounded">
              {{ dat === 'datakril' ? translateText("Rasmni yuklash") : "Rasmni yuklash" }}
            </label>
          </div>
        </div>
        <p v-if="err" class="text-center text-red-600 dark:text-red-400 mt-2 text-sm">{{ err }}</p>
        <button @click="updateAdmin"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl mt-6 w-full transition-all">
          {{ $t('editModal.updateButton') }}
        </button>
      </div>
    </div>
    <div v-if="asds" @click="asds = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative">
        <button @click="asds = false"
          class="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-200">{{ $t('passwordModal.title') }}</h2>
        <label for="updatednewPassword1" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {{ $t('passwordModal.newPasswordPlaceholder') }}
        </label>
        <input v-model="updatednewPassword1" id="updatednewPassword1" type="password"
          class="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          :placeholder="$t('passwordModal.newPasswordPlaceholder')" />
        <label for="updatednewPassword2" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {{ $t('passwordModal.confirmNewPasswordPlaceholder') }}
        </label>
        <input v-model="updatednewPassword2" id="updatednewPassword2" type="password"
          class="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          :placeholder="$t('passwordModal.confirmNewPasswordPlaceholder')" />
        <p class="text-red-600 text-sm dark:text-red-400">{{ err }}</p>
        <button @click="updatepassword"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-700 transition">
          {{ $t('passwordModal.updateButton') }}
        </button>
      </div>
    </div>
    <div v-if="asd" @click="asd = false"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div @click.stop class="bg-white dark:bg-[#2d2d2d] p-6 rounded-2xl w-11/12 max-w-sm text-center
             shadow-xl transform transition-transform duration-300 ease-out
             scale-100 opacity-100" :class="{ 'scale-95 opacity-0': !asd }">
        <h2 class="text-lg font-semibold dark:text-gray-200">
          {{ $t('deleteModal.confirmMessage') }}
        </h2>
        <p class="text-md text-gray-600 dark:text-gray-400 mt-2">
          {{ dat === 'datakril' ? translateText("Ishchini o'chirishni tasdiqlaysizmi?") :
            "Ishchini o'chirishni tasdiqlaysizmi?" }}
        </p>
        <div class="flex justify-center items-center gap-4 mt-6">
          <button @click="removeAdmin"
            class="bg-red-600 text-white px-5 py-2 w-full rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400">
            {{ dat === 'datakril' ? translateText("O'chirish") : "O'chirish" }}
          </button>
          <button @click="asd = false"
            class="bg-gray-400 text-white px-5 py-2 w-full rounded-lg hover:bg-gray-500 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400">
            {{ dat === 'datakril' ? translateText("Bekor qilish") : "Bekor qilish" }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center pt-4 px-4">
      <h1
        class="text-[40px] font-bold text-center bg-gradient-to-r from-blue-800 to-purple-500 text-white shadow-sm shadow-white rounded-lg py-2 px-[100px]">
        {{ dat === 'datakril' ? translateText("Yuristlar ro'yxati") : "Yuristlar ro'yxati" }} <span v-if="Count"
          class="border-b-4 px-1 border-white">{{ filteredAdmins.length }}</span>
      </h1>
    </div>
    <div class="flex justify-between items-center px-4 mt-4">
      <button @click="qwe = true"
        class="bg-blue-500 border-2 dark:border-white/40 dark:bg-gray-700 mr-5 text-white px-6 py-2 rounded-lg text-lg transition">
        {{ dat === 'datakril' ? translateText("Yangi ishchi qo'shish") : "Yangi ishchi qo'shish" }}
      </button>
    </div>
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-4">
      <div v-for="item in filteredAdmins" :key="item.id"
        class="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        :class="{ 'ring-2 ring-green-400 ring-opacity-50': checkIsOnlineRealtime(item.id) }">
        <div class="absolute top-2 right-2 flex items-center z-10">
          <span :class="[
            'w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300',
            checkIsOnlineRealtime(item.id) ? 'bg-green-500' : 'bg-red-500'
          ]"></span>
        </div>
        <div class="bg-gradient-to-r from-blue-800 to-purple-500 text-white text-center p-4">
          <div class="relative inline-block">
            <img class="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white -mb-3 z-10"
              :src="getImageUrl(item.img)" :alt="dat === 'datakril' ? translateText('Avatar') : 'Avatar'" />
          </div>
          <h2 class="text-lg font-bold mt-4">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
            {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
          </h2>
          <p class="text-sm">
            {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
          </p>
          <p :class="['text-xs mt-1 transition-colors duration-300', getStatusTextClass(item)]">
            {{ dat === 'datakril' ? translateText(getAdminStatusText(item)) : getAdminStatusText(item) }}
          </p>
        </div>
        <div class="p-4 text-sm space-y-2 text-gray-800 dark:text-gray-200">
          <p>
            <Icon icon="mdi:phone-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? translateText(item.phone) : item.phone }}
          </p>
          <p>
            <Icon icon="mdi:briefcase-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.startWork?.split('T')[0] : item.startWork?.split('T')[0] }}
          </p>
          <p>
            <Icon icon="mdi:cake-variant-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.birthday?.split('T')[0] : item.birthday?.split('T')[0] }}
          </p>
        </div>
        <div class="text-center p-4 flex justify-center gap-2">
          <button
            class="text-white font-bold py-2 px-4 rounded transition-all duration-300 bg-green-600 hover:bg-green-700"
            @click="router.push('/profile/' + item.id)">
            {{ dat === 'datakril' ? translateText("Batafsil Ma'lumot") : "Batafsil Ma'lumot" }}
          </button>
          <button :ref="el => buttonRefs[item.id] = el"
            class="text-white font-bold py-2 px-3 rounded transition-all duration-300 bg-yellow-600 hover:bg-yellow-700"
            @click="toggleModal(item.id)">
            {{ dat === 'datakril' ? translateText("Tahririlash") : "Tahririlash" }}
          </button>
          <div v-if="modalOpen === item.id" @click="modalOpen = null" class="fixed inset-0 z-[40]">
            <div @click.stop
              class="absolute bg-white border-2 dark:bg-[#2e2e2e] rounded-xl shadow-xl border-black/20 dark:border-gray-700 z-50 overflow-hidden"
              :style="modalPosition[item.id] || { top: '0px', left: '0px', width: '224px' }">
              <button @click="openEditModal(item), modalOpen = null"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-gray-700 dark:text-gray-100 hover:bg-gray-500/50 dark:hover:bg-gray-700 transition-colors">
                <Icon icon="mdi:pencil" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("Tahrirlash") : "Tahrirlash" }}
              </button>
              <button @click="openDeleteModal(item.id), modalOpen = null"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-700/50 transition-colors">
                <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("O'chirish") : "O'chirish" }}
              </button>
              <button @click="openPassModal(item), modalOpen = null"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-lime-600 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-700/50 transition-colors">
                <Icon icon="mdi:key-outline" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("Parolni o'zgartirish") : "Parolni o'zgartirish" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';

const buttonRefs = ref({});
const modalPosition = ref({});
const { t } = useI18n();
const socket = io(URL);
const router = useRouter();
const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};
onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const data = ref([]);
const searchQuery = ref(""); // New ref for search input
const onlineAdmins = ref([]);
const modalOpen = ref(null);
const qwe = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const asds = ref(false);
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
const updatednewPassword1 = ref("");
const updatednewPassword2 = ref("");
const Count = ref(null);
const existingImage = ref(null);
import { useSearchStore } from '@/components/Templates/searchQuary'
const searchStore = useSearchStore()
// Computed property to filter admins based on search query
const filteredAdmins = computed(() => {
  const query = searchStore.query.toLowerCase().trim();
  if (!query) return data.value;

  return data.value.filter(admin => {
    const fullName = `${admin.name} ${admin.surname}`.toLowerCase();
    const phone = admin.phone?.toLowerCase() || "";
    return (
      fullName.includes(query) ||
      phone.includes(query)
    );
  });
});

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "o'": "ў", "g'": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ў"
};

const translateText = (text) => {
  if (!text) return '';
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/yurist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    data.value = response.data
      .filter(item => item.type === "active")
      .sort((a, b) => a.id - b.id);
    Count.value = data.value.length;

    checkOnlineStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const checkIsOnlineRealtime = (adminId) => {
  const admin = data.value.find(item => item.id === adminId);
  if (!admin || !admin.lastSeen) return false;

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);
  return timeDifference < 5;
};

const getAdminStatusText = (admin) => {
  if (!admin.lastSeen) {
    return t('adminCard.offlineStatus');
  }

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);

  if (timeDifference < 5) {
    return t('adminCard.onlineStatus');
  } else {
    return `${formatDistanceToNow(new Date(admin.lastSeen), {
      addSuffix: true,
      locale: uz,
    })} tarmoqda edi`;
  }
};

const getStatusTextClass = (admin) => {
  if (!admin.lastSeen) {
    return "text-gray-100";
  }

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);

  return timeDifference < 5 ? "text-green-500" : "text-red-500";
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

const toggleModal = async (id) => {
  modalOpen.value = modalOpen.value === id ? null : id;

  if (modalOpen.value === id) {
    await nextTick(); // Wait for DOM to update
    const button = buttonRefs.value[id];
    if (button) {
      const rect = button.getBoundingClientRect();
      const offsetX = 10; // Space from the button
      const offsetY = 0; // Align vertically with the button

      // Calculate position (right side of the button)
      let left = rect.right + offsetX + window.scrollX;
      let top = rect.top + offsetY + window.scrollY;

      // Ensure modal stays within viewport
      const modalWidth = 224; // Modal width in pixels
      const viewportWidth = window.innerWidth;
      if (left + modalWidth > viewportWidth) {
        // If modal overflows on the right, position it to the left of the button
        left = rect.left - modalWidth - offsetX;
      }

      // Ensure modal doesn't go off-screen horizontally
      if (left < 0) left = 10; // Minimum padding from left edge

      modalPosition.value[id] = {
        top: `${top -50}px`,
        left: `${left}px`,
        width: `${modalWidth}px`
      };
    }
  }
};

const openEditModal = (item) => {
  selectedId.value = item.id;
  updatedName.value = item.name;
  updatedSurname.value = item.surname;
  updatedFatherName.value = item.dadname;
  updatedUsername.value = item.username;
  updatedPassport.value = item.userCode;
  updatedJshhr.value = item.uniqueCode ? item.uniqueCode.toString() : '';

  // Format phone number
  let phoneValue = item.phone || '';
  if (phoneValue && phoneValue.startsWith('+998')) {
    let numbers = phoneValue.replace(/\D/g, '').slice(3);
    if (numbers.length > 9) numbers = numbers.slice(0, 9);
    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    updatedPhone.value = formatted;
  } else {
    updatedPhone.value = phoneValue || '+998';
  }

  updatedrole.value = item.lavozimi;
  updatedBirthday.value = item.birthday ? item.birthday.split("T")[0] : "";
  existingImage.value = item.img;
  updatedImage.value = null;
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
  updatedJshhr.value = item.uniqueCode ? item.uniqueCode.toString() : '';
  updatedPhone.value = item.phone;
  updatedrole.value = item.lavozimi;
  updatedBirthday.value = item.birthday;
  asds.value = true;
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
  return phoneRegex.test(phone);
};

const validatePassport = (passport) => {
  const passportRegex = /^[A-Z]{2}\d{7}$/;
  return passportRegex.test(passport);
};

const validateJshhr = (jshhr) => {
  const jshhrRegex = /^\d{14}$/;
  return jshhrRegex.test(jshhr);
};

const post = async () => {
  err.value = "";
  if (!name.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Ismni kiriting") : "Ismni kiriting";
    return;
  }
  if (!surname.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Familiyani kiriting") : "Familiyani kiriting";
    return;
  }
  if (!fatherName.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Otangizning ismini kiriting") : "Otangizning ismini kiriting";
    return;
  }
  if (!passport.value.trim() || !validatePassport(passport.value)) {
    err.value = dat === 'datakril' ? translateText("Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)") : "Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)";
    return;
  }
  if (!jshhr.value || !validateJshhr(jshhr.value)) {
    err.value = dat === 'datakril' ? translateText("JShShIR 14 raqamdan iborat bo'lishi kerak") : "JShShIR 14 raqamdan iborat bo'lishi kerak";
    return;
  }
  if (!phone.value.trim() || !validatePhone(phone.value)) {
    err.value = dat === 'datakril' ? translateText("Telefon raqamini to'g'ri kiriting") : "Telefon raqamini to'g'ri kiriting";
    return;
  }
  if (!birthday.value) {
    err.value = dat === 'datakril' ? translateText("Tug'ilgan kunni kiriting") : "Tug'ilgan kunni kiriting";
    return;
  }
  if (!role.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Lavozimni kiriting") : "Lavozimni kiriting";
    return;
  }
  if (!username.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Foydalanuvchi nomini kiriting") : "Foydalanuvchi nomini kiriting";
    return;
  }
  if (!password1.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Parolni kiriting") : "Parolni kiriting";
    return;
  }
  if (!password2.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Parolni tasdiqlang") : "Parolni tasdiqlang";
    return;
  }
  if (password1.value !== password2.value) {
    err.value = dat === 'datakril' ? translateText("Parollar bir xil emas") : "Parollar bir xil emas";
    return;
  }
  if (!image.value) {
    err.value = dat === 'datakril' ? translateText("Rasmni yuklang") : "Rasmni yuklang";
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
  formData.append("phone", phone.value.replace(/\s/g, ''));
  formData.append("password", password2.value);
  formData.append("startWork", createdAt);
  formData.append("lavozimi", role.value);
  formData.append("img", image.value);

  try {
    const token = localStorage.getItem("token");
    await axios.post(`${URL}/yurist`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    getData();
    qwe.value = false;
    err.value = "";
    name.value = "";
    surname.value = "";
    fatherName.value = "";
    username.value = "";
    passport.value = "";
    jshhr.value = "";
    phone.value = "";
    birthday.value = "";
    role.value = "";
    password1.value = "";
    password2.value = "";
    image.value = null;
  } catch (error) {
    console.error("Error creating admin:", error.response?.data || error.message);
    err.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Admin yaratishda xatolik") : "Admin yaratishda xatolik");
  }
};

const updateAdmin = async () => {
  err.value = "";
  if (!updatedName.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Ismni kiriting") : "Ismni kiriting";
    return;
  }
  if (!updatedSurname.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Familiyani kiriting") : "Familiyani kiriting";
    return;
  }
  if (!updatedFatherName.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Otangizning ismini kiriting") : "Otangizning ismini kiriting";
    return;
  }
  if (!updatedPassport.value.trim() || !validatePassport(updatedPassport.value)) {
    err.value = dat === 'datakril' ? translateText("Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)") : "Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)";
    return;
  }
  if (!updatedJshhr.value || !validateJshhr(updatedJshhr.value)) {
    err.value = dat === 'datakril' ? translateText("JShShIR 14 raqamdan iborat bo'lishi kerak") : "JShShIR 14 raqamdan iborat bo'lishi kerak";
    return;
  }
  if (!updatedPhone.value.trim() || !validatePhone(updatedPhone.value)) {
    err.value = dat === 'datakril' ? translateText("Telefon raqamini to'g'ri kiriting") : "Telefon raqamini to'g'ri kiriting";
    return;
  }
  if (!updatedBirthday.value) {
    err.value = dat === 'datakril' ? translateText("Tug'ilgan kunni kiriting") : "Tug'ilgan kunni kiriting";
    return;
  }
  if (!updatedrole.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Lavozimni kiriting") : "Lavozimni kiriting";
    return;
  }
  if (!updatedUsername.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Foydalanuvchi nomini kiriting") : "Foydalanuvchi nomini kiriting";
    return;
  }
  if (!updatedImage.value && !existingImage.value) {
    err.value = dat === 'datakril' ? translateText("Rasmni yuklang") : "Rasmni yuklang";
    return;
  }

  const formData = new FormData();
  formData.append("name", updatedName.value);
  formData.append("surname", updatedSurname.value);
  formData.append("dadname", updatedFatherName.value);
  formData.append("username", updatedUsername.value);
  formData.append("userCode", updatedPassport.value);
  formData.append("uniqueCode", updatedJshhr.value);
  formData.append("birthday", updatedBirthday.value);
  formData.append("phone", updatedPhone.value.replace(/\s/g, ''));
  formData.append("lavozimi", updatedrole.value);

  if (updatedImage.value) {
    formData.append("image", updatedImage.value);
  }

  try {
    const token = localStorage.getItem("token");
    await axios.put(`${URL}/yurist/${selectedId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    getData();
    PutModal.value = false;
    err.value = "";
    updatedName.value = "";
    updatedSurname.value = "";
    updatedFatherName.value = "";
    updatedUsername.value = "";
    updatedPassport.value = "";
    updatedJshhr.value = "";
    updatedPhone.value = "";
    updatedBirthday.value = "";
    updatedrole.value = "";
    updatedImage.value = null;
    existingImage.value = null;
  } catch (error) {
    err.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Yangilashda xatolik") : "Yangilashda xatolik");
    console.error("Error updatingysis admin:", error);
  }
};

const updatepassword = async () => {
  err.value = "";
  if (!updatednewPassword1.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Yangi parolni kiriting") : "Yangi parolni kiriting";
    return;
  }
  if (!updatednewPassword2.value.trim()) {
    err.value = dat === 'datakril' ? translateText("Parolni tasdiqlang") : "Parolni tasdiqlang";
    return;
  }
  if (updatednewPassword1.value !== updatednewPassword2.value) {
    err.value = dat === 'datakril' ? translateText("Parollar bir xil emas") : "Parollar bir xil emas";
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${URL}/yurist/${selectedId.value}/password`,
      {
        newPassword: updatednewPassword2.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    getData();
    asds.value = false;
    err.value = "";
    updatednewPassword1.value = "";
    updatednewPassword2.value = "";
  } catch (error) {
    err.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Parolni yangilashda xatolik") : "Parolni yangilashda xatolik");
    console.error("Error updating password:", error);
  }
};

const removeAdmin = async () => {
  if (!selectedId.value) {
    console.error("No admin ID selected for deletion");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${URL}/yurist/${selectedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getData();
    asd.value = false;
  } catch (error) {
    console.error("Error deleting admin:", error.response?.data || error.message);
  }
};

const handlePhoneFocus = () => {
  if (!phone.value || phone.value.trim() === '') {
    phone.value = '+998';
  }
};

const handlePhoneInput = (event) => {
  let value = event.target.value;
  if (!value.startsWith('+998')) {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length > 0) {
      phone.value = '+998' + numbersOnly;
    } else {
      phone.value = '+998';
    }
  } else {
    let numbers = value.replace(/\D/g, '').slice(3);
    if (numbers.length > 9) numbers = numbers.slice(0, 9);
    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    phone.value = formatted;
  }
};

const handleUpdatedPhoneFocus = () => {
  if (!updatedPhone.value || updatedPhone.value.trim() === '') {
    updatedPhone.value = '+998';
  }
};

const handleUpdatedPhoneInput = (event) => {
  let value = event.target.value;
  if (!value.startsWith('+998')) {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length > 0) {
      updatedPhone.value = '+998' + numbersOnly;
    } else {
      updatedPhone.value = '+998';
    }
  } else {
    let numbers = value.replace(/\D/g, '').slice(3);
    if (numbers.length > 9) numbers = numbers.slice(0, 9);
    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    updatedPhone.value = formatted;
  }
};

const handlePassportInput = (event) => {
  let value = event.target.value.toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 2) {
    const letters = value.slice(0, 2);
    const digits = value.slice(2, 9);
    value = letters + digits;
  } else {
    value = value.slice(0, 2);
  }
  passport.value = value;
};

const handleUpdatedPassportInput = (event) => {
  let value = event.target.value.toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 2) {
    const letters = value.slice(0, 2);
    const digits = value.slice(2, 9);
    value = letters + digits;
  } else {
    value = value.slice(0, 2);
  }
  updatedPassport.value = value;
};

const handleJshhrInput = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  value = value.slice(0, 14);
  jshhr.value = value;
};

const handleUpdatedJshhrInput = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  value = value.slice(0, 14);
  updatedJshhr.value = value;
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
    checkOnlineStatus();
    data.value = [...data.value];
  }, 60000);

  watch([qwe, PutModal, asds, asd], ([createModal, editModal, passModal, deleteModal]) => {
    if (createModal || editModal || passModal || deleteModal) {
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