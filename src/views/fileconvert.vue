<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
    <!-- Header Section -->
    <header class="text-center mb-12">
      <div class="bg-black/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30 shadow-2xl">
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
          <Icon icon="mdi:file-document" class="text-5xl text-white drop-shadow-lg" />
          {{ dat === 'datakril' ? translateText('File Editor & QR Generator'):`File Editor & QR Generator` }}
        </h1>
        <p class="text-lg text-white/90 dark:text-gray-300 font-light">{{ dat === 'datakril' ? translateText(`DOCX ↔ PDF konvertatsiya va QR kod generatsiya`):`DOCX ↔ PDF konvertatsiya va QR kod generatsiya` }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- File Conversion Card -->
      <div class="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            <Icon icon="mdi:swap-horizontal" class="text-white" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(`Fayl Konvertatsiya`):`Fayl Konvertatsiya` }}</h2>
        </div>

        <div class="space-y-6">
          <!-- File Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ dat === 'datakril' ? translateText(`Faylni tanlang:`):`Faylni tanlang:` }}
            </label>
            <div 
              class="relative group cursor-pointer"
              :class="{ 'ring-2 ring-blue-500 dark:ring-blue-400': selectedFile }"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInputRef"
                type="file" 
                @change="handleFileSelect"
                accept=".pdf,.docx"
                class="hidden"
              >
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gray-50 dark:bg-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
                <div v-if="!selectedFile" class="flex flex-col items-center space-y-3">
                  <Icon icon="mdi:file-document" class="text-4xl text-gray-600 dark:text-gray-400 opacity-60" />
                  <span class="text-gray-600 dark:text-gray-400 font-medium">{{ dat === 'datakril' ? translateText(`Faylni tanlash uchun bosing`): `Faylni tanlash uchun bosing` }}</span>
                </div>
                <div v-else class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <Icon icon="mdi:file-document" class="text-2xl text-gray-800 dark:text-white" />
                    <span class="font-medium text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(selectedFile.name):selectedFile.name }}</span>
                  </div>
                  <button 
                    @click.stop="clearFile" 
                    class="w-8 h-8 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors flex items-center justify-center"
                  >
                    <Icon icon="mdi:close-circle" class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Type -->

<!-- Conversion Type - Updated section with three buttons -->
<div class="flex flex-col sm:flex-row gap-4">
  <button 
    @click="convertFile" 
    :disabled="!selectedFile || isConverting"
    class="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
  >
    <Icon v-if="isConverting" icon="mdi:loading" class="w-5 h-5 animate-spin text-white" />
    {{ isConverting ? dat === 'datakril'?translateText('Konvertatsiya qilinmoqda...'):'Konvertatsiya qilinmoqda...' : dat === 'datakril' ? translateText(`Konvertatsiya qilish`):`Konvertatsiya qilish` }}
  </button>
  
  <!-- New additional button -->
  <button 
    @click="uploadFile" 
    :disabled="!selectedFile || isUploading"
    class="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
  >
    <Icon v-if="isUploading" icon="mdi:loading" class="w-5 h-5 animate-spin text-white" />
    <Icon v-else icon="mdi:cloud-upload" class="w-5 h-5 text-white" />
    {{ isUploading ? dat === 'datakril'?translateText('Yuborilmoqda...'):'Yuborilmoqda...' : dat === 'datakril' ? translateText(`QR kodli PDF tayyorlash`):`QR kodli PDF tayyorlash` }}
  </button>
</div>

<!-- Upload Result Message -->
<div v-if="uploadMessage" class="p-4 rounded-xl border-l-4 flex items-center gap-3 mt-4"
     :class="uploadStatus === 'success' 
       ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' 
       : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'"
>
  <Icon :icon="uploadStatus === 'success' ? 'mdi:check-circle' : 'mdi:close-circle'" class="text-xl" />
  <p class="font-medium text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(uploadMessage):uploadMessage }}</p>
