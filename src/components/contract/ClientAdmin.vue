<template>
  <div class="container mx-auto p-4 bg-gray-300 rounded shadow">
    <div v-if="fields.length">
      <div v-for="(field, index) in uniqueFields" :key="index" class="mb-4">
        <label class="block font-medium mb-1 text-black">
          {{ dat === "datakril" ? translateText(field.key) : field.key }}
        </label>
        <input v-model="fieldValues[index]" 
          :type="getInputType(field.key)"
          :maxlength="getMaxLength(field.key)"
          :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" 
          required
          class="w-full p-2 border rounded focus:ring text-black focus:ring-blue-200"
          @input="field.key === 'Fuqaroning telefon raqami ' ? formatPhoneNumber(field.key, index) : restrictToNumbers(field.key, index); formatNumberFields(field.key, index)"
          @focus="addPhonePrefix(field.key, index)" />
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="openCameraModal" class="btn btn-primary">
          {{ dat === "datakril" ? translateText("Suratga Olish") : "Suratga Olish" }}
        </button>
        <button @click="saveAndGenerate" class="btn btn-secondary">
          {{ dat === "datakril" ? translateText("Yuklash") : "Yuklash" }}
        </button>
      </div>

      <!-- Camera Modal -->
      <div v-if="isModalOpen" class="modal" @click.self="closeCameraModal">
        <div class="modal-content dark">
          <video ref="video" width="320" height="240" autoplay class="rounded border"></video>
          <canvas ref="canvas" width="320" height="240" class="hidden"></canvas>
          <div class="mt-4 flex justify-between">
            <button @click="captureImage" class="btn btn-success">
              {{ dat === "datakril" ? translateText("Suratga Olish") : "Suratga Olish" }}
            </button>
            <button @click="closeCameraModal" class="btn btn-danger">
              {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Warning Modal -->
      <div v-if="isWarningModalOpen" class="modal" @click.self="closeWarningModal">
        <div class="modal-content">
          <p class="text-red-600 text-center">
            {{ dat === "datakril" ? translateText("Iltimos, avval rasmga tushuring!") : "Iltimos, avval rasmga tushuring!" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, nextTick, inject } from "vue";
import { v4 as uuidv4 } from "uuid";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRoute } from "vue-router";
import translateText from "@/auth/Translate.js";

const dat = inject("dat");
const route = useRoute();
let UniqueID = null;
let ClientData = '';
const id = route.params.id;
const fields = ref([]);
const uniqueFields = ref([]);
const fieldValues = ref([]);
const docxTemplate = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");
const API_URL = URL + "/contract-file";
const video = ref(null);
const canvas = ref(null);
const isModalOpen = ref(false);
const isWarningModalOpen = ref(false);
const sum1 = ref("");
const sum2 = ref("");
const checkFile = ref(null); // Chek fayli uchun

const formData = reactive({
  name: "",
  surname: "",
  dadname: "",
  userCode: "",
  uniqueCode: "",
  contractId: "",
  phone: "",
  totalSum: 0,
  paidSum: 0,
  remainingSum: 0,
  file: null,
  image: null,
});

const GetClient = async () => {
  try {
    const response = await axios.get(URL + "/client");
    ClientData = response.data.sort((a, b) => a.id - b.id);
    UniqueID = ClientData[ClientData.length - 1].id + 1;
  } catch (error) {
    errorMessage.value = "❌ Client ma'lumotlarini olishda xatolik!";
    console.error("GetClient xatosi:", error.message);
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
        const zip = new PizZip(e.target.result);
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
        console.error("DOCX zip xatosi:", zipError);
      }
    };
    reader.readAsArrayBuffer(blob);
  } catch (error) {
    errorMessage.value = error.message || "❌ Faylni yuklashda xatolik!";
    console.error("fetchDocx xatosi:", error);
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
    console.error("startWebcam xatosi:", error);
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

const generateUniqueCode = () => {
  formData.contractId = uuidv4();
};

const resetForm = () => {
  Object.assign(formData, {
    name: "",
    surname: "",
    dadname: "",
    userCode: "",
    uniqueCode: "",
    phone: "",
    totalSum: 0,
    paidSum: 0,
    remainingSum: 0,
    contractId: "",
    file: null,
    image: null,
  });

  fieldValues.value = new Array(uniqueFields.value.length).fill("");
  dataaa.summa1 = null;
  dataaa.summa2 = null;
  generateUniqueCode();
};

const formatNumberWithDots = (number) => {
  if (!number || isNaN(number)) return "0";
  return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const saveAndGenerate = async () => {
  try {
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
      if (field.key === "boshlag’ich summa") dataaa.price = Number(fieldValues.value[index]) || 0;
      if (field.key === "Konsalting narxi") dataaa.summa1 = Number(fieldValues.value[index]) || 0;
      if (field.key === "Tushuntirish narxi") dataaa.summa2 = Number(fieldValues.value[index]) || 0;
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
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    data["Today Date"] = formattedDate;

    data["ID"] = UniqueID;
    formData.contractId = UniqueID;

    const sum1Num = Number(sum1.value) || 0;
    const sum2Num = Number(sum2.value) || 0;
    const konsaltingNarxi = Number(dataaa.summa1) || 0;
    const tushuntirishNarxi = Number(dataaa.summa2) || 0;
    const boshlagichSumma = Number(dataaa.price) || 0;

    const umumiy = sum1Num + sum2Num + konsaltingNarxi + tushuntirishNarxi;
    const qarz = umumiy - boshlagichSumma;
    formData.totalSum = umumiy;
    formData.paidSum = boshlagichSumma;
    formData.remainingSum = qarz > 0 ? qarz : 0;

    data["sum1"] = formatNumberWithDots(sum1Num);
    data["sum2"] = formatNumberWithDots(sum2Num);
    data["umumiy"] = formatNumberWithDots(umumiy);
    data["qarz"] = formatNumberWithDots(qarz);
    data["Konsalting narxi"] = formatNumberWithDots(konsaltingNarxi);
    data["Tushuntirish narxi"] = formatNumberWithDots(tushuntirishNarxi);
    data["boshlag’ich summa"] = formatNumberWithDots(boshlagichSumma);

    docxTemplate.value.render(data);
    const output = docxTemplate.value.getZip().generate({ type: "blob" });
    formData.file = new File([output], "updated-document.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    await generateCheckFile();
    await submitForm();
  } catch (error) {
    errorMessage.value = "❌ Yuklashda xatolik yuz berdi: " + error.message;
    console.error("saveAndGenerate xatosi:", error);
  }
};

const API_URL1 = `${URL}/client`;

const fetchRecords = async () => {
  try {
    const res = await axios.get(`${URL}/monthly-cost`);
    sum1.value = res.data[0].sum1;
    sum2.value = res.data[0].sum2;
  } catch (err) {
    errorMessage.value = "❌ Sum1 va Sum2 ma'lumotlarini olishda xatolik!";
    sum1.value = "0";
    sum2.value = "0";
    console.error("fetchRecords xatosi:", err);
  }
};

const closeWarningModal = () => {
  isWarningModalOpen.value = false;
};

const generateCheckFile = async () => {
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();
  img1.src = "/asd.jpg";
  img2.src = "https://arizasud.uz/https___arizasud.uz_.png";
  img3.src = "/telegram.png";

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const receiptHTML = `
    <html>
      <head>
        <title>To'lov Cheki</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: black;
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            width: 100%;
            max-width: 400px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          .receipt-header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .receipt-content p {
            margin: 5px 0;
          }
          .receipt-footer {
            text-align: right;
            margin-top: 20px;
            font-size: 12px;
            color: gray;
          }
          .receipt-images {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }
          .receipt-images img {
            max-width: 90%;
            height: auto;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <h2 class="receipt-header">To'lov Cheki</h2>
          <div class="receipt-content">
            <p><strong>Mijoz:</strong> ${formData.name} ${formData.surname} ${formData.dadname}</p>
            <p><strong>Telefon:</strong> ${formData.phone || "Mavjud emas"}</p>
            <p><strong>Shartnoma idsi:</strong> ${formData.contractId || "Mavjud emas"}</p>
            <p><strong>To'langan Summa:</strong> ${formatNumberWithDots(dataaa.price)} so'm</p>
            <p><strong>Qoldiq Qarz:</strong> ${formatNumberWithDots(formData.remainingSum)} so'm</p>
            <p><strong>Sana:</strong>${formattedDate}</p>
          </div>
          <div class="receipt-images">
            <img src="https://arizasud.uz/asd.jpg" alt="Image 1">
            <img src="https://arizasud.uz/https___arizasud.uz_.png" alt="Image 2">
          </div>
          <div class="receipt-footer">
            "YURIST KONSUL KONSALTING"
          </div>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([receiptHTML], { type: "text/html" });
  checkFile.value = new File([blob], `receipt-${formData.contractId}.html`, { type: "text/html" });
};

const printReceipt = () => {
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();
  img1.src = "/asd.jpg";
  img2.src = "https://arizasud.uz/https___arizasud.uz_.png";
  img3.src = "/telegram.png";

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const receiptHTML = `
    <div style="font-size: 12px; width:100%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
        <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:18px;">To'lov cheki</h1>
        <table style="width: 100%; border-collapse: collapse; color: black; table-layout: fixed;">
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Mijoz:</td>
                <td style="color: black;">${formData.name} ${formData.surname} ${formData.dadname}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Telefon Raqami:</td>
                <td style="color: black; line-height: 1.2;">${formData.phone || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Shartnoma idsi:</td>
                <td style="color: black; line-height: 1.2;">№${formData.contractId || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">To'langan:</td>
                <td style="color: black; line-height: 1.2;">${formatNumberWithDots(dataaa.price)} so'm</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Qoldiq qarz:</td>
                <td style="color: black; line-height: 1.2;">${formData.remainingSum <= 0 ? "To‘landi" : formatNumberWithDots(formData.remainingSum) + " so'm"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Sana:</td>
                <td style="color: black; line-height: 1.2;">${formattedDate}</td>
            </tr>
        </table>
        <p style="text-align: center; color: black; justify-content: center; gap:3px; align-items: center; display:flex; margin-top:10px;">
            <img src="${img3.src}" alt="" style="max-width: 7%; height: auto;">
            <span style="font-size: 10px; color: black;">Telegram: +998 99 106 70 35</span>
        </p>
        <p style="text-align: center; font-size:10px; color: black;">"YURIST KONSUL KONSALTING" х/к</p>
        <div style="display: flex; flex-direction:column; justify-content: center; align-items: center; margin-top: 20px;">
            <img src="${img1.src}" alt="" style="max-width: 90%; height: auto;">
            <img src="${img2.src}" alt="" style="max-width: 90%; height: auto;">
        </div>
    </div>
  `;

  const originalContent = document.body.innerHTML;
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      @page { margin: 0; }
      body { margin: 0; }
    }
  `;
  document.head.appendChild(style);

  document.body.innerHTML = receiptHTML;

  img1.onload = img2.onload = img3.onload = () => {
    window.print();
    document.body.innerHTML = originalContent;
    document.head.removeChild(style);
    window.location.reload();
  };

  img1.onerror = img2.onerror = img3.onerror = () => {
    console.error("Image failed to load");
    window.print();
    document.body.innerHTML = originalContent;
    document.head.removeChild(style);
    window.location.reload();
  };
};

const submitForm = async () => {
  if (!formData.file) {
    errorMessage.value = "❌ Fayl generatsiya qilinmagan! Avval saqlash va generatsiya qiling!";
    return;
  }
  if (!formData.image) {
    errorMessage.value = "❌ Surat olish shart! Avval suratga oling!";
    return;
  }
  if (!checkFile.value) {
    errorMessage.value = "❌ Chek fayli generatsiya qilinmagan!";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name || "");
  formDataToSend.append("surname", formData.surname || "");
  formDataToSend.append("dadname", formData.dadname || "");
  formDataToSend.append("userCode", formData.userCode || "");
  formDataToSend.append("uniqueCode", formData.uniqueCode || "");
  formDataToSend.append("contractId", String(formData.contractId) || "");
  formDataToSend.append("phone", formData.phone || "");
  formDataToSend.append("totalSum", String(formData.totalSum) || "0");
  formDataToSend.append("paidSum", String(formData.paidSum) || "0");
  formDataToSend.append("remainingSum", String(formData.remainingSum) || "0");
  formDataToSend.append("file", formData.file);
  formDataToSend.append("image", formData.image);
  formDataToSend.append("check", checkFile.value);

  console.log("Yuborilayotgan ma'lumotlar:");
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`Key: ${key}, Value: ${value}`);
  }

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(API_URL1, formDataToSend, config);
    console.log("✅ Ma'lumotlar muvaffaqiyatli saqlandi:", response.data);
    errorMessage.value = "✅ Muvaffaqiyatli saqlandi!";
    isLoading.value = false;
    printReceipt();
    resetForm();
    await GetClient();
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("❌ Xatolik detallari:", errorDetails);
    errorMessage.value = `❌ Xatolik: ${errorDetails.message || error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const formatNumberFields = (key, index) => {
  const lowerKey = key.toLowerCase();
  if (['konsalting narxi', 'tushuntirish narxi', 'boshlag’ich summa'].some(k => lowerKey.includes(k))) {
    const rawValue = String(fieldValues.value[index] || "").replace(/[^\d]/g, ""); // Remove non-numeric characters
    fieldValues.value[index] = rawValue ? formatNumberWithDots(rawValue) : ""; // Format with dots
  }
};

const getInputType = (key) => {
  const lowerKey = key.toLowerCase();
  if (['konsalting narxi', 'tushuntirish narxi', 'boshlag’ich summa'].some(k => lowerKey.includes(k))) {
    return 'text'; // Use text type for formatted numbers
  }
  if (lowerKey.includes('tug’ilgan sanasi')) {
    return 'date';
  }
  return 'text'; // Default to text for all other fields
};

const getMaxLength = (key) => {
  if (key.trim() === "Fuqaroning JSHSHIR raqami") return 14;
  if (key.trim() === "Fuqaroning telefon raqami ") return 19;
  return undefined;
};

const restrictToNumbers = (key, index) => {
  if (key === "Fuqaroning JSHSHIR raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^0-9]/g, "");
    if (fieldValues.value[index].length > 14) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 14);
    }
  }
};

const preventCyrillic = (key, index) => {
  if (key === "Fuqaroning ID karta raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[а-яА-ЯёЁ]/g, "");
  }
};

const addPhonePrefix = (key, index) => {
  if (key === "Fuqaroning telefon raqami " && !fieldValues.value[index].startsWith("+998")) {
    fieldValues.value[index] = "+998 ";
  }
};

const formatPhoneNumber = (key, index) => {
  if (key === "Fuqaroning telefon raqami ") {
    let rawNumber = fieldValues.value[index].replace(/[^\d]/g, "");
    const formatted = `+998 ${rawNumber.slice(3, 5)} ${rawNumber.slice(5, 8)} ${rawNumber.slice(8, 10)} ${rawNumber.slice(10, 12)}`.trim();
    fieldValues.value[index] = formatted;
  }
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
.container {
  max-width: 600px;
}

.btn {
  padding: 8px 16px;
  border: none;
  margin: 2px;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn-primary {
  background-color: #007bff;
}

.btn-secondary {
  background-color: #24c815;
}

.btn-success {
  background-color: #28a745;
}

.btn-danger {
  background-color: #dc3545;
}

.btn:hover {
  opacity: 0.9;
}

.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.hidden {
  display: none;
}
</style>