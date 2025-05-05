<template>
  <div class="bg-blue-200 -mt-[20px] pt-[20px]">
    <div v-if="isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
      <span class="loader"></span>
      <p class="loading-message">{{ loadingMessage }}</p>
    </div>
    <div class="container mt-5 mx-auto p-4 bg-blue-300 rounded shadow">
      <div v-if="fields.length && !isLoading">
        <div v-for="(field, index) in uniqueFields" :key="index" class="mb-4">
          <div v-if="field.key === 'Mahalla nomi ko’cha nomi uy raqamini yozing'">
            <div v-if="fieldValues[buyurtmachiIndex] === 'Jismoniy'">
              <!-- Shartnoma uchun yangi dropdown -->
              <label for="" class="text-black">
                {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
              </label>
              <select v-model="contractRegion.regionId"
                class="p-3 mb-4 rounded-lg focus:outline-none block w-full text-black border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                @change="fetchDistricts('contract')">
                <option class="text-black" value="" disabled>
                  {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
                </option>
                <option class="text-black" v-for="region in regions" :key="region.id" :value="region.id">
                  {{ dat === 'datakril' ? region.name_oz : region.name_uz }}
                </option>
              </select>

              <label for="" class="text-black">
                {{ dat === 'datakril' ? translateText('Tuman yoki shaxarni tanlang') :
                  'Tuman yoki shaxarni tanlang' }}
              </label>
              <select v-model="contractRegion.districtId"
                class="p-3 mb-4 rounded-lg block w-full focus:outline-none text-black border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                :disabled="!contractRegion.regionId">
                <option class="text-black" value="" disabled>
                  {{ dat === 'datakril' ? translateText('Tuman yoki shaxarni tanlang') :
                    'Tuman yoki shaxarni tanlang' }}
                </option>
                <option class="text-black" v-for="district in contractDistricts" :key="district.id"
                  :value="district.id">
                  {{ dat === 'datakril' ? district.name_oz : district.name_uz }}
                </option>
              </select>
              <label class="block font-medium mb-1 text-black">
                {{ dat === "datakril" ? translateText(field.key) : field.key }}
              </label>
              <input v-model="fieldValues[index]" :type="getInputType(field.key)" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full p-2 border-2 border-blue-500 rounded focus:ring text-black focus:ring-blue-200">
            </div>
          </div>

          <div v-if="field.key === 'Mahalla nomi ko’cha nomi uy raqamini yozing'">
            <div v-if="fieldValues[buyurtmachiIndex] === 'Yuridik'">

              <label for="" class="text-black">
                {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
              </label>
              <select v-model="contractRegion.regionId"
                class="p-3 mb-4 rounded-lg focus:outline-none block w-full text-black border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                @change="fetchDistricts('contract')">
                <option class="text-black" value="" disabled>
                  {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
                </option>
                <option class="text-black" v-for="region in regions" :key="region.id" :value="region.id">
                  {{ dat === 'datakril' ? region.name_oz : region.name_uz }}
                </option>
              </select>
              <label for="" class="text-black">
                {{ dat === 'datakril' ? translateText('Tuman yoki shaxarni tanlang') : 'Tuman yoki shaxarni tanlang' }}
              </label>
              <select v-model="contractRegion.districtId"
                class="p-3 mb-4 rounded-lg block w-full focus:outline-none text-black border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                :disabled="!contractRegion.regionId">
                <option class="text-black" value="" disabled>
                  {{ dat === 'datakril' ? translateText('Tuman yoki shaxarni tanlang') :
                    'Tuman yoki shaxarni tanlang' }}
                </option>
                <option class="text-black" v-for="district in contractDistricts" :key="district.id"
                  :value="district.id">
                  {{ dat === 'datakril' ? district.name_oz : district.name_uz }}
                </option>
              </select>
              <label for="" class="text-black">
                {{ dat === 'datakril' ?
                  translateText('Tashkilot manzilini kiriting (Mahalla nomi ko’cha nomi uy raqamini yozing)') :
                  'Tashkilot manzilini kiriting(Mahalla nomi ko’cha nomi uy raqamini yozing)' }}
              </label>
              <input v-model="fieldValues[index]" :type="getInputType(field.key)" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full p-2  rounded border-2 border-blue-500 focus:ring text-black focus:ring-blue-200">
            </div>
          </div>

          <!-- Conditionally render fields based on Buyurtmachi value -->
          <template v-if="shouldShowField(field.key)">
            <label
              v-if="field.key !== 'adminName' && field.key !== 'adminSurname' && field.key !== 'documentId' && field.key !== 'login' && field.key !== 'parol' && field.key !== 'fingerImage1' && field.key !== 'fingerImage2' && field.key !== 'image1' && field.key !== 'image2' && field.key !== 'qrcode1' && field.key !== 'qrcode3' && field.key !== 'qrcode2' && field.key !== 'ofis' && field.key !== 'STIR' && field.key !== 'Korxona rahbarini F.I.SH.:' && field.key !== 'Mahalla nomi ko’cha nomi uy raqamini yozing' && field.key !== 'Buyurtmachi' && field.key !== 'yuristName' && field.key !== 'yuristSurname' && field.key !== 'Tashkilot nomini kirting'"
              class="block font-medium mb-1 text-black">
              <!-- Modified label rendering logic -->
              {{
                dat === "datakril"
                  ? translateText(
                    fieldValues[buyurtmachiIndex] === 'Yuridik' &&
                      [
                        'Fuqaroning ID karta raqami',
                        'Fuqaroning JSHSHIR raqami',
                        'Fuqaroning qo’shimcha telefon raqami',
                        'Fuqaroning telefon raqami '
                      ].includes(field.key)
                      ? field.key.replace('Fuqaroning', 'Yuridik shaxsning')
                      : field.key
                  )
                  : fieldValues[buyurtmachiIndex] === 'Yuridik' &&
                    [
                      'Fuqaroning ID karta raqami',
                      'Fuqaroning JSHSHIR raqami',
                      'Fuqaroning qo’shimcha telefon raqami',
                      'Fuqaroning telefon raqami '
                    ].includes(field.key)
                    ? field.key.replace('Fuqaroning', 'Yuridik shaxsning')
                    : field.key
              }}
            </label>

            <template v-if="field.key === 'Buyurtmachi'">
              <div class="flex gap-2">
                <div class="buyurtmachi-option flex border-2 border-blue-500 flex-col justify-center items-center gap-3"
                  :class="{ 'buyurtmachi-selected': fieldValues[index] === 'Jismoniy' }"
                  @click="selectBuyurtmachi(index, 'Jismoniy')">
                  <img src="/userr.png" class="w-[50px]" alt="">
                  {{ dat === "datakril" ? translateText('Jismoniy') : 'Jismoniy' }}
                </div>
                <div class="buyurtmachi-option flex border-2 border-blue-500 flex-col justify-center items-center gap-3"
                  :class="{ 'buyurtmachi-selected': fieldValues[index] === 'Yuridik' }"
                  @click="selectBuyurtmachi(index, 'Yuridik')">
                  <img src="/bag.png" class="w-[50px]" alt="">
                  {{ dat === "datakril" ? translateText('Yuridik') : 'Yuridik' }}
                </div>
              </div>
            </template>

            <template v-else-if="field.key === 'STIR'">
              <div v-if="fieldValues[buyurtmachiIndex] === 'Yuridik'">
                <label class="block font-medium mb-1 text-black">
                  {{ dat === "datakril" ? translateText(field.key) : field.key }}
                </label>
                <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                  :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                  class="w-full p-2  border-2 border-blue-500 rounded focus:ring text-black focus:ring-blue-200"
                  @input="restrictToNumbers(field.key, index)" />
              </div>
            </template>
            <template v-else-if="field.key === 'Korxona rahbarini F.I.SH.:'">
              <div v-if="fieldValues[buyurtmachiIndex] === 'Yuridik'">
                <label class="block font-medium mb-1 text-black">
                  {{ dat === "datakril" ? translateText(field.key) : field.key }}
                </label>
                <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                  :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                  class="w-full p-2 border-2 border-blue-500 rounded focus:ring text-black focus:ring-blue-200"
                  @input="validateFullName(field.key, index)" />
                <p v-if="errors[index]" class="text-red-600 text-sm mticators 1">{{ errors[index] }}</p>
              </div>
            </template>
            <template v-else-if="field.key === 'Tashkilot nomini'">
              <div v-if="fieldValues[buyurtmachiIndex] === 'Yuridik'">
                <label class="block font-medium mb-1 text-black">
                  {{ dat === "datakril" ? translateText(field.key) : field.key }}
                </label>
                <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                  :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                  class="w-full p-2 border-2 border-blue-500 rounded focus:ring text-black focus:ring-blue-200"
                  @input="validateFullName(field.key, index)" />
                <p v-if="errors[index]" class="text-red-600 text-sm mticators 1">{{ errors[index] }}</p>
              </div>
            </template>
            <template
              v-else-if="field.key !== 'adminName' && field.key !== 'adminSurname' && field.key !== 'documentId' && field.key !== 'fingerImage1' && field.key !== 'fingerImage2' && field.key !== 'image1' && field.key !== 'qrcode3' && field.key !== 'image2' && field.key !== 'qrcode1' && field.key !== 'qrcode2' && field.key !== 'Korxona rahbarini F.I.SH.:' && field.key !== 'yuristName' && field.key !== 'yuristSurname' && field.key !== 'Mahalla nomi ko’cha nomi uy raqamini yozing' && field.key !== 'Buyurtmachi' && field.key !== 'Tashkilot nomini kirting' && field.key !== 'login' && field.key !== 'parol' && field.key !== 'ofis'">
              <input v-model="fieldValues[index]" :type="getInputType(field.key)" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full p-2 border-2 border-blue-500 rounded focus:ring text-black focus:ring-blue-200"
                @input="['Fuqaroning telefon raqami ', 'Fuqaroning qo’shimcha telefon raqami'].includes(field.key) ? formatPhoneNumber(field.key, index) : restrictToNumbers(field.key, index); formatNumberFields(field.key, index); preventCyrillic(field.key, index)"
                @focus="addPhonePrefix(field.key, index)" />
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key) && field.key !== 'Fuqaroning qo’shimcha telefon raqami'"
                class="error-message">
                {{ dat === 'datakril' ? translateText('Bu maydon to\'ldirilishi shart!') :
                  "Bu maydon to'ldirilishi shart!" }}

              </p>
            </template>
          </template>
        </div>
        <div class="mb-4 w-full relative">
          <!-- Label -->
          <label class="block w-full font-medium mb-1 text-black">
            {{ dat === 'datakril' ? translateText('Ushbu ishni o\'z zimmasiga oladigan yuristni tanlang') :
              'Ushbu ishni o\'z zimmasiga oladigan yuristni tanlang' }}
          </label>

          <!-- Selected Yurist Display -->
          <div class="p-3 border-2 border-blue-500 bg-white rounded-lg cursor-pointer flex justify-between items-center"
            @click="toggleDropdown">
            <span class="text-black">{{ dat === 'datakril' ? translateText(selectedYuristName) : selectedYuristName
            }}</span>
          </div>

          <!-- Dropdown Options -->
          <div v-if="isDropdownOpen"
            class="absolute p-2 top-full left-0 mt-2 w-full flex flex-col gap-2 bg-gray-200 border border-gray-300 rounded-lg shadow-lg z-10">
            <div v-for="yurist in yurists" :key="yurist.id"
              class="p-3 flex gap-4 border-2 border-blue-500 h-[70px] rounded-md items-center cursor-pointer hover:bg-gray-300 text-black relative"
              @click="selectYurist(yurist)" @mouseenter="hoveredYurist = yurist; showHoverModal = true"
              @mouseleave="showHoverModal = false">
              <img class="w-[50px]" :src="URL + '/upload/' + yurist.img" alt="img">
              <h1 class="text-black text-[15px] font-bold">
                {{ dat === 'datakril' ? translateText(yurist.name) : yurist.name }}
              </h1>
              <!-- Hover Modal -->
              <div v-if="showHoverModal && hoveredYurist?.id === yurist.id"
                class="absolute bottom-0 left-full max-h-[500px] overflow-scroll -ml-[40%] p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-20 min-w-[300px]">
                <p class="text-black">Bajaradigan ishlari</p>
                <div v-if="filteredTasks.length > 0">
                  <div class="text-black bg-gray-300 flex justify-between p-2 rounded-lg my-1"
                    v-for="item in filteredTasks" :key="item.id">
                    <p class="text-black">
                      {{ dat === 'datakril' ? translateText(item.name) : item.name }}</p>
                    <h1 class="text-black">holati: <span class="text-red-500">Kutish</span></h1>
                  </div>
                </div>
                <div v-else class="text-black text-center p-2">
                  {{ dat === 'datakril' ? translateText('Bajaradigan ishlari yo\'q') : "Bajaradigan ishlari yo'q" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label for="" class="text-black">
            {{ dat === 'datakril' ? translateText('Shartnoma YKKni qaysi filialida amalga oshirilmoqda') :
              'Shartnoma YKKni qaysi filialida amalga oshirilmoqda' }}
          </label>
          <select v-model="paymentTuman"
            class="p-3 border-2 border-blue-500 mb-4 rounded-lg block w-full focus:outline-none text-black  focus:ring-2 focus:ring-blue-500"
            required>
            <option class="text-black" value="" disabled>
              {{ dat === 'datakril' ? translateText('Shartnoma YKKni qaysi filialida amalga oshirilmoqda') :
                'Shartnoma YKKni qaysi filialida amalga oshirilmoqda' }}
            </option>
            <option class="text-black" value="Xorazm viloyati Urganch shaxar 1-son filiali">
              {{ dat === 'datakril' ? translateText('Xorazm viloyati Urganch shaxar 1-son filiali') :
                'Xorazm viloyati Urganch shaxar 1-son filiali' }}
            </option>
            <option class="text-black" value="Xorazm viloyati Xiva shaxar markaziy binosi">
              {{ dat === 'datakril' ? translateText('Xorazm viloyati Xiva shaxar markaziy binosi') :
                'Xorazm viloyati Xiva shaxar markaziy binosi' }}
            </option>
          </select>
        </div>

        <!-- Rest of the template remains unchanged -->
        <div class="mt-4 flex justify-between">
          <div class="">
            <div class="flex">
              <button @click="openCameraModal('profile')" class="btn btn-primary">
                {{ dat === "datakril" ? translateText("Ong tamondan") : "Ong tamondan" }}<br>
                {{ dat === "datakril" ? translateText("suratga olish") : "suratga olish" }}
              </button>
              <button @click="openCameraModal('document')" class="btn btn-primary">
                {{ dat === "datakril" ? translateText("Chap tamondan suratga olish") : "Chap tamondan suratga olish" }}
              </button>
              <button @click="openVideoModal" class="btn h-[65px] btn-primary">
                {{ dat === "datakril" ? translateText("Video yozib olish") : "Video yozib olish" }}
              </button>
            </div>

            <div>
              <button @click="fingerSearch = !fingerSearch" class="btn btn-primary">
                {{ dat === "datakril" ? translateText("Barmoq izini scanerlash") : "Barmoq izini scanerlash" }}
              </button>
            </div>
          </div>

          <div>
            <button @click="saveAndGenerate" class="btn h-[50px] text-[20px] btn-secondary">
              {{ dat === "datakril" ? translateText("Yuklash") : "Yuklash" }}
            </button>
          </div>
        </div>
        <!-- Completion Date Modal -->
        <div v-if="isCompletionDateModalOpen" class="modal" @click.self="closeCompletionDateModal">
          <div class="modal-content">
            <h2 class="text-lg text-black font-bold mb-4">
              {{ dat === 'datakril' ? translateText('Ishni yakunlash sanasini tanlang') :
                'Ishni yakunlash sanasini tanlang' }}
            </h2>
            <input v-model="selectedCompletionDate" type="text" readonly
              class="p-3 border mb-4 rounded-lg focus:outline-none block w-full text-black border-black focus:ring-2 focus:ring-blue-500"
              :placeholder="dat === 'datakril' ? translateText('Tanlangan sanasi') : 'Tanlangan sanasi'"
              :value="formattedCompletionDate" />
            <!-- Calendar -->
            <div class="calendar">
              <div class="header flex justify-between items-center mb-4">
                <button @click="prevMonth" class="btn btn-secondary"> {{ '<' }} </button>
                    <span class="month-year text-black">{{ getMonthName(currentMonth) }} {{ currentYear }}</span>
                    <button @click="nextMonth" class="btn btn-secondary">></button>
              </div>
              <!-- Weekdays -->
              <div class="weekdays flex gap-2 justify-center">
                <span v-for="(day, index) in ['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y']" :key="index" class="weekday">
                  {{ day }}
                </span>
              </div>
              <div class="days grid grid-cols-7 gap-2">
                <div v-for="date in days" :key="'day' + date.day" class="day"
                  :class="{ 'today': isToday(date.day), 'selected': isSelected(date.day), 'disabled': !date.isSelectable }"
                  @click="date.isSelectable ? selectDate(date.day) : null">
                  {{ date.day }}
                </div>
              </div>
            </div>
            <!-- Save Button -->
            <button v-if="selectedCompletionDate" @click="saveSelectedDate" class="btn btn-primary mt-4 w-full">
              {{ dat === 'datakril' ? translateText('Saqlash') : 'Saqlash' }}
            </button>
          </div>
        </div>
        <!-- Camera Modal -->
        <div v-if="isModalOpen" class="modal" @click.self="closeCameraModal">
          <div class="modal-content dark">
            <video ref="video" width="420" height="240" autoplay class="rounded border"></video>
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

        <div v-if="isVideoModalOpen" class="modal" @click.self="closeVideoModal">
          <div class="video-modal-content dark">
            <video ref="recordingVideo" autoplay class="rounded border" style="width:100%; max-width:670px;"></video>
            <div class="mt-4 pb-2 flex justify-between">
              <button @click="startRecording" v-if="!isRecording" class="btn btn-success">
                {{ dat === "datakril" ? translateText("Yozib olish") : "Yozib olish" }}
              </button>
              <button @click="stopRecording" v-else class="btn btn-danger">
                {{ dat === "datakril" ? translateText("To'xtatish") : "To'xtatish" }}
              </button>
              <button @click="saveVideo" v-if="recordedVideoBlob" class="btn btn-primary">
                {{ dat === "datakril" ? translateText("Saqlash") : "Saqlash" }}
              </button>
            </div>
            <p class="text-center -mt-[40px] text-red-500">
              {{ dat === "datakril" ? translateText("Qolgan vaqt") : "Qolgan vaqt" }}: {{ recordingTime }} sec
            </p>
          </div>
        </div>
        <!-- Warning Modal -->
        <div v-if="isWarningModalOpen" class="modal" @click.self="closeWarningModal">
          <div class="modal-content flex border-4 relative border-red-700">
            <img src="/x.png" class="w-12 mr-1" alt="">
            <img @click="isWarningModalOpen = false" src="/reject.png" class="w-5 h-5 absolute top-1 right-1" alt="">
            <p class="text-red-600 text-center">
              {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="fingerSearch" class="flex justify-center items-center z-40 fixed inset-0 bg-black bg-opacity-70">
      <div class="bg-white rounded-md p-4">
        <div v-if="imageData" class="image-preview">
          <img :src="`data:image/png;base64,${imageData}`" class="mx-auto" alt="Barmoq izi rasmi" />
        </div>
        <div className="w-full space-y-3">
          <button @click="finger1" :class="[
            'w-full py-2.5 px-4 text-white text-sm font-medium rounded transition-colors',
            fingerText2 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#0B4D45] hover:bg-[#083D37]'
          ]">
            {{ fingerText2
              ? (dat === 'datakril' ? translateText('Barmoq izini qayta skaynerlash ( Ong tamon )') :
                'Barmoq izini qayta skaynerlash(Ong tamon)')
              : (dat === 'datakril' ? translateText('Barmoq izini skaynerlaish ( Ong tamon )') :
                'Barmoq izini skaynerlaish ( Ong tamon )') }}
          </button>

          <!-- Chap tomoni -->
          <button @click="finger" :class="[
            'w-full py-2.5 px-4 text-white text-sm font-medium rounded transition-colors',
            fingerText1 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#0B4D45] hover:bg-[#083D37]'
          ]">
            {{
              fingerText1
                ? (dat === 'datakril' ? translateText('Barmoq izini qayta skaynerlash ( Chap tamon )') :
                  'Barmoq izini qayta skaynerlash(Chap tamon)')
                : (dat === 'datakril' ? translateText('Barmoq izini skaynerlaish ( Chap tamon )')
                  : 'Barmoq izini skaynerlaish ( Chap tamon )')
            }}
          </button>

          <div class="flex gap-2">
            <button @click="fingerSearch = false"
              class="w-full py-2.5 px-4 bg-[#4d0b0b] text-white text-sm font-medium rounded hover:bg-[#3d0808] transition-colors">
              {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
            </button>
            <button v-if="imageData" @click="fingerSearch = false"
              class="w-full py-2.5 px-4 bg-[#0b4d1d] text-white text-sm font-medium rounded hover:bg-[#083D37] transition-colors">
              {{ dat === 'datakril' ? translateText('Saqlash') : 'Saqlash' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, nextTick, inject, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import html2pdf from 'html2pdf.js';
import translateText from "@/auth/Translate.js";
import regionsData from '@/assets/regions.json';
import districtsData from '@/assets/districts.json';

const imageData = ref("") // Rasm uchun base64 ma'lumot
const fingerSearch = ref(false)
const dat = inject("dat");
const route = useRoute();
const router = useRouter();
let UniqueID = null;
let ClientData = '';
const id = route.params.id;
const fields = ref([]);
const uniqueFields = ref([]);
const fieldValues = ref([]);
const docxTemplate = ref(null);
const errorMessage = ref("");
const errors = ref([]); // Added for validation errors
const API_URL = URL + "/contract-file";
const video = ref(null);
const qarz = ref(0);
const yuristName = ref("");
const yuristSurname = ref("");
const isDropdownOpen = ref(false);
const paymentViloyat = ref('');
const paymentTuman = ref('');
const yuristId = ref("");
const yurists = ref([]); // Store the list of yurists
const selectedYurist = ref(null);
const totalsumma = ref(0);
const selectedYuristDetails = ref(null); // Store the selected yurist's details
const contractRegion = ref({
  regionId: '',
  districtId: ''
});

const paymentRegion = ref({
  regionId: '',
  districtId: ''
});

const contractDistricts = ref([]);
const paymentDistricts = ref([]);
const canvas = ref(null);
const hoveredYurist = ref(null); // Hover qilingan yuristni saqlash uchun
const showHoverModal = ref(false); // Modalni ko'rsatish uchun
const isModalOpen = ref(false);
const isWarningModalOpen = ref(false);
const sum1 = ref("");
const recordingTime = ref(60); // Video uzunligi
const countdownInterval = ref(null); // Interval uchun referensiya
const sum2 = ref("");
const checkFile = ref(null);
const isLoading = ref(false);
const loadingMessage = ref("Yuklanmoqda...");
const Loading = inject('isLoading');
const adminName = ref('');
const paid = ref(0);
const adminSurname = ref('');
const imageType = ref(null);
const stir = ref('');
const viloyat = ref('');
const tuman = ref('');
const manzil = ref("")
const regions = ref([]);
const districts = ref([]);
const showRegionModal = ref(false);
const generatedLogin = ref('');
const generatedPassword = ref("");
const adminId = ref(0);
const regionFormData = ref({
  regionId: '',
  districtId: ''
});
const selectedRegionForPrint = ref({ regionName: '', districtName: '' });
const pendingPrint = ref(false);
const buyurtmachiIndex = ref(null);
const clientId = ref(null);
const isVideoModalOpen = ref(false);
const recordingVideo = ref(null);
const recordedVideoBlob = ref(null);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);
const isRecording = ref(false);
const formSubmitted = ref(false);
const filteredTasks = computed(() => {
  if (!hoveredYurist.value) return [];
  return hoveredYurist.value.LawyerTask;
});
// Computed Property
const selectedYuristName = computed(() => {
  const selected = yurists.value.find(y => y.id === selectedYurist.value);
  return selected ? (dat.value === 'datakril' ? translateText(selected.name) : selected.name) : "Tanlang";
});

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectYurist = (yurist) => {
  selectedYurist.value = yurist.id; // Save the selected yurist ID
  isDropdownOpen.value = false; // Close the dropdown
  isCompletionDateModalOpen.value = true; // Open the completion date modal
};

const openVideoModal = async () => {
  isVideoModalOpen.value = true;
  await startVideoStream();
};

const closeVideoModal = () => {
  stopVideoStream();
  isVideoModalOpen.value = false;
  recordedVideoBlob.value = null;
  recordedChunks.value = [];
  isRecording.value = false;
};
const removeDots = (value) => {
  if (typeof value !== 'string') return value;
  return value.split('.').join('');
}

const startVideoStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    recordingVideo.value.srcObject = stream;
    recordingVideo.value.muted = true; // Mute the video element to prevent audio playback

    // MediaRecorder uchun MP4 formatini sozlash
    const options = { mimeType: 'video/mp4' };
    mediaRecorder.value = new MediaRecorder(stream, options);

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      recordedVideoBlob.value = new Blob(recordedChunks.value, { type: 'video/mp4' });
    };
  } catch (error) {
    console.error("startVideoStream xatosi:", error);
    errorMessage.value = " Kameraga kirishda xatolik!";
  }
};

const stopVideoStream = () => {
  if (recordingVideo.value && recordingVideo.value.srcObject) {
    const stream = recordingVideo.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    recordingVideo.value.srcObject = null;
  }
};
const getModifiedLabel = (key) => {
  if (fieldValues.value[buyurtmachiIndex.value] === 'Yuridik') {
    return key.split(' ').slice(1).join(' ');
  }
  return key;
};

const startRecording = async () => {
  try {
    if (!recordingVideo.value.srcObject) {
      await startVideoStream(); // Agar stream yoqilgan bo'lmasa, avval uni yoqamiz
    }

    if (mediaRecorder.value && mediaRecorder.value.state !== 'recording') {
      // Avvalgi yozuvni tozalash
      recordedChunks.value = [];
      recordedVideoBlob.value = null;

      // Yangi yozishni boshlash
      mediaRecorder.value.start();

      // Recording holatini yangilash
      isRecording.value = true;

      // Countdown timerni sozlash
      recordingTime.value = 60; // 60 sekund
      clearInterval(countdownInterval.value); // Avvalgi intervallarni tozalash

      countdownInterval.value = setInterval(() => {
        if (recordingTime.value > 0) {
          recordingTime.value--;
        } else {
          stopRecording(); // Vaqt tugaganda avtomatik to'xtatish
        }
      }, 1000);
    }
  } catch (error) {
    console.error("startRecording xatosi:", error);
    errorMessage.value = " Video yozishni boshlashda xatolik!";
  }
};

const stopRecording = () => {
  try {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      // Yozishni to'xtatish
      mediaRecorder.value.stop();

      // Timer intervalini tozalash
      clearInterval(countdownInterval.value);
      countdownInterval.value = null;

      // Recording holatini yangilash
      isRecording.value = false;

      // Qolgan vaqtni tiklash
      recordingTime.value = 60;

      // Videoni blob formatiga o'tkazish
      nextTick(() => {
        if (recordedChunks.value.length > 0) {
          recordedVideoBlob.value = new Blob(recordedChunks.value, { type: 'video/webm' });
        }
      });
    }
  } catch (error) {
    console.error("stopRecording xatosi:", error);
    errorMessage.value = " Video yozishni to'xtatishda xatolik!";
  }
};

const saveVideo = () => {
  if (recordedVideoBlob.value) {
    const videoFile = new File([recordedVideoBlob.value], "recorded-video.mp4", { type: "video/mp4" });
    formData.video = videoFile;
    console.log("Saved video file:", formData.video); // Debug log

    closeVideoModal();
    recordedVideoBlob.value = null;
    recordedChunks.value = [];
  } else {
    console.error("No video blob available to save.");
    errorMessage.value = " Yozib olingan video mavjud emas!";
    isWarningModalOpen.value = true;
  }
};
const getAdmin = async () => {
  Loading.value = true;
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${localStorage.getItem('id')}`);
    adminName.value = response.data.name;
    adminSurname.value = response.data.surname;
    adminId.value = response.data.id;
  } catch (error) {
    console.error("getAdmin xatosi:", error);
  } finally {
    Loading.value = false;
  }
};

const getYurist = async () => {
  Loading.value = true;
  try {
    const response = await axios.get(`${URL}/yurist`);
    yurists.value = response.data; // Populate the yurists array
    console.log("Yurists:", yurists.value);
  } catch (error) {
    console.error("getYurist error:", error);
    errorMessage.value = " Yuristlar ro'yxatini yuklashda xatolik!";
  } finally {
    Loading.value = false;
  }
};
const name = ref("");
const surname = ref("");
const dadname = ref("");
const phone = ref('');
const formData = {
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
  documentImage: null,
  fingerImage: null,
  paymentAmount: 0,
  adminName: "",
  fingerImage1: null,
};

const selectBuyurtmachi = (index, value) => {
  fieldValues.value[index] = value;
};

const bio = ref('')
const fingerText1 = ref(false)
const fingerText2 = ref(false)

const finger = async () => {
  isLoading.value = true;
  loadingMessage.value = 'Iltimos, barmogʻingizni qurilmaga qoʻying. Barmoq izi olinmoqda...';
  try {
    const response = await axios.get("http://localhost:3000");
    console.log("FINGER:", response.data);
    if (response.data.image) {
      imageData.value = response.data.image
    } else {
      imageData.value = ""
    }
    const base64Data = response.data.image.replace(/^data:image\/png;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    formData.fingerImage = new File([blob], "fingerprint.png", { type: "image/png" });
  } catch (error) {
    console.error("fetchClient xatosi:", error);
    errorMessage.value = " Fingerprint capture failed!";
  } finally {
    isLoading.value = false;
    fingerText1.value = true
    console.log("O'ng barmoq skanerlangan?", fingerText1.value) // ✅ Tekshiruv
  }
};

const finger1 = async () => {
  isLoading.value = true;
  loadingMessage.value = 'Iltimos, barmogʻingizni qurilmaga qoʻying. Barmoq izi olinmoqda...';
  try {
    const response = await axios.get("http://localhost:3000");
    console.log("FINGER:", response.data);
    if (response.data.image) {
      imageData.value = response.data.image
    } else {
      imageData.value = ""
    }
    const bioId = response.data.bio_id
    bio.value = bioId
    const base64Data = response.data.image.replace(/^data:image\/png;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    formData.fingerImage1 = new File([blob], "fingerprint.png", { type: "image/png" });
  } catch (error) {
    console.error("fetchClient xatosi:", error);
    errorMessage.value = " Fingerprint capture failed!";
  } finally {
    isLoading.value = false;
    fingerText2.value = true
    console.log("Chap barmoq skanerlangan?", fingerText2.value) // ✅ Tekshiruv
  }
};
const fetchDocx = async () => {
  Loading.value = true;
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const fileUrl = URL + response.data.filePath;
    const fileResponse = await axios.get(fileUrl, { responseType: "blob" });
    if (!fileResponse.headers["content-type"].includes("application/vnd.openxmlformats")) {
      throw new Error(" Server noto'g'ri formatda ma’lumot qaytardi!");
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
            (key) =>
              key !== "sum1" &&
              key !== "sum2" &&
              key !== "qarz" &&
              key !== "umumiy" &&
              key !== "ID" &&
              key !== "Today Date"
          );

          // Reorder uniqueKeys to place Buyurtmachi first
          const buyurtmachiIndex = uniqueKeys.indexOf('Buyurtmachi');
          if (buyurtmachiIndex !== -1) {
            uniqueKeys.splice(buyurtmachiIndex, 1); // Remove Buyurtmachi
            uniqueKeys.unshift('Buyurtmachi'); // Add Buyurtmachi at the beginning
          }

          // Reorder uniqueKeys to place STIR before Korxona rahbarini F.I.SH.:
          const stirIndex = uniqueKeys.indexOf('STIR');
          const korxonaRahbariIndex = uniqueKeys.indexOf('Korxona rahbarini F.I.SH.:');

          if (stirIndex !== -1 && korxonaRahbariIndex !== -1 && stirIndex > korxonaRahbariIndex) {
            // Move STIR before Korxona rahbarini F.I.SH.:
            const stirField = uniqueKeys.splice(stirIndex, 1)[0];
            uniqueKeys.splice(korxonaRahbariIndex, 0, stirField);
          }

          uniqueFields.value = uniqueKeys.map((key) => ({ key }));
          fieldValues.value = new Array(uniqueFields.value.length).fill("");
          errors.value = new Array(uniqueFields.value.length).fill(""); // Initialize errors array
          // Set default value for Buyurtmachi to Jismoniy
          const buyurtmachiFieldIndex = uniqueFields.value.findIndex(field => field.key === 'Buyurtmachi');
          if (buyurtmachiFieldIndex !== -1) {
            fieldValues.value[buyurtmachiFieldIndex] = 'Jismoniy';
          }
        }
      } catch (zipError) {
        errorMessage.value = " DOCX faylni ochishda xatolik!";
        console.error("DOCX zip xatosi:", zipError);
      }
    };
    reader.readAsArrayBuffer(blob);
  } catch (error) {
    errorMessage.value = error.message || " Faylni yuklashda xatolik!";
    console.error("fetchDocx xatosi:", error);
  } finally {
    Loading.value = false;
  }
};

const startWebcam = async () => {
  if (!video.value) {
    errorMessage.value = " Video elementi topilmadi!";
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (error) {
    errorMessage.value = " Kameraga kirishda xatolik! Iltimos, ruxsat bering.";
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

const openCameraModal = (type) => {
  imageType.value = type;
  isModalOpen.value = true;
  nextTick(() => startWebcam());
};

const closeCameraModal = () => {
  stopWebcam();
  isModalOpen.value = false;
  imageType.value = null;
};

const captureImage = () => {
  if (!video.value || !canvas.value) {
    errorMessage.value = " Video yoki canvas topilmadi!";
    return;
  }
  const context = canvas.value.getContext("2d");
  context.drawImage(video.value, 0, 0, 320, 240);
  canvas.value.toBlob((blob) => {
    if (imageType.value === 'profile') {
      formData.image = new File([blob], "profile-image.jpg", { type: "image/jpeg" });
    } else if (imageType.value === 'document') {
      formData.documentImage = new File([blob], "document-image.jpg", { type: "image/jpeg" });
    }
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
    fingerImage1: null,
    file: null,
    image: null,
    documentImage: null,
    fingerImage: null,
    paymentAmount: 0
  });
  fieldValues.value = new Array(uniqueFields.value.length).fill("");
  errors.value = new Array(uniqueFields.value.length).fill(""); // Reset errors
  dataaa.summa1 = null;
  dataaa.summa2 = null;
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
  return `${day}${hours}${minutes}${seconds}${milliseconds}`.slice(-8);
};

const fetchDistricts = (type) => {
  let target;
  let districtsRef;

  if (type === 'contract') {
    target = contractRegion;
    districtsRef = contractDistricts;
  } else if (type === 'payment') {
    target = paymentRegion;
    districtsRef = paymentDistricts;
  } else {
    target = regionFormData;
    districtsRef = districts;
  }

  if (target.value.regionId) {
    const filtered = districtsData.filter(
      (district) => district.region_id === parseInt(target.value.regionId)
    );
    districtsRef.value = filtered;
    target.value.districtId = '';
  } else {
    districtsRef.value = [];
    target.value.districtId = '';
  }
};
function generateRandomName() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';

  // 3 ta tasodifiy harf
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // 3 ta tasodifiy son
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
}
const closeRegionModal = () => {
  showRegionModal.value = false;
  regionFormData.value = {
    regionId: '',
    districtId: ''
  };
  districts.value = [];
  if (pendingPrint.value) {
    pendingPrint.value = false;
  }
};

const submitRegionSelection = async () => {

  const selectedRegion = regions.value.find(
    (r) => r.id === parseInt(regionFormData.value.regionId)
  );
  const selectedDistrict = districts.value.find(
    (d) => d.id === parseInt(regionFormData.value.districtId)
  );
  selectedRegionForPrint.value = {
    regionName: selectedRegion
      ? dat === 'datakril'
        ? selectedRegion.name_uz
        : selectedRegion.name_uz
      : '',
    districtName: selectedDistrict
      ? dat === 'datakril'
        ? selectedDistrict.name_uz
        : selectedDistrict.name_uz
      : ''
  };


  showRegionModal.value = false;
  regionFormData.value = {
    regionId: '',
    districtId: ''
  };
  districts.value = [];

  if (pendingPrint.value) {
    pendingPrint.value = false;
    await printReceipt();
    router.push(`/Check/${clientId.value}`);
    window.location.reload();
  }
};

const submitSelection = async () => {
  const selectedContractRegion = regions.value.find(
    (r) => r.id === parseInt(contractRegion.value.regionId)
  );
  const selectedContractDistrict = contractDistricts.value.find(
    (d) => d.id === parseInt(contractRegion.value.districtId)
  );
  const selectedPaymentRegion = regions.value.find(
    (r) => r.id === parseInt(paymentRegion.value.regionId)
  );
  const selectedPaymentDistrict = paymentDistricts.value.find(
    (d) => d.id === parseInt(paymentRegion.value.districtId)
  );
  viloyat.value = selectedContractRegion?.name_uz || '';
  tuman.value = selectedContractDistrict?.name_uz || '';
  paymentViloyat.value = selectedPaymentRegion?.name_uz || '';

};

const validateFullName = (key, index) => {
  if (key === "Korxona rahbarini F.I.SH.:") {
    const value = fieldValues.value[index].trim();
    const parts = value.split(/\s+/).filter(part => part.length > 0);
    if (parts.length < 3) {
      errors.value[index] = "Familiya, Ism va Otasining ismi kiritilishi kerak!";
    } else {
      errors.value[index] = "";
    }
  }
};

// Inside saveAndGenerate function
const saveAndGenerate = async () => {
  formSubmitted.value = true;
  try {
    submitSelection();

    // Validate region and district selections
    if (!contractRegion.value.regionId || !contractRegion.value.districtId) {
      errorMessage.value = " Shartnoma uchun viloyat va tuman tanlanishi shart!";
      isWarningModalOpen.value = true;
      return;
    }

    if (!contractRegion.value.regionId || !contractRegion.value.districtId) {
      errorMessage.value = " Shartnoma uchun viloyat va tuman tanlanishi shart!";
      isWarningModalOpen.value = true;
      return;
    }

    // Validate yurist selection
    if (!selectedYurist.value) {
      errorMessage.value = " Iltimos, yurist tanlang!";
      isWarningModalOpen.value = true;
      return;
    }

    // Validate completion date
    if (!selectedCompletionDate.value) {
      errorMessage.value = " Ishni yakunlash sanasi tanlanishi shart!";
      isWarningModalOpen.value = true;
      return;
    }

    // Validate images and video
    if (!formData.image || !formData.documentImage) {
      errorMessage.value = " Iltimos, ikkala rasmni ham oling (ong va chap)!";
      isWarningModalOpen.value = true;
      return;
    }

    if (!formData.video) {
      errorMessage.value = " Video yozib olish shart!";
      isWarningModalOpen.value = true;
      return;
    }

    if (!formData.fingerImage) {
      errorMessage.value = "Iltimos barmoq izini skaynerlang";
      isWarningModalOpen.value = true;
      return;
    }
    if (!formData.fingerImage1) {
      errorMessage.value = "Iltimos barmoq izini skaynerlang";
      isWarningModalOpen.value = true;
      return;
    }

    // Clear previous errors
    errors.value = new Array(uniqueFields.value.length).fill("");

    // Initialize data object for Word document rendering
    const data = {};

    // Process fields based on Buyurtmachi type
    const isYuridik = fieldValues.value[buyurtmachiIndex.value] === 'Yuridik';

    // Initialize name fields
    formData.name = "";
    formData.surname = "";
    formData.dadname = "";
    name.value = "";
    surname.value = "";
    dadname.value = "";

    uniqueFields.value.forEach((field, index) => {
      // Handle "Tug’ilgan sanasi" field
      if (field.key === "Tug’ilgan sanasi") {
        data["Tug’ilgan sanasi"] = formatDateToDMY(fieldValues.value[index]);
      }
      // Handle "Korxona rahbarini F.I.SH." for Yuridik
      else if (field.key === "Korxona rahbarini F.I.SH.:" && isYuridik) {
        const fullName = fieldValues.value[index].trim().split(/\s+/).filter(part => part.length > 0);
        if (fullName.length < 3) {
          errorMessage.value = " Korxona rahbarini F.I.SH. to'liq kiritilishi kerak (Familiya, Ism, Otasining ismi)!";
          throw new Error("Incomplete full name");
        }
        formData.surname = fullName[0] || "";
        formData.name = fullName[1] || "";
        formData.dadname = fullName[2] || "";
        surname.value = fullName[0] || "";
        name.value = fullName[1] || "";
        dadname.value = fullName[2] || "";
        data["Familya"] = 'Raxbar: ' + fullName[0] || "";
        data["Ism"] = fullName[1] || "";
        data["Otasining ismi"] = fullName[2] || "";
        data["Korxona rahbarini F.I.SH.:"] = "Yuridik shaxs ";
      }
      // Handle individual fields for Jismoniy
      else if (field.key === "Ism" && !isYuridik) {
        formData.name = fieldValues.value[index] || "";
        name.value = fieldValues.value[index] || "";
        data["Ism"] = fieldValues.value[index] || "";
      }
      else if (field.key === "Familya" && !isYuridik) {
        formData.surname = fieldValues.value[index] || "";
        surname.value = fieldValues.value[index] || "";
        data["Familya"] = fieldValues.value[index] || "";
      }
      else if (field.key === "Otasining ismi" && !isYuridik) {
        formData.dadname = fieldValues.value[index] || "";
        dadname.value = fieldValues.value[index] || "";
        data["Otasining ismi"] = fieldValues.value[index] || "";
      }
      // Other field mappings
      else if (field.key === "STIR") {
        stir.value = fieldValues.value[index] || "";
        data["STIR"] = fieldValues.value[index] ? ` STIR: ${fieldValues.value[index]} ` : "";
      }
      else if (field.key === "Fuqaroning JSHSHIR raqami") {
        formData.uniqueCode = fieldValues.value[index] || "";
        data["Fuqaroning JSHSHIR raqami"] = fieldValues.value[index] || "";
      }
      // Inside saveAndGenerate function, within uniqueFields.value.forEach loop
      else if (field.key === "Fuqaroning ID karta raqami") {
        formData.userCode = fieldValues.value[index] || "";
        data["Fuqaroning ID karta raqami"] = (fieldValues.value[index] || "").toUpperCase();
      }
      else if (field.key === "Fuqaroning telefon raqami ") {
        formData.phone = fieldValues.value[index] || "";
        phone.value = fieldValues.value[index] || "";
        data["Fuqaroning telefon raqami "] = fieldValues.value[index] || "";
      }
      else if (field.key === "Buyurtmachini boshlang’ich to’lovi (avans)") {
        dataaa.price = fieldValues.value[index];
        formData.paymentAmount = fieldValues.value[index];
        data["Buyurtmachini boshlang’ich to’lovi (avans)"] = fieldValues.value[index];
      }
      else if (field.key === "Konsalting xizmat ko’rsatish narxi") {
        dataaa.summa1 = fieldValues.value[index];
        data["Konsalting xizmat ko’rsatish narxi"] = fieldValues.value[index];
      }
      else if (field.key === "Murojaat qilinadigan joy (Sud yoki boshqa joylarga murojaat)") {
        formData.adminName = fieldValues.value[index];
        data["Murojaat qilinadigan joy (Sud yoki boshqa joylarga murojaat)"] = fieldValues.value[index];
      }
      else if (field.key === "Hujjatga tushuntirish berish narxi") {
        data["Hujjatga tushuntirish berish narxi"] = fieldValues.value[index];
      }
      else if (field.key === "Mahalla nomi ko’cha nomi uy raqamini yozing") {
        manzil.value = fieldValues.value[index];
        data["Mahalla nomi ko’cha nomi uy raqamini yozing"] = `${viloyat.value} ${tuman.value} ${manzil.value}`;
      }
      // Store other fields in data
      else {
        data[field.key] = fieldValues.value[index] || "";
      }
    });
    // Ensure name fields are set in data even if not explicitly provided
    if (!data["Ism"]) data["Ism"] = formData.name || "";
    if (!data["Familya"]) data["Familya"] = formData.surname || "";
    if (!data["Otasining ismi"]) data["Otasining ismi"] = formData.dadname || "";

    if (!docxTemplate.value) {
      errorMessage.value = " DOCX shablon topilmadi!";
      return;
    }

    await fetchRecords();

    // Set date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    data["Today Date"] = formattedDate;

    // Generate contract ID
    formData.contractId = generateContractId();
    UniqueID = formData.contractId;
    data["ID"] = formData.contractId;
    data["documentId"] = formData.contractId;

    // Calculate sums
    const sum1Num = removeDots(sum1.value) || 0;
    const sum2Num = removeDots(sum2.value) || 0;
    const konsaltingNarxi = removeDots(dataaa.summa1) || 0;
    const boshlagichSumma = removeDots(dataaa.price) || 0;
    paid.value = +boshlagichSumma;
    const umumiy = +sum1Num + +sum2Num + +konsaltingNarxi;
    totalsumma.value = +umumiy;
    const qarza = umumiy - boshlagichSumma;
    formData.totalSum = umumiy;
    formData.paidSum = boshlagichSumma;
    formData.remainingSum = qarza <= 0 ? 0 : qarza;
    qarz.value = qarza;
    generatedLogin.value = `${formData.name}${generateRandomName()}`
    generatedPassword.value = `${generateRandomName()}${formData.name}`
    // Add calculated fields to data
    data["sum1"] = formatNumberWithDots(sum1Num);
    data["sum2"] = formatNumberWithDots(sum2Num);
    data["umumiy"] = formatNumberWithDots(umumiy);
    data["qarz"] = formatNumberWithDots(qarza);
    data["adminName"] = adminName.value;
    data["adminSurname"] = adminSurname.value;
    data["image1"] = "{{image1}}";
    data["image2"] = "{{image2}}";
    data["yuristName"] = yuristName.value;
    data["yuristSurname"] = yuristSurname.value;
    data["parol"] = generatedPassword;
    data["login"] = generatedLogin;
    data["qrcode1"] = "{{qrcode1}}";
    data["ofis"] = translateText(paymentTuman.value);
    data["qrcode2"] = "{{qrcode2}}";
    data["qrcode3"] = "{{qrcode3}}";
    data["fingerImage1"] = "{{fingerImage1}}";
    data["fingerImage2"] = "{{fingerImage2}}";

    // Render the Word document
    docxTemplate.value.render(data);
    const output = docxTemplate.value.getZip().generate({ type: "blob" });
    formData.file = new File([output], "updated-document.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    await generateCheckFile();
    await submitForm();
  } catch (error) {
    errorMessage.value = " Yuklashda xatolik yuz berdi: " + error.message;
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
    errorMessage.value = " Sum1 va Sum2 ma'lumotlarini olishda xatolik!";
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

// Reactive properties for the calendar
const isCompletionDateModalOpen = ref(false); // To track if the completion date modal is open
const selectedCompletionDate = ref(null); // Date obyekti sifatida saqlaymiz
const formatDateToDMY = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("-"); // Split YYYY-MM-DD
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`; // Return DD.MM.YYYY
};

// Helper methods for calendar logic
const getMonthName = (monthIndex) => {
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Yoyabr", "Dekabr"
  ];
  return months[monthIndex];
};

const isToday = (date) => {
  const today = new Date();
  const selectedDate = new Date(Date.UTC(currentYear.value, currentMonth.value, date));
  return (
    selectedDate.getUTCFullYear() === today.getUTCFullYear() &&
    selectedDate.getUTCMonth() === today.getUTCMonth() &&
    selectedDate.getUTCDate() === today.getUTCDate()
  );
};
const today = new Date();
today.setHours(0, 0, 0, 0);

const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const days = computed(() => {
  const daysArray = [];
  const firstDayOfMonth = new Date(Date.UTC(currentYear.value, currentMonth.value, 1)).getDay();
  const daysInMonth = new Date(Date.UTC(currentYear.value, currentMonth.value + 1, 0)).getDate();

  // Fill empty slots
  for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
    daysArray.push({ day: null, isSelectable: false });
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(currentYear.value, currentMonth.value, day));
    let isSelectable = true;

    // Restrict past dates
    if (date < today) {
      isSelectable = false;
    }

    if (
      currentYear.value === today.getFullYear() &&
      currentMonth.value === today.getMonth()
    ) {
      isSelectable = day >= today.getDate();
    }

    daysArray.push({ day, isSelectable });
  }

  return daysArray;
});

