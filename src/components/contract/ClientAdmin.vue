<template>
  <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="spinner"></div>
    <p class="loading-message">{{ loadingMessage }}</p>
  </div>
  <div class="container mx-auto p-4 bg-gray-300 rounded shadow">
    <!-- Loading Spinner -->
    <!-- Main Content -->
    <div v-if="fields.length && !isLoading">
      <div v-for="(field, index) in uniqueFields" :key="index" class="mb-4">
        <label v-if="field.key !== 'adminName' && field.key !== 'adminSurname' && field.key !== 'documentId'"
          class="block font-medium mb-1 text-black">
          {{ dat === "datakril" ? translateText(field.key) : field.key }}
        </label>
        <template v-if="field.key === 'Buyurtmachi'">
          <select v-model="fieldValues[index]" required
            class="w-full p-2 border rounded focus:ring text-black focus:ring-blue-200">
            <option value="" disabled>{{ dat === 'datakril' ? translateText('Tanlang') : 'Tanlang' }}</option>
            <option value="Yuridik">{{ dat === 'datakril' ? translateText('Yuridik') : 'Yuridik' }}</option>
            <option value="Jismoniy">{{ dat === 'datakril' ? translateText('Jismoniy') : 'Jismoniy' }}</option>
          </select>
        </template>
        <template v-else-if="field.key !== 'adminName' && field.key !== 'adminSurname' && field.key !== 'documentId'">
          <input v-model="fieldValues[index]" :type="getInputType(field.key)" :maxlength="getMaxLength(field.key)"
            :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
            class="w-full p-2 border rounded focus:ring text-black focus:ring-blue-200"
            @input="field.key === 'Fuqaroning telefon raqami ' ? formatPhoneNumber(field.key, index) : restrictToNumbers(field.key, index); formatNumberFields(field.key, index); preventCyrillic(field.key, index)"
            @focus="addPhonePrefix(field.key, index)" />
        </template>
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="openCameraModal" class="btn btn-primary">
          {{ dat === "datakril" ? translateText("Suratga Olish") : "Suratga Olish" }}
        </button>
        <button @click="finger" class="btn btn-primary">
          {{ dat === "datakril" ? translateText("Barmoq izini scanerlash") : "Barmoq izini scanerlash" }}
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
import html2pdf from 'html2pdf.js';
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
const errorMessage = ref("");
const API_URL = URL + "/contract-file";
const video = ref(null);
const qarz = ref(0);
const canvas = ref(null);
const isModalOpen = ref(false);
const isWarningModalOpen = ref(false);
const sum1 = ref("");
const sum2 = ref("");
const checkFile = ref(null); // Chek fayli uchun
const isLoading = ref(false);
const loadingMessage = ref("Yuklanmoqda..."); 
const Loading = inject('isLoading');
const adminName = ref('')
const adminSurname = ref('')
// Default loading message

const getAdmin = async () => {
  Loading.value = true;
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${localStorage.getItem('id')}`);
    adminName.value = response.data.name;
    adminSurname.value = response.data.surname;
  } catch (error) {
    console.error("getAdmin xatosi:", error);
  } finally {
    Loading.value = false;
  }
};
const name = ref("");
const surname = ref("");
const dadname = ref("");
const phone = ref('');
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
  fingerImage: null,
});

const finger = async () => {
  Loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000");
    console.log("FINGER:", response.data);

    // Convert base64 to Blob
    const base64Data = response.data.image.replace(/^data:image\/png;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Create File object from Blob
    formData.fingerImage = new File([blob], "fingerprint.png", { type: "image/png" });

  } catch (error) {
    console.error("fetchClient xatosi:", error);
    errorMessage.value = "❌ Fingerprint capture failed!";
  } finally {
    Loading.value = false;
  }
};

const fetchDocx = async () => {
  Loading.value = true;
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
  } finally {
    Loading.value = false;
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
  // generateUniqueCode();
};

const formatNumberWithDots = (number) => {
  if (!number || isNaN(number)) return "0";
  return Number(number).toLocaleString("uz-UZ", { minimumFractionDigits: 0 }).replace(/,/g, ".");
};

const generateContractId = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${day}${hours}${minutes}${seconds}${milliseconds}`.slice(-8); // Generate an 8-character unique ID
};

