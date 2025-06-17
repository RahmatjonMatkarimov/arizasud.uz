```vue
<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen pt-16 font-roboto antialiased transition-colors duration-300 overflow-visible">
    <!-- Subtle Background Gradient -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,130,246,0.05)_0%,transparent_50%)] dark:bg-[linear-gradient(180deg,rgba(79,70,229,0.05)_0%,transparent_50%)]"></div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-[9999] backdrop-blur-sm">
      <div class="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin bg-gradient-to-r from-blue-500 to-teal-400 dark:from-indigo-500 dark:to-purple-400 shadow-sm"></div>
      <p class="mt-4 text-gray-50 text-sm font-medium tracking-tight animate-pulse">{{ loadingMessage }}</p>
    </div>

    <!-- Main Container -->
    <div class="container max-w-lg mx-auto px-6 py-12 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-sm border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm">
      <div v-if="fields.length && !isLoading" class="space-y-8">
        <!-- Form Fields -->
        <div v-for="(field, index) in uniqueFields" :key="index" class="space-y-3">
          <!-- Address Field for Jismoniy -->
          <div v-if="field.key === 'Mahalla nomi ko’cha nomi uy raqamini yozing' && fieldValues[buyurtmachiIndex] === 'Jismoniy'">
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
                {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
              </label>
              <select v-model="contractRegion.regionId" class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm" @change="fetchDistricts('contract')" aria-label="Select region">
                <option value="" disabled selected class="text-gray-500 dark:text-gray-400">
                  {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
                </option>
                <option v-for="region in regions" :key="region.id" :value="region.id" class="text-gray-900 dark:text-gray-200">
                  {{ dat === 'datakril' ? region.name_oz : region.name_uz }}
                </option>
              </select>

              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase mt-3">
                {{ dat === 'datakril' ? translateText('Tuman/shahar') : 'Tuman/shahar' }}
              </label>
              <select v-model="contractRegion.districtId" class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm" :disabled="!contractRegion.regionId" aria-label="Select district">
                <option value="" disabled selected class="text-gray-500 dark:text-gray-400">
                  {{ dat === 'datakril' ? translateText('Tuman/shahar') : 'Tuman/shahar' }}
                </option>
                <option v-for="district in contractDistricts" :key="district.id" :value="district.id" class="text-gray-900 dark:text-gray-200">
                  {{ dat === 'datakril' ? district.name_oz : district.name_uz }}
                </option>
              </select>

              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase mt-3">
                {{ dat === 'datakril' ? translateText(field.key) : field.key }}
              </label>
              <input v-model="fieldValues[index]" type="text" maxlength="80"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                aria-label="Enter address">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </div>
          </div>

          <!-- Address Field for Yuridik -->
          <div v-if="field.key === 'Mahalla nomi ko’cha nomi uy raqamini yozing' && fieldValues[buyurtmachiIndex] === 'Yuridik'">
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
                {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
              </label>
              <select v-model="contractRegion.regionId" class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm" @change="fetchDistricts('contract')" aria-label="Select region">
                <option value="" disabled selected class="text-gray-500 dark:text-gray-400">
                  {{ dat === 'datakril' ? translateText('Viloyatni tanlang') : 'Viloyatni tanlang' }}
                </option>
                <option v-for="region in regions" :key="region.id" :value="region.id" class="text-gray-900 dark:text-gray-200">
                  {{ dat === 'datakril' ? region.name_oz : region.name_uz }}
                </option>
              </select>

              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase mt-3">
                {{ dat === 'datakril' ? translateText('Tuman/shahar') : 'Tuman/shahar' }}
              </label>
              <select v-model="contractRegion.districtId" class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm" :disabled="!contractRegion.regionId" aria-label="Select district">
                <option value="" disabled selected class="text-gray-500 dark:text-gray-400">
                  {{ dat === 'datakril' ? translateText('Tuman/shahar') : 'Tuman/shahar' }}
                </option>
                <option v-for="district in contractDistricts" :key="district.id" :value="district.id" class="text-gray-900 dark:text-gray-200">
                  {{ dat === 'datakril' ? district.name_oz : district.name_uz }}
                </option>
              </select>

              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase mt-3">
                {{ dat === 'datakril' ? translateText('Tashkilot manzili') : 'Tashkilot manzili' }}
              </label>
              <input v-model="fieldValues[index]" type="text" maxlength="80"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                aria-label="Enter organization address">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </div>
          </div>

          <!-- Conditional Fields -->
          <template v-if="shouldShowField(field.key)">
            <label v-if="!['adminName', 'adminSurname', 'documentId', 'login', 'parol', 'fingerImage1', 'fingerImage2', 'image1', 'image2', 'qrcode1', 'qrcode3', 'qrcode2', 'ofis', 'STIR', 'Korxona rahbarini F.I.Sh.:', 'Mahalla nomi ko‘cha nomi uy raqamini yozing', 'Buyurtmachi', 'yuristName', 'yuristSurname', 'Tashkilot nomini kiriting'].includes(field.key)" class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
              {{ dat === 'datakril' ? translateText(fieldValues[buyurtmachiIndex] === 'Yuridik' && ['Fuqaroning ID karta raqami', 'Fuqaroning JSHSHIR raqami', 'Fuqaroning qo’shimcha telefon raqami', 'Fuqaroning telefon raqami'].includes(field.key) ? field.key.replace('Fuqaroning', '') : field.key) : (fieldValues[buyurtmachiIndex] === 'Yuridik' && ['Fuqaroning ID karta raqami', 'Fuqaroning JSHSHIR raqami', 'Fuqaroning qo’shimcha telefon raqami', 'Fuqaroning telefon raqami'].includes(field.key) ? field.key.replace('Fuqaroning', '') : field.key) }}
            </label>

            <!-- Buyurtmachi Selection -->
            <template v-if="field.key === 'Buyurtmachi'">
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col items-center gap-2 p-4 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-sm" :class="{ 'border-blue-500 dark:border-blue-600 bg-blue-50/95 dark:bg-blue-900/95': fieldValues[index] === 'Jismoniy' }" @click="selectBuyurtmachi(index, 'Jismoniy')" aria-label="Select Jismoniy">
                  <img src="/userr.png" class="w-12 h-12 object-cover rounded-full border-2 border-gray-200/20 dark:border-gray-600/50" alt="Jismoniy">
                  <span class="text-gray-900 dark:text-gray-200 text-sm font-semibold tracking-tight uppercase">{{ dat === 'datakril' ? translateText('Jismoniy') : 'Jismoniy' }}</span>
                </div>
                <div class="flex flex-col items-center gap-2 p-4 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-sm" :class="{ 'border-blue-500 dark:border-blue-600 bg-blue-50/95 dark:bg-blue-900/95': fieldValues[index] === 'Yuridik' }" @click="selectBuyurtmachi(index, 'Yuridik')" aria-label="Select Yuridik">
                  <img src="/bag.png" class="w-12 h-12 object-cover rounded-full border-2 border-gray-200/20 dark:border-gray-600/50" alt="Yuridik">
                  <span class="text-gray-900 dark:text-gray-200 text-sm font-semibold tracking-tight uppercase">{{ dat === 'datakril' ? translateText('Yuridik') : 'Yuridik' }}</span>
                </div>
              </div>
            </template>

            <!-- STIR Field -->
            <template v-else-if="field.key === 'STIR' && fieldValues[buyurtmachiIndex] === 'Yuridik'">
              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
                {{ dat === 'datakril' ? translateText(field.key) : field.key }}
              </label>
              <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                @input="restrictToNumbers(field.key, index)" aria-label="Enter STIR">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </template>

            <!-- Korxona rahbarini F.I.Sh Field -->
            <template v-else-if="field.key === 'Korxona rahbarini F.I.Sh.:' && fieldValues[buyurtmachiIndex] === 'Yuridik'">
              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
                {{ dat === 'datakril' ? translateText(field.key) : field.key }}
              </label>
              <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                @input="validateFullName(field.key, index)" aria-label="Enter organization head name">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </template>

            <!-- Tashkilot nomini Field -->
            <template v-else-if="field.key === 'Tashkilot nomini kiriting' && fieldValues[buyurtmachiIndex] === 'Yuridik'">
              <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
                {{ dat === 'datakril' ? translateText(field.key) : field.key }}
              </label>
              <input v-model="fieldValues[index]" type="text" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                @input="validateFullName(field.key, index)" aria-label="Enter organization name">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </template>

            <!-- Other Input Fields -->
            <template v-else-if="!['adminName', 'adminSurname', 'documentId', 'fingerImage1', 'fingerImage2', 'image1', 'qrcode3', 'image2', 'qrcode1', 'qrcode2', 'Korxona rahbarini F.I.Sh.:', 'yuristName', 'yuristSurname', 'Mahalla nomi ko‘cha nomi uy raqamini yozing', 'Buyurtmachi', 'Tashkilot nomini kiriting', 'login', 'parol', 'ofis'].includes(field.key)">
              <input v-model="fieldValues[index]" :type="getInputType(field.key)" :maxlength="getMaxLength(field.key)"
                :placeholder="dat === 'datakril' ? translateText(field.key) : field.key" required
                class="w-full px-3 py-2 bg-white/95 dark:bg-gray-700/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm"
                :class="{ 'border-red-500': formSubmitted && !fieldValues[index] && shouldShowField(field.key) }"
                @input="['Fuqaroning telefon raqami', 'Fuqaroning qo’shimcha telefon raqami'].includes(field.key) ? formatPhoneNumber(field.key, index) : restrictToNumbers(field.key, index); formatNumberFields(field.key, index); preventCyrillic(field.key, index)"
                @focus="addPhonePrefix(field.key, index)" :aria-label="`Enter ${field.key}`">
              <p v-if="formSubmitted && !fieldValues[index] && shouldShowField(field.key)" class="text-red-400 text-xs mt-1 font-medium animate-pulse">
                {{ dat === 'datakril' ? translateText('Majburiy maydon!') : 'Majburiy maydon!' }}
              </p>
            </template>
          </template>
        </div>

        <!-- Yurist Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
            {{ dat === 'datakril' ? translateText('Yurist tanlang') : 'Yurist tanlang' }}
          </label>
          <div class="relative z-[1000]">
            <div class="w-full px-3 py-2 bg-white/95 dark:bg-gray-800/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 cursor-pointer flex justify-between items-center transition-all duration-200 shadow-sm" :class="{ 'border-blue-500 bg-blue-50/95 dark:bg-blue-900/95': isDropdownOpen }" @click.stop.prevent="toggleDropdown" @keydown.enter.stop.prevent="toggleDropdown" @keydown.space.stop.prevent="toggleDropdown" :aria-expanded="isDropdownOpen" tabindex="0" aria-label="Select yurist">
              <span class="text-sm font-medium">{{ selectedYuristName || (dat === 'datakril' ? translateText('Yurist tanlang') : 'Yurist tanlang') }}</span>
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <div v-if="isDropdownOpen" class="absolute top-[100%] left-0 w-full mt-1 bg-white/95 dark:bg-gray-800/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg shadow-sm z-[9999] p-2 backdrop-blur-sm max-h-[200px] overflow-auto">
              <div v-if="yurists.length > 0" class="space-y-1">
                <div v-for="yurist in yurists" :key="yurist.id" class="flex gap-2 p-2 items-center border border-gray-200/20 dark:border-gray-600/50 rounded-md cursor-pointer hover:bg-gray-100/95 dark:hover:bg-gray-700/95 transition-all duration-200" @click.stop="selectYurist(yurist)" :aria-label="`Select ${yurist.name}`">
                  <img :src="URL + '/upload/' + yurist.img" class="w-6 h-6 rounded-full object-cover border border-gray-200/20 dark:border-gray-600/50" alt="Yurist profile">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ dat === 'datakril' ? translateText(yurist.name) : yurist.name }}</span>
                </div>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 text-sm font-medium text-center py-2 bg-gray-100/95 dark:bg-gray-700/95 rounded-md">
                {{ dat === 'datakril' ? translateText('Yurist topilmadi') : 'Yurist topilmadi' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Tuman Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase">
            {{ dat === 'datakril' ? translateText('Filial tanlang') : 'Filial tanlang' }}
          </label>
          <select v-model="paymentT" class="w-full px-3 py-2 bg-white/95 dark:bg-gray-800/95 border-2 border-gray-200/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 focus:border-transparent transition-all duration-300 shadow-sm" required :aria-label="dat === 'datakril' ? translateText('Filial tanlang') : 'Filial tanlang'">
            <option value="" disabled selected class="text-gray-500 dark:text-gray-400">
              {{ dat === 'datakril' ? translateText('Filial tanlang') : 'Filial tanlang' }}
            </option>
            <option value="Xorazm viloyati Urganch shahar 1-son filiali" class="text-gray-900 dark:text-gray-200">
              {{ dat === 'datakril' ? translateText('Urganch 1-son filiali') : 'Urganch 1-son filiali' }}
            </option>
            <option value="Xorazm viloyati Xiva shahar markazi" class="text-gray-900 dark:text-gray-200">
              {{ dat === 'datakril' ? translateText('Xiva markazi') : 'Xiva markazi' }}
            </option>
          </select>
        </div>

        <!-- Upload Button -->
        <div class="flex justify-center mt-6">
          <button @click.prevent.stop="openActionModal" class="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 transition-all duration-300 shadow-sm font-semibold tracking-tight uppercase animate-pulse" aria-label="Open action modal">
            {{ dat === 'datakril' ? translateText('Yuklash') : 'Yuklash' }}
          </button>
        </div>

        <!-- Action Modal -->
        <div v-if="isActionModalOpen" class="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-[9999] backdrop-blur-sm" @click.self="closeActionModal">
          <div class="bg-white/95 dark:bg-gray-800/95 rounded-lg p-4 shadow-sm w-full max-w-sm border-2 border-blue-500 dark:border-blue-600 backdrop-blur-sm">
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-200 tracking-tight uppercase mb-4">
              {{ dat === 'datakril' ? translateText('Amallar') : 'Amallar' }}
            </h2>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button @click="openCameraModal('profile')" class="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Capture right side photo">
                {{ dat === 'datakril' ? translateText('O‘ng taraf') : 'O‘ng taraf' }}
              </button>
              <button @click="openCameraModal('document')" class="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Capture left side photo">
                {{ dat === 'datakril' ? translateText('Chap taraf') : 'Chap taraf' }}
              </button>
              <button @click="openVideoModal" class="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Record video">
                {{ dat === 'datakril' ? translateText('Video') : 'Video' }}
              </button>
              <button @click="fingerSearch = !fingerSearch" class="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Scan fingerprint">
                {{ dat === 'datakril' ? translateText('Barmoq izi') : 'Barmoq izi' }}
              </button>
            </div>
            <div class="flex justify-center gap-3">
              <button @click="saveAndGenerate" class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 hover:scale-105 focus:ring-2 focus:ring-green-400/30 dark:focus:ring-green-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Upload">
                {{ dat === 'datakril' ? translateText('Yuklash') : 'Yuklash' }}
              </button>
              <button @click="closeActionModal" class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 hover:scale-105 focus:ring-2 focus:ring-gray-400/30 dark:focus:ring-gray-500/20 transition-all duration-200 text-sm font-medium tracking-tight uppercase" aria-label="Close modal">
                {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pulse animation for buttons */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.95; }
}
.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

/* Ensure containers don't interfere */
.bg-gray-100, .container {
  position: static;
  overflow: visible;
}

/* Modal visibility */
.fixed.inset-0 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```
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
const route = useRoute();
const router = useRouter();
let UniqueID = null;
let ClientData = '';
const id = route.params.id;
const isActionModalOpen = ref(false)
function openActionModal() {
  isActionModalOpen.value = true
}
function closeActionModal() {
  isActionModalOpen.value = false
}
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
var paid = ref(0);
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
const paymentSum = ref(null)
const adminId = ref(0);
const regionFormData = ref({
  regionId: '',
  districtId: ''
});
const selectedRegionForPrint = ref({ regionName: '', districtName: '' });
const buyurtmachiIndex = ref(null);
const clientId = ref(null);
const isVideoModalOpen = ref(false);
const recordingVideo = ref(null);
const recordedVideoBlob = ref(null);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);
const uniqueCode = ref('')
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
    const response = await axios.get("http://localhost:2181");
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
  }
};

