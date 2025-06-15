<template>
  <div
    class="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-colors duration-700"
  >
    <div
      class="w-full max-w-8xl flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16"
    >
      <!-- Form Section -->
      <div class="w-[130%] flex items-center justify-center">
        <div
          class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 transition-all duration-500 hover:shadow-3xl border border-white/20 dark:border-gray-800/20 max-w-[90%] w-full"
        >
          <!-- Permission Denied Message -->
          <div
            v-if="!hasRecordingPermissions"
            class="text-center py-20 animate-slide-in"
            aria-live="assertive"
          >
            <Icon
              icon="mdi:alert-circle"
              class="mx-auto h-20 w-20 text-red-500 dark:text-red-400 animate-pulse"
            />
            <h3
              class="mt-4 text-3xl lg:text-4xl font-extrabold text-red-700 dark:text-red-300 tracking-tight"
            >
              {{
                dat === "datakril"
                  ? translateText(`Ruxsat talab qilinadi`)
                  : `Ruxsat talab qilinadi`
              }}
            </h3>
            <p class="mt-2 text-lg text-red-600 dark:text-red-400 max-w-md mx-auto">
              {{
                dat === "datakril"
                  ? translateText(`Veb-kamera va ekran yozuviga ruxsat bering.`)
                  : `Veb-kamera va ekran yozuviga ruxsat bering.`
              }}
            </p>
            <button
              @click="retryRecording"
              class="mt-8 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:ring-4 focus:ring-blue-400 focus:outline-none shadow-lg hover:scale-105 text-lg"
              aria-label="Ruxsatlarni qayta so'rash"
            >
              {{ dat === "datakril" ? translateText(`Qayta urinish`) : `Qayta urinish` }}
            </button>
          </div>

          <!-- Loading State -->
          <div
            v-else-if="isLoading"
            class="flex items-center justify-center py-24 animate-pulse"
            aria-live="polite"
          >
            <Icon
              icon="mdi:loading"
              class="h-20 w-20 text-blue-600 dark:text-blue-400 animate-spin"
            />
            <span class="ml-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">{{
              dat === "datakril"
                ? translateText(`Ma'lumotlar yuklanmoqda...`)
                : `Ma'lumotlar yuklanmoqda...`
            }}</span>
          </div>

          <!-- Form Content -->
          <div v-else-if="shouldShowForm" class="space-y-10">
            <h2
              class="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-center"
            >
              {{
                dat === "datakril"
                  ? translateText(`Ariza ma'lumotlari`)
                  : `Ariza ma'lumotlari`
              }}
            </h2>

            <div
              v-for="(placeholder, index) in validPlaceholders"
              :key="placeholder + index"
              class="group relative"
            >
              <label
                :for="`input-${index}`"
                class="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2"
              >
                {{
                  dat === "datakril"
                    ? translateText(getPlaceholderLabel(placeholder))
                    : getPlaceholderLabel(placeholder)
                }}
                <span v-if="isRequiredField(placeholder)" class="text-red-500">*</span>
                <span
                  v-if="getFieldHint(placeholder)"
                  class="w-6 h-6 text-gray-400 dark:text-gray-500 cursor-help group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                  :title="getFieldHint(placeholder)"
                >
                  <Icon icon="mdi:information-outline" class="w-6 h-6" />
                </span>
              </label>

              <div class="flex items-center gap-3">
                <select
                  v-if="isFieldPlaceholder(placeholder, 'userCode')"
                  v-model="idKartaPrefix"
                  class="px-5 py-4 border border-gray-200/50 dark:border-gray-700/50 rounded-l-2xl bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-600 text-base"
                  @change="updateContent(placeholder)"
                  aria-label="ID Karta prefiksi"
                >
                  <option
                    v-for="prefix in ['AA', 'AB', 'AC', 'AD', 'AE', 'AF']"
                    :key="prefix"
                    :value="prefix"
                  >
                    {{ prefix }}
                  </option>
                </select>

                <span
                  v-if="isFieldPlaceholder(placeholder, 'phone')"
                  class="px-5 py-4 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-l-2xl text-gray-700 dark:text-gray-300 font-semibold backdrop-blur-sm text-base"
                >
                  +998
                </span>

                <input
                  :id="`input-${index}`"
                  v-model="inputValues[placeholder]"
                  :class="[
                    'px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 w-full text-gray-900 dark:text-gray-200 transition-all duration-300 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm text-base',
                    validationErrors[placeholder]
                      ? 'border-red-500 focus:ring-red-400 dark:border-red-400 dark:focus:ring-red-400'
                      : 'border-gray-200/50 dark:border-gray-700/50 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-600',
                    isFieldPlaceholder(placeholder, 'phone') ? 'rounded-l-none' : '',
                  ]"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText(getPlaceholderHint(placeholder))
                      : getPlaceholderHint(placeholder)
                  "
                  :type="getInputType(placeholder)"
                  :maxlength="getMaxLength(placeholder)"
                  :minlength="getMinLength(placeholder)"
                  @input="debouncedHandleInput(placeholder, $event)"
                  @blur="validateInput(placeholder)"
                  @keypress="restrictInput($event, placeholder)"
                  :required="isRequiredField(placeholder)"
                  :aria-invalid="validationErrors[placeholder] ? true : false"
                  :aria-describedby="
                    validationErrors[placeholder] ? `error-${index}` : undefined
                  "
                />
              </div>

              <p
                v-if="validationErrors[placeholder]"
                :id="`error-${index}`"
                class="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center animate-pulse"
                role="alert"
              >
                <Icon icon="mdi:close-circle" class="w-5 h-5 mr-2" />
                {{
                  dat === "datakril"
                    ? translateText(validationErrors[placeholder])
                    : validationErrors[placeholder]
                }}
              </p>
            </div>

            <button
              @click="openSubmitModal"
              :class="[
                'w-full py-4 rounded-2xl font-semibold text-white mt-12 transition-all duration-300 hover:scale-105 focus:ring-4 focus:outline-none shadow-lg text-lg',
                isSubmitting || hasValidationErrors || !isFormValid
                  ? 'bg-gray-300/50 dark:bg-gray-700/50 cursor-not-allowed backdrop-blur-sm'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700',
              ]"
              :disabled="isSubmitting || hasValidationErrors || !isFormValid"
              :aria-busy="isSubmitting ? 'true' : 'false'"
              aria-label="Formani yuborish"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <Icon icon="mdi:loading" class="animate-spin mr-3 h-6 w-6 text-white" />
                {{
                  dat === "datakril"
                    ? translateText(`Yuborilmoqda...`)
                    : `Yuborilmoqda...`
                }}
              </span>
              <span v-else>{{
                dat === "datakril" ? translateText(submitButtonText) : submitButtonText
              }}</span>
            </button>

            <div
              v-if="errorMessage"
              class="mt-8 p-5 bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/50 rounded-2xl flex items-center text-base text-red-700 dark:text-red-300 backdrop-blur-sm animate-slide-in"
              role="alert"
            >
              <Icon icon="mdi:alert-circle" class="w-6 h-6 mr-3" />
              {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
            </div>

            <div
              v-if="successMessage"
              class="mt-8 p-5 bg-green-50/80 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/50 rounded-2xl flex items-center text-base text-green-700 dark:text-green-300 backdrop-blur-sm animate-slide-in"
              role="alert"
            >
              <Icon icon="mdi:check-circle" class="w-6 h-6 mr-3" />
              {{ dat === "datakril" ? translateText(successMessage) : successMessage }}
            </div>
          </div>

          <!-- Missing Required Fields -->
          <div
            v-else-if="!isLoading && !hasAllRequiredFields"
            class="text-center py-20 animate-slide-in"
            aria-live="assertive"
          >
            <Icon
              icon="mdi:alert-circle"
              class="mx-auto h-20 w-20 text-red-500 dark:text-red-400 animate-pulse"
            />
            <h3
              class="mt-4 text-3xl lg:text-4xl font-extrabold text-red-700 dark:text-red-300 tracking-tight"
            >
              {{
                dat === "datakril"
                  ? translateText(`Noto'g'ri hujjat`)
                  : `Noto'g'ri hujjat`
              }}
            </h3>
            <p class="mt-2 text-lg text-red-600 dark:text-red-400 max-w-md mx-auto">
              {{
                dat === "datakril"
                  ? translateText(`Bu hujjatda kerakli barcha maydonlar mavjud emas.`)
                  : `Bu hujjatda kerakli barcha maydonlar mavjud emas.`
              }}
            </p>
            <div
              class="mt-8 p-6 bg-red-50/80 dark:bg-red-900/30 rounded-2xl border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm"
            >
              <p class="text-base font-semibold text-red-800 dark:text-red-300 mb-3">
                {{
                  dat === "datakril"
                    ? translateText(`Kerakli maydonlar:`)
                    : `Kerakli maydonlar:`
                }}
              </p>
              <ul
                class="text-base text-red-700 dark:text-red-300 space-y-2 list-disc list-inside"
              >
                <li v-for="field in uniqueRequiredFields" :key="field">
                  {{
                    dat === "datakril"
                      ? translateText(getPlaceholderLabel(field))
                      : getPlaceholderLabel(field)
                  }}
                </li>
              </ul>
              <p class="text-base text-red-600 dark:text-red-400 mt-3">
                {{
                  dat === "datakril"
                    ? translateText(`Topilgan maydonlar: `)
                    : `Topilgan maydonlar: `
                }}
                <span class="font-medium">
                  {{
                    foundBackendFields.length
                      ? foundBackendFields
                          .map((field) => getPlaceholderLabel(field))
                          .join(", ")
                      : dat === "datakril"
                      ? translateText("Hech biri")
                      : "Hech biri"
                  }}
                </span>
              </p>
              <p
                v-if="placeholders.length === 0"
                class="text-base text-red-600 dark:text-red-400 mt-2"
              >
                {{
                  dat === "datakril"
                    ? translateText(
                        `Hujjatda hech qanday placeholder (${placeholderText}) topilmadi.`
                      )
                    : `Hujjatda hech qanday placeholder (${placeholderText}) topilmadi.`
                }}
              </p>
              <p v-else class="text-base text-red-600 dark:text-red-400 mt-2">
                {{
                  dat === `datakril`
                    ? translateText(
                        `Topilgan placeholder'lar: ${placeholders.join(", ")}`
                      )
                    : `Topilgan placeholder'lar: ${placeholders.join(", ")}`
                }}
              </p>
            </div>
          </div>

          <!-- No Valid Placeholders -->
          <div
            v-else-if="!isLoading && validPlaceholders.length === 0"
            class="text-center py-20 animate-slide-in"
            aria-live="assertive"
          >
            <Icon
              icon="mdi:file-document-outline"
              class="mx-auto h-20 w-20 text-gray-500 dark:text-gray-400"
            />
            <h3
              class="mt-4 text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              {{
                dat === "datakril"
                  ? translateText(`Hech qanday maydon topilmadi`)
                  : `Hech qanday maydon topilmadi`
              }}
            </h3>
            <p class="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {{
                dat === "datakril"
                  ? translateText(`Hujjatda to'ldiriladigan maydonlar topilmadi.`)
                  : `Hujjatda to'ldiriladigan maydonlar topilmadi.`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content Preview -->
      <div v-if="showContent" class="w-full flex items-center justify-center">
        <div
          class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-3xl p-8 sm:p-10 lg:p-12 max-h-[90vh] overflow-y-auto transition-all duration-500 hover:shadow-3xl border border-white/20 dark:border-gray-800/20 w-full max-w-4xl"
        >
          <div class="flex justify-between items-center mb-10">
            <h3
              class="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              {{
                dat === "datakril"
                  ? translateText(`Ariza ko'rinishi`)
                  : `Ariza ko'rinishi`
              }}
            </h3>
            <button
              @click="downloadWordFile"
              class="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white rounded-2xl bg-2xl hover:bg-gradient-to-r hover:from-green-600-700 hover:to-emerald-green-700 transition-all duration-300 flex items-center gap-3 gap-2 focus:ring-4 focus:ring-green-400 focus:outline-none shadow-lg focus:ring-4 sm:ring-2 hover:ring-4 focus:ring-green-400 focus:ring-opacity-80 hover:scale-105 text-lg"
              :disabled="isSubmitting"
              aria-label="Word faylini yuklab olish"
            >
              <Icon icon="mdi:download" class="w-6 h-6 text-white" />
              {{
                dat === "datakril"
                  ? translateText(`Word yuklab olish`)
                  : `Word yuklab olish`
              }}
            </button>
          </div>
          <div
            v-html="animatedContent"
            class="custom-content animate-slide-in text-gray-700 dark:text-white leading-relaxed prose prose-xl dark:prose-invert"
          ></div>
        </div>
      </div>
    </div>

    <!-- Submit Confirmation Modal -->
    <div
      v-if="isSubmitModalOpen"
      class="fixed inset-0 bg-black/80 flex items-center backdrop-blur-sm justify-center z-50 animate-slide-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 sm:p-10 w-full max-w-xl max-w-full lg:max-w-2xl transform transition-all duration-500 scale-100 shadow-2xl border border-white/20 dark:border-gray-800/20"
      >
        <div class="flex justify-between items-center mb-8">
          <h3
            id="submit-modal-title"
            class="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            {{
              dat === "datakril"
                ? translateText(`Yuborishni tasdiqlash`)
                : `Yuborishni tasdiqlash`
            }}
          </h3>
          <button
            @click="isSubmitModalOpen = false"
            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            aria-label="Modalni yopish"
          >
            <Icon icon="mdi:close" class="w-8 h-8" />
          </button>
        </div>
        <p class="mb-8 text-base text-center text-gray-600 lg:text-lg dark:text-gray-300">
          {{
            dat === "datakril"
              ? translateText(`Quyidagi ma'lumotlarni yuborishni tasdiqlaysizmi?`)
              : `Quyidagi ma'lumotlarni yuborishni tasdiqlaysizmi?`
          }}
        </p>
        <div class="pr-3 space-y-5 overflow-y-auto max-h-[60vh]">
          <div
            v-for="placeholder in validPlaceholders"
            :key="placeholder"
            class="flex justify-between text-base text-gray-700 lg:text-lg dark:text-gray-200"
          >
            <span class="font-semibold"
              >{{
                dat === "datakril"
                  ? translateText(getPlaceholderLabel(placeholder))
                  : getPlaceholderLabel(placeholder)
              }}:</span
            >
            <span class="text-right">{{
              dat === "datakril"
                ? translateText(
                    formatModalValue(placeholder, inputValues[placeholder]) ||
                      "Kiritilmagan"
                  )
                : formatModalValue(placeholder, inputValues[placeholder]) ||
                  "Kiritilmagan"
            }}</span>
          </div>
        </div>
        <div class="flex justify-center mt-8 gap-6">
          <button
            @click="isSubmitModalOpen = false"
            class="px-10 py-4 text-lg text-gray-700 bg-gray-200/50 dark:bg-gray-800/50 dark:text-gray-200 rounded-2xl hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-all duration-300 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm backdrop-blur-sm"
            aria-label="Bekor qilish"
          >
            {{ dat === "datakril" ? translateText(`Bekor qilish`) : `Bekor qilish` }}
          </button>
          <button
            @click="submitForm"
            class="px-10 py-4 text-lg text-white rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:scale-105"
            :disabled="isSubmitting"
            aria-label="Tasdiqlash"
          >
            {{ dat === "datakril" ? translateText(`Tasdiqlash`) : `Tasdiqlash` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: inherit;
}
.custom-content * {
  color: #374151 !important; /* text-gray-700 for light mode */
}
.dark .custom-content * {
  color: #ffffff !important; /* text-white for dark mode */
}

.custom-content,
.custom-content * {
  color: inherit !important;
  line-height: 1.6;
}

.custom-content p {
  margin-bottom: 1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import mammoth from "mammoth";
import { debounce } from "lodash";
import { Icon } from "@iconify/vue";
import translateText from "@/auth/Translate";
import { onUnmounted } from "vue";
import { inject } from "vue";

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
// Constants
const API_URL = "https://backend.arizasud.uz";
const BACKEND_URL = "https://api.backend.arizasud.uz";

const FIELD_MAPPINGS = {
  name: ["name", "ism", "firstName", "fullname", "fullName", "imya", "nomi"],
  surname: ["surname", "familiya", "lastName", "familya"],
  dadname: ["dadname", "otasining", "middleName", "father", "otchestvo"],
  phone: ["phone", "telefon", "tel", "mobile", "raqam"],
  birthday: ["birthday", "tugilgan", "sana", "birth", "date", "tugilgansana"],
  userCode: ["usercode", "idkarta", "passport", "idcard", "id"],
  uniqueCode: ["uniquecode", "jshshir", "inn", "tin", "pinfl"],
};

const REQUIRED_BACKEND_FIELDS = [
  "name",
  "surname",
  "dadname",
  "phone",
  "birthday",
  "userCode",
  "uniqueCode",
];

const uniqueRequiredFields = computed(() => [...new Set(REQUIRED_BACKEND_FIELDS)]);

// Computed Property for Placeholder Text
const placeholderText = computed(() => "{{...}}");

// State
const route = useRoute();
const id = ref(route.params.id);
const htmlContent = ref("");
const modifiedContent = ref("");
const animatedContent = ref("");
const placeholders = ref([]);
const inputValues = ref({});
const showContent = ref(false);
const isSubmitting = ref(false);
const isLoading = inject("isLoading");
const errorMessage = ref("");
const successMessage = ref("");
const idKartaPrefix = ref("AA");
const validationErrors = ref({});
const isSubmitModalOpen = ref(false);
const hasRecordingPermissions = ref(false);

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

// Computed Properties
const validPlaceholders = computed(() => {
  return placeholders.value.filter((placeholder) => getFieldType(placeholder) !== null);
});

const foundBackendFields = computed(() => {
  const foundFields = new Set();
  validPlaceholders.value.forEach((placeholder) => {
    const fieldType = getFieldType(placeholder);
    if (fieldType) foundFields.add(fieldType);
  });
  return Array.from(foundFields);
});

const hasAllRequiredFields = computed(() => {
  return uniqueRequiredFields.value.every((field) =>
    foundBackendFields.value.includes(field)
  );
});

const shouldShowForm = computed(() => {
  return (
    !isLoading.value && hasAllRequiredFields.value && validPlaceholders.value.length > 0
  );
});

const getPlaceholderLabel = computed(() => (placeholder) => {
  const fieldType = getFieldType(placeholder);
  const labels = {
    name: "Ism",
    surname: "Familiya",
    dadname: "Otasining ismi",
    phone: "Telefon raqami",
    birthday: "Tug'ilgan sana",
    userCode: "ID Karta raqami",
    uniqueCode: "JSHShIR",
  };
  return labels[fieldType] || placeholder.replace(/\{\{|\}\}\}/g, "").trim();
});

const hasValidationErrors = computed(() => {
  return Object.values(validationErrors.value).some((error) => error !== "");
});

const isFormValid = computed(() => {
  return validPlaceholders.value.every((placeholder) => {
    const value = inputValues.value[placeholder];
    const fieldType = getFieldType(placeholder);
    return REQUIRED_BACKEND_FIELDS.includes(fieldType)
      ? value && value.toString().trim() !== "" && !validationErrors.value[placeholder]
      : true;
  });
});

const submitButtonText = computed(() => {
  if (!isFormValid.value) return "Barcha maydonlarni to'ldiring";
  if (hasValidationErrors.value) return "Xatoliklarni tuzating";
  return "Yuborish";
});

// Helper Functions
const getFieldType = (placeholder) => {
  const cleanPlaceholder = placeholder
    .replace(/\{\{|\}\}/g, "")
    .trim()
    .toLowerCase();
  for (const [fieldType, keywords] of Object.entries(FIELD_MAPPINGS)) {
    if (
      keywords.some((keyword) =>
        cleanPlaceholder.match(new RegExp(`\\b${keyword.toLowerCase()}\\b`))
      )
    ) {
      return fieldType;
    }
  }
  return null;
};

const isFieldPlaceholder = (placeholder, fieldName) => {
  return getFieldType(placeholder) === fieldName;
};

const isRequiredField = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  return REQUIRED_BACKEND_FIELDS.includes(fieldType);
};