</div>
          <!-- Conversion Result -->
          <div v-if="conversionMessage" class="p-4 rounded-xl border-l-4 flex items-center gap-3"
               :class="conversionStatus === 'success' 
                 ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' 
                 : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'"
          >
            <Icon :icon="conversionStatus === 'success' ? 'mdi:check-circle' : 'mdi:close-circle'" class="text-xl text-green-700 dark:text-green-400" />
            <p class="font-medium text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(conversionMessage):conversionMessage }}</p>
          </div>
        </div>
      </div>

      <!-- QR Code Generator Card -->
      <div class="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 dark:from-pink-600 dark:to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            <Icon icon="mdi:qrcode" class="text-white" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(`QR Kod Generatori`):`QR Kod Generatori` }}</h2>
        </div>

        <div class="space-y-6">
          <!-- URL Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ dat === 'datakril' ? translateText(`URL manzil:`):`URL manzil:` }}
            </label>
            <input 
              v-model="qrUrl" 
              type="url" 
              class="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent text-gray-800 dark:text-white transition-all"
              placeholder="https://example.com"
              @input="debouncedGeneratePreview"
            >
          </div>

          <!-- Size Control -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ dat === 'datakril' ? translateText(`QR kod o'lchami:`):`QR kod o'lchami:` }}
            </label>
            <div class="flex items-center gap-4">
              <input 
                v-model="qrSize" 
                type="range" 
                min="100" 
                max="800" 
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                @input="debouncedGeneratePreview"
              >
              <span class="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 rounded-lg font-semibold min-w-[80px] text-center">
                {{ qrSize }}px
              </span>
            </div>
          </div>

          <!-- Margin Control -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ dat === 'datakril' ? translateText(`QR kod chegara o'lchami:`):`QR kod chegara o'lchami:` }}
            </label>
            <div class="flex items-center gap-4">
              <input 
                v-model="qrMargin" 
                type="range" 
                min="0" 
                max="10" 
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                @input="debouncedGeneratePreview"
              >
              <span class="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 rounded-lg font-semibold min-w-[60px] text-center">
                {{ qrMargin }}
              </span>
            </div>
          </div>

          <!-- Color Controls -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {{ dat === 'datakril' ? translateText(`QR kod ranglari:`):`QR kod ranglari:` }}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <input 
                  v-model="qrDarkColor" 
                  type="color" 
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  @input="debouncedGeneratePreview"
                >
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ dat === 'datakril' ? translateText(`Qora rang`) :`Qora rang` }}</span>
              </div>
              <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <input 
                  v-model="qrLightColor" 
                  type="color" 
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  @input="debouncedGeneratePreview"
                >
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ dat ==='datakril' ? translateText(`Oq rang`):`Oq rang` }}</span>
              </div>
            </div>
          </div>

          <!-- QR Preview -->
          <div v-if="qrImageUrl || isGenerating" class="mt-8">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600">
              <div v-if="isGenerating" class="flex flex-col items-center gap-4">
                <Icon icon="mdi:loading" class="w-8 h-8 animate-spin text-pink-500 dark:text-pink-400" />
                <span class="text-gray-600 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`QR kod yaratilmoqda..`):`QR kod yaratilmoqda..` }}.</span>
              </div>
              <div v-else-if="qrImageUrl" class="space-y-4">
                <img 
                  :src="qrImageUrl" 
                  alt="QR Code Preview" 
                  class="max-w-full max-h-80 mx-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ dat === 'datakril' ? translateText(`Eslatma: Haqiqiy QR kod yuklashda generatsiya qilinadi`):`Eslatma: Haqiqiy QR kod yuklashda generatsiya qilinadi` }}</p>
                <button 
                  @click="downloadQRCode" 
                  class="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:download" class="text-lg text-white" />
                  {{ dat === 'datakril' ? translateText(`QR kodni yuklab olish`):`QR kodni yuklab olish` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- History Section -->
    <div class="max-w-7xl mx-auto mt-12">
      <div class="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              <Icon icon="mdi:history" class="text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ dat === 'datakril' ? translateText(`Qr-Code joylashtirilgan fayllar ro'yxati`):`Qr-Code joylashtirilgan fayllar ro'yxati` }}</h2>
          </div>
          <div v-if="activeTab === 'qr'" class="flex gap-4">
            <button 
              @click="toggleCheckboxVisibility"
              class="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:checkbox-marked-outline" class="text-lg text-white" />
              {{ showCheckboxes ? dat === 'datakril' ? translateText(`Yashirish`):`Yashirish` : dat === 'datakril' ? translateText(`Tanlab o'chirish`):`Tanlab o'chirish` }}
            </button>
            <button 
              @click="activeTab === 'qr' ? deleteSelectedQRCodes() : deleteSelectedOtherFiles()"
              :disabled="activeTab === 'qr' ? selectedQRCodes.length === 0 : selectedOtherFiles.length === 0"
              v-if="showCheckboxes"
              class="py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="mdi:delete" class="text-lg text-white" />
              {{ dat === 'datakril' ? translateText(`Tanlanganlarni o'chirish`):`Tanlanganlarni o'chirish` }}
            </button>
            <button 
              @click="activeTab === 'qr' ? deleteAllQRCodes() : deleteAllOtherFiles()"
              :disabled="activeTab === 'qr' ? qrCodes.length === 0 : otherFiles.length === 0"
              class="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="mdi:delete-forever" class="text-lg text-white" />
              {{ dat === 'datakril' ? translateText(`Barchasini o'chirish`):`Barchasini o'chirish` }}
            </button>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="flex gap-2 mb-6">
          <button 
            @click="activeTab = 'qr'"
            class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
            :class="activeTab === 'qr' 
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            <Icon icon="mdi:qrcode" class="text-lg" />
            {{ dat === 'datakril' ? translateText(`QR Kodlar`):`QR Kodlar` }}
            <span class="bg-white/20 dark:bg-gray-800/20 px-2 py-1 rounded-lg text-sm">{{ qrCodes.length }}</span>
          </button>
          <button 
            @click="activeTab = 'files'"
            class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
            :class="activeTab === 'files' 
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            <Icon icon="mdi:file-document" class="text-lg" />
            {{ dat === 'datakril' ? translateText(`Fayllar`):`Fayllar` }}
            <span class="bg-white/20 dark:bg-gray-800/20 px-2 py-1 rounded-lg text-sm">{{ otherFiles.length }}</span>
          </button>
        </div>
        <!-- QR Codes Tab Content -->
        <div v-if="activeTab === 'qr'">
          <div v-if="isLoadingQRCodes" class="flex justify-center items-center py-8">
            <Icon icon="mdi:loading" class="w-8 h-8 animate-spin text-teal-500 dark:text-teal-400" />
            <span class="ml-4 text-gray-600 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Yuklanmoqda...`):  `Yuklanmoqda...` }}</span>
          </div>
          <div v-else-if="qrCodes.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
            {{ dat === 'datakril' ? translateText(`Hozircha QR kodlar yo'q`):`Hozircha QR kodlar yo'q` }}
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="qr in qrCodes" :key="qr.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between mb-2">
                <label v-if="showCheckboxes" class="custom-checkbox">
                  <input 
                    type="checkbox" 
                    :value="qr.id" 
                    v-model="selectedQRCodes"
                    class="opacity-0 absolute"
                  >
                  <span class="checkmark"></span>
                </label>
                <span v-else class="w-5 h-5"></span>
              </div>
              <img 
                :src="`data:image/png;base64,${qr.filePath}`" 
                :alt="qr.fileName" 
                class="w-full h-40 object-contain rounded-xl mb-4"
              >
              <div class="space-y-2 text-lg text-center text-gray-800 dark:text-gray-200">
                <p><strong>{{ dat === 'datakril' ? translateText(`URL`) :`URL` }}:</strong> <a :href="qr.url" target="_blank" class="text-blue-500 dark:text-blue-400 hover:underline">{{ qr.url }}</a></p>
                <div class="grid grid-cols-3 gap-2 mt-4">
                  <button 
                    @click="downloadQRFromHistory(qr.filePath, qr.fileName)"
                    class="py-2 bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
                    :title="dat === 'datakril' ? translateText('Yuklab olish') : 'Yuklab olish'"
                  >
                    <Icon icon="mdi:download" class="text-sm sm:text-lg text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`Yuklab olish`):`Yuklab olish` }}</span>
                  </button>
                  <button 
                    @click="copyQRToClipboard(qr.filePath)"
                    class="py-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
                    :title="dat === 'datakril' ? translateText('Nusxalash') : 'Nusxalash'"
                  >
                    <Icon icon="mdi:content-copy" class="text-sm sm:text-lg text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`Nusxalash`):`Nusxalash` }}</span>
                  </button>
                  <button 
                    @click="deleteQRCode(qr.id)"
                    class="py-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
                    :title="dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish'"
                  >
                    <Icon icon="mdi:delete" class="text-sm sm:text-lg text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`O'chirish`):`O'chirish` }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Files Tab Content -->
        <div v-if="activeTab === 'files'">
          <div v-if="isLoadingOtherFiles" class="flex justify-center items-center py-8">
            <Icon icon="mdi:loading" class="w-8 h-8 animate-spin text-teal-500 dark:text-teal-400" />
            <span class="ml-4 text-gray-600 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Yuklanmoqda...`):  `Yuklanmoqda...` }}</span>
          </div>
          <div v-else-if="otherFiles.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
            {{ dat === 'datakril' ? translateText(`Hozircha fayllar yo'q`):`Hozircha fayllar yo'q` }}
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="file in otherFiles" :key="file.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between mb-2">
                <label v-if="showCheckboxes" class="custom-checkbox">
                  <input 
                    type="checkbox" 
                    :value="file.id" 
                    v-model="selectedOtherFiles"
                    class="opacity-0 absolute"
                  >
                  <span class="checkmark"></span>
                </label>
                <span v-else class="w-5 h-5"></span>
              </div>
              
              <!-- QR Code Preview -->
              <div v-if="file.QrCode" class="mb-4">
                <img 
                  :src="`${URL}${file.QrCode}`" 
                  :alt="`QR Code for ${file.name}`" 
                  class="w-full h-[200px] object-contain rounded-xl  border-gray-200 dark:border-gray-600"
                >
              </div>
              
              <div class="space-y-2 text-sm text-center text-gray-800 dark:text-gray-200">
                <p><strong>{{ dat === 'datakril' ? translateText(`Fayl nomi`) :`Fayl nomi` }}:</strong> {{ file.name }}</p>
                <p><strong>{{ dat === 'datakril' ? translateText(`Hajmi`) :`Hajmi` }}:</strong> {{ file.fileSize }}</p>
                <p><strong>{{ dat === 'datakril' ? translateText(`Sana`) :`Sana` }}:</strong> {{ new Date(file.createdAt).toLocaleDateString() }}</p>
                
                <div class="grid grid-cols-3 gap-2 mt-4">
                  <button 
                    @click="downloadOtherFileFromHistory(file.filePath, file.filePath)"
                    class="py-2 bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs"
                    :title="dat === 'datakril' ? translateText('Yuklab olish') : 'Yuklab olish'"
                  >
                    <Icon icon="mdi:download" class="text-sm text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`Yuklab olish`):`Yuklab olish` }}</span>
                  </button>
                  <button 
                    @click="copyQRToClipboard(`${URL}${file.QrCode}`)"
                    class="py-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
                    :title="dat === 'datakril' ? translateText('Nusxalash') : 'Nusxalash'"
                  >
                    <Icon icon="mdi:content-copy" class="text-sm sm:text-lg text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`Nusxalash`):`Nusxalash` }}</span>
                  </button>
                  <button 
                    @click="deleteOtherFile(file.id)"
                    class="py-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-1 text-xs"
                    :title="dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish'"
                  >
                    <Icon icon="mdi:delete" class="text-sm text-white" />
                    <span class="hidden sm:inline">{{ dat === 'datakril' ? translateText(`O'chirish`):`O'chirish` }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transform transition-all duration-300"
        :class="{
          'bg-green-500/90 dark:bg-green-600/90 border-green-400 dark:border-green-500 text-white': toast.type === 'success',
          'bg-red-500/90 dark:bg-red-600/90 border-red-400 dark:border-red-500 text-white': toast.type === 'error',
          'bg-blue-500/90 dark:bg-blue-600/90 border-blue-400 dark:border-blue-500 text-white': toast.type === 'info'
        }"
      >
        <Icon :icon="toast.type === 'success' ? 'mdi:check-circle' : toast.type === 'error' ? 'mdi:close-circle' : 'mdi:information'" class="text-xl text-white" />
        <span class="font-medium flex-1 text-white">{{ dat === 'datakril' ? translateText(toast.message):toast.message }}</span>
        <button 
          @click="removeToast(toast.id)" 
          class="w-6 h-6 rounded-full hover:bg-white/20 dark:hover:bg-gray-900/20 transition-colors flex items-center justify-center"
        >
          <Icon icon="mdi:close-circle" class="text-lg text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';
