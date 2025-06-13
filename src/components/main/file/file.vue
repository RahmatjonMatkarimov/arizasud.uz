<template>
  <div class="bg-gray-200 flex flex-col justify-center items-center p-6">
    <div class="flex h-full w-full gap-3 justify-center">
      <form @submit.prevent="submitForm" class="w-1/2">
        <div class="bg-white shadow-md rounded-lg p-6 w-full">
          <div class="mb-6" v-if="placeholders.length > 0">
            <div class="mt-3" v-for="(placeholder, index) in placeholders" :key="index">
              <label class="text-[18px]">{{ getPlaceholderLabel(placeholder) }}:</label>
              <div class="flex items-center gap-2">
                <!-- Add select option for "id karta" -->
                <select
                  v-if="isFieldPlaceholder(placeholder, 'userCode')"
                  v-model="idKartaPrefix"
                  class="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AA">AA</option>
                  <option value="AB">AB</option>
                  <option value="AC">AC</option>
                  <!-- Add more options as needed -->
                </select>
                <input
                  v-model="inputValues[placeholder]"
                  class="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="getPlaceholderLabel(placeholder)"
                  :type="getInputType(placeholder)"
                  :maxlength="isFieldPlaceholder(placeholder, 'userCode') ? 7 : isFieldPlaceholder(placeholder, 'uniqueCode') ? 14 : undefined"
                  @input="validateInput(placeholder); updateContent(placeholder)"
                  @keypress="restrictToNumbers($event, placeholder)"
                />
              </div>
              <!-- Display validation error messages -->
              <p v-if="validationErrors[placeholder]" class="text-red-500 text-sm mt-1">
                {{ validationErrors[placeholder] }}
              </p>
            </div>
            <button
              type="submit"
              class="w-full text-white duration-500 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 mt-4"
              :disabled="isSubmitting || hasValidationErrors"
            >
              {{ isSubmitting ? 'Yuborilmoqda...' : 'Yuborish' }}
            </button>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
          </div>
        </div>
      </form>
      <div
        v-if="showContent"
        class="bg-white w-[900px] h-[100vh] shadow-md rounded-lg p-6 text-gray-700 overflow-auto"
      >
        <div v-html="animatedContent" class="custom-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: black;
}

.custom-content,
.custom-content * {
  color: black !important;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';

const API_URL = 'https://backend.arizasud.uz'; // Update as needed
const url = 'https://api.backend.arizasud.uz'; // Update as needed

const route = useRoute();
const id = ref(route.params.id);
const htmlContent = ref('');
const modifiedContent = ref('');
const animatedContent = ref('');
const placeholders = ref([]);
const inputValues = ref({});
const showContent = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const idKartaPrefix = ref('AA'); // Default prefix for "id karta"
const validationErrors = ref({}); // Store validation errors for each placeholder

const formData = ref({
  phone: '',
  birthday: '',
  uniqueCode: '',
  userCode: '',
  surname: '',
  name: '',
  dadname: '',
});

const recordingState = ref({
  cameraRecorders: [],
  screenRecorder: null,
  cameraChunks: [],
  screenChunks: [],
});

const wordState = ref({
  generated: false,
  blob: null,
});

const getPlaceholderLabel = computed(() => (placeholder) =>
  placeholder.replaceAll('{{', '').replaceAll('}}', '')
);

// New computed function to determine input type
const getInputType = (placeholder) => {
  const cleanPlaceholder = placeholder.replaceAll('{{', '').replaceAll('}}', '').toLowerCase();
  if (cleanPlaceholder.includes('sana') || cleanPlaceholder.includes('tugilgansana')) {
    return 'date';
  } else if (isFieldPlaceholder(placeholder, 'userCode') || isFieldPlaceholder(placeholder, 'uniqueCode')) {
    return 'text';
  }
  return 'text';
};

// Check if there are any validation errors
const hasValidationErrors = computed(() => {
  return Object.values(validationErrors.value).some((error) => error !== '');
});

// Restrict input to numbers only for "jshshir" and "id karta"
const restrictToNumbers = (event, placeholder) => {
  if (isFieldPlaceholder(placeholder, 'userCode') || isFieldPlaceholder(placeholder, 'uniqueCode')) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }
};

// Validate input for "jshshir", "id karta", and dates
const validateInput = (placeholder) => {
  const value = inputValues.value[placeholder] || '';
  const cleanPlaceholder = placeholder.replaceAll('{{', '').replaceAll('}}', '').toLowerCase();

  if (isFieldPlaceholder(placeholder, 'uniqueCode')) {
    if (!/^\d{14}$/.test(value)) {
      validationErrors.value[placeholder] = 'JSHShIR 14 ta raqamdan iborat bo‘lishi kerak!';
    } else {
      validationErrors.value[placeholder] = '';
    }
  } else if (isFieldPlaceholder(placeholder, 'userCode')) {
    if (!/^\d{7}$/.test(value)) {
      validationErrors.value[placeholder] = 'ID Karta 7 ta raqamdan iborat bo‘lishi kerak!';
    } else {
      validationErrors.value[placeholder] = '';
    }
  } else if (cleanPlaceholder.includes('sana') || cleanPlaceholder.includes('tugilgansana')) {
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) {
        validationErrors.value[placeholder] = 'Tug‘ilgan sana kelajakdagi sana bo‘lishi mumkin emas!';
      } else {
        validationErrors.value[placeholder] = '';
      }
    } else {
      validationErrors.value[placeholder] = 'Iltimos, sanani kiriting!';
    }
  } else {
    validationErrors.value[placeholder] = '';
  }
};