const getInputType = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  if (fieldType === "birthday") return "date";
  if (fieldType === "phone") return "tel";
  return "text";
};

const getMaxLength = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  return (
    {
      userCode: 7,
      uniqueCode: 14,
      phone: 12, // 9 digits + 3 spaces
      name: 50,
      surname: 50,
      dadname: 50,
    }[fieldType] || 100
  );
};

const getMinLength = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  return (
    {
      userCode: 7,
      uniqueCode: 14,
      phone: 12, // 9 digits + 3 spaces
      name: 2,
      surname: 2,
      dadname: 2,
    }[fieldType] || 1
  );
};

const getPlaceholderHint = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  return (
    {
      userCode: "1234567",
      uniqueCode: "12345678901234",
      phone: "91 234 56 78",
      name: "Ismingizni kiriting",
      surname: "Familiyangizni kiriting",
      dadname: "Otangizning ismini kiriting",
      birthday: "YYYY-MM-DD (masalan: 1990-05-15)",
    }[fieldType] || ""
  );
};

const getFieldHint = (placeholder) => {
  const fieldType = getFieldType(placeholder);
  return (
    {
      userCode: "7 ta raqamdan iborat ID karta raqami",
      uniqueCode: "14 ta raqamdan iborat JSHShIR",
      phone:
        "9 ta raqamdan iborat telefon raqami (+998 prefiksisiz, masalan: 91 234 56 78)",
      birthday:
        "Tug'ilgan sana (YYYY-MM-DD formatida, kelajakdagi sanalar qo'llanilmaydi)",
      name: "Kamida 2 harfdan iborat ism",
      surname: "Kamida 2 harfdan iborat familiya",
      dadname: "Kamida 2 harfdan iborat otasining ismi",
    }[fieldType] || null
  );
};