import { fi } from 'date-fns/locale';

const isLoading = inject('isLoading')
let intervalId = null
const dat = ref(localStorage.getItem("til") || "datalotin")

const checkLanguageChange = () => {
    const currentLang = localStorage.getItem("til") || "datalotin"
    if (currentLang !== dat.value) {
        dat.value = currentLang
    }
}

onMounted(() => {
    intervalId = setInterval(checkLanguageChange, 0)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
// API Configuration
const API_BASE = `${URL}/file-editor`;

// Dark Mode
const isDark = ref(false);

// File Conversion State
const fileInputRef = ref(null);
const selectedFile = ref(null);
const conversionType = ref('');
const isConverting = ref(false);
const conversionMessage = ref('');
const conversionStatus = ref('');

// QR Code State
const qrUrl = ref('');
const qrSize = ref(300);
const qrMargin = ref(2);
const qrDarkColor = ref('#000000');
const qrLightColor = ref('#ffffff');
const isGenerating = ref(false);
const qrImageUrl = ref('');

// QR Code History State
const qrCodes = ref([]);
const otherFiles = ref([]); // New state for other files
const isLoadingQRCodes = ref(false);
const isLoadingOtherFiles = ref(false); // New state for other files loading
const selectedQRCodes = ref([]);
const selectedOtherFiles = ref([]); // New state for selected other files
const showCheckboxes = ref(false); // New state for checkbox visibility
const activeTab = ref('qr'); // New state for active tab (qr or files)

// Toast System
const toasts = ref([]);
let toastId = 0;

// Debounce timer for QR preview
let debounceTimer = null;

// Dark Mode Toggle
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

// Toggle Checkbox Visibility
const toggleCheckboxVisibility = () => {
  showCheckboxes.value = !showCheckboxes.value;
  if (!showCheckboxes.value) {
    selectedQRCodes.value = []; // Clear selections when hiding checkboxes
    selectedOtherFiles.value = []; // Clear other files selections when hiding checkboxes
  }
};

// Initialize dark mode
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
  fetchQRCodes(); // Fetch QR codes on mount
  fetchOtherFiles(); // Fetch other files on mount
});