const updateContent = (placeholder) => {
  let tempContent = htmlContent.value;
  placeholders.value.forEach((ph) => {
    const innerText = ph.replaceAll('{{', '').replaceAll('}}', '');
    let value = inputValues.value[ph] || innerText;

    // Combine the prefix with the "id karta" input value
    if (isFieldPlaceholder(ph, 'userCode')) {
      value = `${idKartaPrefix.value}${inputValues.value[ph] || ''}`;
      formData.value.userCode = value; // Update formData with the combined value
    }

    tempContent = tempContent.replaceAll(ph, value);
  });
  modifiedContent.value = tempContent;
};

const fetchWordFile = async () => {
  try {
    const response = await fetch(`${API_URL}/files/${id.value}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const resData = await response.json();
    const fileResponse = await fetch(`${API_URL}/uploads/${resData.filePath}`);
    if (!fileResponse.ok) throw new Error(`HTTP error! Status: ${fileResponse.status}`);
    const arrayBuffer = await fileResponse.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    htmlContent.value = result.value;
    modifiedContent.value = result.value;
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...result.value.matchAll(placeholderRegex)];
    placeholders.value = [...new Set(matches.map((match) => match[0]))];
    placeholders.value.forEach((placeholder) => {
      inputValues.value[placeholder] = '';
      validationErrors.value[placeholder] = ''; // Initialize validation errors
    });
    updateContent();
  } catch (error) {
    console.error('Error fetching file:', error.message);
    modifiedContent.value = "<p class='text-red-500'>Faylni olishda xatolik yuz berdi!</p>";
  }
};

const startRecording = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    if (!videoDevices.length) {
      console.warn('No cameras available');
    } else {
      for (const [index, device] of videoDevices.entries()) {
        if (index >= 2) break;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: device.deviceId },
            audio: true,
          });
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) =>
            recordingState.value.cameraChunks[index].push(e.data);
          recorder.start();
          recordingState.value.cameraRecorders[index] = recorder;
          recordingState.value.cameraChunks[index] = [];
        } catch (err) {
          console.warn(`Camera ${index + 1} failed: ${err.message}`);
        }
      }
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const recorder = new MediaRecorder(screenStream);
      recorder.ondataavailable = (e) =>
        recordingState.value.screenChunks.push(e.data);
      recorder.start();
      recordingState.value.screenRecorder = recorder;
    } catch (err) {
      console.warn(`Screen recording failed: ${err.message}`);
    }
  } catch (error) {
    console.error('Recording error:', error);
    errorMessage.value = 'Recording failed. Please check permissions.';
  }
};

const stopRecording = async () => {
  const stopPromises = recordingState.value.cameraRecorders.map((recorder, index) => {
    if (recorder && recorder.state !== 'inactive') {
      return new Promise((resolve) => {
        recorder.stop();
        recorder.stream.getTracks().forEach((track) => track.stop());
        setTimeout(resolve, 500);
      });
    }
    return Promise.resolve();
  });

  if (recordingState.value.screenRecorder && recordingState.value.screenRecorder.state !== 'inactive') {
    stopPromises.push(
      new Promise((resolve) => {
        recordingState.value.screenRecorder.stop();
        recordingState.value.screenRecorder.stream.getTracks().forEach((track) => track.stop());
        setTimeout(resolve, 500);
      }),
    );
  }

  await Promise.all(stopPromises);
};

const generateWordFile = async () => {
  const paragraphs = modifiedContent.value
    .split(/<\/p>|<br\s*\/?>/)
    .map((p) => p.replace(/<[^>]+>/g, '').trim())
    .filter((p) => p);
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: paragraphs.map((text) => new Paragraph({ children: [new TextRun({ text, size: 24 })] })),
    }],
  });
  try {
    wordState.value.blob = await Packer.toBlob(doc);
    wordState.value.generated = true;
    return wordState.value.blob;
  } catch (error) {
    console.error('Error generating Word file:', error);
    throw new Error('Failed to generate Word file.');
  }
};

const saveWordFile = async (blob) => {
  if (!blob) return alert('Word file not ready!');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Ariza.docx';
  link.click();
};

const isFieldPlaceholder = (placeholder, fieldName) => {
  const cleanPlaceholder = placeholder.replaceAll('{{', '').replaceAll('}}', '').toLowerCase();
  switch (fieldName) {
    case 'name': return cleanPlaceholder.includes('name') || cleanPlaceholder.includes('ism');
    case 'surname': return cleanPlaceholder.includes('surname') || cleanPlaceholder.includes('familiya');
    case 'dadname': return cleanPlaceholder.includes('dadname') || cleanPlaceholder.includes('otasining') || cleanPlaceholder.includes('father');
    case 'phone': return cleanPlaceholder.includes('phone') || cleanPlaceholder.includes('telefon');
    case 'birthday': return cleanPlaceholder.includes('birthday') || cleanPlaceholder.includes('tugilgan sana');
    case 'userCode': return cleanPlaceholder.includes('usercode') || cleanPlaceholder.includes('id karta');
    case 'uniqueCode': return cleanPlaceholder.includes('uniquecode') || cleanPlaceholder.includes('jshshir');
    default: return false;
  }
};

const typeContent = (content) => {
  let index = 0;
  animatedContent.value = '';
  const typeNextChar = () => {
    if (index < content.length) {
      animatedContent.value = content.substring(0, index + 1);
      index++;
      setTimeout(typeNextChar, 50);
    }
  };
  typeNextChar();
};

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Validate all inputs before submission
    placeholders.value.forEach((placeholder) => {
      validateInput(placeholder);
    });

    if (hasValidationErrors.value) {
      throw new Error('Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!');
    }

    await stopRecording();

    placeholders.value.forEach((placeholder) => {
      if (isFieldPlaceholder(placeholder, 'name')) formData.value.name = inputValues.value[placeholder] || formData.value.name;
      if (isFieldPlaceholder(placeholder, 'surname')) formData.value.surname = inputValues.value[placeholder] || formData.value.surname;
      if (isFieldPlaceholder(placeholder, 'dadname')) formData.value.dadname = inputValues.value[placeholder] || formData.value.dadname;
      if (isFieldPlaceholder(placeholder, 'phone')) formData.value.phone = inputValues.value[placeholder] || formData.value.phone;
      if (isFieldPlaceholder(placeholder, 'birthday')) formData.value.birthday = inputValues.value[placeholder] || formData.value.birthday;
      if (isFieldPlaceholder(placeholder, 'userCode')) formData.value.userCode = `${idKartaPrefix.value}${inputValues.value[placeholder] || ''}`;
      if (isFieldPlaceholder(placeholder, 'uniqueCode')) formData.value.uniqueCode = inputValues.value[placeholder] || formData.value.uniqueCode;
    });

    if (!formData.value.name) throw new Error("Ism (name) maydoni to'ldirilishi shart!");

    const htmlContentGenerated = generateHTMLContent();
    const htmlFile = new File([new Blob([htmlContentGenerated], { type: 'text/html' })], 'application.html', { type: 'text/html' });

    await uploadFiles(htmlFile);
    updateContent();
    showContent.value = true;
    typeContent(modifiedContent.value);

    const wordBlob = await generateWordFile();
    saveWordFile(wordBlob);

    successMessage.value = 'Ma\'lumotlar muvaffaqiyatli yuborildi!';
  } catch (error) {
    console.error('Submission error:', error.message, error.response?.data);
    errorMessage.value = error.response?.data?.message || error.message || 'Xatolik yuz berdi';
  } finally {
    isSubmitting.value = false;
  }
};

const uploadFiles = async (htmlFile) => {
  const form = new FormData();

  if (recordingState.value.cameraChunks.length > 0) {
    if (recordingState.value.cameraChunks[0]) {
      form.append('video1', new File([new Blob(recordingState.value.cameraChunks[0], { type: 'video/webm' })], 'webcam1_recording.webm', { type: 'video/webm' }));
    }
    if (recordingState.value.cameraChunks[1]) {
      form.append('video2', new File([new Blob(recordingState.value.cameraChunks[1], { type: 'video/webm' })], 'webcam2_recording.webm', { type: 'video/webm' }));
    }
  }

  if (recordingState.value.screenChunks.length) {
    form.append('video3', new File([new Blob(recordingState.value.screenChunks, { type: 'video/webm' })], 'screen_recording.webm', { type: 'video/webm' }));
  }

  form.append('file', htmlFile);
  form.append('data', JSON.stringify({
    uniqueCode: formData.value.uniqueCode || '',
    userCode: formData.value.userCode || '',
    name: formData.value.name,
    surname: formData.value.surname || null,
    dadname: formData.value.dadname || null,
    phone: formData.value.phone ? `+${formData.value.phone}` : formData.value.phone,
    birthday: formData.value.birthday ? new Date(formData.value.birthday).toISOString() : formData.value.birthday,
  }));

  try {
    const response = await axios.post(`${url}/commoners`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    console.error('Axios error:', error.message, error.response?.data);
    throw error;
  }
};

const generateHTMLContent = () => modifiedContent.value;

onMounted(() => {
  fetchWordFile();
  startRecording();
});
</script>