<template>
  <div class="p-6 max-w-2xl mx-auto bg-gray-300 shadow-lg rounded-lg">
    <div v-if="fields.length">
      <div v-for="(field, index) in uniqueFields" :key="index" class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">{{ field.key }}</label>
        <input v-model="fieldValues[index]" :placeholder="field.key" type="text" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" />
      </div>

      <div class="mt-4 text-center">
        <button @click="openCameraModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
         Suratga Olish
        </button>
        <button @click="saveAndGenerate"
          class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
          Yuklash
        </button>
      </div>

      <!-- Camera Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeCameraModal">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <video ref="video" width="320" height="240" autoplay class="rounded-lg border border-gray-300"></video>
          <canvas ref="canvas" width="320" height="240" class="hidden"></canvas>
          <div class="mt-4 flex justify-between">
            <button @click="captureImage"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Suratga Olish
            </button>
            <button @click="closeCameraModal"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Yopish
            </button>
          </div>
        </div>
      </div>

      <!-- Warning Modal -->
      <div v-if="isWarningModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeWarningModal">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <p class="text-red-600 text-[20px]">Iltimos, avval rasmga tushuring!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, nextTick } from "vue";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRoute } from "vue-router";
import { saveAs } from "file-saver";

const route = useRoute();
var UniqueID = null;
var ClientData = '';
const id = route.params.id;
const fields = ref([]);
const uniqueFields = ref([]);
const fieldValues = ref([]);
const docxTemplate = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const API_URL = URL + "/contract-file";
const video = ref(null);
const canvas = ref(null);
const isModalOpen = ref(false);
const isWarningModalOpen = ref(false);
const sum1 = ref("");
const sum2 = ref("");

const formData = reactive({
  name: "",
  surname: "",
  dadname: "",
  userCode: "",
  uniqueCode: "",
  contractId: 0,
  phone: "",
  price: 0,
  file: null,
  image: null,
});

const GetClient = async () => {
  try {
    const response = await axios.get(URL + "/client");
    ClientData = response.data;
    UniqueID = ClientData[ClientData.length - 1].id + 1;
    console.log(response.data);

  } catch (error) {
    errorMessage.value = "❌ Client ma'lumotlarini olishda xatolik!";
  }
};

const fetchDocx = async () => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const fileUrl = URL + response.data.filePath;
    const fileResponse = await axios.get(fileUrl, { responseType: "blob" });

    if (!fileResponse.headers["content-type"].includes("application/vnd.openxmlformats")) {
      throw new Error("❌ Server noto‘g‘ri formatda ma’lumot qaytardi!");
    }

    const blob = fileResponse.data;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const zip = new PizZip(e.target.result, { base64: false });
        docxTemplate.value = new Docxtemplater(zip, {
          delimiters: { start: "{{", end: "}}" },
          paragraphLoop: true,
          linebreaks: true,
        });
        const text = docxTemplate.value.getFullText();
        const matches = text.match(/{{(.*?)}}/g);
        if (matches) {
          fields.value = matches.map((match) => ({
            key: match.replace(/{{|}}/g, ""),
          }));

          const uniqueKeys = [...new Set(fields.value.map((field) => field.key))].filter(
            (key) => key !== "sum1" && key !== "sum2" && key !== "qarz" && key !== "umumiy" && key !== "ID" && key !== "Today Date"
          );
          uniqueFields.value = uniqueKeys.map((key) => ({ key }));
          fieldValues.value = new Array(uniqueFields.value.length).fill("");
        }
      } catch (zipError) {
        errorMessage.value = "❌ DOCX faylni ochishda xatolik!";
      }
    };
    reader.readAsArrayBuffer(blob);
  } catch (error) {
    errorMessage.value = error.message || "❌ Faylni yuklashda xatolik!";
  } finally {
    isLoading.value = false;
  }
};

const startWebcam = async () => {
  if (!video.value) {
    errorMessage.value = "❌ Video elementi topilmadi!";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (error) {
    errorMessage.value = "❌ Kameraga kirishda xatolik! Iltimos, ruxsat bering.";
  }
};

const stopWebcam = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.value.srcObject = null;
  }
};

const openCameraModal = () => {
  isModalOpen.value = true;
  nextTick(() => startWebcam());
};

const closeCameraModal = () => {
  stopWebcam();
  isModalOpen.value = false;
};

const captureImage = () => {
  if (!video.value || !canvas.value) {
    errorMessage.value = "❌ Video yoki canvas topilmadi!";
    return;
  }

  const context = canvas.value.getContext("2d");
  context.drawImage(video.value, 0, 0, 320, 240);

  canvas.value.toBlob((blob) => {
    formData.image = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
    closeCameraModal();
  }, "image/jpeg");
};

const dataaa = {
  summa1: null,
  summa2: null,
  price: null,
};

const resetForm = () => {
  Object.assign(formData, {
    name: "",
    surname: "",
    dadname: "",
    userCode: "",
    uniqueCode: "",
    phone: "",
    contractId: 0,
    price: 0,
    file: null,
    image: null,
  });

  fieldValues.value = new Array(uniqueFields.value.length).fill("");

  dataaa.summa1 = null;
  dataaa.summa2 = null;
  dataaa.price = null;
};

