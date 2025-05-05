<template>
  <!-- Add Modal -->
  <div v-if="showModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-auto bg-slate-500 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="toggleModal" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <uploadpathadmin />
    </div>
  </div>

  <!-- Add File Modal -->
  <div v-if="showModalfiles"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="toggleFilesModal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png"
        alt="Close" />
      <div>
        <form @submit.prevent="uploadfile">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              placeholder="Court Name" required />
          </div>
          <div class="my-3">
            <input @change="onFileChange" type="file" required />
          </div>
          <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
            {{ $t('yuklash') }}
          </button>
        </form>
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  </div>

  <!-- Update File Modal -->
  <div v-if="fileModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="fileModal = false" class="w-10 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png"
        alt="Close" />
      <div>
        <form @submit.prevent="updatefileCourt">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              placeholder="Court Name" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" accept="image/*" class="my-2" />
          </div>
          <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
            {{ $t('yuklash') }}
          </button>
        </form>
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  </div>

  <!-- Update Modal -->
  <div v-if="PutModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-auto bg-slate-800 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="Modal" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <form @submit.prevent="updateCourt" class="w-full">
        <input v-model="courtName" class="w-full text-black outline-none p-3 mt-6 rounded-lg" type="text"
          placeholder="Court Name" required />
        <input @change="onFileChange" type="file" accept="image/*" class="w-full mt-4" />
        <button class="w-full mt-6 py-2 text-lg font-medium text-white bg-lime-600 rounded-lg hover:bg-lime-900"
          type="submit">
          {{ $t('yuklash') }}
        </button>
        <p v-if="successMessage" class="mt-2 text-center text-green-500">{{ successMessage }}</p>
        <p v-if="errorMessage" class="mt-2 text-center text-red-500">{{ errorMessage }}</p>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute w-[400px] bg-gray-300 flex flex-col items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="func(null)" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <div class="mt-4 flex flex-col gap-2 w-full items-center">
        <button @click="Modal"
          class="w-full py-4 px-6 text-lg font-medium text-black bg-lime-500 rounded-lg hover:bg-lime-600">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/pen.png" alt="Edit" />
          {{ $t('tahrirlash') }}
        </button>
        <button @click="removeSelectedItems"
          class="w-full py-4 text-lg px-6 font-medium text-white bg-red-500 rounded-lg hover:bg-red-700">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/remove.png" alt="Delete" />
          {{ $t('remove') }}
        </button>
        <div
          class="flex py-4 rounded-lg h-[70px] items-center text-black w-full min-w-[250px] duration-500 justify-between px-10 bg-gray-400 hover:red-700">
          <h2>Ishga tushirish</h2>
          <div class="flex gap-1">
            <h1>On</h1>
            <label class="switch">
              <input type="checkbox" v-model="workStatus" @change="updateWorkStatus">
              <span class="slider round"></span>
            </label>
            <h1>Off</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex flex-col items-center py-10">
    <div v-if="data.length || ServiceData.length" class="w-full gap-2 flex justify-end px-6">
      <button v-if="data.length == 0" @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t('create') }}
      </button>
      <button v-if="data.length" @click="toggleModal"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t("bolim_yaratish") }}
      </button>
    </div>
    <div v-else class="w-full gap-2 flex justify-end px-6">
      <button @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t('create') }}
      </button>
      <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t("bolim_yaratish") }}
      </button>
    </div>

    <div v-if="data.length == 0" class="text-black flex flex-col justify-center mt-16 items-center">
      <div class="rounded-[20px] max-w-[110rem] p-10 mb-16 opacity-[98%] w-[1200px] shadow-2xl bg-gray-300">
        <div v-if="dat === 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="Word Icon" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ item.fileName }}</h1>
          <div class="flex relative z-40 gap-2">
            <img @click.stop="Modalfile(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="Edit" />
            <img @click.stop="removefileItems(item.id)" class="w-4 h-4 cursor-pointer"
              src="../../../../public/reject.png" alt="Delete" />
          </div>
        </div>
        <div v-if="dat === 'datakril'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="Word Icon" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ translateText(item.fileName) }}</h1>
          <div class="flex gap-2">
            <img @click.stop="Modalfile(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="Edit" />
            <img @click.stop="removefileItems(item.id)" class="w-4 h-4 cursor-pointer"
              src="../../../../public/reject.png" alt="Delete" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.length" class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item.id)" class="absolute z-40 top-2 right-2 w-6 h-6 cursor-pointer" src="/ellipsis.png"
              alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Court Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            </div>
            <div v-if="item.workStatus"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
          <div v-if="dat === 'datakril'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item.id)" class="absolute z-40 top-2 right-2 w-6 h-6 cursor-pointer" src="/ellipsis.png"
              alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Court Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ translateText(item.name) }}</h3>
            </div>
            <div v-if="item.workStatus"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import uploadpathadmin from "@/components/main/path/uploadpathadmin.vue";
import { URL } from "../../../auth/url.js";
import axios from "axios";

const dat = inject('dat');
const router = useRouter();
const route = useRoute();

const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const id1 = ref(route.params.id);
const data = ref([]);
const ServiceData = ref([]);

const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const showModalfiles = ref(false);
const fileModal = ref(false);

const PutId = ref(null);
const selectedId = ref(null);
const selectedFileId = ref(null);

const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const workStatus = ref(false); // Boolean for workStatus toggle

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return '';
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};

const toggleModal = () => showModal.value = !showModal.value;
const toggleFilesModal = () => showModalfiles.value = !showModalfiles.value;

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const func = (id) => {
  PutId.value = id;
  selectedId.value = id;
  asd.value = !asd.value;

  if (id) {
    const selectedItem = data.value.find(item => item.id === id);
    if (selectedItem) {
      courtName.value = selectedItem.name;
      workStatus.value = selectedItem.workStatus; // Set the switch state
    }
  } else {
    courtName.value = "";
    workStatus.value = false;
  }
};

const Modalfile = (id) => {
  selectedFileId.value = id;
  fileModal.value = true;
  const selectedFile = ServiceData.value.find(item => item.id === id);
  if (selectedFile) courtName.value = selectedFile.fileName;
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const getData = async () => {
  try {
    const response = await axios.get(`${url}/${id1.value}`);
    const result = response.data;
    data.value = (result.services || [])
      .filter(item => item.status === "active")
      .sort((a, b) => a.id - b.id);
    ServiceData.value = result.files || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi";
  }
};

const uploadfile = async () => {
  if (!file.value || !courtName.value) {
    errorMessage.value = "Iltimos, barcha maydonlarni to'ldiring!";
    return;
  }

  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("files", file.value);

  try {
    await axios.post(`${URL}/courts/${id1.value}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    successMessage.value = "Fayl muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    resetForm();
    await getData();
    showModalfiles.value = false;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Fayl yuklashda xatolik!";
    console.error("Upload error:", error);
  }
};

const updatefileCourt = async () => {
  if (!courtName.value) {
    errorMessage.value = "Fayl nomini kiriting!";
    return;
  }

  const formData = new FormData();
  formData.append("fileName", courtName.value);
  if (file.value) formData.append("file", file.value);

  try {
    await axios.put(`${URL}/courts/files/${selectedFileId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    successMessage.value = "Fayl muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    resetForm();
    fileModal.value = false;
    await getData();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Yangilashda xatolik!";
  }
};

const updateCourt = async () => {
  if (!courtName.value) {
    errorMessage.value = "Sud nomini kiriting!";
    return;
  }

  const formData = new FormData();
  formData.append("name", courtName.value);
  if (file.value) formData.append("file", file.value);
  formData.append("courtsId", parseInt(id1.value));

  try {
    await axios.put(`${URL}/services/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    successMessage.value = "Sud muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    resetForm();
    PutModal.value = false;
    await getData();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Yangilashda xatolik!";
  }
};

const updateWorkStatus = async () => {
  if (!selectedId.value) return;

  const payload = {
    workStatus: workStatus.value, // Boolean true/false
    courtsId: parseInt(id1.value),
  };

  try {
    await axios.put(`${URL}/services/${selectedId.value}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    successMessage.value = "Ishga tushirish holati muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    await getData(); // Refresh data to reflect changes
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Holadni yangilashda xatolik!";
    console.error("Update workStatus error:", error);
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;

  try {
    await axios.delete(`${URL}/services/${selectedId.value}`);
    successMessage.value = "Sud muvaffaqiyatli o'chirildi!";
    errorMessage.value = "";
    asd.value = false;
    await getData();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "O'chirishda xatolik!";
  }
};

const removefileItems = async (id) => {
  try {
    await axios.delete(`${URL}/courts/files/${id}`);
    successMessage.value = "Fayl muvaffaqiyatli o'chirildi!";
    errorMessage.value = "";
    await getData();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Fayl o'chirishda xatolik!";
  }
};

const goToCard = (id) => router.push(`/edit/${id}/${id1.value}`);
const goToPath = (id) => router.push(`/aplicationsAdmin/${id}`);
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const resetForm = () => {
  courtName.value = "";
  file.value = null;
  successMessage.value = "";
  errorMessage.value = "";
};

watch([showModal, PutModal, asd, showModalfiles, fileModal], () => {
  document.body.style.overflow = showModal.value || PutModal.value || asd.value ||
    showModalfiles.value || fileModal.value ? 'hidden' : '';
});

onMounted(() => {
  getData();
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

input:checked+.slider {
  background-color: #09FF52;
}

input:checked+.slider:before {
  transform: translateX(24px);
}
</style>