const formatModalValue = (placeholder, value) => {
  if (!value) return "";
  const fieldType = getFieldType(placeholder);
  if (fieldType === "userCode") return `${idKartaPrefix.value}${value}`;
  if (fieldType === "phone") return `+998 ${value}`;
  if (fieldType === "birthday") return new Date(value).toLocaleDateString("uz-UZ");
  return value;
};

const formatPhoneNumber = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 9) {
    let formatted = "";
    for (let i = 0; i < digits.length; i++) {
      if (i === 0) formatted += digits[i];
      else if (i === 2) formatted += " " + digits[i];
      else if (i === 5) formatted += " " + digits[i];
      else if (i === 7) formatted += " " + digits[i];
      else formatted += digits[i];
    }
    return formatted;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
    5,
    7
  )} ${digits.slice(7, 9)}`;
};

// Input Handling
const restrictInput = (event, placeholder) => {
  const fieldType = getFieldType(placeholder);
  if (["userCode", "uniqueCode"].includes(fieldType)) {
    const charCode = event.charCode || event.which;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  } else if (fieldType === "phone") {
    const charCode = event.charCode || event.which;
    if ((charCode < 48 || charCode > 57) && charCode !== 32) {
      event.preventDefault();
    }
  }
};

const handleInput = (placeholder, event) => {
  isLoading.value = true;
  try {
    let value = event.target.value;
    const fieldType = getFieldType(placeholder);
    if (fieldType === "phone") {
      value = formatPhoneNumber(value.replace(/\D/g, "").slice(0, 9));
    } else if (["userCode", "uniqueCode"].includes(fieldType)) {
      value = value.replace(/\D/g, "");
    }
    inputValues.value[placeholder] = value;
    validateInput(placeholder);
    updateContent();
  } catch (error) {
    console.error(`Input handling error for ${placeholder}:`, error);
    errorMessage.value = "Kiritishda xatolik yuz berdi!";
  } finally {
    isLoading.value = true;
  }
};

const debouncedHandleInput = debounce(handleInput, 100);

const validateInput = (placeholder) => {
  const value = inputValues.value[placeholder] || "";
  const fieldType = getFieldType(placeholder);

  const validators = {
    uniqueCode: () =>
      !value
        ? "JSHShIR kiritilishi shart!"
        : !/^\d{14}$/.test(value)
        ? "JSHShIR 14 ta raqamdan iborat bo'lishi kerak!"
        : "",
    userCode: () =>
      !value
        ? "ID karta raqami kiritilishi shart!"
        : !/^\d{7}$/.test(value)
        ? "ID karta raqami 7 ta raqamdan iborat bo'lishi kerak!"
        : "",
    phone: () => {
      if (!value) return "Telefon raqami kiritilishi shart!";
      const digits = value.replace(/\D/g, "");
      if (digits.length !== 9)
        return "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak!";
      return "";
    },
    birthday: () => {
      if (!value) return "Tug'ilgan sana kiritilishi shart!";
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value))
        return "Tug'ilgan sana noto'g'ri formatda! (YYYY-MM-DD ishlatilsin)";
      const date = new Date(value);
      if (isNaN(date.getTime())) return "Noto'g'ri sana formati!";
      const today = new Date();
      if (date > today) return "Tug'ilgan sana kelajakda bo'lishi mumkin emas!";
      return "";
    },
    name: () => {
      if (!value) return "Ism kiritilishi shart!";
      if (value.length < 2) return "Ism kamida 2 harfdan iborat bo'lishi kerak!";
      return "";
    },
    surname: () => {
      if (!value) return "Familiya kiritilishi shart!";
      if (value.length < 2) return "Familiya kamida 2 harfdan iborat bo'lishi kerak!";
      return "";
    },
    dadname: () => {
      if (!value) return "Otasining ismi kiritilishi shart!";
      if (value.length < 2)
        return "Otasining ismi kamida 2 harfdan iborat bo'lishi kerak!";
      return "";
    },
  };

  validationErrors.value[placeholder] = validators[fieldType]
    ? validators[fieldType]()
    : "";
};

// Content Updates
const updateContent = (specificPlaceholder = null) => {
  let content = htmlContent.value;
  validPlaceholders.value.forEach((placeholder) => {
    if (specificPlaceholder && placeholder !== specificPlaceholder) return;
    const fieldType = getFieldType(placeholder);
    let value = inputValues.value[placeholder] || "";
    if (fieldType === "userCode" && value) value = `${idKartaPrefix.value}${value}`;
    else if (fieldType === "phone" && value) value = `+998 ${value}`;
    else if (fieldType === "birthday" && value)
      value = new Date(value).toLocaleDateString("uz-UZ");
    const originalText = placeholder.replace(/\{\{|\}\}/g, "").trim();
    content = content.replace(
      new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
      value || originalText
    );
  });
  modifiedContent.value = content;
};

// File Operations
const fetchWordFile = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const response = await fetch(`${API_URL}/files/${id.value}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Fayl topilmadi: ${response.status}`);

    const data = await response.json();
    const fileResponse = await fetch(`${API_URL}/uploads/${data.filePath}`, {
      cache: "no-store",
    });
    if (!fileResponse.ok) throw new Error(`Fayl yuklab olinmadi: ${fileResponse.status}`);

    const arrayBuffer = await fileResponse.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    htmlContent.value = result.value;
    modifiedContent.value = result.value;

    const placeholderRegex = /\{\{[^\}]+?\}\}/g;
    placeholders.value = [
      ...new Set([...result.value.matchAll(placeholderRegex)].map((m) => m[0])),
    ];

    placeholders.value.forEach((placeholder) => {
      inputValues.value[placeholder] = "";
      validationErrors.value[placeholder] = "";
    });

    if (placeholders.value.length === 0) {
      errorMessage.value = `Hujjatda hech qanday to'ldiriladigan maydon (${placeholderText.value}) topilmadi! Iltimos, hujjatda {{ism}}, {{familiya}} kabi maydonlar borligini tekshiring.`;
    }

    updateContent();
  } catch (error) {
    console.error("Error fetching file:", error);
    errorMessage.value = `Faylni olishda xatolik: ${error.message}`;
    modifiedContent.value =
      "<p class='text-red-500 dark:text-red-400'>Faylni olishda xatolik yuz berdi!</p>";
  } finally {
    isLoading.value = false;
  }
};