// Utility function to format numbers with dots as thousand separators
const formatNumberWithDots = (number) => {
  if (!number || isNaN(number)) return "N/A";
  return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const saveAndGenerate = async () => {
  if (!formData.image) {
    isWarningModalOpen.value = true;
    return;
  }

  uniqueFields.value.forEach((field, index) => {
    if (field.key === "Ism") formData.name = fieldValues.value[index];
    if (field.key === "Familya") formData.surname = fieldValues.value[index];
    if (field.key === "Otasining ismi") formData.dadname = fieldValues.value[index];
    if (field.key === "Fuqaroning JSHSHIR raqami") formData.uniqueCode = fieldValues.value[index];
    if (field.key === "Fuqaroning ID karta raqami") formData.userCode = fieldValues.value[index];
    if (field.key === "Fuqaroning telefon raqami ") formData.phone = fieldValues.value[index];
    if (field.key === "boshlag’ich summa") dataaa.price = +fieldValues.value[index];
    if (field.key === "Konsalting narxi") dataaa.summa1 = fieldValues.value[index];
    if (field.key === "Tushuntirish narxi") dataaa.summa2 = fieldValues.value[index];
  });

  if (!docxTemplate.value) {
    errorMessage.value = "❌ DOCX shablon topilmadi!";
    return;
  }

  await fetchRecords();

  const data = {};
  uniqueFields.value.forEach((field, index) => {
    data[field.key] = fieldValues.value[index] || "";
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}.${month}.${day}`;
  data["Today Date"] = formattedDate;

  data["ID"] = UniqueID;
  formData.contractId = UniqueID;

  // Calculate numeric values
  const sum1Num = parseInt(sum1.value) || 0;
  const sum2Num = parseInt(sum2.value) || 0;
  const konsaltingNarxi = parseInt(dataaa.summa1) || 0;
  const tushuntirishNarxi = parseInt(dataaa.summa2) || 0;
  const boshlagichSumma = parseInt(dataaa.price) || 0;

  const umumiy = sum1Num + sum2Num + konsaltingNarxi + tushuntirishNarxi;
  const qarz = umumiy - boshlagichSumma;

  if (qarz <= 0) {
    formData.price = 0;
  } else {
    formData.price =
      parseInt(sum1.value) +
      parseInt(sum2.value) +
      parseInt(dataaa.summa1) +
      parseInt(dataaa.summa2) -
      parseInt(dataaa.price);
  }


  // Format numbers with dots
  data["sum1"] = formatNumberWithDots(sum1Num);
  data["sum2"] = formatNumberWithDots(sum2Num);
  data["umumiy"] = formatNumberWithDots(umumiy);
  data["qarz"] = formatNumberWithDots(qarz);
  data["Konsalting narxi"] = formatNumberWithDots(konsaltingNarxi);
  data["Tushuntirish narxi"] = formatNumberWithDots(tushuntirishNarxi);
  data["boshlag’ich summa"] = formatNumberWithDots(boshlagichSumma);

  // Update formData.price for submission

  try {
    docxTemplate.value.render(data);
    const output = docxTemplate.value.getZip().generate({ type: "blob" });
    formData.file = new File([output], "updated-document.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    await submitForm();
  } catch (error) {
    errorMessage.value = "❌ DOCX yaratishda xatolik!";
  }
};

const API_URL1 = `${URL}/client`;
const submitForm = async () => {
  if (!formData.file) {
    errorMessage.value = "❌ Fayl generatsiya qilinmagan! Avval saqlash va generatsiya qiling!";
    return;
  }
  if (!formData.image) {
    errorMessage.value = "❌ Surat olish shart! Avval suratga oling!";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== "") formDataToSend.append(key, value);
  });

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    await axios.post(API_URL1, formDataToSend, config);
    resetForm();
    await GetClient();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "❌ Backendga yuborishda xatolik!";
  } finally {
    isLoading.value = false;
  }
};

const fetchRecords = async () => {
  try {
    const res = await axios.get(`${URL}/monthly-cost`);
    sum1.value = res.data[0].sum1;
    sum2.value = res.data[0].sum2;
  } catch (err) {
    errorMessage.value = "❌ Sum1 va Sum2 ma'lumotlarini olishda xatolik!";
    sum1.value = "N/A";
    sum2.value = "N/A";
  }
};

const closeWarningModal = () => {
  isWarningModalOpen.value = false;
};

watch(
  () => fields.value.length,
  async (newLength) => {
    if (newLength > 0) {
      await nextTick();
    }
  }
);

onMounted(() => {
  fetchDocx();
  fetchRecords();
  GetClient();
});

onUnmounted(() => {
  stopWebcam();
});
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

button {
  margin: 5px;
  padding: 8px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

* {
  color: black;
}

video,
img {
  margin: 10px 0;
  border: 1px solid #ccc;
}

input {
  padding: 5px;
  margin: 5px 0;
}
</style>