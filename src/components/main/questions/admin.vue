```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
    <div class="container mx-auto px-4 py-8">
      <!-- Notification -->
      <div
        v-if="notification.show"
        :class="[
          'fixed top-5 right-5 z-50 min-w-[300px] p-4 rounded-lg text-white font-medium transition-transform duration-300',
          {
            'translate-x-0': notification.show,
            'translate-x-full': !notification.show,
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error',
            'bg-yellow-500': notification.type === 'warning',
            'bg-blue-500': notification.type === 'info',
          }
        ]"
      >
        {{ translateText(notification.message) }}
      </div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {{ translateText('Savollar') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {{ translateText("Savollar ro'yxati") }}
          </p>
        </div>

        <!-- Action Buttons (for both tabs) -->
        <div
          v-if="activeTab === 'unanswered' && data.length > 0 || activeTab === 'answered' && dataAllowed.length > 0"
          class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            {{ translateText('Jami') }}: {{ activeTab === 'unanswered' ? data.length : dataAllowed.length }} {{ translateText('ta savol') }}
          </div>

          <!-- Select All Button -->
          <button
            @click="toggleSelectAll"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Hammasini tanlash yoki bekor qilish')"
          >
            {{ isAllSelected ? translateText('Hammasini bekor qilish') : translateText('Hammasini tanlash') }}
          </button>

          <!-- Delete Button -->
          <button
            v-if="ids.length > 0"
            @click="openDeleteModal"
            class="relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
            :aria-label="translateText('Tanlangan savollarni o\'chirish')"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>{{ translateText('O\'chirish') }} ({{ ids.length }})</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'unanswered'"
          :class="[
            'px-4 py-2 font-semibold rounded-t-lg transition-all duration-200',
            activeTab === 'unanswered' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          role="tab"
          :aria-selected="activeTab === 'unanswered'"
          aria-controls="unanswered-questions"
        >
          {{ translateText('Javob berilmagan savollar') }}
        </button>
        <button
          @click="activeTab = 'answered'"
          :class="[
            'px-4 py-2 font-semibold rounded-t-lg transition-all duration-200',
            activeTab === 'answered' ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          role="tab"
          :aria-selected="activeTab === 'answered'"
          aria-controls="answered-questions"
        >
          {{ translateText('Javob berilgan savollar') }}
        </button>
      </div>

      <!-- Content -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unanswered Questions Tab -->
      <div v-else-if="activeTab === 'unanswered'" id="unanswered-questions" role="tabpanel" class="space-y-6">
        <div
          v-for="item in data"
          :key="item.id"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <div class="absolute inset-0 bg-blue-100/10 group-hover:bg-blue-200/20 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-start space-x-4">
              <!-- Custom Checkbox -->
              <div class="flex-shrink-0 mt-1">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="ids"
                    :value="item.id"
                    @click.stop
                    class="sr-only peer"
                    :aria-label="translateText(`Savolni tanlash: ${translateText(item.question)}`)"
                  />
                  <div class="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 peer-checked:border-blue-500 peer-hover:border-blue-400 transition-all duration-200 flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-white transition-opacity duration-200"
                      :class="{ 'opacity-0': !ids.includes(item.id), 'opacity-100': ids.includes(item.id) }"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- User Info -->
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {{ getInitials(item.name, item.surname) }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {{ translateText(item.name) }} {{ translateText(item.surname) }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ translateText('Savol beruvchi') }}
                    </p>
                  </div>
                </div>

                <!-- Question -->
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4 border-l-4 border-blue-500 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div class="flex items-start space-x-3 relative z-10">
                    <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <span class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{{ translateText('Savol') }}:</span>
                      <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-wrap-balance">
                        {{ translateText(item.question) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Date -->
                <div class="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ formatDate(item.createdAt) }}
                </div>

                <!-- Answer Button -->
                <div class="flex items-center space-x-2 mt-4">
                  <button
                    @click.stop="openModal(item)"
                    class="px-4 py,: 2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    :aria-label="translateText(`Javob yozish: ${translateText(item.question)}`)"
                  >
                    {{ translateText('Javob yozish') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="data.length > 0 && data.length >= page * perPage" class="mt-6 text-center">
          <button
            @click="page++"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yana savollar yuklash')"
          >
            {{ translateText('Yana yuklash') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="data.length === 0" class="text-center py-20">
          <div class="relative">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ translateText('Savollar yo\'q') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              {{ translateText('Hozircha javob berilmagan savollar mavjud emas') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Answered Questions Tab -->
      <div v-else-if="activeTab === 'answered'" id="answered-questions" role="tabpanel" class="space-y-6">
        <div
          v-for="item in dataAllowed"
          :key="item.id"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
        >
          <div class="absolute inset-0 bg-green-100/10 group-hover:bg-green-200/20 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-start space-x-4">
              <!-- Custom Checkbox -->
              <div class="flex-shrink-0 mt-1">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="ids"
                    :value="item.id"
                    @click.stop
                    class="sr-only peer"
                    :aria-label="translateText(`Savolni tanlash: ${translateText(item.question)}`)"
                  />
                  <div class="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-cyan-600 peer-checked:border-green-500 peer-hover:border-green-400 transition-all duration-200 flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-white transition-opacity duration-200"
                      :class="{ 'opacity-0': !ids.includes(item.id), 'opacity-100': ids.includes(item.id) }"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- User Info -->
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 via-teal-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {{ getInitials(item.name, item.surname) }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {{ translateText(item.name) }} {{ translateText(item.surname) }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ translateText('Savol beruvchi') }}
                    </p>
                  </div>
                </div>

                <!-- Question -->
                <div class="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4 border-l-4 border-green-500 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-cyan-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div class="flex items-start space-x-3 relative z-10">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <span class="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">{{ translateText('Savol') }}:</span>
                      <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-wrap-balance">
                        {{ translateText(item.question) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Answer -->
                <div class="mt-4 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4 border-l-4 border-teal-500 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div class="flex items-start space-x-3 relative z-10">
                    <div class="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <span class="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">{{ translateText('Javob') }}:</span>
                      <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-wrap-balance">
                        {{ translateText(item.answer || 'Javob hali yuklanmadi') }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Date -->
                <div class="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="dataAllowed.length > 0 && dataAllowed.length >= pageAllowed * perPage" class="mt-6 text-center">
          <button
            @click="pageAllowed++"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            :aria-label="translateText('Yana javob berilgan savollar yuklash')"
          >
            {{ translateText('Yana yuklash') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="dataAllowed.length === 0" class="text-center py-20">
          <div class="relative">
            <div class="w-32 h-32 bg-gradient-to-br from-green-100 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 animate-pulse"></div>
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ translateText('Savollar yo\'q') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              {{ translateText('Hozircha javob berilgan savollar mavjud emas') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Answer Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeModal"
        @keydown.esc="closeModal"
        tabindex="0"
        aria-modal="true"
        role="dialog"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-600/50">
            <div class="flex items-center justify-between">
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ translateText('Javob berish') }}
              </h2>
              <button
                @click="closeModal"
                class="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                :aria-label="translateText('Modalni yopish')"
              >
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- User Info -->
            <div class="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {{ getInitials(selectedItem.name, selectedItem.surname) }}
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl">
                  {{ translateText(selectedItem.name) }} {{ translateText(selectedItem.surname) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">{{ translateText('Savol beruvchi') }}</p>
              </div>
            </div>

            <!-- Question -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ translateText('Savol') }}
              </label>
              <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border-l-4 border-blue-500">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-wrap-balance">
                  {{ translateText(selectedItem.question) }}
                </p>
              </div>
            </div>

            <!-- Answer Input -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
                {{ translateText('Javobingiz') }}
              </label>
              <div class="relative">
                <textarea
                  v-model="answer"
                  :placeholder="translateText('Bu yerga javobingizni yozing...')"
                  maxlength="1000"
                  class="w-full p-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none min-h-[150px]"
                  :class="{ 'border-red-500 focus:ring-red-500': answer.length > 900 }"
                  rows="6"
                  :aria-label="translateText('Javob matni')"
                ></textarea>
                <div class="absolute bottom-3 right-3 text-sm" :class="{ 'text-red-500': answer.length > 900, 'text-gray-400': answer.length <= 900 }">
                  {{ answer.length }}/{{ translateText('1000 belgi') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <button
              @click="closeModal"
              class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              :aria-label="translateText('Bekor qilish')"
            >
              {{ translateText('Bekor qilish') }}
            </button>
            <button
              @click="submitAnswer"
              :disabled="!answer.trim() || isSubmitting"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-none relative"
              :class="{ 'opacity-50 cursor-not-allowed': !answer.trim() || isSubmitting }"
              :aria-label="translateText('Javob yuborish')"
            >
              <span v-if="!isSubmitting" class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ translateText('Javob yuborish') }}
              </span>
              <span v-else class="absolute inset-0 flex items-center justify-center">
                <svg class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeDeleteModal"
        @keydown.esc="closeDeleteModal"
        tabindex="0"
        aria-modal="true"
        role="dialog"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md" @click.stop>
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {{ translateText('O\'chirishni tasdiqlash') }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                  {{ translateText('Bu amalni bekor qilib bo\'lmaydi') }}
                </p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p class="text-red-800 dark:text-red-300 font-semibold text-lg">
                {{ ids.length }} {{ translateText('ta savol butunlay o\'chiriladi') }}
              </p>
              <p class="text-red-600 dark:text-red-400 text-sm mt-2">
                {{ translateText('Ushbu amalni bekor qilib bo\'lmaydi') }}
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="closeDeleteModal"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                :aria-label="translateText('Bekor qilish')"
              >
                {{ translateText('Bekor qilish') }}
              </button>
              <button
                @click="remove"
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 relative"
                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
                :aria-label="translateText('O\'chirish')"
              >
                <span v-if="!isSubmitting" class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  {{ translateText('Ha, o\'chirish') }}
                </span>
                <span v-else class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, computed, watch } from "vue";
import axios from "axios";
import { URL } from "@/auth/url";
import translateText from "@/auth/Translate copy";

// State
const data = ref([]);
const dataAllowed = ref([]);
const isLoading = inject("isLoading");
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref({});
const answer = ref("");
const ids = ref([]);
const page = ref(1);
const pageAllowed = ref(1);
const perPage = 10;
const isSubmitting = ref(false);
const notification = ref({ show: false, message: "", type: "info" });
const activeTab = ref("unanswered");

// Computed property for select all
const isAllSelected = computed(() => {
  const currentData = activeTab.value === 'unanswered' ? data.value : dataAllowed.value;
  return ids.value.length === currentData.length && currentData.length > 0;
});

// Helper functions
const getInitials = (name, surname) => {
  if (!name || !surname) return "?";
  return `${translateText(name).charAt(0)}${translateText(surname).charAt(0)}`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Handle invalid date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return "";
  }
};

const showNotification = (message, type = "info", duration = 3000) => {
  notification.value = { show: true, message: translateText(message), type };
  setTimeout(() => {
    notification.value = { show: false, message: "", type: "info" };
  }, duration);
};

const toggleSelectAll = () => {
  const currentData = activeTab.value === 'unanswered' ? data.value : dataAllowed.value;
  if (ids.value.length === currentData.length) {
    ids.value = [];
  } else {
    ids.value = currentData.map((item) => item.id);
  }
};

// API functions
const getQuestions = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `${URL}/question-answer?page=${
        activeTab.value === "unanswered" ? page.value : pageAllowed.value
      }&limit=${perPage}`
    );
    if (activeTab.value === "unanswered") {
      data.value = response.data.filter((item) => !item.isAnswered);
    } else {
      dataAllowed.value = response.data.filter((item) => item.isAnswered);
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    showNotification("Savollar yuklashda xatolik yuz berdi", "error");
  } finally {
    isLoading.value = false;
  }
};

const openModal = (item) => {
  selectedItem.value = item;
  answer.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = {};
  answer.value = "";
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const submitAnswer = async () => {
  if (!answer.value.trim()) return;

  isSubmitting.value = true;
  try {
    await axios.put(`${URL}/question-answer/${selectedItem.value.id}`, {
      answer: answer.value.trim(),
    });
    await getQuestions();
    closeModal();
    showNotification("Javob muvaffaqiyatli yuborildi", "success");
  } catch (error) {
    console.error("Error submitting answer:", error);
    showNotification("Javob yuborishda xatolik yuz berdi", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const remove = async () => {
  if (ids.value.length === 0) return;

  isSubmitting.value = true;
  try {
    await axios.delete(`${URL}/question-answer/archived`, {
      data: { ids: ids.value },
    });
    await getQuestions();
    ids.value = [];
    closeDeleteModal();
    showNotification(`${ids.value.length} ta savol o'chirildi`, "success");
  } catch (error) {
    console.error("Error removing questions:", error);
    showNotification("Savol o'chirishda xatolik yuz berdi", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// Watch tab changes to fetch data and clear selections
watch(activeTab, () => {
  if (activeTab.value === "unanswered") {
    page.value = 1;
  } else {
    pageAllowed.value = 1;
  }
  ids.value = []; // Clear selections when switching tabs
  getQuestions();
});

// Lifecycle
onMounted(() => {
  getQuestions();
});
</script>
```