// Recording Functions
const startRecording = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.warn("Media devices not supported in this browser.");
    errorMessage.value = "Video yozish bu brauzerda qo'llab-quvvatlanmaydi!";
    hasRecordingPermissions.value = false;
    return;
  }
isLoading.value = true;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    let hasCameraPermission = false;
    let hasScreenPermission = false;

    for (const [index, device] of videoDevices.entries()) {
      if (index >= 2) break;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
          audio: index === 0,
        });
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorder.ondataavailable = (e) => {
          if (!recordingState.value.cameraChunks[index]) {
            recordingState.value.cameraChunks[index] = [];
          }
          if (e.data.size > 0) {
            recordingState.value.cameraChunks[index].push(e.data);
          }
        };
        recorder.start(1000);
        recordingState.value.cameraRecorders[index] = recorder;
        hasCameraPermission = true;
      } catch (err) {
        console.warn(`Camera ${index + 1} failed: ${err.message}`);
      }
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const recorder = new MediaRecorder(screenStream, { mimeType: "video/webm" });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordingState.value.screenChunks.push(e.data);
        }
      };
      recorder.start(1000);
      recordingState.value.screenRecorder = recorder;
      hasScreenPermission = true;
    } catch (err) {
      console.warn("Screen recording failed:", err.message);
    }

    hasRecordingPermissions.value = hasCameraPermission || hasScreenPermission;
    if (!hasRecordingPermissions.value) {
      errorMessage.value = "Veb-kamera yoki ekran yozuviga ruxsat berilmadi!";
    }
  } catch (error) {
    console.error("Recording setup failed:", error);
    errorMessage.value = "Video yozuvni boshlashda xatolik!";
    hasRecordingPermissions.value = false;
  } finally{
    isLoading.value = false
  }
};

