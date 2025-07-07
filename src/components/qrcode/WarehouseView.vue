<template>
  <div
    class="min-h-screen transition-all duration-700 ease-in-out dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950"
  >
    <div class="max-w-7xl mx-auto p-8">
      <!-- Header -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 mb-8 group hover:shadow-3xl transition-all duration-700"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg"
              >
                <Icon icon="mdi:warehouse" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2"
                >
                  {{ dat === 'datakril' ? translateText(`Ombor Boshqaruvi`):`Ombor Boshqaruvi` }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 text-lg">
                  {{ dat === 'datakril' ? translateText(`Yangi mahsulotlarni qo'shing va mavjud omborni boshqaring`):`Yangi mahsulotlarni qo'shing va mavjud omborni boshqaring` }}
                </p>
              </div>
            </div>
            <button
              @click="openCreateModal"
              class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div class="relative z-10 flex items-center">
                <Icon icon="mdi:plus-circle-outline" class="mr-3 w-5 h-5" />
                {{ dat === 'datakril' ? translateText(`Yangi Mahsulot Qo'shish`):`Yangi Mahsulot Qo'shish` }}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        class="relative overflow-hidden bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-8 group hover:shadow-3xl transition-all duration-700"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-green-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>
        <div class="relative z-10">
          <h2
            class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
          >
            <div
              class="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mr-3 shadow-lg"
            >
              <Icon icon="mdi:view-list-outline" class="w-5 h-5 text-white" />
            </div>
            {{ dat === 'datakril' ? translateText(`Mavjud Mahsulotlar`):`Mavjud Mahsulotlar` }}
            <span
              class="ml-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-lg"
            >
              {{ warehouses.length }}
            </span>
          </h2>
          <button
            @click="exportToExcel"
            class="group relative px-6 py-3 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden mb-6"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-700 via-teal-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative z-10 flex items-center">
              <Icon icon="mdi:file-excel-outline" class="mr-2 w-5 h-5" />
              {{ dat === 'datakril' ? translateText(`Excel-da Yuklab Olish`):`Excel-da Yuklab Olish` }}
            </div>
          </button>

          <div v-if="warehouses.length === 0" class="text-center py-16">
            <div class="relative mb-8">
              <div
                class="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl"
              >
                <Icon
                  icon="mdi:package-variant-closed"
                  class="w-16 h-16 text-gray-400 dark:text-gray-500"
                />
              </div>
              <div
                class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-bounce"
              ></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              {{ dat === 'datakril' ? translateText(`Hozircha mahsulotlar mavjud emas`):`Hozircha mahsulotlar mavjud emas` }}
            </h3>
            <p class="text-gray-500 dark:text-gray-500 text-lg">
              {{ dat === 'datakril' ? translateText(`Yangi mahsulot qo'shish uchun yuqoridagi tugmani bosing`):`Yangi mahsulot qo'shish uchun yuqoridagi tugmani bosing` }}
            </p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
          >
            <div
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              @click="viewDetails(warehouse.id)"
              class="group z-30 relative bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-700/90 dark:to-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-gray-600/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>

              <div class="relative z-10">
                <!-- Product Header -->
                <div class="flex items-start justify-between mb-6">
                  <h3
                    class="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  >
                    {{ dat === 'datakril' ? translateText(warehouse.name):warehouse.name }}
                  </h3>
                  <div class="flex flex-col items-end gap-2">
                    <span
                      class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg"
                    >
                      {{ warehouse.quantity }} dona
                    </span>
                    <div
                      v-if="warehouse.condition"
                      class="px-2 py-1 text-xs font-semibold rounded-lg"
                      :class="getConditionStyle(warehouse.condition)"
                    >
                      {{ dat === 'datakril' ? translateText(getConditionText(warehouse.condition)):getConditionText(warehouse.condition) }}
                    </div>
                  </div>
                </div>

                <!-- Product Images (One Image and QR Code) -->
                <div class="flex gap-4 mb-6">
                  <div
                    v-if="warehouse.images && warehouse.images.length > 0"
                    class="relative group flex-shrink-0"
                  >
                    <img
                      :src="URL + warehouse.images[0].imageUrl"
                      alt="Mahsulot rasmi"
                      class="w-24 h-24 object-cover rounded-xl border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"
                    ></div>
                  </div>
                  <div
                    v-if="warehouse.qrCodeUrl"
                    class="relative group flex-shrink-0"
                  >
                    <img
                      :src="URL + warehouse.qrCodeUrl"
                      alt="QR kod"
                      class="w-24 h-24 object-cover rounded-xl border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"
                    ></div>
                  </div>
                  <div
                    v-if="!warehouse.images || warehouse.images.length === 0 && !warehouse.qrCodeUrl"
                    class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center"
                  >
                    <span class="text-gray-500 dark:text-gray-400 text-sm">{{ dat === 'datakril' ? translateText(`Rasm yo'q`):`Rasm yo'q` }}</span>
                  </div>
                </div>

                <!-- Product Details -->
                <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div v-if="warehouse.id" class="flex items-center">
                    <Icon icon="mdi:barcode" class="w-5 h-5 text-orange-500 mr-3" />
                    <span class="font-medium w-[50%]">S/N:</span>
                    <span class="font-mono">{{ warehouse.id }}</span>
                  </div>
                  <div v-if="warehouse.location" class="flex items-center">
                    <Icon
                      icon="mdi:map-marker-outline"
                      class="w-5 h-5 text-red-500 mr-3"
                    />
                    <span class="font-medium w-[50%]">{{ dat === 'datakril' ? translateText(`Joy`):`Joy` }}:</span>
                    <span class="font-semibold">{{ dat === 'datakril' ? translateText(warehouse.location):warehouse.location }}</span>
                  </div>
                  <div v-if="warehouse.purchaseDate" class="flex items-center">
                    <Icon
                      icon="mdi:calendar-outline"
                      class="w-5 h-5 text-cyan-500 mr-3"
                    />
                    <span class="font-medium w-[50%]">{{ dat === 'datakril' ? translateText(`Sana`):`Sana` }}:</span>
                    <span>{{ formatDate(warehouse.purchaseDate) }}</span>
                  </div>
                  <div v-if="warehouse.collection" class="flex items-center">
                    <Icon icon="mdi:archive-outline" class="w-5 h-5 text-teal-500 mr-3" />
                    <span class="font-medium w-[50%]">{{ dat === 'datakril' ? translateText(`To'liq to'plam:`):`To'liq to'plam:` }}</span>
                    <span>{{ warehouse.collection ? dat === 'datakril' ? translateText(`Ha`):`Ha` : dat === 'datakril'? translateText("Yo'q"):"Yo'q" }}</span>
                  </div>
                  <div v-if="warehouse.whomBelongs" class="flex items-center">
                    <Icon
                      icon="mdi:account-tie-outline"
                      class="w-5 h-5 text-amber-400 mr-3"
                    />
                    <span class="font-medium w-[50%]">{{ dat === 'datakril' ? translateText(`Mas'ul shaxs`):`Mas'ul shaxs` }}:</span>
                    <span>{{ dat === 'datakril' ? translateText(warehouse.whomBelongs):warehouse.whomBelongs }}</span>
                  </div>
                  <div v-if="warehouse.user" class="flex items-center">
                    <Icon
                      icon="mdi:account-outline"
                      class="w-5 h-5 text-blue-500 mr-3"
                    />
                    <span class="font-medium w-[50%]">{{ dat === 'datakril' ? translateText(`Foydalanuvchi`):`Foydalanuvchi` }}:</span>
                    <span>{{ dat === 'datakril' ? translateText(warehouse.user.name):warehouse.user.name }}</span>
                  </div>
                </div>
                <div
                  class="mb-6 pt-4 border-t border-gray-200/50 dark:border-gray-600/50"
                >
                  <div v-if="warehouse.reports?.length" class="space-y-2">
                  </div>
                  <p v-else class="text-sm text-gray-500 dark:text-gray-500">
                    {{ dat === 'datakril' ? translateText(`Hozircha hisobotlar yo'q`):`Hozircha hisobotlar yo'q` }}
                  </p>
                </div>
                <div class="flex justify-end gap-3">
                  <button
                    @click.stop="openEditModal(warehouse)"
                    class="group relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 relative z-10" />
                  </button>
                  <button
                    @click.stop="openDeleteModal(warehouse)"
                    class="group relative p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <Icon icon="mdi:delete-outline" class="w-5 h-5 relative z-10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showCreateModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeCreateModal"
        >
          <div
            class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-3xl m-4 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden transition-all duration-300"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5"
            ></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center"
                >
                  <div
                    class="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl mr-3 shadow-md"
                  >
                    <Icon icon="mdi:plus-circle-outline" class="w-5 h-5 text-white" />
                  </div>
                  {{ dat === 'datakril' ? translateText(`Yangi Mahsulot Qo'shish`):`Yangi Mahsulot Qo'shish` }}
                </h3>
                <button
                  @click="closeCreateModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>
              <form @submit.prevent="createWarehouse" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon icon="mdi:tag-outline" class="w-4 h-4 text-blue-500 mr-2" />
                      {{ dat === 'datakril' ? translateText(`Mahsulot Nomi`):`Mahsulot Nomi` }} *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      :placeholder="dat === 'datakril' ? translateText(`Mahsulot nomini kiriting`):'Mahsulot nomini kiriting'"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon icon="mdi:numeric" class="w-4 h-4 text-green-500 mr-2" />
                      {{ dat === 'datakril'? translateText(`Miqdori`):`Miqdori` }} *
                    </label>
                    <input
                      v-model.number="form.quantity"
                      type="number"
                      min="1"
                      :placeholder="dat === 'datakril' ? translateText('Miqdorni kiriting'):'Miqdorni kiriting'"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon
                        icon="mdi:check-circle-outline"
                        class="w-4 h-4 text-purple-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Holati`):`Holati` }} *
                    </label>
                    <select
                      v-model="form.condition"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="">{{ dat === 'datakril' ? translateText(`Holatni tanlang`):`Holatni tanlang` }}</option>
                      <option value="yangi">✨ {{ dat === 'datakril'? translateText(`Yangi`):`Yangi` }}</option>
                      <option value="yaxshi">👍 {{ dat === 'datakril' ? translateText(`Yaxshi`):`Yaxshi` }}</option>
                      <option value="qoniqarli">👌 {{ dat === 'datakril' ? translateText(`Qoniqarli`):`Qoniqarli` }}</option>
                      <option value="tamirlash_kerak">🔧 {{ dat === 'datakril' ? translateText(`Tamirlash kerak`):`Tamirlash kerak` }}</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon
                        icon="mdi:map-marker-outline"
                        class="w-4 h-4 text-red-500 mr-2"
                      />
                      {{dat === 'datakril' ? translateText(`Turgan joyi`):`Turgan joyi` }} *
                    </label>
                    <input
                      v-model="form.location"
                      type="text"
                      :placeholder="dat === 'datakril' ? translateText(`Joyni kiriting (A-1, B-5, ...)`):`Joyni kiriting (A-1, B-5, ...)`"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon
                        icon="mdi:calendar-outline"
                        class="w-4 h-4 text-cyan-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Sotib Olingan Sana`):`Sotib Olingan Sana` }} *
                    </label>
                    <input
                      v-model="form.purchaseDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon
                        icon="mdi:package-variant"
                        class="w-4 h-4 text-indigo-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Butun komplekt keldimi?`):`Butun komplekt keldimi?` }}
                    </label>
                    <div
                      class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70"
                    >
                      <input
                        v-model="form.collection"
                        type="checkbox"
                        id="collection"
                        class="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <label
                        for="collection"
                        class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {{ dat === 'datakril' ? translateText(`Ha, butun komplekt`):`Ha, butun komplekt` }}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon
                        icon="mdi:account-outline"
                        class="w-4 h-4 text-blue-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Foydalanuvchi`):`Foydalanuvchi` }} *
                    </label>
                    <select
                      v-model="form.userId"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">{{ dat === 'datakril'? translateText(`Foydalanuvchini tanlang`):`Foydalanuvchini tanlang` }}</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ dat === 'datakril' ? translateText(user.name):user.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Icon icon="mdi:image-outline" class="w-4 h-4 text-pink-500 mr-2" />
                      {{ dat === 'datakril' ? translateText(`Mahsulot Rasmlari`):`Mahsulot Rasmlari` }}
                    </label>
                    <input
                      type="file"
                      @change="handleFile"
                      accept="image/*"
                      multiple
                      name="images"
                      class="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40 transition-all duration-200"
                    />
                    <div v-if="imagePreviews.length" class="mt-3 flex gap-3 flex-wrap">
                      <div v-for="(preview, index) in imagePreviews" :key="index" class="relative">
                        <img
                          :src="preview"
                          alt="Preview"
                          class="w-20 h-20 object-cover rounded-lg border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <button
                          @click="removeImage(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Icon icon="mdi:close" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Icon
                      icon="mdi:text-box-outline"
                      class="w-4 h-4 text-teal-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Tavsif`):`Tavsif` }}
                  </label>
                  <textarea
                    v-model="form.description"
                    :placeholder="dat === 'datakril' ? translateText(`Mahsulot haqida qo'shimcha ma'lumot...`):`Mahsulot haqida qo'shimcha ma'lumot...`"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 resize-none"
                  ></textarea>
                </div>
                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    @click="closeCreateModal"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                  >
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-4 h-4"
                    />
                    {{ loading ? dat === 'datakril' ? translateText(`Qo'shilmoqda...`):`Qo'shilmoqda...` : dat === 'datakril' ? translateText(`Qo'shish`):`Qo'shish` }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Warehouse Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeEditModal"
        >
          <div
            class="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl m-4 shadow-xl border border-white/20 dark:border-gray-700/30 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"
            ></div>
            <div class="relative z-10">
              <div
                class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/20 dark:border-gray-700/20"
              >
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {{ dat === 'datakril' ? translateText(`Mahsulotni Tahrirlash`):`Mahsulotni Tahrirlash` }}
                  </h3>
                </div>
                <button
                  @click="closeEditModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>
              <form @submit.prevent="updateWarehouse" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:tag-outline" class="w-4 h-4 text-blue-500 mr-2" />
                      {{ dat === 'datakril' ? translateText(`Mahsulot Nomi`):`Mahsulot Nomi` }} *
                    </label>
                    <input
                      v-model="editForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :placeholder="dat === 'datakril' ? translateText(`Mahsulot nomini kiriting`):`Mahsulot nomini kiriting`"
                    />
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:numeric" class="w-4 h-4 text-green-500 mr-2" />
                      {{ dat === 'datakril' ? translateText(`Miqdori`):`Miqdori` }} *
                    </label>
                    <input
                      v-model.number="editForm.quantity"
                      type="number"
                      min="1"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:check-circle-outline"
                        class="w-4 h-4 text-purple-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Holati`):`Holati` }}
                    </label>
                    <select
                      v-model="editForm.condition"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    >
                      <option value="">{{ dat === 'datakril' ? translateText(`Holatni tanlang`):`Holatni tanlang` }}</option>
                      <option value="yangi">✨ {{ dat === 'datakril'? translateText(`Yangi`):`Yangi` }}</option>
                      <option value="yaxshi">👍 {{ dat === 'datakril' ? translateText(`Yaxshi`):`Yaxshi` }}</option>
                      <option value="qoniqarli">👌 {{ dat === 'datakril' ? translateText(`Qoniqarli`):`Qoniqarli` }}</option>
                      <option value="tamirlash_kerak">🔧 {{ dat === 'datakril' ? translateText(`Tamirlash kerak`):`Tamirlash kerak` }}</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:map-marker-outline"
                        class="w-4 h-4 text-red-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Turgan joyi`):`Turgan joyi` }} *
                    </label>
                    <input
                      v-model="editForm.location"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="A-1, B-5, ..."
                    />
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:package-variant"
                        class="w-4 h-4 text-orange-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Butun komplekt keldimi?`):`Butun komplekt keldimi?` }}
                    </label>
                    <div
                      class="flex items-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-gray-300 dark:border-gray-600"
                    >
                      <input
                        v-model="editForm.collection"
                        type="checkbox"
                        class="w-4 h-4 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >{{ dat==='datakril'? translateText(`Barcha qismlar mavjud`):`Barcha qismlar mavjud` }}</span
                      >
                    </div>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:account-outline"
                        class="w-4 h-4 text-blue-500 mr-2"
                      />
                      {{ dat === 'datakril' ? translateText(`Foydalanuvchi`):`Foydalanuvchi` }} *
                    </label>
                    <select
                      v-model="editForm.userId"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">{{ dat === 'datakril' ? translateText(`Foydalanuvchini tanlang`):`Foydalanuvchini tanlang` }}</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ dat === 'datakril' ? translateText(user.name):user.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:image-outline" class="w-4 h-4 text-pink-500 mr-2" />
                      {{ dat === 'datakril' ? translateText(`Mahsulot rasmlari`):`Mahsulot rasmlari` }}
                    </label>
                    <input
                      type="file"
                      @change="handleEditFile"
                      accept="image/*"
                      multiple
                      name="images"
                      class="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white hover:border-pink-400 transition-colors"
                    />
                    <div v-if="editImagePreviews.length || editForm.images.length" class="mt-3 flex gap-3 flex-wrap">
                      <div
                        v-for="image in editForm.images"
                        :key="image.id"
                        class="relative"
                      >
                        <img
                          :src="URL + image.imageUrl"
                          alt="Existing Image"
                          class="w-20 h-20 object-cover rounded-lg border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <button
                          @click="removeExistingImage(image.id)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Icon icon="mdi:close" class="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        v-for="(preview, index) in editImagePreviews"
                        :key="'new-' + index"
                        class="relative"
                      >
                        <img
                          :src="preview"
                          alt="Preview"
                          class="w-20 h-20 object-cover rounded-lg border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <button
                          @click="removeEditImage(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Icon icon="mdi:close" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                  >
                    <Icon
                      icon="mdi:text-box-outline"
                      class="w-4 h-4 text-indigo-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Tavsif`):`Tavsif` }}
                  </label>
                  <textarea
                    v-model="editForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    :placeholder="dat === `datakril` ? translateText(`Mahsulot haqida qo'shimcha ma'lumot`):`Mahsulot haqida qo'shimcha ma'lumot`"
                  ></textarea>
                </div>
                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200/20 dark:border-gray-700/20"
                >
                  <button
                    type="button"
                    @click="closeEditModal"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-4 h-4"
                    />
                    <Icon v-else icon="mdi:content-save-outline" class="mr-2 w-4 h-4" />
                    {{ loading ? dat === 'datakril' ? translateText(`Saqlanmoqda...`):`Saqlanmoqda...` : dat === 'datakril' ? translateText(`Saqlash`):`Saqlash` }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeDeleteModal"
        >
          <div
            class="relative bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md m-6 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-orange-500/5"
            ></div>
            <div class="relative z-10">
              <h3
                class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
              >
                <div
                  class="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-3 shadow-lg"
                >
                  <Icon icon="mdi:delete-outline" class="w-5 h-5 text-white" />
                </div>
                {{ dat === 'datakril' ? translateText(`Mahsulotni O'chirish`):`Mahsulotni O'chirish` }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                "{{ dat === 'datakril' ? translateText(deleteWarehouse?.name):deleteWarehouse?.name }}" {{ dat === 'datakril' ? translateText(`mahsulotini o'chirishni tasdiqlaysizmi? Bu
                amal qaytarib bo'lmaydi.`):`mahsulotini o'chirishni tasdiqlaysizmi? Bu
                amal qaytarib bo'lmaydi.` }}
              </p>
              <div class="flex justify-end gap-2">
                <button
                  @click="closeDeleteModal"
                  class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                </button>
                <button
                  @click="deleteWarehouseAction"
                  :disabled="loading"
                  class="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-lg hover:shadow-xl focus:ring-4 focus:ring-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-red-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div class="relative z-10 flex items-center">
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-5 h-5"
                    />
                    {{ loading ? dat === 'datakril' ? translateText("O'chirilmoqda..."):"O'chirilmoqda..." : dat === 'datakril' ? translateText(`O'chirish`):`O'chirish` }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showCreateReportModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeCreateReportModal"
        >
          <div
            class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md m-4 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden transition-all duration-300"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-teal-500/5 to-blue-500/5"
            ></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center"
                >
                  <div
                    class="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mr-3 shadow-md"
                  >
                    <Icon icon="mdi:plus-circle-outline" class="w-5 h-5 text-white" />
                  </div>
                  {{ dat === 'datakril' ? translateText(`Yangi Hisobot Qo'shish`):`Yangi Hisobot Qo'shish` }}
                </h3>
                <button
                  @click="closeCreateReportModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>
              <form @submit.prevent="createReport" class="space-y-4">
                <div>
                  <label
                    class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Icon
                      icon="mdi:check-circle-outline"
                      class="w-4 h-4 text-purple-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Holati`):`Holati` }} *
                  </label>
                  <select
                    v-model="reportForm.status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                  >
                  <option value="">{{dat === 'datakril' ? translateText(`Holatni tanlang`):`Holatni tanlang`}}</option>
                    <option value="yangi">✨ {{ dat === 'datakril' ? translateText(`Yangi`): `Yangi` }}</option>
                    <option value="yaxshi">👍 {{ dat === 'datakril' ? translateText(`Yaxshi`):`Yaxshi` }}</option>
                    <option value="buzuq">🚫 {{ dat === 'datakril' ? translateText(`Buzuq`):`Buzuq` }}</option>
                  </select>
                </div>
                <div>
                  <label
                    class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Icon
                      icon="mdi:text-box-outline"
                      class="w-4 h-4 text-teal-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Izoh`):`Izoh` }}
                    <span v-if="reportForm.status === 'buzuq'" class="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="reportForm.description"
                    :placeholder="dat === 'datakril' ? translateText('Izoh kiriting (buzuq holatda majburiy)'):`Izoh kiriting (buzuq holatda majburiy)`"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 resize-none"
                    :required="reportForm.status === 'buzuq'"
                  ></textarea>
                </div>
                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    @click="closeCreateReportModal"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:shadow-lg focus:ring-4 focus:ring-green-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                  >
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-4 h-4"
                    />
                    {{ loading ? dat === 'datakril' ? translateText("Qo'shilmoqda..."):"Qo'shilmoqda..." : dat === 'datakril' ? translateText(`Qo'shish`):`Qo'shish` }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Report Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showEditReportModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeEditReportModal"
        >
          <div
            class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md m-4 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden transition-all duration-300"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"
            ></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center"
                >
                  <div
                    class="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3 shadow-md"
                  >
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 text-white" />
                  </div>
                  {{ dat === 'datakril' ? translateText(`Hisobotni Tahrirlash`):`Hisobotni Tahrirlash` }}
                </h3>
                <button
                  @click="closeEditReportModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>
              <form @submit.prevent="updateReport" class="space-y-4">
                <div>
                  <label
                    class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Icon
                      icon="mdi:check-circle-outline"
                      class="w-4 h-4 text-purple-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Holati`):`Holati` }} *
                  </label>
                  <select
                    v-model="editReportForm.status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                  >
                  <option value="">{{dat === 'datakril' ? translateText(`Holatni tanlang`):`Holatni tanlang`}}</option>
                    <option value="yangi">✨ {{ dat === 'datakril' ? translateText(`Yangi`):`Yangi` }}</option>
                    <option value="yaxshi">👍 {{ dat === 'datakril' ? translateText(`Yaxshi`):`Yaxshi` }}</option>
                    <option value="buzuq">🚫 {{ dat === 'datakril' ? translateText(`Buzuq`):`Buzuq` }}</option>
                  </select>
                </div>
                <div>
                  <label
                    class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Icon
                      icon="mdi:text-box-outline"
                      class="w-4 h-4 text-teal-500 mr-2"
                    />
                    {{ dat === 'datakril' ? translateText(`Izoh`):`Izoh` }}
                    <span v-if="editReportForm.status === 'buzuq'" class="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="editReportForm.description"
                    ::="dat === 'datakril' ? translateText(`Izoh kiriting (buzuq holatda majburiy)`):`Izoh kiriting (buzuq holatda majburiy)`"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 :-gray-400 dark::-gray-500 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 resize-none"
                    :required="editReportForm.status === 'buzuq'"
                  ></textarea>
                </div>
                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    @click="closeEditReportModal"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                  >
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-4 h-4"
                    />
                    {{ loading ? dat === 'datakril' ? translateText(`Saqlanmoqda...`): `Saqlanmoqda...` : dat === 'datakril' ? translateText(`Saqlash`):`Saqlash` }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Report Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="showDeleteReportModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          @click="closeDeleteReportModal"
        >
          <div
            class="relative bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md m-6 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden"
            @click.stop
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-orange-500/5"
            ></div>
            <div class="relative z-10">
              <h3
                class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
              >
                <div
                  class="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-3 shadow-lg"
                >
                  <Icon icon="mdi:delete-outline" class="w-5 h-5 text-white" />
                </div>
                {{ dat === 'datakril' ? translateText(`Hisobotni O'chirish`):`Hisobotni O'chirish` }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                {{ dat === 'datakril' ? translateText(`Ushbu hisobotni o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.`):`Ushbu hisobotni o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.` }}
              </p>
              <div class="flex justify-end gap-2">
                <button
                  @click="closeDeleteReportModal"
                  class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
                </button>
                <button
                  @click="deleteReportAction"
                  :disabled="loading"
                  class="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-lg hover:shadow-xl focus:ring-4 focus:ring-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-red-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div class="relative z-10 flex items-center">
                    <Icon
                      v-if="loading"
                      icon="mdi:loading"
                      class="animate-spin mr-2 w-5 h-5"
                    />
                  {{ loading ? dat === 'datakril' ? translateText(`O'chirilmoqda...`):`O'chirilmoqda...` : dat === 'datakril' ? translateText(`O'chirish`):`O'chirish` }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, inject } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { URL } from "@/auth/url.js";
import * as XLSX from "xlsx"; // Import xlsx library
import translateText from "@/auth/Translate";

const dat = ref(localStorage.getItem('til'));
const isLoading = inject('isLoading')
const route = useRoute();
const router = useRouter();
const warehouses = ref([]);
const users = ref([]);
const loading = ref(false);
const images = ref([]);
const editImages = ref([]);
const categoryId = ref(route.query.categoryId || null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showCreateReportModal = ref(false);
const showEditReportModal = ref(false);
const showDeleteReportModal = ref(false);
const deleteWarehouse = ref(null);
const deleteReport = ref(null);
const currentWarehouse = ref(null);

const form = ref({
  name: "",
  quantity: 1,
  collection: false,
  whomBelongs: "",
  description: "",
  condition: "",
  location: "",
  purchaseDate: "",
  userId: null,
});

const editForm = ref({
  id: null,
  name: "",
  quantity: 1,
  description: "",
  condition: "",
  collection: false,
  whomBelongs: "",
  location: "",
  purchaseDate: "",
  images: [],
  userId: null,
});

const reportForm = ref({
  warehouseId: null,
  userId: null,
  status: "",
  description: "",
});

const editReportForm = ref({
  id: null,
  status: "",
  description: "",
});

const themeClasses = computed(() => ({
  background: isDark.value ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100",
}));

const imagePreviews = computed(() => {
  return images.value.map(file => window.URL.createObjectURL(file));
});

const editImagePreviews = computed(() => {
  return editImages.value.map(file => window.URL.createObjectURL(file));
});

const isDark = ref(false);

const getConditionStyle = (condition) => {
  switch (condition) {
    case "yangi":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "yaxshi":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "qoniqarli":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "tamirlash_kerak":
    case "buzuq":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "";
  }
};

const getConditionText = (condition) => {
  switch (condition) {
    case "yangi":
      return "✨ Yangi";
    case "yaxshi":
      return "👍 Yaxshi";
    case "qoniqarli":
      return "👌 Qoniqarli";
    case "tamirlash_kerak":
      return "🔧 Tamirlash kerak";
    case "buzuq":
      return "🚫 Buzuq";
    default:
      return condition;
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${URL}/deliverer/allUsers`);
    users.value = data;
  } catch (error) {
    console.error("Foydalanuvchilarni yuklashda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchWarehouses = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${URL}/warehouse`, {
      params: { categoryId: route.query.categoryId },
    });
    warehouses.value = await Promise.all(
      data.map(async (warehouse) => {
        const reports = await axios.get(`${URL}/warehouse/report/${warehouse.id}`);
        return { ...warehouse, reports: reports.data };
      })
    );
  } catch (error) {
    console.error("Omborlarni yuklashda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleFile = (event) => {
  images.value = Array.from(event.target.files);
};

const handleEditFile = (event) => {
  editImages.value = Array.from(event.target.files);
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const removeEditImage = (index) => {
  editImages.value.splice(index, 1);
};

const removeExistingImage = async (imageId) => {
  isLoading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/image/${imageId}`);
    editForm.value.images = editForm.value.images.filter(img => img.id !== imageId);
  } catch (error) {
    console.error("Rasmni o'chirishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const createWarehouse = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("quantity", form.value.quantity.toString());
    formData.append("categoryId", parseFloat(route.query.id));
    formData.append("collection", form.value.collection.toString());
    formData.append("userId", form.value.userId.toString());
    if (form.value.description) formData.append("description", form.value.description);
    if (form.value.condition) formData.append("condition", form.value.condition);
    if (form.value.location) formData.append("location", form.value.location);
    if (form.value.purchaseDate) formData.append("purchaseDate", form.value.purchaseDate);
    images.value.forEach((file) => {
      formData.append(`images`, file);
    });

    await axios.post(`${URL}/warehouse`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    resetForm();
    closeCreateModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Mahsulot qo'shishda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const updateWarehouse = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", editForm.value.name);
    formData.append("quantity", editForm.value.quantity.toString());
    formData.append("collection", editForm.value.collection.toString());
    formData.append("userId", editForm.value.userId.toString());
    if (editForm.value.description)
      formData.append("description", editForm.value.description);
    if (editForm.value.condition) formData.append("condition", editForm.value.condition);
    if (editForm.value.location) formData.append("location", editForm.value.location);
    if (editForm.value.purchaseDate)
      formData.append("purchaseDate", editForm.value.purchaseDate);
    editImages.value.forEach((file) => {
      formData.append(`images`, file);
    });

    await axios.put(`${URL}/warehouse/${editForm.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    closeEditModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Mahsulotni yangilashda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const deleteWarehouseAction = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/${deleteWarehouse.value.id}`);
    closeDeleteModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Mahsulotni o'chirishda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const createReport = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    await axios.post(`${URL}/warehouse/report`, {
      warehouseId: reportForm.value.warehouseId,
      userId: reportForm.value.userId,
      status: reportForm.value.status,
      description: reportForm.value.status === "buzuq" ? reportForm.value.description : undefined,
    });
    resetReportForm();
    closeCreateReportModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Hisobot qo'shishda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const updateReport = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    await axios.put(`${URL}/warehouse/report/${editReportForm.value.id}`, {
      status: editReportForm.value.status,
      description: editReportForm.value.status === "buzuq" ? editReportForm.value.description : undefined,
    });
    closeEditReportModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Hisobotni yangilashda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const deleteReportAction = async () => {
  isLoading.value = true;
  loading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/report/${deleteReport.value.id}`);
    closeDeleteReportModal();
    await fetchWarehouses();
  } catch (error) {
    console.error("Hisobotni o'chirishda xatolik:", error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const viewDetails = (id) => {
  router.push(`/warehouseHouse/${id}`);
};

const openCreateModal = () => {
  resetForm();
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const openEditModal = (warehouse) => {
  editForm.value = {
    id: warehouse.id,
    name: warehouse.name,
    quantity: warehouse.quantity,
    collection: warehouse.collection,
    whomBelongs: warehouse.whomBelongs || "",
    description: warehouse.description || "",
    condition: warehouse.condition || "",
    location: warehouse.location || "",
    purchaseDate: warehouse.purchaseDate
      ? new Date(warehouse.purchaseDate).toISOString().split("T")[0]
      : "",
    images: warehouse.images || [],
    userId: warehouse.userId || null,
  };
  editImages.value = [];
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  resetEditForm();
};

const openDeleteModal = (warehouse) => {
  deleteWarehouse.value = warehouse;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteWarehouse.value = null;
};

const openCreateReportModal = (warehouse) => {
  currentWarehouse.value = warehouse;
  reportForm.value = {
    warehouseId: warehouse.id,
    userId: warehouse.userId,
    status: "",
    description: "",
  };
  showCreateReportModal.value = true;
};

const closeCreateReportModal = () => {
  showCreateReportModal.value = false;
  resetReportForm();
};

const openEditReportModal = (report, warehouse) => {
  currentWarehouse.value = warehouse;
  editReportForm.value = {
    id: report.id,
    status: report.status,
    description: report.description || "",
  };
  showEditReportModal.value = true;
};

const closeEditReportModal = () => {
  showEditReportModal.value = false;
  resetEditReportForm();
};

const openDeleteReportModal = (report) => {
  deleteReport.value = report;
  showDeleteReportModal.value = true;
};

const closeDeleteReportModal = () => {
  showDeleteReportModal.value = false;
  deleteReport.value = null;
};

const resetForm = () => {
  form.value = {
    name: "",
    quantity: 1,
    description: "",
    condition: "",
    location: "",
    purchaseDate: "",
    whomBelongs: "",
    collection: false,
    userId: null,
  };
  images.value = [];
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => (input.value = ""));
};

const resetEditForm = () => {
  editForm.value = {
    id: null,
    name: "",
    quantity: 1,
    description: "",
    condition: "",
    location: "",
    purchaseDate: "",
    images: [],
    whomBelongs: "",
    collection: false,
    userId: null,
  };
  editImages.value = [];
};

const resetReportForm = () => {
  reportForm.value = {
    warehouseId: null,
    userId: null,
    status: "",
    description: "",
  };
};

const resetEditReportForm = () => {
  editReportForm.value = {
    id: null,
    status: "",
    description: "",
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ");
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

const exportToExcel = () => {
  const data = warehouses.value.map(warehouse => ({
    "Mahsulot Nomi": warehouse.name,
    "Miqdori": warehouse.quantity + " dona",
    "Holati": getConditionText(warehouse.condition),
    "Joy": warehouse.location || "-",
    "Sotib Olingan Sana": warehouse.purchaseDate ? formatDate(warehouse.purchaseDate) : "-",
    "To'liq To'plam": warehouse.collection ? "Ha" : "Yo'q",
    "Foydalanuvchi": warehouse.user?.name || "-",
    "Seriya raqami": warehouse.id || "-"
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Warehouses");
  XLSX.writeFile(workbook, "warehouses_data.xlsx");
};

onMounted(() => {
  fetchUsers();
  fetchWarehouses();
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(-20px);
  opacity: 0;
}
</style>