const selectDate = (day) => {
  if (!day || !days.value.find(d => d.day === day && d.isSelectable)) {
    return;
  }
  const selectedDate = new Date(Date.UTC(currentYear.value, currentMonth.value, day));
  console.log('Selected Date:', selectedDate, selectedDate.toISOString());
  selectedCompletionDate.value = selectedDate.toISOString().split('T')[0];
};

const isSelected = (date) => {
  if (!selectedCompletionDate.value) return false;
  const selectedDate = new Date(selectedCompletionDate.value + 'T00:00:00Z');
  const calendarDate = new Date(Date.UTC(currentYear.value, currentMonth.value, date));
  console.log('Comparing:', selectedDate, calendarDate);
  return (
    selectedDate.getUTCFullYear() === calendarDate.getUTCFullYear() &&
    selectedDate.getUTCMonth() === calendarDate.getUTCMonth() &&
    selectedDate.getUTCDate() === calendarDate.getUTCDate()
  );
};

// Calendar navigatsiya
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth()) {
    return; // Hozirgi oydandan oldinga o'tishni cheklash
  }
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// Methods for calendar navigation and actions
const saveSelectedDate = () => {
  if (!selectedCompletionDate.value) {
    errorMessage.value = " Iltimos, avval sana tanlang!";
    return;
  }
  // Perform any additional actions needed with the selected date
  console.log("Selected Completion Date:", selectedCompletionDate.value);

  // Close the modal
  isCompletionDateModalOpen.value = false;
};