const retryRecording = async () => {
  errorMessage.value = "";
  await startRecording();
};

const stopRecording = async () => {
  isLoading.value = true;
  try {
    const stopPromises = [];

    recordingState.value.cameraRecorders.forEach((recorder, index) => {
      if (recorder && recorder.state !== "inactive") {
        stopPromises.push(
          new Promise((resolve) => {
            recorder.onstop = () => {
              recorder.stream?.getTracks().forEach((track) => track.stop());
              resolve();
            };
            recorder.stop();
          })
        );
      }
    });

    if (
      recordingState.value.screenRecorder &&
      recordingState.value.screenRecorder.state !== "inactive"
    ) {
      stopPromises.push(
        new Promise((resolve) => {
          recordingState.value.screenRecorder.onstop = () => {
            recordingState.value.screenRecorder.stream
              ?.getTracks()
              .forEach((track) => track.stop());
            resolve();
          };
          recordingState.value.screenRecorder.stop();
        })
      );
    }

    await Promise.all(stopPromises);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error stopping recording:", error);
    errorMessage.value = "Yozuvni to'xtatishda xatolik!";
  }finally{
    isLoading.value = false
  }
};

// Word File Operations
const generateWordFile = async () => {
  isLoading.value = true;
  try {
    const paragraphs = modifiedContent.value
      .split(/<\/p>|<br\s*\/?>/)
      .map((p) => p.replace(/<[^>]+>/g, "").trim())
      .filter((p) => p);

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            },
          },
          children: paragraphs.map(
            (text) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: 24,
                  }),
                ],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    wordState.value.blob = blob;
    wordState.value.generated = true;
    return blob;
  } catch (error) {
    console.error("Error generating Word file:", error);
    throw new Error("Word fayl yaratishda xatolik!");
  } finally{
    isLoading.value = false
  }
};

