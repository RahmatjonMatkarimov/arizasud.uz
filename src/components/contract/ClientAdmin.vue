<template>
  <div class="container mx-auto p-4 bg-gray-300 rounded shadow">
    <div v-if="fields.length">
      <div v-for="(field, index) in uniqueFields" :key="index" class="mb-4">
        <label class="block font-medium mb-1 text-black">{{ field.key }}</label>
        <input v-model="fieldValues[index]" :placeholder="field.key" type="text" required
          class="w-full p-2 border rounded focus:ring text-black focus:ring-blue-200" />
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="openCameraModal" class="btn btn-primary">Suratga Olish</button>
        <button @click="saveAndGenerate" class="btn btn-secondary">Yuklash</button>
      </div>

      <!-- Camera Modal -->
      <div v-if="isModalOpen" class="modal" @click.self="closeCameraModal">
        <div class="modal-content dark">
          <video ref="video" width="320" height="240" autoplay class="rounded border"></video>
          <canvas ref="canvas" width="320" height="240" class="hidden"></canvas>
          <div class="mt-4 flex justify-between">
            <button @click="captureImage" class="btn btn-success">Suratga Olish</button>
            <button @click="closeCameraModal" class="btn btn-danger">Yopish</button>
          </div>
        </div>
      </div>

      <!-- Warning Modal -->
      <div v-if="isWarningModalOpen" class="modal" @click.self="closeWarningModal">
        <div class="modal-content">
          <p class="text-red-600 text-center">Iltimos, avval rasmga tushuring!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, nextTick } from "vue";
import { v4 as uuidv4 } from "uuid";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRoute } from "vue-router";
import { saveAs } from "file-saver";
import { f } from "html2pdf.js";
import { Origami } from "lucide-vue-next";

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
  contractId: "",
  phone: "",
  price: 0,
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
    contractId: "",
    price: 0,
    file: null,
    image: null,
  });

  fieldValues.value = new Array(uniqueFields.value.length).fill("");

  dataaa.summa1 = null;
  dataaa.summa2 = null;
  dataaa.price = null;
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

    const sum1Num = parseInt(sum1.value) || 0;
    const sum2Num = parseInt(sum2.value) || 0;
    const konsaltingNarxi = parseInt(dataaa.summa1) || 0;
    const tushuntirishNarxi = parseInt(dataaa.summa2) || 0;
    const boshlagichSumma = parseInt(dataaa.price) || 0;

    const umumiy = sum1Num + sum2Num + konsaltingNarxi + tushuntirishNarxi;
    const qarz = umumiy - boshlagichSumma;

    if (qarz > 0) {
      formData.price = qarz;
    } else {
      formData.price = 0;
    }

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

    await submitForm();
  } catch (error) {
    errorMessage.value = "❌ Yuklashda xatolik yuz berdi!";
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
  }
};

const closeWarningModal = () => {
  isWarningModalOpen.value = false;
};

const printReceipt = () => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const img = new Image();
  img.src = "https://arizasud.uz/asd.jpg";
  img.src1 = "https://arizasud.uz/https___arizasud.uz_.png";
  img.style.display = "none";
  document.body.appendChild(img);

  const receiptHTML = `
  <div style="font-size: 13px; width:100%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
    <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:20px;">To'lov cheki</h1>
            <table style="width: 100%; border-collapse: collapse; color: black;">
              <tr><td style="color: black;">Mijoz:</td><td style="color: black;">${formData.name} ${formData.surname} ${formData.dadname}</td></tr>
              <tr><td style="color: black;">Telefon Raqami:</td><td style="color: black;">+${formData.phone || "Mavjud emas"}</td></tr>
              <tr><td style="color: black;">Shartnoma idsi:</td><td style="color: black;">${formData.contractId || "Mavjud emas"}</td></tr>
              <tr><td style="color: black;">To'langan:</td><td style="color: black;">${formatNumberWithDots(dataaa.price)} so'm</td></tr>
              <tr><td style="color: black;">To'lanishi Kerak:</td><td style="color: black;">${formData.price <= 0 ? "To‘landi" : formatNumberWithDots(formData.price) + " so'm"}</td></tr>
              <tr><td style="color: black;">Sana:</td><td style="color: black;">${formattedDate}</td></tr>
              </table>
              <p style="text-align: center; color: black;">Tel: +998 99 999 99 99</p>
              <p style="text-align: center; font-size:10px; color: black;">"YURIST KONSUL KONSALTING" х/к</p>
              <div style="display: flex; flex-direction:column; justify-content: center; align-items: center; margin-top: 20px;">
                <img src="${img.src}" alt="" style="max-width: 90%; height: auto;">
                <img src="${img.src1}" alt="" style="max-width: 90%; height: auto;">
                </div>
                </div>
  `;
  console.log("formData after saveAndGenerate:", formData);
  console.log("dataaa after saveAndGenerate:", dataaa);
  const originalContent = document.body.innerHTML;

  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      @page {
        margin: 0;
      }
      body {
        margin: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.innerHTML = receiptHTML;

  img.onload = () => {
    window.print();
    document.body.innerHTML = originalContent;
    document.head.removeChild(style);
    window.location.reload();
  };

  img.onerror = () => {
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

  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

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
            <p><strong>Qoldiq Qarz:</strong> ${formatNumberWithDots(formData.price)} so'm</p>
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
  const receiptBlob = new Blob([receiptHTML], { type: "text/html" });
  const receiptFile = new File([receiptBlob], "receipt.html", { type: "text/html" });

  isLoading.value = true;
  errorMessage.value = "";

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== "") formDataToSend.append(key, value);
  });

  formDataToSend.append("check", receiptFile);

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(API_URL1, formDataToSend, config);
    printReceipt();
    resetForm();
    await GetClient();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "❌ Ma'lumotlarni yuborishda xatolik!";
  } finally {
    isLoading.value = false;
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
  border: none; margin: 2px;
  border-radius: 4px;
  cursor: pointer;
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
</style>