<template>
  <div class="min-h-screen transition-all duration-700 bg-gray-100 dark:bg-gray-900">
    <!-- Background Decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-float-slow bg-gray-300 dark:bg-gray-600"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-float-reverse bg-gray-300 dark:bg-gray-600"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10 animate-pulse-slow bg-gray-300 dark:bg-gray-600"
      ></div>
    </div>

    <div class="container mx-auto px-6 py-16 max-w-6xl relative z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="relative inline-block">
          <div
            class="absolute inset-0 rounded-3xl blur-xl opacity-20 animate-pulse-glow bg-gray-300 dark:bg-gray-600"
          ></div>
          <div
            class="relative inline-flex items-center gap-4 px-8 py-4 rounded-3xl backdrop-blur-sm border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 transition-all duration-500 hover:scale-105"
          >
            <div class="relative">
              <Icon
                icon="mdi:package-variant-closed"
                class="w-8 h-8 animate-bounce-subtle text-gray-700 dark:text-gray-300"
              />
              <div
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping bg-gray-300 dark:bg-gray-600"
              ></div>
            </div>
            <h1 class="text-3xl font-bold">
              {{ dat === 'datakril' ? translateText('Kategoriya Boshqaruvi') : 'Kategoriya Boshqaruvi' }}
            </h1>
          </div>
        </div>
        <p class="text-xl mt-6 opacity-80 animate-fade-in-up delay-200 text-gray-600 dark:text-gray-400">
          {{ dat === 'datakril' ? translateText('Mahsulot kategoriyalarini professional tarzda boshqaring') : 'Mahsulot kategoriyalarini professional tarzda boshqaring' }}
        </p>

        <!-- Stats Cards -->
        <div class="flex justify-center gap-6 mt-8">
          <div
            class="px-6 py-3 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300"
          >
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ categories.length }}</div>
            <div class="text-sm opacity-70 text-gray-600 dark:text-gray-400">
              {{ dat === 'datakril' ? translateText('Kategoriya') : 'Kategoriya' }}
            </div>
          </div>
          <div
            class="px-6 py-3 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-500"
          >
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalItems }}</div>
            <div class="text-sm opacity-70 text-gray-600 dark:text-gray-400">
              {{ dat === 'datakril' ? translateText('Mahsulot') : 'Mahsulot' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Add Button -->
      <div class="text-center mb-12">
        <button
          @click="openModal"
          class="group relative inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-500 hover:scale-110 shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100"
        >
          <div class="relative flex items-center gap-3">
            <div
              class="p-2 rounded-xl group-hover:rotate-90 transition-all duration-300 bg-gray-200/50 dark:bg-gray-700/50"
            >
              <Icon icon="mdi:plus-circle" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <span>
              {{ dat === 'datakril' ? translateText('Yangi Kategoriya Yaratish') : 'Yangi Kategoriya Yaratish' }}
            </span>
            <Icon icon="mdi:sparkles" class="w-5 h-5 animate-pulse text-gray-600 dark:text-gray-400" />
          </div>
        </button>
      </div>

      <!-- Categories Grid -->
      <div
        class="backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 transition-all duration-500 hover:shadow-lg"
      >
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-gray-200/50 dark:bg-gray-700/50">
              <Icon icon="mdi:layers" class="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ dat === 'datakril' ? translateText('Kategoriyalar') : 'Kategoriyalar' }}
              </h2>
              <p class="text-sm opacity-60 mt-1 text-gray-600 dark:text-gray-400">
                {{ dat === 'datakril' ? translateText('Barcha kategoriyalar ro\'yxati') : 'Barcha kategoriyalar ro\'yxati' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="px-4 py-2 rounded-full text-sm font-bold border border-gray-200 dark:border-gray-600 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:format-list-bulleted" class="w-5 h-5 inline-block mr-1" />
              {{ categories.length }}
            </div>
            <button
              class="p-2 rounded-xl transition-all duration-300 hover:scale-110 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
              @click="fetchCategories"
            >
              <Icon icon="mdi:refresh" class="w-5 h-4" />
            </button>
          </div>
        </div>
        <div v-if="categories.length === 0" class="text-center py-20 animate-fade-in">
          <div class="relative mb-8">
            <div
              class="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse bg-gray-300 dark:bg-gray-600"
            ></div>
            <Icon
              icon="mdi:package-variant-closed"
              class="relative w-24 h-24 mx-auto opacity-40 animate-float text-gray-700 dark:text-gray-300"
            />
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {{ dat === 'datakril' ? translateText('Kategoriyalar yo\'q') : 'Kategoriyalar yo\'q' }}
          </h3>
          <p class="text-lg opacity-60 mb-8 text-gray-600 dark:text-gray-400">
            {{ dat === 'datakril' ? translateText('Birinchi kategoriyangizni yarating va boshqarishni boshlang') : 'Birinchi kategoriyangizni yarating va boshqarishni boshlang' }}
          </p>
          <button
            @click="openModal"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-200/50 dark:hover:bg-blue-800/50"
          >
            <Icon icon="mdi:plus" class="w-5 h-5" />
            {{ dat === 'datakril' ? translateText('Kategoriya Yaratish') : 'Kategoriya Yaratish' }}
          </button>
        </div>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(cat, index) in categories"
            :key="cat.id"
            @click="goToWarehouse(cat.id)"
            class="group relative p-6 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:border-gray-300 dark:hover:border-gray-500"
            :class="`delay-${index * 100}`"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                >
                  <Icon icon="mdi:folder-outline" class="w-7 h-7 text-gray-700 dark:text-gray-300" />
                  <div
                    class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
                  >
                    {{ cat.warehouses?.length || 0 }}
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-lg transition-all duration-300 text-gray-900 dark:text-gray-100">
                    {{ dat === 'datakril' ? translateText(cat.name) : cat.name }}
                  </h3>
                  <p class="text-sm opacity-60 mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Icon icon="mdi:cube-outline" class="w-4 h-4" />
                    {{ cat.warehouses?.length || 0 }}
                    {{ dat === 'datakril' ? translateText('ta mahsulot') : 'ta mahsulot' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click.stop="editCategory(cat)"
                  class="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                >
                  <Icon icon="mdi:pencil" class="w-4 h-4" />
                </button>
                <button
                  @click.stop="openDeleteModal(cat)"
                  class="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                >
                  <Icon icon="mdi:delete" class="w-4 h-4" />
                </button>
                <Icon
                  icon="mdi:chevron-right"
                  class="w-6 h-6 transition-all duration-500 group-hover:translate-x-2 text-gray-600 dark:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
      <Transition name="modal-overlay">
        <div
          v-if="showModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="closeModal"
          role="dialog"
          aria-labelledby="create-modal-title"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 rounded-lg backdrop-blur-sm bg-black/50 dark:bg-black/70 transition-all duration-300"
          ></div>

          <!-- Create Modal Content -->
          <Transition name="modal-content">
            <div
              v-if="showModal"
              @click.stop
              class="relative w-full max-w-lg transform transition-all duration-500 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200/50 dark:bg-gray-700/50">
                    <Icon icon="mdi:plus" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 id="create-modal-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {{ dat === 'datakril' ? translateText('Yangi Kategoriya') : 'Yangi Kategoriya' }}
                    </h3>
                    <p class="text-xs opacity-70 text-gray-600 dark:text-gray-400">
                      {{ dat === 'datakril' ? translateText('Kategoriya ma\'lumotlarini kiriting') : 'Kategoriya ma\'lumotlarini kiriting' }}
                    </p>
                  </div>
                </div>
                <button
                  @click="closeModal"
                  class="p-2 rounded-lg hover:scale-110 transition-all duration-300 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                  aria-label="Close modal"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-6">
                <form @submit.prevent="createCategory" class="space-y-6">
                  <div class="space-y-2">
                    <label class="text-sm font-semibold flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      <Icon icon="mdi:tag-outline" class="w-4 h-4" />
                      {{ dat === 'datakril' ? translateText('Kategoriya nomi') : 'Kategoriya nomi' }}
                    </label>
                    <div class="relative">
                      <input
                        ref="modalInput"
                        v-model="name"
                        type="text"
                        :placeholder="dat === 'datakril' ? translateText('Masalan: Elektronika, Kiyim-kechak, Sport...') : 'Masalan: Elektronika, Kiyim-kechak, Sport...'"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white/50 dark:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-1"
                      />
                      <Icon
                        icon="mdi:tag-multiple-outline"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{{ dat === 'datakril' ? translateText('Minimum 2 ta harf') : 'Minimum 2 ta harf' }}</span>
                      <span>{{ name.length }}/50</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-300/50 dark:hover:bg-gray-600/50"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <Icon icon="mdi:close-circle-outline" class="w-4 h-4" />
                        {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                      </div>
                    </button>
                    <button
                      type="submit"
                      class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      :class="isSubmitting ? 'bg-gray-300/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-200/50 dark:hover:bg-blue-800/50'"
                      :disabled="isSubmitting"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <Icon
                          :icon="isSubmitting ? 'mdi:loading' : 'mdi:check-circle'"
                          class="w-4 h-4"
                          :class="{ 'animate-spin': isSubmitting }"
                        />
                        {{ isSubmitting ? (dat === 'datakril' ? translateText('Yaratilmoqda...') : 'Yaratilmoqda...') : (dat === 'datakril' ? translateText('Kategoriya Yaratish') : 'Kategoriya Yaratish') }}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Edit Modal -->
      <Teleport to="body">
        <Transition name="modal-overlay">
          <div
            v-if="showEditModal"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
            @click="closeEditModal"
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div
              class="absolute inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 transition-all duration-300"
            ></div>
            <Transition name="modal-content">
              <div
                v-if="showEditModal"
                @click.stop
                class="relative w-full rounded-lg max-w-lg transform transition-all duration-500 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
              >
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200/50 dark:bg-gray-700/50">
                      <Icon icon="mdi:pencil" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 id="edit-modal-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {{ dat === 'datakril' ? translateText('Kategoriyani Tahrirlash') : 'Kategoriyani Tahrirlash' }}
                      </h3>
                      <p class="text-xs opacity-70 text-gray-600 dark:text-gray-400">
                        {{ dat === 'datakril' ? translateText('Kategoriya nomini o\'zgartiring') : 'Kategoriya nomini o\'zgartiring' }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="closeEditModal"
                    class="p-2 rounded-lg hover:scale-110 transition-all duration-300 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    aria-label="Close modal"
                  >
                    <Icon icon="mdi:close" class="w-5 h-5" />
                  </button>
                </div>
                <div class="p-6">
                  <form @submit.prevent="updateCategory" class="space-y-6">
                    <div class="space-y-2">
                      <label class="text-sm font-semibold flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Icon icon="mdi:tag-outline" class="w-4 h-4" />
                        {{ dat === 'datakril' ? translateText('Kategoriya nomi') : 'Kategoriya nomi' }}
                      </label>
                      <div class="relative">
                        <input
                          ref="editModalInput"
                          v-model="editName"
                          type="text"
                          :placeholder="dat === 'datakril' ? translateText('Masalan: Elektronika, Kiyim-kechak, Sport...') : 'Masalan: Elektronika, Kiyim-kechak, Sport...'"
                          required
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white/50 dark:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-1"
                        />
                        <Icon
                          icon="mdi:tag-multiple-outline"
                          class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                      <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{{ dat === 'datakril' ? translateText('Minimum 2 ta harf') : 'Minimum 2 ta harf' }}</span>
                        <span>{{ editName.length }}/50</span>
                      </div>
                    </div>
                    <div class="flex gap-3">
                      <button
                        type="button"
                        @click="closeEditModal"
                        class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-300/50 dark:hover:bg-gray-600/50"
                      >
                        <div class="flex items-center justify-center gap-1">
                          <Icon icon="mdi:close-circle-outline" class="w-4 h-4" />
                          {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                        </div>
                      </button>
                      <button
                        type="submit"
                        class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        :class="isSubmitting ? 'bg-gray-300/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-200/50 dark:hover:bg-blue-800/50'"
                        :disabled="isSubmitting"
                      >
                        <div class="flex items-center justify-center gap-1">
                          <Icon
                            :icon="isSubmitting ? 'mdi:loading' : 'mdi:check-circle'"
                            class="w-4 h-4"
                            :class="{ 'animate-spin': isSubmitting }"
                          />
                          {{ isSubmitting ? (dat === 'datakril' ? translateText('Saqlanmoqda...') : 'Saqlanmoqda...') : (dat === 'datakril' ? translateText('Saqlash') : 'Saqlash') }}
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <Transition name="modal-overlay">
          <div
            v-if="showDeleteModal"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
            @click="closeDeleteModal"
            role="dialog"
            aria-labelledby="delete-modal-title"
          >
            <div
              class="absolute inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 transition-all duration-300"
            ></div>
            <Transition name="modal-content">
              <div
                v-if="showDeleteModal"
                @click.stop
                class="relative w-full rounded-lg max-w-md transform transition-all duration-500 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
              >
                <div class="flex items-center justify-between p-6 border-b">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200/50 dark:bg-gray-700/50">
                      <Icon icon="mdi:delete" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 id="delete-modal-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {{ dat === 'datakril' ? translateText('Kategoriyani o\'chirish') : 'Kategoriyani o\'chirish' }}
                      </h3>
                      <p class="text-xs opacity-70 text-gray-600 dark:text-gray-400">
                        {{ dat === 'datakril' ? translateText('Haqiqatan ham bu kategoriyani o\'chirmoqchimisiz?') : 'Haqiqatan ham bu kategoriyani o\'chirmoqchimisiz?' }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="closeDeleteModal"
                    class="p-2 rounded-lg hover:scale-110 transition-all duration-300 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    aria-label="Close modal"
                  >
                    <Icon icon="mdi:close" class="w-5 h-5" />
                  </button>
                </div>
                <div class="p-6">
                  <div class="text-center mb-4">
                    <p class="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {{ dat === 'datakril' ? translateText(categoryToDelete?.name || '') : categoryToDelete?.name || '' }}
                    </p>
                    <p class="text-xs opacity-70 text-gray-600 dark:text-gray-400">
                      {{ dat === 'datakril' ? translateText('Bu amal qaytarib bo\'lmaydi') : 'Bu amal qaytarib bo\'lmaydi' }}
                    </p>
                  </div>
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="closeDeleteModal"
                      class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-300/50 dark:hover:bg-gray-600/50"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <Icon icon="mdi:close-circle-outline" class="w-4 h-4" />
                        {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                      </div>
                    </button>
                    <button
                      @click="deleteCategory"
                      class="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      :class="isDeleting ? 'bg-gray-400/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 cursor-not-allowed' : 'bg-red-200/50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-300/50 dark:hover:bg-red-800/50'"
                      :disabled="isDeleting"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <Icon
                          :icon="isDeleting ? 'mdi:loading' : 'mdi:delete'"
                          class="w-4 h-4"
                          :class="{ 'animate-spin': isDeleting }"
                        />
                        {{ isDeleting ? (dat === 'datakril' ? translateText('O\'chirilmoqda...') : 'O\'chirilmoqda...') : (dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish') }}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import  translateText from '@/auth/Translate';
import { URL } from '@/auth/url'; 

const dat = ref(localStorage.getItem('til') || 'datalatin');

let intervalId: ReturnType<typeof setInterval> | null = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalatin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 500);

  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const name = ref('');
const categories = ref([]);
const router = useRouter();
const isSubmitting = ref(false);
const showModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const categoryToEdit = ref(null);
const categoryToDelete = ref(null);
const isDeleting = ref(false);
const editName = ref('');
const modalInput = ref<HTMLInputElement | null>(null);
const editModalInput = ref<HTMLInputElement | null>(null);

const totalItems = computed(() => {
  return categories.value.reduce((total, cat) => total + (cat.warehouses?.length || 0), 0);
});

const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${URL}/category`);
    categories.value = data;
  } catch (error) {
    console.error('Kategoriyalarni olishda xatolik:', error);
  }
};

const createCategory = async () => {
  if (!name.value.trim() || name.value.length < 2) return;

  isSubmitting.value = true;

  try {
    await axios.post(`${URL}/categories`, { name: name.value });
    name.value = '';
    await fetchCategories();
    closeModal();
  } catch (error) {
    console.error('Error creating category:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const updateCategory = async () => {
  if (!editName.value.trim() || editName.value.length < 2 || !categoryToEdit.value) return;

  isSubmitting.value = true;

  try {
    await axios.patch(`${URL}/categories/${categoryToEdit.value.id}`, { name: editName.value });
    await fetchCategories();
    closeEditModal();
  } catch (error) {
    console.error('Error updating category:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  isDeleting.value = true;

  try {
    await axios.delete(`${URL}/categories/${categoryToDelete.value.id}`);
    await fetchCategories();
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting category:', error);
  } finally {
    isDeleting.value = false;
  }
};

const openModal = () => {
  showModal.value = true;
  nextTick(() => {
    setTimeout(() => {
      modalInput.value?.focus();
    }, 300);
  });
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    name.value = '';
    isSubmitting.value = false;
  }, 300);
};

const openEditModal = (category: any) => {
  categoryToEdit.value = category;
  editName.value = category.name;
  showEditModal.value = true;
  nextTick(() => {
    setTimeout(() => {
      editModalInput.value?.focus();
    }, 300);
  });
};

const closeEditModal = () => {
  showEditModal.value = false;
  setTimeout(() => {
    categoryToEdit.value = null;
    editName.value = '';
    isSubmitting.value = false;
  }, 300);
};

const openDeleteModal = (category: any) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  setTimeout(() => {
    categoryToDelete.value = null;
    isDeleting.value = false;
  }, 300);
};

const goToWarehouse = (categoryId: number) => {
  router.push({ path: '/warehouse', query: { id: categoryId } });
};

const editCategory = (category: any) => {
  openEditModal(category);
};

const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-reverse-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.3; }
}

@keyframes bounce-sub {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: transform 0.4s ease, opacity 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: translateY(-20px) scale(0.95);
  opacity: 0;
}

input:focus,
button:focus {
  outline: none;
}
</style>