const downloadWordFile = async () => {
  isLoading.value = true;
  try {
    let blob = wordState.value.blob;
    if (!blob) blob = await generateWordFile();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Ariza.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading Word file:", error);
    errorMessage.value = `Word faylini yuklab olishda xatolik: ${error.message}`;
  } finally{
    isLoading.value = false
  }
};

// Content Animation
const typeContent = (content) => {
  let index = 0;
  animatedContent.value = "";
  const typeChar = () => {
    if (index < content.length) {
      animatedContent.value += content[index];
      index++;
      setTimeout(typeChar, 1);
    }
  };
  typeChar();
};

// Form Submission
const openSubmitModal = () => {
  validPlaceholders.value.forEach((placeholder) => validateInput(placeholder));
  if (hasValidationErrors.value || !isFormValid.value) {
    errorMessage.value =
      "Iltimos, barcha xatoliklarni tuzating va kerakli maydonlarni to'ldiring!";
    return;
  }
  isSubmitModalOpen.value = true;
};

const submitForm = async () => {
  isLoading.value = true;
  try {
    isSubmitting.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    validPlaceholders.value.forEach((placeholder) => validateInput(placeholder));
    if (hasValidationErrors.value) {
      throw new Error("Iltimos, barcha xatoliklarni tuzating!");
    }

    const birthdayPlaceholder = validPlaceholders.value.find(
      (p) => getFieldType(p) === "birthday"
    );
    if (birthdayPlaceholder && !inputValues.value[birthdayPlaceholder]) {
      throw new Error("Tug'ilgan sana kiritilishi shart!");
    }

    if (!isFormValid.value) {
      throw new Error("Barcha kerakli maydonlar to'ldirilishi shart!");
    }

    await stopRecording();

    const preparedData = prepareFormData();
    const wordBlob = await generateWordFile();
    const htmlFile = new Blob([modifiedContent.value], { type: "text/html" });
    const form = new FormData();
    form.append("file", wordBlob, "Ariza.docx");

    Object.entries(preparedData).forEach(([key, value]) => {
      if (value !== null) {
        form.append(key, value);
      }
    });
    form.append("data", JSON.stringify(preparedData));

    await validateFiles(htmlFile);
    await uploadFiles(form, preparedData);

    showContent.value = true;
    typeContent(modifiedContent.value);

    successMessage.value = "Ma'lumotlar muvaffaqiyatli yuborildi!";
    isSubmitModalOpen.value = false;
  } catch (error) {
    console.error("Submission error:", error);
    errorMessage.value = error.message || "Yuborishda xatolik yuz berdi!";
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const prepareFormData = () => {
  const data = {
    name: null,
    surname: null,
    dadname: null,
    phone: null,
    birthday: null,
    userCode: null,
    uniqueCode: null,
  };

  validPlaceholders.value.forEach((placeholder) => {
    const fieldType = getFieldType(placeholder);
    const value = inputValues.value[placeholder];
    if (value && fieldType) {
      if (fieldType === "birthday") {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          console.error("Invalid birthday format:", value);
          throw new Error("Tug'ilgan sana noto'g'ri formatda! (YYYY-MM-DD ishlatilsin)");
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          console.error("Invalid date object for birthday:", value);
          throw new Error("Noto'g'ri sana formati!");
        }
        data[fieldType] = value;
      } else if (fieldType === "userCode") {
        data[fieldType] = `${idKartaPrefix.value}${value}`;
      } else if (fieldType === "phone") {
        data[fieldType] = `+998 ${value}`;
      } else {
        data[fieldType] = value.trim();
      }
    } else if (fieldType === "birthday" && !value) {
      console.error("Birthday is missing for placeholder:", placeholder);
      throw new Error("Tug'ilgan sana kiritilishi shart!");
    }
  });

  return data;
};

const validateFiles = async (htmlFile) => {
  if (htmlFile.size > 5 * 1024 * 1024) {
    throw new Error("HTML fayl hajmi 5MB dan oshmasligi kerak!");
  }
};

const uploadFiles = async (form, formData) => {
  const formDataObj = {};
  form.forEach((value, key) => {
    formDataObj[key] = value instanceof Blob ? "Blob" : value.toString();
  });

  recordingState.value.cameraChunks.forEach((chunks, index) => {
    if (chunks?.length) {
      const blob = new Blob(chunks, { type: "video/webm" });
      form.append(`video${index + 1}`, blob, `webcam_${index + 1}_recording.webm`);
    }
  });

  if (recordingState.value.screenChunks.length) {
    const blob = new Blob(recordingState.value.screenChunks, { type: "video/webm" });
    form.append("video3", blob, "screen_recording.webm");
  }

  const finalFormDataObj = {};
  form.forEach((value, key) => {
    finalFormDataObj[key] = value instanceof Blob ? "Blob" : value.toString();
  });
isLoading.value = true;
  try {
    const response = await axios.post(`${BACKEND_URL}/commoners`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    console.error("Upload error with response:", error.response?.data || error);
    const message =
      error.code === "ECONNABORTED"
        ? "Serverga ulanish vaqti tugadi"
        : error.response?.status === 413
        ? "Fayl hajmi juda katta"
        : error.response?.status >= 500
        ? "Server xatosi"
        : error.response?.data?.message || "Ma'lumotlarni yuklashda xatolik";
    throw new Error(message);
  }finally{isLoading.value = false}
};

// Watchers
watch(idKartaPrefix, () => updateContent());

// Lifecycle
onMounted(async () => {
  await fetchWordFile();
  if (!errorMessage.value) {
    await startRecording();
  }
});
</script>