// File Handling Methods
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    autoDetectConversionType(file);
  }
};

const clearFile = () => {
  selectedFile.value = null;
  conversionMessage.value = '';
  conversionStatus.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Barcha ma'lumotlarni tozalash funksiyasi
const clearAllData = () => {
  // Fayl ma'lumotlarini tozalash
  selectedFile.value = null;
  conversionMessage.value = '';
  conversionStatus.value = '';
  uploadMessage.value = '';
  uploadStatus.value = '';
  
  // File input ni tozalash
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  
  // QR kod ma'lumotlarini tozalash
  clearQRData();
  
  // Tarix ma'lumotlarini yangilash
  fetchQRCodes();
  fetchOtherFiles();
};

// QR kod ma'lumotlarini tozalash funksiyasi
const clearQRData = () => {
  qrUrl.value = '';
  qrSize.value = 300;
  qrMargin.value = 2;
  qrDarkColor.value = '#000000';
  qrLightColor.value = '#ffffff';
  qrImageUrl.value = '';
  
  // Blob URL ni tozalash
  if (qrImageUrl.value && qrImageUrl.value.startsWith('blob:') && typeof window !== 'undefined' && window.URL) {
    window.URL.revokeObjectURL(qrImageUrl.value);
  }
};

const autoDetectConversionType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    conversionType.value = 'docx';
  } else if (extension === 'docx') {
    conversionType.value = 'pdf';
  }
};