const saveAndGenerate = async () => {
  try {
    if (!formData.image) {
      isWarningModalOpen.value = true;
      return;
    }

    uniqueFields.value.forEach((field, index) => {
      if (field.key === "Ism") formData.name = fieldValues.value[index];
      if (field.key === "Ism") name.value = fieldValues.value[index];
      if (field.key === "Familya") formData.surname = fieldValues.value[index];
      if (field.key === "Familya") surname.value = fieldValues.value[index];
      if (field.key === "Otasining ismi") formData.dadname = fieldValues.value[index];
      if (field.key === "Otasining ismi") dadname.value = fieldValues.value[index];
      if (field.key === "Fuqaroning JSHSHIR raqami") formData.uniqueCode = fieldValues.value[index];
      if (field.key === "Fuqaroning ID karta raqami") formData.userCode = fieldValues.value[index];
      if (field.key === "Fuqaroning telefon raqami ") formData.phone = fieldValues.value[index];
      if (field.key === "Fuqaroning telefon raqami ") phone.value = fieldValues.value[index];
      if (field.key === "Buyurtmachini boshlang’ich to’lovi (avans)") dataaa.price = Number(fieldValues.value[index]);
      if (field.key === "Konsalting xizmat ko’rsatish narxi") dataaa.summa1 = Number(fieldValues.value[index]) || 0;
      if (field.key === "Hujjatga tushuntirish berish narxi") dataaa.summa2 = Number(fieldValues.value[index]) || 0;
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

    formData.contractId = generateContractId();
    UniqueID = formData.contractId;
    
    // erate and assign unique contractId
    data["ID"] = formData.contractId;
    data["documentId"] = formData.contractId;

    const sum1Num = Number(sum1.value) || 0;
    const sum2Num = Number(sum2.value) || 0;
    const konsaltingNarxi = Number(dataaa.summa1) || 0;
    const tushuntirishNarxi = Number(dataaa.summa2) || 0;
    const boshlagichSumma = Number(dataaa.price) || 0;

    const umumiy = sum1Num + sum2Num + konsaltingNarxi + tushuntirishNarxi;
    const qarza = Math.floor(umumiy - boshlagichSumma); 
    formData.totalSum = umumiy;
    formData.paidSum = boshlagichSumma;
    formData.remainingSum = qarza <= 0 ? 0 : qarza;
    qarz.value = qarza;

    data["sum1"] = formatNumberWithDots(sum1Num);
    data["sum2"] = formatNumberWithDots(sum2Num);
    data["umumiy"] = formatNumberWithDots(umumiy);
    data["qarz"] = formatNumberWithDots(qarza);
    data["Konsalting xizmat ko’rsatish narxi"] = formatNumberWithDots(konsaltingNarxi);
    data["Hujjatga tushuntirish berish narxi"] = formatNumberWithDots(tushuntirishNarxi);
    data["Buyurtmachini boshlang’ich to’lovi (avans)"] = formatNumberWithDots(boshlagichSumma);
    data["adminName"] = adminName.value;
    data["adminSurname"] = adminSurname.value;

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
  Loading.value = true;
  try {
    const res = await axios.get(`${URL}/monthly-cost`);
    sum1.value = res.data[0].sum1;
    sum2.value = res.data[0].sum2;
  } catch (err) {
    errorMessage.value = "❌ Sum1 va Sum2 ma'lumotlarini olishda xatolik!";
    sum1.value = "0";
    sum2.value = "0";
    console.error("fetchRecords xatosi:", err);
  } finally {
    Loading.value = false;
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

    // HTML kontentni yaratish
    const receiptHTML = `
    <div style="font-size: 12px; max-width:23%; display:flex; flex-direction: column; justify-content: center; align-content:center; color: black;">
        <h1 style="text-align: center; font-size:15px; font-weight: bold; color: black; margin-top:18px;">To'lov cheki</h1>
        <table style="width: 100%; border-collapse: collapse; color: black; table-layout: fixed;">
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Mijoz:</td>
                <td style="color: black;">${name.value} ${surname.value} ${dadname.value}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Telefon Raqami:</td>
                <td style="color: black; line-height: 1.2;">${phone.value || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Shartnoma idsi:</td>
                <td style="color: black; line-height: 1.2;">№ ${UniqueID || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">To'langan:</td>
                <td style="color: black; line-height: 1.2;">${formatNumberWithDots(dataaa.price)} so'm</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Qoldiq qarz:</td>
                <td style="color: black; line-height: 1.2;">
                  ${qarz.value <= 0 ? "To'langan" : formatNumberWithDots(qarz.value)}
                </td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Sana:</td>
                <td style="color: black; line-height: 1.2;">${formattedDate}</td>
            </tr>
        </table>
        <p style="text-align: center; color: black; justify-content: center; gap:3px; align-items: center; display:flex; margin-top:10px;">
            <img src="/telegram.png" alt="" style="max-width: 7%; height: auto;">
            <span style="font-size: 10px; color: black;">Telegram: +998 99 106 70 35</span>
        </p>
        <p style="text-align: center; font-size:10px; color: black;">"YURIST KONSUL KONSALTING" х/к</p>
        <div style="display: flex; flex-direction:column; justify-content: center; align-items: center; margin-top: 20px;">
            <img src="/asd.jpg" alt="" style="max-width: 90%; height: auto;">
            <img src="/https___arizasud.uz_.png" alt="" style="max-width: 90%; height: auto;">
        </div>
    </div>
    `;

    // DOM elementiga HTMLni qo'shish
    const element = document.createElement('div');
    element.innerHTML = receiptHTML;

    // PDFni generatsiya qilish uchun sozlamalar
    const options = {
        margin: [0,0,0,0], // Margin (mm)
        filename: `receipt-${formData.contractId || 'unknown'}.pdf`, // Fayl nomi
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, // Sifatni oshirish
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // PDFni generatsiya qilish va Blob sifatida saqlash
    const pdfBlob = await html2pdf()
        .from(element)
        .set(options)
        .outputPdf('blob');

    // Blobni File obyektiga aylantirish
    checkFile.value = new File([pdfBlob], `receipt-${formData.contractId || 'unknown'}.pdf`, { type: "application/pdf" });
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
                <td style="color: black;">${name.value} ${surname.value} ${dadname.value}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Telefon Raqami:</td>
                <td style="color: black; line-height: 1.2;">${phone.value || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Shartnoma idsi:</td>
                <td style="color: black; line-height: 1.2;">№ ${UniqueID || "Mavjud emas"}</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">To'langan:</td>
                <td style="color: black; line-height: 1.2;">${formatNumberWithDots(dataaa.price)} so'm</td>
            </tr>
            <tr>
                <td style="color: black; text-align: left; line-height: 1.2; white-space: nowrap;">Qoldiq qarz:</td>
                <td style="color: black; line-height: 1.2;">
                  ${qarz.value <= 0 ? "To'langan" : formatNumberWithDots(qarz.value)}
                </td>
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
  loadingMessage.value = "Ma'lumotlar yuborilmoqda...";
  errorMessage.value = "";

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name || "");
  formDataToSend.append("surname", formData.surname || "");
  formDataToSend.append("dadname", formData.dadname || "");
  formDataToSend.append("userCode", formData.userCode || "");
  formDataToSend.append("uniqueCode", formData.uniqueCode || "");
  formDataToSend.append("contractId", String(formData.contractId) || "");
  formDataToSend.append("phone", formData.phone || "");
  formDataToSend.append("totalSum", formData.totalSum || 0);
  formDataToSend.append("paidSum", formData.paidSum || 0);
  formDataToSend.append("remainingSum", formData.remainingSum || 0);
  formDataToSend.append("file", formData.file);
  formDataToSend.append("image", formData.image);
  formDataToSend.append("check", checkFile.value);

  // Add fingerprint image if it exists
  if (formData.fingerImage) {
    formDataToSend.append("fingerImage", formData.image);
  }

  console.log("Yuborilayotgan ma'lumotlar:");
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`Key: ${key}, Value: ${value}`);
  }

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(API_URL1, formDataToSend, config);
    console.log("✅ Ma'lumotlar muvaffaqiyatli saqlandi:", response.data);
    errorMessage.value = "✅ Muvaffaqiyatli saqlandi!";
    resetForm();
    printReceipt();
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
  if (['konsalting xizmat ko’rsatish narxi', 'hujjatga tushuntirish berish narxi', 'buyurtmachini boshlang’ich to’lovi (avans)'].some(k => lowerKey.includes(k))) {
    const rawValue = String(fieldValues.value[index] || "").replace(/[^\d]/g, ""); // Remove non-numeric characters
    fieldValues.value[index] = rawValue ? formatNumberWithDots(rawValue) : ""; // Format with dots
  }
};

const getInputType = (key) => {
  const lowerKey = key.toLowerCase();
  if (['Konsalting xizmat ko’rsatish narxi', 'Hujjatga tushuntirish berish narxi', 'Buyurtmachini boshlang’ich to’lovi (avans)'].some(k => lowerKey.includes(k))) {
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
  if (key.trim() === "Fuqaroning ID karta raqami") return 9; // Set max length to 9
  return undefined;
};

const restrictToNumbers = (key, index) => {
  if (key === "Fuqaroning JSHSHIR raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^0-9]/g, "");
    if (fieldValues.value[index].length > 14) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 14);
    }
  }
  if (key === "Fuqaroning ID karta raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^a-zA-Z0-9]/g, ""); // Allow only alphanumeric characters
    if (fieldValues.value[index].length > 9) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 9); // Limit to 9 characters
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
  getAdmin()
});

onUnmounted(() => {
  stopWebcam();
});
</script>

<style scoped>
.container {
  max-width: 600px;
  position: relative;
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
  z-index: 1000;
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



.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  margin-top: 10px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>