<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200/70">
    <!-- Create Modal -->
    <div v-if="modalState?.create" @click="closeAllModals"
      class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative">
        <button @click="closeAllModals"
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {{ dat === 'datakril' ? translateText("Yangi ishchi qo'shish") : "Yangi ishchi qo'shish" }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.namePlaceholder') }}
            </label>
            <input v-model="form.name" id="name"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.namePlaceholder')" />
            <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.surnamePlaceholder') }}
            </label>
            <input v-model="form.surname" id="surname"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.surnamePlaceholder')" />
            <label for="fatherName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.fatherNamePlaceholder') }}
            </label>
            <input v-model="form.fatherName" id="fatherName"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.fatherNamePlaceholder')" />
            <label for="passport" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passportPlaceholder') }}
            </label>
            <input v-model="form.passport" id="passport" @input="handlePassportInput" maxlength="9"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.passportPlaceholder')" />
            <label for="jshhr" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.jshhrPlaceholder') }}
            </label>
            <input v-model="form.jshhr" id="jshhr" @input="handleJshhrInput" type="text" maxlength="14"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.jshhrPlaceholder')" />
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.phonePlaceholder') }}
            </label>
            <input v-model="form.phone" id="phone" @focus="handlePhoneFocus" @input="handlePhoneInput" maxlength="17"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              placeholder="+998 91 999 99 99" />
          </div>
          <div>
            <label for="birthday" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.birthdayPlaceholder') }}
            </label>
            <input v-model="form.birthday" id="birthday" type="date"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.birthdayPlaceholder')" />
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.rolePlaceholder') }}
            </label>
            <input v-model="form.role" id="role"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.rolePlaceholder')" />
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.usernamePlaceholder') }}
            </label>
            <input v-model="form.username" id="username" :maxlength="USERNAME_MAX_LENGTH"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
              :placeholder="$t('createModal.usernamePlaceholder')" />
            <label for="password1" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passwordPlaceholder') }}
            </label>
            <div class="relative">
              <input v-model="form.password1" id="password1" :type="showPassword ? 'text' : 'password'" :maxlength="PASSWORD_MAX_LENGTH"
                class="w-full p-3 mb-4 border rounded-xl pr-10 dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
                :placeholder="$t('createModal.passwordPlaceholder')" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                <img :src="showPassword ? '/eyes.png' : '/eye.png'" :alt="$t('createModal.toggleVisibilityAlt')"
                  class="w-5 h-5" />
              </button>
            </div>
            <label for="password2" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.confirmPasswordPlaceholder') }}
            </label>
            <div class="relative">
              <input v-model="form.password2" id="password2" :type="showPassword1 ? 'text' : 'password'" :maxlength="PASSWORD_MAX_LENGTH"
                class="w-full p-3 mb-4 border rounded-xl pr-10 dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition"
                :placeholder="$t('createModal.confirmPasswordPlaceholder')" />
              <button type="button" @click="showPassword1 = !showPassword1"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                <img :src="showPassword1 ? '/eyes.png' : '/eye.png'" :alt="$t('createModal.toggleVisibilityAlt')"
                  class="w-5 h-5" />
              </button>
            </div>
            <label for="profile-image-upload" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ dat === 'datakril' ? translateText("Profil rasmni yuklash") : "Profil rasmni yuklash" }}
            </label>
            <input id="profile-image-upload" type="file" @change="handleProfileImageUpload" accept="image/jpeg,image/png"
              class="hidden" ref="profileImageInput" />
            <label for="profile-image-upload"
              class="w-full block p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition file:bg-gray-100 file:border-0 file:px-3 file:py-1 file:rounded cursor-pointer">
              {{ form.image ? form.image.name : (dat === 'datakril' ? translateText("Rasmni tanlang") : "Rasmni tanlang") }}
            </label>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ dat === 'datakril' ? translateText("Yuz rasmlarini yuklash (ixtiyoriy)") : "Yuz rasmlarini yuklash (ixtiyoriy)" }}
            </label>
            <button @click="openFaceCaptureModal('create')"
              class="w-full block p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition text-left">
              {{ form.faceImages.length ? form.faceImages.map(f => f.name).join(', ') : (dat === 'datakril' ? translateText("Kameradan suratga olish") : "Kameradan suratga olish") }}
            </button>
          </div>
        </div>
        <p v-if="createError" class="text-center text-red-600 dark:text-red-400 mt-2 text-sm">{{ createError }}</p>
        <button @click="post" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-6 rounded-xl transition">
          {{ $t('createModal.createButton') }}
        </button>
      </div>
    </div>
    <!-- Update Modal -->
    <div v-if="modalState?.update" @click="closeAllModals"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative">
        <button @click="closeAllModals"
          class="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {{ dat === 'datakril' ? translateText("Yangilash") : "Yangilash" }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label for="updatedName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.namePlaceholder') }}
            </label>
            <input v-model="updateForm.name" id="updatedName" :placeholder="$t('createModal.namePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedSurname" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.surnamePlaceholder') }}
            </label>
            <input v-model="updateForm.surname" id="updatedSurname" :placeholder="$t('createModal.surnamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedFatherName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.fatherNamePlaceholder') }}
            </label>
            <input v-model="updateForm.fatherName" id="updatedFatherName"
              :placeholder="$t('createModal.fatherNamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedPassport" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.passportPlaceholder') }}
            </label>
            <input v-model="updateForm.passport" id="updatedPassport" @input="handleUpdatedPassportInput" maxlength="9"
              :placeholder="$t('createModal.passportPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedJshhr" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.jshhrPlaceholder') }}
            </label>
            <input v-model="updateForm.jshhr" id="updatedJshhr" @input="handleUpdatedJshhrInput" type="text" maxlength="14"
              :placeholder="$t('createModal.jshhrPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
          </div>
          <div>
            <label for="updatedPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.phonePlaceholder') }}
            </label>
            <input v-model="updateForm.phone" id="updatedPhone" @focus="handleUpdatedPhoneFocus"
              @input="handleUpdatedPhoneInput" maxlength="17" placeholder="+998 91 999 99 99"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedBirthday" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.birthdayPlaceholder') }}
            </label>
            <input v-model="updateForm.birthday" id="updatedBirthday" type="date"
              :placeholder="$t('createModal.birthdayPlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedrole" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.rolePlaceholder') }}
            </label>
            <input v-model="updateForm.role" id="updatedrole" :placeholder="$t('createModal.rolePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updatedUsername" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ $t('createModal.usernamePlaceholder') }}
            </label>
            <input v-model="updateForm.username" id="updatedUsername" :maxlength="USERNAME_MAX_LENGTH"
              :placeholder="$t('createModal.usernamePlaceholder')"
              class="w-full p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition" />
            <label for="updated-profile-image-upload" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ dat === 'datakril' ? translateText("Profil rasmni yuklash") : "Profil rasmni yuklash" }}
            </label>
            <input id="updated-profile-image-upload" type="file" @change="handleUpdatedProfileImageUpload"
              accept="image/jpeg,image/png" class="hidden" ref="updatedProfileImageInput" />
            <label for="updated-profile-image-upload"
              class="w-full block p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition file:bg-gray-100 file:border-0 file:px-3 file:py-1 file:rounded cursor-pointer">
              {{ updateForm.image ? updateForm.image.name : (existingImage.value ?? (dat === 'datakril' ? translateText("Rasmni tanlang") : "Rasmni tanlang")) }}
            </label>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {{ dat === 'datakril' ? translateText("Yuz rasmlarini yuklash (ixtiyoriy)") : "Yuz rasmlarini yuklash (ixtiyoriy)" }}
            </label>
            <button @click="openFaceCaptureModal('update')"
              class="w-full block p-3 mb-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 border-gray-500/50 dark:text-gray-100 transition text-left">
              {{ updateForm.faceImages.length ? updateForm.faceImages.map(f => f.name).join(', ') : (dat === 'datakril' ? translateText("Kameradan suratga olish") : "Kameradan suratga olish") }}
            </button>
          </div>
        </div>
        <p v-if="updateError" class="text-center text-red-600 dark:text-red-400 mt-2 text-sm">{{ updateError }}</p>
        <button @click="updateAdmin"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl mt-6 w-full transition-all">
          {{ $t('editModal.updateButton') }}
        </button>
      </div>
    </div>
    <!-- Face Capture Modal -->
    <div v-if="modalState?.faceCapture" @click="closeFaceCaptureModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div @click.stop class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative">
        <button @click="closeFaceCaptureModal"
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          {{ dat === 'datakril' ? translateText("Yuz rasmini suratga olish") : "Yuz rasmini suratga olish" }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
          {{ dat === 'datakril' ? translateText("Yuzingizni ramka ichida to'g'ri joylashtiring va suratga oling") : "Yuzingizni ramka ichida to'g'ri joylashtiring va suratga oling" }}
        </p>
        <div class="relative flex justify-center mb-4">
          <video ref="video" class="w-full max-w-md rounded-lg" autoplay></video>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-64 h-80 border-2 border-green-500 rounded-lg opacity-50"></div>
          </div>
        </div>
        <div class="flex justify-center mb-4">
          <button @click="captureImage"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            {{ dat === 'datakril' ? translateText("Suratga olish") : "Suratga olish" }}
          </button>
        </div>
        <div v-if="capturedImages.length" class="grid grid-cols-3 gap-2 mb-4">
          <div v-for="(image, index) in capturedImages" :key="index" class="relative">
            <img :src="image.url" class="w-full h-24 object-cover rounded-lg" />
            <button @click="removeCapturedImage(index)"
              class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
              ×
            </button>
          </div>
        </div>
        <p v-if="faceCaptureError" class="text-center text-red-600 dark:text-red-400 text-sm mb-4">
          {{ faceCaptureError }}
        </p>
        <div class="flex justify-center gap-4">
          <button @click="saveCapturedImages"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            {{ dat === 'datakril' ? translateText("Saqlash") : "Saqlash" }}
          </button>
          <button @click="closeFaceCaptureModal"
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition">
            {{ dat === 'datakril' ? translateText("Bekor qilish") : "Bekor qilish" }}
          </button>
        </div>
      </div>
    </div>
    <!-- Password Modal -->
    <div v-if="modalState?.password" @click="closeAllModals"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative">
        <button @click="closeAllModals"
          class="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold rotate-45">
          +
        </button>
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-200">{{ $t('passwordModal.title') }}</h2>
        <label for="updatednewPassword1" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {{ $t('passwordModal.newPasswordPlaceholder') }}
        </label>
        <input v-model="passwordForm.newPassword1" autocomplete="new-password" id="updatednewPassword1" type="password" :maxlength="PASSWORD_MAX_LENGTH"
          class="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          :placeholder="$t('passwordModal.newPasswordPlaceholder')" />
        <label for="updatednewPassword2" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {{ $t('passwordModal.confirmNewPasswordPlaceholder') }}
        </label>
        <input v-model="passwordForm.newPassword2" autocomplete="new-password" id="updatednewPassword2" type="password" :maxlength="PASSWORD_MAX_LENGTH"
          class="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          :placeholder="$t('passwordModal.confirmNewPasswordPlaceholder')" />
        <p v-if="passwordError" class="text-red-600 text-sm dark:text-red-400">{{ passwordError }}</p>
        <button @click="updatePassword"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-700 transition">
          {{ $t('passwordModal.updateButton') }}
        </button>
      </div>
    </div>
    <!-- Delete Modal -->
    <div v-if="modalState?.delete" @click="closeAllModals"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div @click.stop class="bg-white dark:bg-[#2d2d2d] p-6 rounded-2xl w-11/12 max-w-sm text-center
             shadow-xl transform transition-transform duration-300 ease-out
             scale-100 opacity-100" :class="{ 'scale-95 opacity-0': !modalState.delete }">
        <h2 class="text-lg font-semibold dark:text-gray-200">
          {{ $t('deleteModal.confirmMessage') }}
        </h2>
        <p class="text-md text-gray-600 dark:text-gray-400 mt-2">
          {{ dat === 'datakril' ? translateText("Ishchini o'chirishni tasdiqlaysizmi?") :
            "Ishchini o'chirishni tasdiqlaysizmi?" }}
        </p>
        <div class="flex justify-center items-center gap-4 mt-6">
          <button @click="removeAdmin"
            class="bg-red-600 text-white px-5 py-2 w-full rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400">
            {{ dat === 'datakril' ? translateText("O'chirish") : "O'chirish" }}
          </button>
          <button @click="closeAllModals"
            class="bg-gray-400 text-white px-5 py-2 w-full rounded-lg hover:bg-gray-500 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400">
            {{ dat === 'datakril' ? translateText("Bekor qilish") : "Bekor qilish" }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center pt-4 px-4">
      <h1
        class="text-[40px] font-bold text-center bg-gradient-to-r from-blue-800 to-purple-500 text-white shadow-sm shadow-white rounded-lg py-2 px-[100px]">
        {{ dat === 'datakril' ? translateText(title) : title }} <span v-if="Count"
          class="border-b-4 px-1 border-white">{{ filteredAdmins.length }}</span>
      </h1>
    </div>
    <div class="flex justify-between items-center px-4 mt-4">
      <button @click="openCreateModal"
        class="bg-blue-500 border-2 dark:border-white/40 dark:bg-gray-700 mr-5 text-white px-6 py-2 rounded-lg text-lg transition">
        {{ dat === 'datakril' ? translateText("Yangi ishchi qo'shish") : "Yangi ishchi qo'shish" }}
      </button>
    </div>
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-4">
      <div v-for="item in filteredAdmins" :key="item.id"
        class="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        :class="{ 'ring-2 ring-green-400 ring-opacity-50': checkIsOnlineRealtime(item.id) }">
        <div class="absolute top-2 right-2 flex items-center z-10">
          <span :class="[
            'w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300',
            checkIsOnlineRealtime(item.id) ? 'bg-green-500' : 'bg-red-500'
          ]"></span>
        </div>
        <div class="bg-gradient-to-r from-blue-800 to-purple-500 text-white text-center p-4">
          <div class="relative inline-block">
            <img class="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white -mb-3 z-10"
              :src="getImageUrl(item.img)" :alt="dat === 'datakril' ? translateText('Avatar') : 'Avatar'" />
          </div>
          <h2 class="text-lg font-bold mt-4">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }}
            {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
          </h2>
          <p class="text-sm">
            {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
          </p>
          <p :class="['text-xs mt-1 transition-colors duration-300', getStatusTextClass(item)]">
            {{ dat === 'datakril' ? translateText(getAdminStatusText(item)) : getAdminStatusText(item) }}
          </p>
        </div>
        <div class="p-4 text-sm space-y-2 text-gray-800 dark:text-gray-200">
          <p>
            <Icon icon="mdi:phone-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? translateText(item.phone) : item.phone }}
          </p>
          <p>
            <Icon icon="mdi:briefcase-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.startWork?.split('T')[0] : item.startWork?.split('T')[0] }}
          </p>
          <p>
            <Icon icon="mdi:cake-variant-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.birthday?.split('T')[0] : item.birthday?.split('T')[0] }}
          </p>
        </div>
        <div class="text-center p-4 flex justify-center gap-2">
          <button
            class="text-white font-bold py-2 px-4 rounded transition-all duration-300 bg-green-600 hover:bg-green-700"
            @click="router.push('/profile/' + item.id)">
            {{ dat === 'datakril' ? translateText("Batafsil Ma'lumot") : "Batafsil Ma'lumot" }}
          </button>
          <button :ref="el => buttonRefs[item.id] = el"
            class="text-white font-bold py-2 px-3 rounded transition-all duration-300 bg-yellow-600 hover:bg-yellow-700"
            @click="toggleContextMenu(item.id)">
            {{ dat === 'datakril' ? translateText("Tahririlash") : "Tahririlash" }}
          </button>
          <div v-if="modalState?.contextMenu === item.id" @click="closeAllModals" class="fixed inset-0 z-[40]">
            <div @click.stop
              class="absolute bg-white border-2 dark:bg-[#2e2e2e] rounded-xl shadow-xl border-black/20 dark:border-gray-700 z-50 overflow-hidden"
              :style="modalPosition[item.id] || { top: '0px', left: '0px', width: '224px' }">
              <button @click="openEditModal(item)"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-gray-700 dark:text-gray-100 hover:bg-gray-500/50 dark:hover:bg-gray-700 transition-colors">
                <Icon icon="mdi:pencil" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("Tahrirlash") : "Tahrirlash" }}
              </button>
              <button @click="openDeleteModal(item.id)"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-700/50 transition-colors">
                <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("O'chirish") : "O'chirish" }}
              </button>
              <button @click="openPassModal(item)"
                class="flex items-center gap-2 w-full px-5 py-3 text-left text-lg text-lime-600 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-700/50 transition-colors">
                <Icon icon="mdi:key-outline" class="w-5 h-5" />
                {{ dat === 'datakril' ? translateText("Parolni o'zgartirish") : "Parolni o'zgartirish" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, inject, computed, nextTick, getCurrentInstance } from "vue";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import translateText from '@/auth/Translate';
import { useSearchStore } from '@/components/Templates/searchQuary';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = ref(30);
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = ref(30);

const title = ref("Operatorlar ro'yxati");
const ApiSubDomen = ref("/operator");


const instance = getCurrentInstance();
if (instance) {
  const providedKeys = Object.keys(instance.appContext.provides);
  console.log('Provided keys:', providedKeys);
}

const isLoading = inject('isLoading', ref(false));
const buttonRefs = ref({});
const modalPosition = ref({});
const { t } = useI18n();
const socket = io(URL);
const router = useRouter();
const dat = ref(localStorage.getItem('til') || 'datalotin');
const searchStore = useSearchStore();

const data = ref([]);
const onlineAdmins = ref([]);
const selectedId = ref(null);
const showPassword = ref(false);
const showPassword1 = ref(false);
const Count = ref(null);
const existingImage = ref(null);
const profileImageInput = ref(null);
const updatedProfileImageInput = ref(null);
const video = ref(null);
const capturedImages = ref([]);
const faceCaptureError = ref('');
const currentModalType = ref(null);

// Consolidated modal state
const modalState = ref({
  create: false,
  update: false,
  delete: false,
  password: false,
  contextMenu: null,
  faceCapture: false
});

// Form data for create modal
const form = ref({
  name: "",
  surname: "",
  fatherName: "",
  username: "",
  passport: "",
  jshhr: "",
  phone: "",
  birthday: "",
  password1: "",
  password2: "",
  image: null,
  faceImages: [],
  role: ""
});

// Form data for update modal
const updateForm = ref({
  name: "",
  surname: "",
  fatherName: "",
  username: "",
  passport: "",
  jshhr: "",
  phone: "",
  birthday: "",
  image: null,
  faceImages: [],
  role: ""
});

// Form data for password modal
const passwordForm = ref({
  newPassword1: "",
  newPassword2: ""
});

// Separate error states for each modal
const createError = ref("");
const updateError = ref("");
const passwordError = ref("");

// Computed property to filter admins
const filteredAdmins = computed(() => {
  const query = searchStore.query.toLowerCase().trim();
  if (!query) return data.value;

  return data.value.filter(admin => {
    const fullName = `${admin.name} ${admin.surname}`.toLowerCase();
    const phone = admin.phone?.toLowerCase() || "";
    return (
      fullName.includes(query) ||
      phone.includes(query)
    );
  });
});

const getData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/${ApiSubDomen.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    data.value = response.data
      .filter(item => item.type === "active")
      .map(item => ({
        ...item,
        img: item.img || null
      }))
      .sort((a, b) => a.id - b.id);
    Count.value = data.value.length;

    checkOnlineStatus();
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const checkIsOnlineRealtime = (adminId) => {
  const admin = data.value.find(item => item.id === adminId);
  if (!admin || !admin.lastSeen) return false;

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);
  return timeDifference < 5;
};

const getAdminStatusText = (admin) => {
  if (!admin.lastSeen) {
    return t('adminCard.offlineStatus');
  }

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);

  if (timeDifference < 5) {
    return t('adminCard.onlineStatus');
  } else {
    return `${formatDistanceToNow(new Date(admin.lastSeen), {
      addSuffix: true,
      locale: uz,
    })} tarmoqda edi`;
  }
};