const generateCheckFile = async () => {
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();
  img1.src = "/asd.jpg";
  img2.src = "/https___arizasud.uz_.png";
  img3.src = "/telegram.png";

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const receiptHTML = `
    <table style="border: 1px solid black; border-collapse: collapse;">
        <tr>
            <td rowspan="9" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${window.location.origin}/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">№${UniqueID || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Tolov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Kansating xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${totalsumma.value} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${qarz.value <= 0 ? "To'landi" : formatNumberWithDots(qarz.value) + " so'm"}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px">${formatNumberWithDots(paid.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${name.value} ${surname.value} ${dadname.value}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${paymentTuman.value} bosh ofis binosi</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(+paid.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const element = document.createElement('div');
  element.innerHTML = receiptHTML;

  const options = {
    margin: [0, 0, 0, 0],
    filename: `receipt-${formData.contractId || 'unknown'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const pdfBlob = await html2pdf()
    .from(element)
    .set(options)
    .outputPdf('blob');

  checkFile.value = new File([pdfBlob], `receipt-${formData.contractId || 'unknown'}.pdf`, { type: "application/pdf" });
};

function numberToUzbekWords(n) {
  const ones = [
    '',
    'bir',
    'ikki',
    'uch',
    "to'rt",
    'besh',
    'olti',
    'yetti',
    'sakkiz',
    "to'qqiz",
  ];
  const tens = [
    '',
    "o'n",
    'yigirma',
    "o'ttiz",
    'qirq',
    'ellik',
    'oltmish',
    'yetmish',
    'sakson',
    "to'qson",
  ];
  const hundreds = [
    '',
    'bir yuz',
    'ikki yuz',
    'uch yuz',
    "to'rt yuz",
    'besh yuz',
    'olti yuz',
    'yetti yuz',
    'sakkiz yuz',
    "to'qqiz yuz",
  ];

  if (typeof n !== 'number' || isNaN(n)) return "Noto'g'ri qiymat";
  if (n === 0) return 'nol';
  if (n < 0) return 'manfiy ' + numberToUzbekWords(-n);
  if (n > 999_999_999_999) return 'Milliardgacha son kiriting.';

  const getThreeDigitWords = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;

    let parts = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t > 0 || o > 0) parts.push(tens[t] + (o > 0 ? ' ' + ones[o] : ''));
    return parts.join(' ').trim();
  };

  let result = '';

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;

  if (billions > 0) result += getThreeDigitWords(billions) + ' milliard ';
  if (millions > 0) result += getThreeDigitWords(millions) + ' million ';
  if (thousands > 0) result += getThreeDigitWords(thousands) + ' ming ';
  if (rest > 0) result += getThreeDigitWords(rest);

  return result.trim();
}
const printReceipt = () => {
  // If region selection is pending, do not proceed until modal is closed
  if (pendingPrint.value) return;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const images = [
    { src: `${window.location.origin}/telegram-cloud.jpg`, key: 'telegram-cloud' },
    { src: `${window.location.origin}/https___arizasud.uz_.png`, key: 'arizasud' },
    { src: `${window.location.origin}/telegram.png`, key: 'telegram' },
  ];
  const receiptHTML = `
    <table style="border: 1px solid black; border-collapse: collapse;">
        <tr>
            <td rowspan="9" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${window.location.origin}/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">№${UniqueID || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Tolov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Kansating xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${totalsumma.value} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${qarz.value <= 0 ? "To'landi" : formatNumberWithDots(qarz.value) + " so'm"}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px">${formatNumberWithDots(paid.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${name.value} ${surname.value} ${dadname.value}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${paymentTuman.value} bosh ofis binosi</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(+paid.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center; color: black; border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center; color: black; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
        </tr>
    </table>
    `;

  const originalContent = document.body.innerHTML;
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      @page { margin: 2px; }
      body { margin: 0; }
    }
    `;
  document.head.appendChild(style);

  let loadedImages = 0;
  const totalImages = images.length;

  const checkAllImagesLoaded = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      document.body.innerHTML = receiptHTML;
      window.print();
      document.body.innerHTML = originalContent;
      document.head.removeChild(style);
      window.location.reload();
    }
  };

  images.forEach((image) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      console.log(`${image.key} loaded successfully`);
      checkAllImagesLoaded();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${image.key}`);
      checkAllImagesLoaded();
    };
  });
};
const submitForm = async () => {
  if (!formData.file) {
    errorMessage.value = " Fayl generatsiya qilinmagan! Avval saqlash va generatsiya qiling!";
    return;
  }
  if (!formData.image || !formData.documentImage) {
    errorMessage.value = " Ikkala surat olish shart! Avval chap va ong tamondan suratlarini oling!";
    return;
  }
  if (!formData.image || !formData.documentImage) {
    errorMessage.value = " Avval Videoga olishingiz shart oling!";
    return;
  }
  if (!checkFile.value) {
    errorMessage.value = " Chek fayli generatsiya qilinmagan!";
    return;
  }
  if (!checkFile.value) {
    errorMessage.value = " Ong qol barmoq izi skaynerlanagan!";
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
  formDataToSend.append("image1", formData.image);
  formDataToSend.append("image2", formData.documentImage);
  formDataToSend.append("check", checkFile.value);
  formDataToSend.append("fingerImage1", formData.fingerImage);
  formDataToSend.append("fingerImage2", formData.fingerImage1);
  formDataToSend.append("video", formData.video);
  formDataToSend.append("login", generatedLogin.value);
  formDataToSend.append("lawyerId", +yuristId.value || 0);
  formDataToSend.append("adminId", +adminId.value || 0);
  formDataToSend.append("taskName", formData.adminName || "");
  formDataToSend.append("password", generatedPassword.value);
  formDataToSend.append("endDate", selectedCompletionDate.value || "");
  formDataToSend.append("bio_id", bio.value);
  console.log(bio.value);

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(API_URL1, formDataToSend, config);
    clientId.value = response.data.client.id;
    errorMessage.value = "✅ Muvaffaqiyatli saqlandi!";
    resetForm();

    if (paid.value > 0) {
      pendingPrint.value = true;
      submitRegionSelection()
    } else {
      await router.push(`/Check/${clientId.value}`);
      window.location.reload();
    }
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error(" Xatolik detallari:", errorDetails);
    errorMessage.value = ` Xatolik: ${errorDetails.message || error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const formatNumberFields = (key, index) => {
  const lowerKey = key.toLowerCase();
  if (['konsalting xizmat ko’rsatish narxi', 'hujjatga tushuntirish berish narxi', 'buyurtmachini boshlang’ich to’lovi (avans)'].some(k => lowerKey.includes(k))) {
    const rawValue = String(fieldValues.value[index] || "").replace(/[^\d]/g, "");
    fieldValues.value[index] = rawValue ? formatNumberWithDots(rawValue) : "";
  }
};

const getInputType = (key) => {
  const lowerKey = key.toLowerCase();
  if (['konsalting xizmat ko’rsatish narxi', 'hujjatga tushuntirish berish narxi', 'buyurtmachini boshlang’ich to’lovi (avans)'].some(k => lowerKey.includes(k))) {
    return 'text';
  }
  if (lowerKey.includes('tug’ilgan sanasi')) {
    return 'date';
  }
  if (key === "Fuqaroning JSHSHIR raqami") {
    return 'number'; // Use number type for JSHSHIR
  }
  return 'text';
};

const getMaxLength = (key) => {
  if (key.trim() === "Fuqaroning JSHSHIR raqami") return 14;
  if (key.trim() === "Fuqaroning telefon raqami ") return 19;
  if (key.trim() === "Fuqaroning qo’shimcha telefon raqami") return 19;
  if (key.trim() === "Fuqaroning ID karta raqami") return 9;
  if (key.trim() === "STIR") return 9;
  return undefined;
};

const restrictToNumbers = (key, index) => {
  if (key === "Fuqaroning ID karta raqami") {
    fieldValues.value[index] = fieldValues.value[index]
      .replace(/[^a-zA-Z0-9]/g, "") // Faqat lotin harflari va raqamlarni saqlash
      .toUpperCase(); // Katta harflarga o'zgartirish
    if (fieldValues.value[index].length > 9) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 9);
    }
  }
  if (key === "Fuqaroning ID karta raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^a-zA-Z0-9]/g, "");
    if (fieldValues.value[index].length > 9) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 9);
    }
  }
  if (key === "STIR") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^0-9]/g, "");
    if (fieldValues.value[index].length > 9) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 9);
    }
  }
};

const preventCyrillic = (key, index) => {
  if (key === "Fuqaroning ID karta raqami") {
    fieldValues.value[index] = fieldValues.value[index]
      .replace(/[а-яА-ЯёЁ]/g, "") // Kirill harflarini olib tashlash
      .toUpperCase(); // Barcha harflarni katta harfga o'zgartirish
  }
};

const addPhonePrefix = (key, index) => {
  if (["Fuqaroning telefon raqami ", "Fuqaroning qo’shimcha telefon raqami"].includes(key) && !fieldValues.value[index].startsWith("+998")) {
    fieldValues.value[index] = "+998 ";
  }
};

const formatPhoneNumber = (key, index) => {
  if (["Fuqaroning telefon raqami ", "Fuqaroning qo’shimcha telefon raqami"].includes(key)) {
    let rawNumber = fieldValues.value[index].replace(/[^\d]/g, "");
    if (rawNumber.length >= 3) {
      const formatted = `+998 ${rawNumber.slice(3, 5)} ${rawNumber.slice(5, 8)} ${rawNumber.slice(8, 10)} ${rawNumber.slice(10, 12)}`.trim();
      fieldValues.value[index] = formatted;
    }
  }
};
const formattedCompletionDate = computed(() => {
  return formatDateToDMY(selectedCompletionDate.value);
});
// Determine if a field should be shown
const shouldShowField = (key) => {
  const personalFields = ['Ism', 'Familya', 'Otasining ismi'];
  const yuridikFields = ['Korxona rahbarini F.I.SH.', 'STIR', 'Tashkilot nomi'];
  if (personalFields.includes(key)) {
    return fieldValues.value[buyurtmachiIndex.value] === 'Jismoniy';
  }
  if (yuridikFields.includes(key)) {
    return fieldValues.value[buyurtmachiIndex.value] === 'Yuridik';
  }
  return true;
};

watch(
  () => fields.value.length,
  async (newLength) => {
    if (newLength > 0) {
      await nextTick();
    }
  }
);
watch(
  () => fieldValues.value,
  (newValues) => {
    newValues.forEach((value, index) => {
      if (value && errors.value[index]) {
        errors.value[index] = "";
      }
    });
  },
  { deep: true }
);
watch(
  () => uniqueFields.value,
  () => {
    buyurtmachiIndex.value = uniqueFields.value.findIndex(field => field.key === 'Buyurtmachi');
  },
  { immediate: true }
);
watch(
  () => selectedYurist.value,
  async (newYuristId) => {
    if (newYuristId) {
      const selected = yurists.value.find((y) => y.id === newYuristId);
      if (selected) {
        yuristId.value = selected.id
        yuristName.value = selected.name
        yuristSurname.value = selected.surname
        selectedYuristDetails.value = selected;
      }
    } else {
      selectedYuristDetails.value = null; // Clear the selected yurist's details
    }
  }
);
watch(
  () => fieldValues.value[buyurtmachiIndex.value],
  (newValue, oldValue) => {
    // Only proceed if buyurtmachiIndex is valid and the value has changed
    if (buyurtmachiIndex.value === null || buyurtmachiIndex.value === -1 || newValue === oldValue) {
      return;
    }

    // Define fields to clear based on Buyurtmachi type
    const fieldsToClear = {
      Yuridik: ['Ism', 'Familya', 'Otasining ismi'],
      Jismoniy: ['Korxona rahbarini F.I.SH.', 'STIR'],
    };

    // Get the fields to clear based on the new value
    const fields = fieldsToClear[newValue];

    // If the new value is invalid, don't clear anything
    if (!fields) {
      return;
    }

    // Clear the relevant fields
    uniqueFields.value.forEach((field, index) => {
      if (fields.includes(field.key)) {
        fieldValues.value[index] = '';
        errors.value[index] = '';
      }
    });
  },
  { immediate: true } // Run immediately to handle initial state
);

onMounted(() => {
  fetchDocx();
  fetchRecords();
  getYurist();
  getAdmin();
  regions.value = regionsData;
  regions.value.sort((a, b) =>
    dat === 'datakril'
      ? a.name_ru.localeCompare(b.name_ru)
      : a.name_uz.localeCompare(b.name_uz)
  );
});

onUnmounted(() => {
  stopWebcam();
  clearInterval(countdownInterval.value); // Interval tozalash
});
</script>

<style scoped>
.container {
  max-width: 800px;
  position: relative;
}

.btn {
  padding: 8px 16px;
  border: none;
  margin: 2px;
  width: 180px;
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

.video-modal-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 700px;
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

.buyurtmachi-option {
  flex: 1;
  padding: 16px 16px;
  border-radius: 10px;
  color: black;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.buyurtmachi-selected {
  background-color: #65a30d;
  color: rgb(57, 57, 57);
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

.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  color: black;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.day.disabled {
  color: #ccc;
  /* Bo'yash rangini o'zgartirish */
  background: #3a3a3a;
  pointer-events: none;
  /* Bosib bo'lmaydigan qilish */
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  color: black;
  width: 90%;
  max-width: 400px;
}

.calendar {
  background: #f9f9f9;
  border-radius: 8px;
  color: black;
  overflow: hidden;
  max-width: 350px;
  /* Qo'shildi */
  margin: 0 auto;
  /* Qo'shildi */
}

.input-error {
  border-color: #dc3545 !important;
}

.select-error {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.header {
  color: black;
  font-size: 18px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  color: black;
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  color: black;
  padding: 8px;
  font-size: 14px;
  margin: auto;
  /* Qo'shildi */
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  color: black;
  gap: 4px;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: black;
  margin: auto;
  cursor: pointer;
  transition: background-color 0.2s;
}

.day:hover {
  background-color: #e0e0e0;
}

.day.selected {
  background-color: #007bff !important;
  color: white;
}

.today {
  background: #ff6b6b;
  color: white;
}

.modal-content input[type="text"] {
  width: 100%;
  padding: 8px;
  color: black;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f9f9f9;
  cursor: not-allowed;
  /* Make it read-only */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
<style>
@media print {
  @page {
    size: 80mm auto;
    padding-top: 5px;
    padding-right: 5px;
    padding-left: 170px;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px !important;
    text-align: left;
    line-height: 1.2 !important;
    white-space: pre-wrap !important;
    box-sizing: border-box;
  }

  h2 {
    text-align: center;
    font-size: 12px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 0 !important;
    vertical-align: top;
  }

  th {
    text-align: center;
  }

  .hidden,
  [hidden] {
    display: none !important;
  }

  * {
    box-sizing: border-box !important;
  }
}
</style>