// File Conversion
const convertFile = async () => {
  if (!selectedFile.value) {
    showToast('Iltimos, faylni tanlang!', 'error');
    return;
  }

  const file = selectedFile.value;
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  let targetFormat = conversionType.value;
  if (!targetFormat) {
    targetFormat = fileExtension === 'pdf' ? 'docx' : 'pdf';
  }

  if (fileExtension === targetFormat) {
    conversionMessage.value = `Fayl allaqachon ${targetFormat.toUpperCase()} formatida!`;
    conversionStatus.value = 'error';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  isConverting.value = true;
  conversionMessage.value = '';
  conversionStatus.value = '';

  try {
    isLoading.value = true;
    const response = await fetch(`${API_BASE}/convert?to=pdf`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const blob = await response.blob();
    downloadFile(blob, file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat);

    conversionMessage.value = `Fayl muvaffaqiyatli ${targetFormat.toUpperCase()} formatiga konvertatsiya qilindi!`;
    conversionStatus.value = 'success';
    showToast('Konvertatsiya muvaffaqiyatli bajarildi!', 'success');

    // Muvaffaqiyatli konvertatsiyadan keyin ma'lumotlarni tozalash
    clearAllData();

  } catch (error) {
    console.error('Konvertatsiya xatosi:', error);
    conversionMessage.value = 'Konvertatsiya xatosi: ' + error.message;
    conversionStatus.value = 'error';
    showToast('Konvertatsiyada xatolik yuz berdi', 'error');
  } finally {
    isConverting.value = false;
    isLoading.value = false;
  }
};
// Add these new reactive variables to your existing state
const isUploading = ref(false);
const uploadMessage = ref('');
const uploadStatus = ref('');

// Add this new upload function
const uploadFile = async () => {
  if (!selectedFile.value) {
    showToast('Iltimos, faylni tanlang!', 'error');
    return;
  }

  const file = selectedFile.value;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  isUploading.value = true;
  uploadMessage.value = '';
  uploadStatus.value = '';

  try {
    isLoading.value = true;
    
    // Your upload API endpoint - adjust this URL according to your backend
    const response = await fetch(`${URL}/other-files`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const result = await response.json();
    
    uploadMessage.value = 'Fayl muvaffaqiyatli yuborildi!';
    uploadStatus.value = 'success';
    showToast('Fayl muvaffaqiyatli yuborildi!', 'success');
    
    // Muvaffaqiyatli yuklashdan keyin ma'lumotlarni tozalash
    clearAllData();

  } catch (error) {
    console.error('Yuklash xatosi:', error);
    uploadMessage.value = 'Fayl yuklashda xatolik: ' + error.message;
    uploadStatus.value = 'error';
    showToast('Fayl yuklashda xatolik yuz berdi', 'error');
  } finally {
    isUploading.value = false;
    isLoading.value = false;
  }
};
// Fetch QR Codes
const fetchQRCodes = async () => {
  isLoadingQRCodes.value = true;
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE}/qrCodes`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    qrCodes.value = response.data;
    selectedQRCodes.value = []; // Clear selection when refreshing
  } catch (error) {
    console.error('QR kodlarni olishda xatolik:', error);
    showToast('QR kodlarni olishda xatolik yuz berdi', 'error');
  } finally {
    isLoadingQRCodes.value = false;
    isLoading.value = false;
  }
};

// Fetch Other Files
const fetchOtherFiles = async () => {
  isLoadingOtherFiles.value = true;
  try {
    isLoading.value = true;
    const response = await axios.get(`${URL}/other-files`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    otherFiles.value = response.data;
    console.log(otherFiles.value);
    selectedOtherFiles.value = []; // Clear selection when refreshing
  } catch (error) {
    console.error('Boshqa fayllarni olishda xatolik:', error);
    showToast('Boshqa fayllarni olishda xatolik yuz berdi', 'error');
  } finally {
    isLoadingOtherFiles.value = false;
    isLoading.value = false;
  }
};

// Delete Single QR Code
const deleteQRCode = async (id) => {
  if (!confirm('Bu QR kodni o\'chirishni tasdiqlaysizmi?')) return;

  try {
    isLoading.value = true;
    const response = await axios.delete(`${API_BASE}/qrcode/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    showToast('QR kod muvaffaqiyatli o\'chirildi!', 'success');
    await fetchQRCodes(); // Refresh QR code list
  } catch (error) {
    console.error('QR kod o\'chirishda xatolik:', error);
    showToast('QR kod o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Delete Selected QR Codes
const deleteSelectedQRCodes = async () => {
  if (selectedQRCodes.value.length === 0) {
    showToast('Hech qanday QR kod tanlanmagan!', 'error');
    return;
  }

  if (!confirm(`${selectedQRCodes.value.length} ta QR kodni o'chirishni tasdiqlaysizmi?`)) return;

  try {
    isLoading.value = true;
    const response = await axios.delete(`${API_BASE}/qrcode/deleteAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ids: selectedQRCodes.value
      }
    });
    showToast('Tanlangan QR kodlar muvaffaqiyatli o\'chirildi!', 'success');
    await fetchQRCodes(); // Refresh QR code list
  } catch (error) {
    console.error('Tanlangan QR kodlarni o\'chirishda xatolik:', error);
    showToast('QR kodlarni o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  }finally {
    isLoading.value = false;
  }
};

// Delete All QR Codes
const deleteAllQRCodes = async () => {
  if (qrCodes.value.length === 0) {
    showToast('O\'chirish uchun QR kodlar yo\'q!', 'error');
    return;
  }

  if (!confirm('Barcha QR kodlarni o\'chirishni tasdiqlaysizmi?')) return;

  const allIds = qrCodes.value.map(qr => qr.id);

  try {
    isLoading.value = true;
    const response = await axios.delete(`${API_BASE}/qrcode/deleteAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ids: allIds
      }
    });

    showToast('Barcha QR kodlar muvaffaqiyatli o\'chirildi!', 'success');
    await fetchQRCodes(); // Refresh QR code list
  } catch (error) {
    console.error('Barcha QR kodlarni o\'chirishda xatolik:', error);
    showToast('Barcha QR kodlarni o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Delete Single Other File
const deleteOtherFile = async (id) => {
  if (!confirm('Bu faylni o\'chirishni tasdiqlaysizmi?')) return;

  try {
    isLoading.value = true;
    const response = await axios.delete(`${URL}/other-files/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    showToast('Fayl muvaffaqiyatli o\'chirildi!', 'success');
    await fetchOtherFiles(); // Refresh other files list
  } catch (error) {
    console.error('Fayl o\'chirishda xatolik:', error);
    showToast('Fayl o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Delete Selected Other Files
const deleteSelectedOtherFiles = async () => {
  if (selectedOtherFiles.value.length === 0) {
    showToast('Hech qanday fayl tanlanmagan!', 'error');
    return;
  }

  if (!confirm(`${selectedOtherFiles.value.length} ta faylni o'chirishni tasdiqlaysizmi?`)) return;

  try {
    isLoading.value = true;
    const response = await axios.delete(`${URL}/other-files/deleteAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ids: selectedOtherFiles.value
      }
    });
    showToast('Tanlangan fayllar muvaffaqiyatli o\'chirildi!', 'success');
    await fetchOtherFiles(); // Refresh other files list
  } catch (error) {
    console.error('Tanlangan fayllarni o\'chirishda xatolik:', error);
    showToast('Fayllarni o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Delete All Other Files
const deleteAllOtherFiles = async () => {
  if (otherFiles.value.length === 0) {
    showToast('O\'chirish uchun fayllar yo\'q!', 'error');
    return;
  }

  if (!confirm('Barcha fayllarni o\'chirishni tasdiqlaysizmi?')) return;

  const allIds = otherFiles.value.map(file => file.id);

  try {
    isLoading.value = true;
    const response = await axios.delete(`${URL}/other-files/deleteAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ids: allIds
      }
    });

    showToast('Barcha fayllar muvaffaqiyatli o\'chirildi!', 'success');
    await fetchOtherFiles(); // Refresh other files list
  } catch (error) {
    console.error('Barcha fayllarni o\'chirishda xatolik:', error);
    showToast('Barcha fayllarni o\'chirishda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// QR Code Generation (POST request only on download)
const generateQRCode = async () => {
  if (!qrUrl.value.trim()) {
    throw new Error('URL manzil kiritilmagan');
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${API_BASE}/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: qrUrl.value.trim(),
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
        margin: parseInt(qrMargin.value),
        color: {
          dark: qrDarkColor.value,
          light: qrLightColor.value,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('QR kod yaratish xatosi:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// QR Preview (Placeholder only)
const generatePreview = () => {
  if (!qrUrl.value.trim()) {
    qrImageUrl.value = '';
    return;
  }

  // Use a placeholder image for preview
  qrImageUrl.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
};

// Debounced Preview Update
const debouncedGeneratePreview = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    generatePreview();
  }, 500);
};

// Download QR Code
const downloadQRCode = async () => {
  if (!qrUrl.value.trim()) {
    showToast('Iltimos, QR kod uchun URL kiriting!', 'error');
    return;
  }

  isGenerating.value = true;

  try {
    isLoading.value = true;
    const qrBlob = await generateQRCode();
    const fileName = `qrcode_${Date.now()}.png`;
    downloadFile(qrBlob, fileName);
    
    // Update preview with real QR using safe URL creation
    if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
      qrImageUrl.value = window.URL.createObjectURL(qrBlob);
    } else {
      // Fallback for preview
      const reader = new FileReader();
      reader.onload = function(e) {
        qrImageUrl.value = e.target.result;
      };
      reader.readAsDataURL(qrBlob);
    }
    
    showToast('QR kod muvaffaqiyatli yuklab olindi!', 'success');
    await fetchQRCodes(); // Refresh QR code history
    
    // Muvaffaqiyatli QR kod yaratishdan keyin ma'lumotlarni tozalash
    clearQRData();
  } catch (error) {
    showToast('QR kod yuklashda xatolik: ' + error.message, 'error');
  } finally {
    isGenerating.value = false;
    isLoading.value = false;
  }
};

// Download QR Code from History
const downloadQRFromHistory = (base64, fileName) => {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  downloadFile(blob, fileName);
  showToast('QR kod tarixdan yuklab olindi!', 'success');
};

// Download Other File from History
const downloadOtherFileFromHistory = async (filePath, fileName) => {
  try {
    isLoading.value = true;
    const response = await fetch(`${URL}${filePath}`);
    
    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }
    
    const blob = await response.blob();
    downloadFile(blob, fileName);
    showToast('Fayl tarixdan yuklab olindi!', 'success');
  } catch (error) {
    console.error('Fayl yuklashda xatolik:', error);
    showToast('Fayl yuklashda xatolik yuz berdi: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Copy QR Code to Clipboard
const copyQRToClipboard = async (data) => {
  try {
    let blob;
    
    // Check if data is a URL or base64
    if (data.startsWith('http') || data.startsWith('/')) {
      // It's a URL, fetch the image
      const response = await fetch(data);
      if (!response.ok) {
        throw new Error('Rasmni yuklashda xatolik');
      }
      blob = await response.blob();
    } else {
      // It's base64 data
      const byteString = atob(data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([arrayBuffer], { type: 'image/png' });
    }
    
    // Clipboard API dan foydalanish
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      showToast('QR kod muvaffaqiyatli nusxalandi!', 'success');
    } else {
      // Fallback metod - rasmni yaratib, uni nusxalash
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            showToast('QR kod muvaffaqiyatli nusxalandi!', 'success');
          } catch (error) {
            showToast('Nusxalashda xatolik yuz berdi', 'error');
          }
        }, 'image/png');
      };
      
      // Set image source based on data type
      if (data.startsWith('http') || data.startsWith('/')) {
        img.src = data;
      } else {
        img.src = `data:image/png;base64,${data}`;
      }
    }
  } catch (error) {
    console.error('Nusxalash xatosi:', error);
    showToast('Nusxalashda xatolik yuz berdi: ' + error.message, 'error');
  }
};

// Download File Helper
const downloadFile = (blob, filename) => {
  // Check if URL.createObjectURL is available
  if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } else {
    // Fallback method for environments where URL.createObjectURL is not available
    const reader = new FileReader();
    reader.onload = function(e) {
      const a = document.createElement('a');
      a.href = e.target.result;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(blob);
  }
};

// Toast System
const showToast = (message, type = 'info') => {
  const toast = {
    id: ++toastId,
    message,
    type,
  };
  toasts.value.push(toast);
  
  setTimeout(() => {
    removeToast(toast.id);
  }, 5000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Cleanup blob URLs on unmount
onMounted(() => {
  return () => {
    if (qrImageUrl.value && qrImageUrl.value.startsWith('blob:') && typeof window !== 'undefined' && window.URL) {
      window.URL.revokeObjectURL(qrImageUrl.value);
    }
  };
});
</script>

<style scoped>
/* Custom Checkbox Styles */
.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.custom-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #ffffff;
  border: 2px solid #4b5563;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.dark .checkmark {
  background-color: #374151;
  border-color: #9ca3af;
}

.custom-checkbox input:checked ~ .checkmark {
  background: linear-gradient(45deg, #10b981, #34d399);
  border-color: transparent;
}

.custom-checkbox input:checked ~ .checkmark:after {
  content: '';
  position: absolute;
  display: block;
  left: 8px;
  top: 4px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkmark:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Custom slider styles for Webkit browsers */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #f97316);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #f97316);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  border: none;
  transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
}

/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
</style>