const getStatusTextClass = (admin) => {
  if (!admin.lastSeen) {
    return "text-gray-100";
  }

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);

  return timeDifference < 5 ? "text-green-500" : "text-red-500";
};

const checkOnlineStatus = () => {
  onlineAdmins.value = data.value
    .filter(admin => {
      if (!admin.lastSeen) return false;
      const lastSeenTime = new Date(admin.lastSeen).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - lastSeenTime) / (1000 * 60);
      return timeDifference < 5;
    })
    .map(admin => admin.id.toString());
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

const toggleContextMenu = async (id) => {
  if (modalState.value.contextMenu === id) {
    modalState.value.contextMenu = null;
  } else {
    closeAllModals();
    modalState.value.contextMenu = id;
    await nextTick();
    const button = buttonRefs.value[id];
    if (button) {
      const rect = button.getBoundingClientRect();
      const offsetX = 10;
      const offsetY = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      let top = rect.top + scrollTop - 250;
      let left = rect.right + scrollLeft + offsetX;
      const modalWidth = 224;

      if (left + modalWidth > window.innerWidth + scrollLeft) {
        left = rect.left + scrollLeft - modalWidth - offsetX;
      }
      if (left < 0) left = 10;

      modalPosition.value[id] = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${modalWidth}px`
      };
    }
  }
};

const openCreateModal = () => {
  closeAllModals();
  resetCreateForm();
  modalState.value.create = true;
};

const openEditModal = async (item) => {
  if (isLoading.value) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (!isLoading.value) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
  closeAllModals();
  selectedId.value = item.id;
  updateForm.value = {
    name: item.name || '',
    surname: item.surname || '',
    fatherName: item.dadname || '',
    username: item.username || '',
    passport: item.userCode || '',
    jshhr: item.uniqueCode ? item.uniqueCode.toString() : '',
    phone: formatPhoneNumber(item.phone || ''),
    birthday: item.birthday ? item.birthday.split("T")[0] : "",
    role: item.lavozimi || '',
    image: null,
    faceImages: []
  };
  existingImage.value = item.img || null;
  modalState.value.update = true;
};

const openDeleteModal = (id) => {
  closeAllModals();
  selectedId.value = id;
  modalState.value.delete = true;
};

const openPassModal = (item) => {
  closeAllModals();
  selectedId.value = item.id;
  resetPasswordForm();
  modalState.value.password = true;
};

const openFaceCaptureModal = (type) => {
  closeAllModals();
  modalState.value.faceCapture = true;
  currentModalType.value = type;
  capturedImages.value = [];
  faceCaptureError.value = '';
  startCamera();
};

const closeAllModals = () => {
  modalState.value = {
    create: false,
    update: false,
    delete: false,
    password: false,
    contextMenu: null,
    faceCapture: false
  };
  stopCamera();
  createError.value = "";
  updateError.value = "";
  passwordError.value = "";
  faceCaptureError.value = "";
};

const closeFaceCaptureModal = () => {
  modalState.value.faceCapture = false;
  stopCamera();
  capturedImages.value = [];
  faceCaptureError.value = '';
};

const resetCreateForm = () => {
  form.value = {
    name: "",
    surname: "",
    fatherName: "",
    username: "",
    passport: "",
    jshhr: "",
    phone: "",
    birthday: "",
    password1: "",
    password2: "",
    image: null,
    faceImages: [],
    role: ""
  };
  if (profileImageInput.value?.value) {
    profileImageInput.value.value = "";
  }
};

const resetUpdateForm = () => {
  updateForm.value = {
    name: "",
    surname: "",
    fatherName: "",
    username: "",
    passport: "",
    jshhr: "",
    phone: "",
    birthday: "",
    image: null,
    faceImages: [],
    role: ""
  };
  if (updatedProfileImageInput.value?.value) {
    updatedProfileImageInput.value.value = "";
  }
  existingImage.value = null;
};

const resetPasswordForm = () => {
  passwordForm.value = {
    newPassword1: "",
    newPassword2: ""
  };
};

const resetAllForms = () => {
  resetCreateForm();
  resetUpdateForm();
  resetPasswordForm();
};

const formatPhoneNumber = (phone) => {
  if (!phone || !phone.startsWith('+998')) return '+998';
  let numbers = phone.replace(/\D/g, '').slice(3);
  if (numbers.length > 9) numbers = numbers.slice(0, 9);
  let formatted = '+998';
  if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
  if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
  if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
  if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
  return formatted;
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
  return phoneRegex.test(phone);
};

const validatePassport = (passport) => {
  const passportRegex = /^[A-Z]{2}\d{7}$/;
  return passportRegex.test(passport);
};

const validateJshhr = (jshhr) => {
  const jshhrRegex = /^\d{14}$/;
  return jshhrRegex.test(jshhr);
};

const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  return file && allowedTypes.includes(file.type);
};

const validateFaceImages = (files) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  return files.every(file => allowedTypes.includes(file.type));
};

const validateUsername = (username) => {
  return username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH.value;
};

const validatePassword = (password) => {
  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH.value;
};

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 }
    });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (error) {
    faceCaptureError.value = dat === 'datakril' ? translateText("Kameraga kirishda xatolik yuz berdi") : "Kameraga kirishda xatolik yuz berdi";
    console.error("Error accessing camera:", error);
  }
};

const stopCamera = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.value.srcObject = null;
  }
};

const captureImage = async () => {
  if (capturedImages.value.length >= 10) {
    faceCaptureError.value = dat === 'datakril' ? translateText("Yuz rasmlari soni 10 tadan oshmasligi kerak") : "Yuz rasmlari soni 10 tadan oshmasligi kerak";
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `face_image_${Date.now()}.jpg`, { type: 'image/jpeg' });

  capturedImages.value.push({
    url: dataUrl,
    file: file
  });
};

const removeCapturedImage = (index) => {
  capturedImages.value.splice(index, 1);
  faceCaptureError.value = '';
};

const saveCapturedImages = () => {
  if (capturedImages.value.length === 0) {
    faceCaptureError.value = dat === 'datakril' ? translateText("Kamida bitta surat oling") : "Kamida bitta surat oling";
    return;
  }

  const files = capturedImages.value.map(item => item.file);
  if (currentModalType.value === 'create') {
    form.value.faceImages = files;
  } else if (currentModalType.value === 'update') {
    updateForm.value.faceImages = files;
  }

  modalState.value.faceCapture = false;
  stopCamera();
  capturedImages.value = [];
  faceCaptureError.value = '';
  
  modalState.value[currentModalType.value] = true;

  if (currentModalType.value === 'update' && !existingImage.value) {
    const item = data.value.find(admin => admin.id === selectedId.value);
    existingImage.value = item?.img || null;
  }
};

const post = async () => {
  createError.value = "";
  if (!form.value.name.trim()) {
    createError.value = dat === 'datakril' ? translateText("Ismni kiriting") : "Ismni kiriting";
    return;
  }
  if (!form.value.surname.trim()) {
    createError.value = dat === 'datakril' ? translateText("Familiyani kiriting") : "Familiyani kiriting";
    return;
  }
  if (!form.value.fatherName.trim()) {
    createError.value = dat === 'datakril' ? translateText("Otangizning ismini kiriting") : "Otangizning ismini kiriting";
    return;
  }
  if (!form.value.passport.trim() || !validatePassport(form.value.passport)) {
    createError.value = dat === 'datakril' ? translateText("Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)") : "Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)";
    return;
  }
  if (!form.value.jshhr || !validateJshhr(form.value.jshhr)) {
    createError.value = dat === 'datakril' ? translateText("JShShIR 14 raqamdan iborat bo'lishi kerak") : "JShShIR 14 raqamdan iborat bo'lishi kerak";
    return;
  }
  if (!form.value.phone.trim() || !validatePhone(form.value.phone)) {
    createError.value = dat === 'datakril' ? translateText("Telefon raqamini to'g'ri kiriting") : "Telefon raqamini to'g'ri kiriting";
    return;
  }
  if (!form.value.birthday) {
    createError.value = dat === 'datakril' ? translateText("Tug'ilgan kunni kiriting") : "Tug'ilgan kunni kiriting";
    return;
  }
  if (!form.value.role.trim()) {
    createError.value = dat === 'datakril' ? translateText("Lavozimni kiriting") : "Lavozimni kiriting";
    return;
  }
  if (!form.value.username.trim()) {
    createError.value = dat === 'datakril' ? translateText("Foydalanuvchi nomini kiriting") : "Foydalanuvchi nomini kiriting";
    return;
  }
  if (!validateUsername(form.value.username)) {
    createError.value = dat === 'datakril' 
      ? translateText(`Foydalanuvchi nomi ${USERNAME_MIN_LENGTH} dan ${USERNAME_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`) 
      : `Foydalanuvchi nomi ${USERNAME_MIN_LENGTH} dan ${USERNAME_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`;
    return;
  }
  if (!form.value.password1.trim()) {
    createError.value = dat === 'datakril' ? translateText("Parolni kiriting") : "Parolni kiriting";
    return;
  }
  if (!validatePassword(form.value.password1)) {
    createError.value = dat === 'datakril' 
      ? translateText(`Parol ${PASSWORD_MIN_LENGTH} dan ${PASSWORD_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`) 
      : `Parol ${PASSWORD_MIN_LENGTH} dan ${PASSWORD_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`;
    return;
  }
  if (!form.value.password2.trim()) {
    createError.value = dat === 'datakril' ? translateText("Parolni tasdiqlang") : "Parolni tasdiqlang";
    return;
  }
  if (form.value.password1 !== form.value.password2) {
    createError.value = dat === 'datakril' ? translateText("Parollar bir xil emas") : "Parollar bir xil emas";
    return;
  }
  if (!form.value.image || !validateImage(form.value.image)) {
    createError.value = dat === 'datakril' ? translateText("Iltimos, to'g'ri profil rasmni yuklang (jpg/png)") : "Iltimos, to'g'ri profil rasmni yuklang (jpg/png)";
    return;
  }
  if (form.value.faceImages.length > 0 && !validateFaceImages(form.value.faceImages)) {
    createError.value = dat === 'datakril' ? translateText("Iltimos, to'g'ri yuz rasmlarini yuklang (jpg/png)") : "Iltimos, to'g'ri yuz rasmlarini yuklang (jpg/png)";
    return;
  }
  if (form.value.faceImages.length > 10) {
    createError.value = dat === 'datakril' ? translateText("Yuz rasmlari soni 10 tadan oshmasligi kerak") : "Yuz rasmlari soni 10 tadan oshmasligi kerak";
    return;
  }

  const createdAt = new Date().toISOString();
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("surname", form.value.surname);
  formData.append("dadname", form.value.fatherName);
  formData.append("username", form.value.username);
  formData.append("userCode", form.value.passport);
  formData.append("uniqueCode", form.value.jshhr);
  formData.append("birthday", form.value.birthday);
  formData.append("phone", form.value.phone.replace(/\s/g, ''));
  formData.append("password", form.value.password2);
  formData.append("startWork", createdAt);
  formData.append("lavozimi", form.value.role);
  if (form.value.image) {
    formData.append("img", form.value.image);
  }
  form.value.faceImages.forEach((file) => {
    formData.append(`faceImages`, file);
  });

  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${URL}/${ApiSubDomen.value}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    await getData();
    closeAllModals();
    resetAllForms();
  } catch (error) {
    createError.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Admin yaratishda xatolik") : "Admin yaratishda xatolik");
    console.error("Error creating admin:", error);
  } finally {
    isLoading.value = false;
  }
};

const updateAdmin = async () => {
  updateError.value = "";
  if (!updateForm.value.name.trim()) {
    updateError.value = dat === 'datakril' ? translateText("Ismni kiriting") : "Ismni kiriting";
    return;
  }
  if (!updateForm.value.surname.trim()) {
    updateError.value = dat === 'datakril' ? translateText("Familiyani kiriting") : "Familiyani kiriting";
    return;
  }
  if (!updateForm.value.fatherName.trim()) {
    updateError.value = dat === 'datakril' ? translateText("Otangizning ismini kiriting") : "Otangizning ismini kiriting";
    return;
  }
  if (!updateForm.value.passport.trim() || !validatePassport(updateForm.value.passport)) {
    updateError.value = dat === 'datakril' ? translateText("Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)") : "Passport raqamini to'g'ri kiriting (2 harf va 7 raqam)";
    return;
  }
  if (!updateForm.value.jshhr || !validateJshhr(updateForm.value.jshhr)) {
    updateError.value = dat === 'datakril' ? translateText("JShShIR 14 raqamdan iborat bo'lishi kerak") : "JShShIR 14 raqamdan iborat bo'lishi kerak";
    return;
  }
  if (!updateForm.value.phone.trim() || !validatePhone(updateForm.value.phone)) {
    updateError.value = dat === 'datakril' ? translateText("Telefon raqamini to'g'ri kiriting") : "Telefon raqamini to'g'ri kiriting";
    return;
  }
  if (!updateForm.value.birthday) {
    updateError.value = dat === 'datakril' ? translateText("Tug'ilgan kunni kiriting") : "Tug'ilgan kunni kiriting";
    return;
  }
  if (!updateForm.value.role.trim()) {
    updateError.value = dat === 'datakril' ? translateText("Lavozimni kiriting") : "Lavozimni kiriting";
    return;
  }
  if (!updateForm.value.username.trim()) {
    updateError.value = dat === 'datakril' ? translateText("Foydalanuvchi nomini kiriting") : "Foydalanuvchi nomini kiriting";
    return;
  }
  if (!validateUsername(updateForm.value.username)) {
    updateError.value = dat === 'datakril' 
      ? translateText(`Foydalanuvchi nomi ${USERNAME_MIN_LENGTH} dan ${USERNAME_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`) 
      : `Foydalanuvchi nomi ${USERNAME_MIN_LENGTH} dan ${USERNAME_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`;
    return;
  }
  if (!updateForm.value.image && !existingImage.value) {
    updateError.value = dat === 'datakril' ? translateText("Iltimos, profil rasmni yuklang") : "Iltimos, profil rasmni yuklang";
    return;
  }
  if (updateForm.value.faceImages.length > 0 && !validateFaceImages(updateForm.value.faceImages)) {
    updateError.value = dat === 'datakril' ? translateText("Iltimos, to'g'ri yuz rasmlarini yuklang (jpg/png)") : "Iltimos, to'g'ri yuz rasmlarini yuklang (jpg/png)";
    return;
  }
  if (updateForm.value.faceImages.length > 10) {
    updateError.value = dat === 'datakril' ? translateText("Yuz rasmlari soni 10 tadan oshmasligi kerak") : "Yuz rasmlari soni 10 tadan oshmasligi kerak";
    return;
  }

  const formData = new FormData();
  formData.append("name", updateForm.value.name);
  formData.append("surname", updateForm.value.surname);
  formData.append("dadname", updateForm.value.fatherName);
  formData.append("username", updateForm.value.username);
  formData.append("userCode", updateForm.value.passport);
  formData.append("uniqueCode", updateForm.value.jshhr);
  formData.append("birthday", updateForm.value.birthday);
  formData.append("phone", updateForm.value.phone.replace(/\s/g, ''));
  formData.append("lavozimi", updateForm.value.role);
  if (updateForm.value.image) {
    formData.append("img", updateForm.value.image);
  }
  updateForm.value.faceImages.forEach((file) => {
    formData.append(`faceImages`, file);
  });

  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    await axios.put(`${URL}/${ApiSubDomen.value}/${selectedId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    await getData();
    closeAllModals();
    resetAllForms();
  } catch (error) {
    updateError.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Yangilashda xatolik") : "Yangilashda xatolik");
    console.error("Error updating admin:", error);
  } finally {
    isLoading.value = false;
  }
};

const updatePassword = async () => {
  passwordError.value = "";
  if (!passwordForm.value.newPassword1.trim()) {
    passwordError.value = dat === 'datakril' ? translateText("Yangi parolni kiriting") : "Yangi parolni kiriting";
    return;
  }
  if (!validatePassword(passwordForm.value.newPassword1)) {
    passwordError.value = dat === 'datakril' 
      ? translateText(`Parol ${PASSWORD_MIN_LENGTH} dan ${PASSWORD_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`) 
      : `Parol ${PASSWORD_MIN_LENGTH} dan ${PASSWORD_MAX_LENGTH.value} gacha belgidan iborat bo'lishi kerak`;
    return;
  }
  if (!passwordForm.value.newPassword2.trim()) {
    passwordError.value = dat === 'datakril' ? translateText("Parolni tasdiqlang") : "Parolni tasdiqlang";
    return;
  }
  if (passwordForm.value.newPassword1 !== passwordForm.value.newPassword2) {
    passwordError.value = dat === 'datakril' ? translateText("Parollar bir xil emas") : "Parollar bir xil emas";
    return;
  }

  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${URL}/${ApiSubDomen.value}/${selectedId.value}/password`,
      {
        newPassword: passwordForm.value.newPassword2,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await getData();
    closeAllModals();
    resetAllForms();
  } catch (error) {
    passwordError.value = error.response?.data?.message || (dat === 'datakril' ? translateText("Parolni yangilashda xatolik") : "Parolni yangilashda xatolik");
    console.error("Error updating password:", error);
  } finally {
    isLoading.value = false;
  }
};

const removeAdmin = async () => {
  if (!selectedId.value) {
    console.error("No admin ID selected for deletion");
    return;
  }
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${URL}/${ApiSubDomen.value}/${selectedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getData();
    closeAllModals();
    resetAllForms();
  } catch (error) {
    console.error("Error deleting admin:", error.response?.data || error.message);
  } finally {
    isLoading.value = false;
  }
};

const handlePhoneFocus = () => {
  if (!form.value.phone || form.value.phone.trim() === '') {
    form.value.phone = '+998';
  }
};

const handlePhoneInput = (event) => {
  let value = event.target.value;
  if (!value.startsWith('+998')) {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length > 0) {
      form.value.phone = '+998' + numbersOnly;
    } else {
      form.value.phone = '+998';
    }
  } else {
    let numbers = value.replace(/\D/g, '').slice(3);
    if (numbers.length > 9) numbers = numbers.slice(0, 9);
    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    form.value.phone = formatted;
  }
};

const handleUpdatedPhoneFocus = () => {
  if (!updateForm.value.phone || updateForm.value.phone.trim() === '') {
    updateForm.value.phone = '+998';
  }
};

const handleUpdatedPhoneInput = (event) => {
  let value = event.target.value;
  if (!value.startsWith('+998')) {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length > 0) {
      updateForm.value.phone = '+998' + numbersOnly;
    } else {
      updateForm.value.phone = '+998';
    }
  } else {
    let numbers = value.replace(/\D/g, '').slice(3);
    if (numbers.length > 9) numbers = numbers.slice(0, 9);
    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    updateForm.value.phone = formatted;
  }
};

const handlePassportInput = (event) => {
  let value = event.target.value.toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 2) {
    const letters = value.slice(0, 2);
    const digits = value.slice(2, 9);
    value = letters + digits;
  } else {
    value = value.slice(0, 2);
  }
  form.value.passport = value;
};

const handleUpdatedPassportInput = (event) => {
  let value = event.target.value.toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 2) {
    const letters = value.slice(0, 2);
    const digits = value.slice(2, 9);
    value = letters + digits;
  } else {
    value = value.slice(0, 2);
  }
  updateForm.value.passport = value;
};

const handleJshhrInput = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  value = value.slice(0, 14);
  form.value.jshhr = value;
};

const handleUpdatedJshhrInput = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  value = value.slice(0, 14);
  updateForm.value.jshhr = value;
};

const handleProfileImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && validateImage(file)) {
    form.value.image = file;
  } else {
    createError.value = dat === 'datakril' ? translateText("Iltimos, to'g'ri profil rasmni yuklang (jpg/png)") : "Iltimos, to'g'ri profil rasmni yuklang (jpg/png)";
    form.value.image = null;
  }
};

const handleUpdatedProfileImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && validateImage(file)) {
    updateForm.value.image = file;
  } else {
    updateError.value = dat === 'datakril' ? translateText("Iltimos, to'g'ri profil rasmni yuklang (jpg/png)") : "Iltimos, to'g'ri profil rasmni yuklang (jpg/png)";
    updateForm.value.image = null;
  }
};

onMounted(() => {
  getData();

  socket.on("connect", () => {
    socket.emit("getOnlineAdmins");
  });

  socket.on("onlineAdmins", () => {
    checkOnlineStatus();
  });

  socket.on("adminOnlineUpdate", () => {
    checkOnlineStatus();
  });

  const interval = setInterval(() => {
    checkOnlineStatus();
  }, 60000);

  watch(modalState, (newState) => {
    const isAnyModalOpen = newState.create || newState.update || newState.delete || newState.password || newState.contextMenu !== null || newState.faceCapture;
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
  }, { deep: true });

  onUnmounted(() => {
    clearInterval(interval);
    socket.off("connect");
    socket.off("onlineAdmins");
    socket.off("adminOnlineUpdate");
    socket.disconnect();
    stopCamera();
  });
});
</script>