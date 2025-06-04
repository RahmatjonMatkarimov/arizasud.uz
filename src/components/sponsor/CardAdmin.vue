<template>
  <div class="flex justify-center mt-8 items-center">
    <h1
      class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
      {{ dat === 'datakril' ? translateText('Hamkorlar ro\'yxati') : 'Hamkorlar ro\'yxati' }}
    </h1>
  </div>
  <div>
    <!-- Upload Form -->
    <div v-if="showModal"
      class="fixed z-30 top-0 inset-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <img @click="toggleModal" class="w-10 -mt-[220px] -mr-[325px] absolute z-10" src="../../../public/reject.png"
        alt="" />
      <div class="absolute w-96 bg-slate-500 flex flex-col opacity-90 items-center justify-center p-10 rounded-lg">
        <form @submit.prevent="uploadCourt" class="flex flex-col gap-4 max-w-sm mx-auto">
          <div>
            <input v-model="courtName" class="text-black w-full mt-5 outline-none p-3 rounded-lg" type="text" id="name"
              placeholder="Bo'lim nomini kiriting" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" required
              class="block w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
          <button class="w-full rounded-full bg-lime-600 hover:bg-lime-900 text-lg text-white py-2" type="submit">
            Yuklash
          </button>
        </form>
        <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </div>
    </div>
    <div class="w-full flex justify-end mt-2 px-6">
      <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        Bo'lim yuklash
      </button>
    </div>
    <!-- Display Uploaded Items -->
    <div class="w-full flex flex-col justify-center items-center mt-10">
      <div class="rounded-2xl w-full max-w-[110rem] p-10 mb-16 bg-gray-200">
        <div class="flex justify-center">
          <b class="mb-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">{{
            $t('hamkor') }}</b>
        </div>
        <div class="my-16 flex justify-center flex-wrap gap-4 max-w-[1600px] mx-auto">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
            class="bg-white border-[#223B9E] flex flex-col justify-start items-center gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2">
            <span @click.stop="func(item.id)" class="cursor-pointer w-6 h-6 z-40 absolute top-2 right-2">
              <img width="20px" src="../../../public/ellipsis.png" alt="" />
            </span>
            <div class="flex justify-center items-center p-2 h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="size-fit w-[150px]" />
            </div>
            <h3 class="text-lg font-medium text-center text-black">{{ item.translatedName }}</h3>
            <div v-if="item.isActive"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
            class="bg-white border-[#223B9E] flex flex-col justify-start items-center gap-2 border-[5px] break-words w-72 min-h-full rounded-xl relative hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-2">
            <span @click.stop="func(item.id)" class="cursor-pointer w-6 h-6 z-40 absolute top-2 right-2">
              <img width="20px" src="../../../public/ellipsis.png" alt="" />
            </span>
            <div class="flex justify-center items-center p-2 h-[160px]">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="size-fit w-[150px]" />
            </div>
            <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            <div v-if="item.isActive"
              class="bg-blue-200 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full">
              <b class="text-black font-bold text-[20px]">{{ $t('tez_kunda') }}</b>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="PutModal"
        class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
        <div
          class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
          <img @click="Modal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../public/reject.png" alt="" />
          <div>
            <form @submit.prevent="updateCourt">
              <div>
                <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
                  id="name" required />
              </div>
              <div>
                <input @change="onFileChange" type="file" id="file" accept="image/*" required />
              </div>
              <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
                Yuklash
              </button>
            </form>
            <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
            <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Action Modal (Edit/Delete/Toggle) -->
      <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
        <div class="relative w-[500px] bg-[#D9D9D9] flex flex-col items-center justify-center p-10 rounded-[15px]">
          <img @click="func(null)" class="w-10 absolute top-2 right-2" src="../../../public/reject.png" alt="" />
          <div class="mt-4 flex flex-col justify-center w-full items-center">
            <div class="flex flex-col gap-2 w-full justify-between items-center">
              <button @click="Modal"
                class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-[#15FF09] hover:bg-lime-600">
                <img class="w-8 mr-5" src="../../../public/pen.png" alt="">
                O’zgartirish
              </button>
              <button @click="removeSelectedItems"
                class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:bg-red-700">
                <img class="w-10 mr-5" src="../../../public/remove.png" alt="">
                O'chirish
              </button>
              <div
                class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-gray-400 hover:bg-gray-500">
                <h1 class="text-black mr-2">Ishga tushirish</h1>
                <label class="switch">
                  <input type="checkbox" v-model="selectedItem.isActive" @change="updateWorkStatus(selectedItem)">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url";
import translateText from "@/auth/Translate";
import { onMounted } from "vue";

const PutId = ref(null);
const PutModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const selectedItem = ref({ isActive: false }); // Store the selected item for the action modal
const imageBaseUrl = `${URL}/upload`;

const datakril = ref([]);
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
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
const isLoading = inject('isLoading');

// Fetch data from the backend
const getData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name)
        }))
        .filter((item) => item.status === "active");
      data.value = result.filter((item) => item.status === "active").sort((a, b) => a.id - b.id);
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

// Toggle upload modal
const toggleModal = () => {
  showModal.value = !showModal.value;
};

// Toggle edit and action modals
const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

// Open action modal and set selected item
const func = (id) => {
  PutId.value = id;
  asd.value = !asd.value;
  if (id) {
    const item = data.value.find(item => item.id === id) || datakril.value.find(item => item.id === id);
    selectedItem.value = { ...item }; // Set the selected item for the action modal
  } else {
    selectedItem.value = { isActive: false }; // Reset when closing
  }
};

// Handle file input change
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Upload new court
const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    await axios.post(`${URL}/partners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModal.value = false;
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi!";
  } finally {
    isLoading.value = false;
  }
};

// Update court
const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    const response = await axios.put(`${URL}/partners/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
      getData();
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

// Remove selected item
const removeSelectedItems = async () => {
  if (!PutId.value) return;
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners/${PutId.value}`, {
      method: "DELETE",
    });
    if (response.ok) {
      asd.value = false;
      await getData();
      successMessage.value = "Muvaffaqiyatli o'chirildi!";
      errorMessage.value = "";
    } else {
      errorMessage.value = "O'chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

// Update work status (isActive)
const updateWorkStatus = async (item) => {
  try {
    const endpoint = item.isActive ? `${URL}/partners/${item.id}/isActive` : `${URL}/partners/${item.id}/isFalse`;
    await axios.get(endpoint); // Adjust if your API uses PATCH/PUT instead of GET
    getData(); // Refresh the data after update
  } catch (error) {
    console.error('Error updating workStatus:', error);
  }
};

// Get image URL
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

// Watch modals to control body overflow
watch([showModal, PutModal, asd], ([modalOpen, editModalOpen, actionModalOpen]) => {
  if (modalOpen || editModalOpen || actionModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Initial data fetch
getData();
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