const finger1 = async () => {
  isLoading.value = true;
  loadingMessage.value = 'Iltimos, barmogʻingizni qurilmaga qoʻying. Barmoq izi olinmoqda...';
  try {
    const response = await axios.get("http://localhost:2181");
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
    if (!paymentTuman.value) {
      errorMessage.value = "Iltimos YKK filialini belgilang!";
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
          isWarningModalOpen.value = true;
return
        }
        formData.surname = fullName[0] || "";
        formData.name = fullName[1] || "";
        formData.dadname = `${fullName[2]} ${fullName[3]}` || "";
        surname.value = fullName[0] || "";
        name.value = fullName[1] || "";
        dadname.value = `${fullName[2]} ${fullName[3]}` || "";
        data["Familya"] = 'Raxbar: ' + fullName[0] || "";
        data["Ism"] = fullName[1] || "";
        data["Otasining ismi"] = `${fullName[2]} ${fullName[3]}` || "";
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
        uniqueCode.value = fieldValues.value[index] || "";
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
        paymentSum.value = fieldValues.value[index]
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

    const loginSearch = async () => {
      try {
        const res = await axios.get(`${URL}/client/uniqueCode/${uniqueCode.value}`);

        generatedLogin.value = res.data.login;
        generatedPassword.value = res.data.adressID;
      } catch (error) {
        console.error("So‘rovda xatolik yuz berdi:", error);
        generatedLogin.value = `${formData.name}${generateRandomName()}`
        generatedPassword.value = `${generateRandomName()}${formData.name}`
      }
    };
    await loginSearch();

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
    data["parol"] = generatedPassword.value;
    data["login"] = generatedLogin.value;
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
  selectedCompletionDate.value = selectedDate.toISOString().split('T')[0];
};

const isSelected = (date) => {
  if (!selectedCompletionDate.value) return false;
  const selectedDate = new Date(selectedCompletionDate.value + 'T00:00:00Z');
  const calendarDate = new Date(Date.UTC(currentYear.value, currentMonth.value, date));
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
       <table style="border: 1px solid black; height:80px; width:100%; border-collapse: collapse;">
        <tr>
            <td rowspan="8" style="text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px; vertical-align: middle;">Markaziy korxona manzili</td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px; vertical-align: middle;">Xorazm viloyati, Xiva shaxar, <br> Yangi-hayot mahallasi, Sportchilar ko'chasi 14-uy</td>
            <td rowspan="5" style="width: 70px; text-align: center; color: black; border: 1px solid black;"><img width="100%" src="${window.location.origin}/https___arizasud.uz_.png" alt=""></td>
        </tr>
        <tr>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">Shartnoma raqami</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">№${UniqueID || 'Mavjud emas'}</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;font-size:12px; padding-bottom: 12px;">Joriy to'lov</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px;font-size:12px; padding-bottom: 12px;">${formatNumberWithDots(paid.value)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">Qoldiq qarzdorlik</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">${qarz.value <= 0 ? "To'landi" : formatNumberWithDots(qarz.value) + " so'm"}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">Joriy to'lov qilingan sana</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">${formattedDate}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">To'lovchining F.I.O.:</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">${name.value} ${surname.value} ${dadname.value}</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">${paymentTuman.value}</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">STIR 307675491      MFO: 01037</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">To'lovni qabul qiluvchi korxona</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">"YURIST KONSUL KONSALTING" X/k</td>
        </tr>
        <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;font-size:12px; padding-bottom: 12px;">TO'LOV SUMMASI SO"Z BILAN</td>
            <td colspan="3" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; text-transform: uppercase; border: 1px solid black;">${numberToUzbekWords(+paid.value)} so'm</td>
        </tr>
        <tr>
            <td style="width: 110px; text-align: center; color: black; font-size:12px; padding-bottom: 12px;border: 1px solid black;">Texnik yordam: +998 62 226 99 00</td>
            <td colspan="3" style="width: 110px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; border: 1px solid black;">ushbu to'lov ARIZASUD.UZ tizimi orqali amalga oshirilgan</td>
        </tr>
        <tr>
            <td colspan="4" style="width: 100px; text-align: center; color: black;font-size:12px; padding-bottom: 12px; text-transform: uppercase; border: 1px solid black;">To'lov pattasi faqatgina kassa muhri bilan tasdiqlangandan so'ng haqiqiy hisoblanadi. Agar pattada muhr bo'lmasa, u rasmiy kuchga ega emas va yaroqsiz deb topiladi. Shu sababli, har qanday to'lov hujjatining muhrlanganligiga e'tibor berish lozim.</td>
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
// If region selection is pending, do not proceed until modal is closed
const printReceipt = async () => {

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
            <td rowspan="8" text-align: center; color: black; border: 1px solid black;"><img width="150px" src="${window.location.origin}/telegram-cloud.jpg" alt=""></td>
            <td rowspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black; vertical-align: middle;">Markaziy korxona manzili</td>
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
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">To'lov maqsadi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Konsalting xizmat</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Shartnomani umumiy bahosi</td>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${formatNumberWithDots(totalsumma.value)} so'm</td>
        </tr>
        <tr>
          <td style="width: 100px; text-align: center; color: black; border: 1px solid black; height:15px;">Joriy to'lov</td>
          <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;height:15px">${formatNumberWithDots(paid.value)} so'm</td>
        </tr>
         <tr>
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">Qoldiq qarzdorlik</td>
            <td colspan="2" style="width: 100px; text-align: center; color: black; border: 1px solid black;">${qarz.value <= 0 ? "To'landi" : formatNumberWithDots(qarz.value) + " so'm"}</td>
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
            <td style="width: 100px; text-align: center; color: black; border: 1px solid black;">${paymentTuman.value}</td>
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
  await router.push(`/Check/${clientId.value}`);

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
      checkAllImagesLoaded();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${image.key}`);
      checkAllImagesLoaded();
    };
  });
  await router.push(`/Check/${clientId.value}`);
};

const handlePayment = async () => {
  try {
    const paidAmount = parseFloat(removeDots(paymentSum.value)) || 0;
    if (paidAmount !== 0) {
      await printReceipt(); // printReceipt async bo'lishi kerak
    }

  } catch (error) {
    console.error("To'lov qismida xato:", error);
    alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  }
};


const submitForm = async () => {
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

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(API_URL1, formDataToSend, config);
    clientId.value = response.data.client.id;
    await handlePayment()

    errorMessage.value = "✅ Muvaffaqiyatli saqlandi!";
    resetForm();
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error(" Xatolik detallari:", errorDetails);
    errorMessage.value = ` Xatolik: ${errorDetails.message || error.message}`;
  } finally {
    await router.push(`/Check/${clientId.value}`);
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
  if (key === "Fuqaroning JSHSHIR raqami") {
    fieldValues.value[index] = fieldValues.value[index].replace(/[^0-9]/g, "");
    if (fieldValues.value[index].length > 14) {
      fieldValues.value[index] = fieldValues.value[index].slice(0, 14);
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
  background: #700000;
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