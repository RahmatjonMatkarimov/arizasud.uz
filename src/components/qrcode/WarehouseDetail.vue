<template>
  <div
    class="min-h-screen transition-all duration-700 dark:bg-[#1a2642] dark:text-gray-200 ease-in-out"
  >
    <div class="max-w-4xl mx-auto p-8">
      <!-- Back and Print Buttons -->
      <div class="mb-6 flex gap-3">
        <button
          @click="goBack"
          class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative z-10 flex items-center">
            <Icon icon="mdi:arrow-left" class="mr-2 w-5 h-5" />
            {{ dat === "datakril" ? translateText(`Orqaga`) : `Orqaga` }}
          </div>
        </button>
        <!-- Print Receipt Buttons -->
        <button
          @click="printContent1"
          class="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
          :disabled="loading"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative z-10 flex items-center">
            <Icon icon="mdi:printer" class="mr-2 w-5 h-5" />
            {{ dat === "datakril" ? translateText(`Chek Chiqarish`) : `Chek Chiqarish` }}
            <br />
            {{ dat === "datakril" ? translateText(`(ENG kattasi)`) : `(ENG kattasi)` }}
          </div>
        </button>
        <button
          @click="printContent3"
          class="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
          :disabled="loading"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative z-10 flex items-center">
            <Icon icon="mdi:printer" class="mr-2 w-5 h-5" />
            {{ dat === "datakril" ? translateText(`Chek Chiqarish`) : `Chek Chiqarish` }}
            <br />
            {{ dat === "datakril" ? translateText(`(ENG kichik)`) : `(ENG kichik)` }}
          </div>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <Icon icon="mdi:loading" class="w-16 h-16 text-blue-500 animate-spin mx-auto" />
        <p class="text-gray-600 dark:text-gray-300 text-lg mt-4">
          {{ dat === "datakril" ? translateText(`Yuklanmoqda`) : `Yuklanmoqda` }}...
        </p>
      </div>
      <div v-else-if="error" class="text-center py-16">
        <div
          class="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Icon icon="mdi:alert-circle-outline" class="w-16 h-16 text-red-500" />
        </div>
        <h3 class="text-2xl font-bold text-red-600 dark:text-red-400 mt-4 mb-2">
          {{
            dat === "datakril" ? translateText(`Xatolik yuz berdi`) : `Xatolik yuz berdi`
          }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ dat === "datakril" ? translateText(error) : error }}
        </p>
      </div>
      <div
        v-else
        class="relative overflow-hidden bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-8 group hover:shadow-3xl transition-all duration-700"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>
        <div class="relative z-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div
                class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg"
              >
                <Icon icon="mdi:warehouse" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
                >
                  {{
                    dat === "datakril" ? translateText(warehouse.name) : warehouse.name
                  }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 text-lg mt-1">
                  {{
                    dat === "datakril"
                      ? translateText(warehouse.category?.name)
                      : warehouse.category?.name || "Kategoriya topilmadi"
                  }}
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <button
                @click="openEditModal"
                class="group relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <Icon icon="mdi:pencil-outline" class="w-5 h-5 relative z-10" />
              </button>
              <button
                @click="openDeleteModal"
                class="group relative p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <Icon icon="mdi:delete-outline" class="w-5 h-5 relative z-10" />
              </button>
            </div>
          </div>

          <!-- Images -->
          <div class="mb-8">
            <div class="image-container" :class="{ expanded: isExpanded }">
              <div
                v-if="warehouse.qrCodeUrl"
                class="image-wrapper"
                @click="toggleExpand"
                :style="{ '--index': 0 }"
              >
                <img
                  :src="URL + '/' + warehouse.qrCodeUrl"
                  alt="QR kod"
                  class="image-item"
                />
                <div class="image-overlay"></div>
              </div>
              <div
                v-for="(image, index) in warehouse.images"
                :key="image.id"
                @click="toggleExpand1(URL + '/' + image.imageUrl)"
                class="image-wrapper"
                :style="{ '--index': index + 1 }"
              >
                <img
                  :src="URL + '/' + image.imageUrl"
                  alt="Mahsulot rasmi"
                  class="image-item"
                />
                <div class="image-overlay"></div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <Icon icon="mdi:numeric" class="w-6 h-6 text-green-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{ dat === "datakril" ? translateText(`Miqdori`) : `Miqdori` }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200"
                  >{{ warehouse.quantity }}
                  {{ dat === "datakril" ? translateText(`dona`) : `dona` }}</span
                >
              </div>
              <div v-if="warehouse.id" class="flex items-center">
                <Icon icon="mdi:barcode" class="w-6 h-6 text-orange-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril" ? translateText(`Seriya Raqami`) : `Seriya Raqami`
                  }}:</span
                >
                <span class="ml-2 font-mono text-gray-800 dark:text-gray-200">{{
                  warehouse.id
                }}</span>
              </div>
              <div class="flex items-center">
                <Icon
                  icon="mdi:check-circle-outline"
                  class="w-6 h-6 text-purple-500 mr-3"
                />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{ dat === "datakril" ? translateText(`Holati`) : `Holati` }}:</span
                >
                <span class="ml-2" :class="getConditionStyle(warehouse.condition)">{{
                  getConditionText(warehouse.condition)
                }}</span>
              </div>
              <div v-if="warehouse.location" class="flex items-center">
                <Icon icon="mdi:map-marker-outline" class="w-6 h-6 text-red-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril" ? translateText(`Turgan joyi`) : `Turgan joyi`
                  }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200">{{
                  warehouse.location
                }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div v-if="warehouse.collection" class="flex items-center">
                <Icon icon="mdi:archive-outline" class="w-6 h-6 text-violet-300 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril"
                      ? translateText(`To'liq to'plam`)
                      : `To'liq to'plam`
                  }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200">
                  {{
                    warehouse.collection
                      ? dat === "datakril"
                        ? translateText(`Ha`)
                        : `Ha`
                      : dat === "datakril"
                      ? translateText("Yo'q")
                      : "Yo'q"
                  }}
                </span>
              </div>
              <div v-if="warehouse.whomBelongs" class="flex items-center">
                <Icon
                  icon="mdi:account-tie-outline"
                  class="w-6 h-6 text-emerald-500 mr-3"
                />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril" ? translateText(`Mas'ul shaxs`) : `Mas'ul shaxs`
                  }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200">
                  {{
                    dat === "datakril"
                      ? translateText(warehouse.whomBelongs)
                      : warehouse.whomBelongs
                  }}
                </span>
              </div>
              <div v-if="warehouse.category.name" class="flex items-center">
                <Icon icon="mdi:folder-outline" class="w-6 h-6 text-blue-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril" ? translateText(`Bo'lim nomi`) : `Bo'lim nomi`
                  }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200">
                  {{
                    dat === "datakril"
                      ? translateText(warehouse.category.name)
                      : warehouse.category.name
                  }}
                </span>
              </div>
              <div v-if="warehouse.purchaseDate" class="flex items-center">
                <Icon icon="mdi:calendar-outline" class="w-6 h-6 text-cyan-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >{{
                    dat === "datakril"
                      ? translateText(`Sotib Olingan Sana`)
                      : `Sotib Olingan Sana`
                  }}:</span
                >
                <span class="ml-2 text-gray-800 dark:text-gray-200">{{
                  formatDate(warehouse.purchaseDate)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="warehouse.description"
            class="border-t border-gray-200/50 dark:border-gray-600/50 pt-6"
          >
            <h3
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"
            >
              <Icon icon="mdi:text-box-outline" class="w-6 h-6 text-indigo-500 mr-3" />
              {{ dat === "datakril" ? translateText(`Tavsif`) : `Tavsif` }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{
                dat === "datakril"
                  ? translateText(warehouse.description)
                  : warehouse.description
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
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
              <!-- Header -->
              <div
                class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/20 dark:border-gray-700/20"
              >
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {{
                      dat === "datakril"
                        ? translateText(`Mahsulotni Tahrirlash`)
                        : `Mahsulotni Tahrirlash`
                    }}
                  </h3>
                </div>
                <button
                  @click="closeEditModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="updateWarehouse" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Product Name -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:tag-outline" class="w-4 h-4 text-blue-500 mr-2" />
                      {{
                        dat === "datakril"
                          ? translateText(`Mahsulot Nomi`)
                          : `Mahsulot Nomi`
                      }}
                      *
                    </label>
                    <input
                      v-model="editForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :placeholder="
                        dat === 'datakril'
                          ? translateText(`Mahsulot nomini kiriting`)
                          : `Mahsulot nomini kiriting`
                      "
                    />
                  </div>

                  <!-- Quantity -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:numeric" class="w-4 h-4 text-green-500 mr-2" />
                      {{ dat === "datakril" ? translateText(`Miqdori`) : `Miqdori` }} *
                    </label>
                    <input
                      v-model.number="editForm.quantity"
                      type="number"
                      min="1"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <!-- Condition -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:check-circle-outline"
                        class="w-4 h-4 text-purple-500 mr-2"
                      />
                      {{ dat === "datakril" ? translateText(`Holati`) : `Holati` }}
                    </label>
                    <select
                      v-model="editForm.condition"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    >
                      <option value="">
                        {{
                          dat === "datakril"
                            ? translateText(`Holatni tanlang`)
                            : `Holatni tanlang`
                        }}
                      </option>
                      <option value="yangi">
                        ✨ {{ dat === "datakril" ? translateText(`Yangi`) : `Yangi` }}
                      </option>
                      <option value="yaxshi">
                        👍 {{ dat === "datakril" ? translateText(`Yaxshi`) : `Yaxshi` }}
                      </option>
                      <option value="qoniqarli">
                        👌
                        {{
                          dat === "datakril" ? translateText(`Qoniqarli`) : `Qoniqarli`
                        }}
                      </option>
                      <option value="tamirlash_kerak">
                        🔧
                        {{
                          dat === "datakril"
                            ? translateText(`Tamirlash kerak`)
                            : `Tamirlash kerak`
                        }}
                      </option>
                    </select>
                  </div>

                  <!-- Location -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:map-marker-outline"
                        class="w-4 h-4 text-red-500 mr-2"
                      />
                      {{
                        dat === "datakril" ? translateText(`Turgan joyi`) : `Turgan joyi`
                      }}
                    </label>
                    <input
                      v-model="editForm.location"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="A-1, B-5, ..."
                    />
                  </div>

                  <!-- Collection -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:package-variant"
                        class="w-4 h-4 text-orange-500 mr-2"
                      />
                      {{
                        dat === "datakril"
                          ? translateText(`Butun komplekt keldimi?`)
                          : `Butun komplekt keldimi?`
                      }}
                    </label>
                    <div
                      class="flex items-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-gray-300 dark:border-gray-600"
                    >
                      <input
                        v-model="editForm.collection"
                        type="checkbox"
                        class="w-4 h-4 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{
                        dat === "datakril"
                          ? translateText(`Barcha qismlar mavjud`)
                          : `Barcha qismlar mavjud`
                      }}</span>
                    </div>
                  </div>

                  <!-- Responsible Person -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:account-outline"
                        class="w-4 h-4 text-teal-500 mr-2"
                      />
                      {{
                        dat === `datakril`
                          ? translateText(`Mas'ul shaxs`)
                          : `Mas'ul shaxs`
                      }}
                    </label>
                    <input
                      v-model="editForm.whomBelongs"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      :placeholder="
                        dat === 'datakril'
                          ? translateText(`Mas'ul shaxs ismi`)
                          : `Mas'ul shaxs ismi`
                      "
                    />
                  </div>

                  <!-- Purchase Date -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon
                        icon="mdi:calendar-outline"
                        class="w-4 h-4 text-cyan-500 mr-2"
                      />
                      {{
                        dat === "datakril"
                          ? translateText(`Sotib olingan sana`)
                          : `Sotib olingan sana`
                      }}
                    </label>
                    <input
                      v-model="editForm.purchaseDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <!-- Image Upload -->
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <Icon icon="mdi:image-outline" class="w-4 h-4 text-pink-500 mr-2" />
                      {{
                        dat === "datakril"
                          ? translateText(`Mahsulot rasmlari`)
                          : `Mahsulot rasmlari`
                      }}
                    </label>
                    <input
                      type="file"
                      @change="handleEditFile"
                      accept="image/*"
                      multiple
                      name="images"
                      class="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white hover:border-pink-400 transition-colors"
                    />
                    <div
                      v-if="editImagePreviews.length || editForm.images.length"
                      class="mt-3 flex gap-3 flex-wrap"
                    >
                      <!-- Existing Images -->
                      <div
                        v-for="image in editForm.images"
                        :key="image.id"
                        class="relative"
                      >
                        <img
                          :src="URL + '/' + image.imageUrl"
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
                      <!-- New Image Previews -->
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

                <!-- Description -->
                <div>
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                  >
                    <Icon
                      icon="mdi:text-box-outline"
                      class="w-4 h-4 text-indigo-500 mr-2"
                    />
                    {{ dat === "datakril" ? translateText(`Tavsif`) : `Tavsif` }}
                  </label>
                  <textarea
                    v-model="editForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    :placeholder="
                      dat === 'datakril'
                        ? translateText(`Mahsulot haqida qo'shimcha ma'lumot`)
                        : `Mahsulot haqida qo'shimcha ma'lumot`
                    "
                  ></textarea>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200/20 dark:border-gray-700/20"
                >
                  <button
                    type="button"
                    @click="closeEditModal"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{
                      dat === "datakril" ? translateText(`Bekor Qilish`) : `Bekor Qilish`
                    }}
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
                    {{
                      loading
                        ? dat === "datakril"
                          ? translateText(`Saqlanmoqda...`)
                          : `Saqlanmoqda...`
                        : dat === "datakril"
                        ? translateText(`Saqlash`)
                        : `Saqlash`
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Modal -->
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
                {{
                  dat === "datakril"
                    ? translateText(`Mahsulotni O'chirish`)
                    : `Mahsulotni O'chirish`
                }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                "{{
                  dat === "datakril" ? translateText(warehouse.name) : warehouse.name
                }}"
                {{
                  dat === "datakril"
                    ? translateText(`mahsulotini o'chirishni tasdiqlaysizmi? Bu amal
                qaytarib bo'lmaydi.`)
                    : `mahsulotini o'chirishni tasdiqlaysizmi? Bu amal
                qaytarib bo'lmaydi.`
                }}
              </p>
              <div class="flex justify-end gap-3">
                <button
                  @click="closeDeleteModal"
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  {{
                    dat === "datakril" ? translateText(`Bekor Qilish`) : `Bekor Qilish`
                  }}
                </button>
                <button
                  @click="deleteWarehouseAction"
                  :disabled="loading"
                  class="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl hover:shadow-xl focus:ring-4 focus:ring-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden font-semibold"
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
                    {{
                      loading
                        ? dat === "datakril"
                          ? translateText(`"O'chirilmoqda..."`)
                          : "O'chirilmoqda..."
                        : dat === "datakril"
                        ? translateText("O'chirish")
                        : "O'chirish"
                    }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
  <div v-if="isExpanded2" @click="isExpanded2 = null" class="bg-black/60 fixed flex justify-center items-center z-50 inset-0">
  <Icon icon="mdi:close" class="absolute text-white top-4 z-50 right-4 w-10 h-10 cursor-pointer" />
  
  <img @click.stop :src="isExpanded2" class="w-[400px]"  alt="">
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { URL } from "@/auth/url.js";
import { printContent } from "./print";
import translateText from "@/auth/Translate";
import { Trash } from "lucide-vue-next";
import { onUnmounted } from "vue";

const isExpanded1 = ref(false)
const isExpanded2 = ref('')
const route = useRoute();
const router = useRouter();
const warehouse = ref({});
const loading = ref(false);
const error = ref(null);
const isDark = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editImages = ref([]);
const isExpanded = ref(false);

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

const editForm = ref({
  id: null,
  name: "",
  quantity: 1,
  collection: false,
  whomBelongs: "",
  description: "",
  condition: "",
  location: "",
  purchaseDate: "",
  images: [],
});

const themeClasses = computed(() => ({
  background: isDark.value ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100",
}));

const editImagePreviews = computed(() => {
  return editImages.value.map((file) => URL.createObjectURL(file));
});

const getConditionStyle = (condition) => {
  switch (condition) {
    case "yangi":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-lg";
    case "yaxshi":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-lg";
    case "qoniqarli":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-lg";
    case "tamirlash_kerak":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-lg";
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
    default:
      return condition || "Noma'lum";
  }
};

const fetchWarehouse = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.get(`${URL}/warehouse/${route.params.id}`);
    warehouse.value = {
      ...data,
      images: data.images || [],
    };
    editForm.value = {
      id: data.id,
      name: data.name || "",
      quantity: data.quantity || 1,
      description: data.description || "",
      condition: data.condition || "",
      whomBelongs: data.whomBelongs || "",
      collection: data.collection || false,
      location: data.location || "",
      purchaseDate: data.purchaseDate
        ? new Date(data.purchaseDate).toISOString().split("T")[0]
        : "",
      images: data.images || [],
    };
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi";
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

const handleEditFile = (event) => {
  editImages.value = Array.from(event.target.files);
};

const removeEditImage = (index) => {
  editImages.value.splice(index, 1);
};

const removeExistingImage = async (imageId) => {
  try {
    await axios.delete(`${URL}/warehouse/image/${imageId}`);
    editForm.value.images = editForm.value.images.filter((img) => img.id !== imageId);
    await fetchWarehouse();
  } catch (error) {
    error.value = error.response?.data?.message || "Rasmni o'chirishda xatolik";
    console.error("Remove image error:", error);
  }
};

const updateWarehouse = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", editForm.value.name);
    formData.append("quantity", editForm.value.quantity.toString());
    formData.append("categoryId", warehouse.value.categoryId || "");
    formData.append("whomBelongs", editForm.value.whomBelongs || "");
    formData.append("collection", editForm.value.collection.toString());
    if (editForm.value.description)
      formData.append("description", editForm.value.description);
    if (editForm.value.condition) formData.append("condition", editForm.value.condition);
    if (editForm.value.location) formData.append("location", editForm.value.location);
    if (editForm.value.purchaseDate)
      formData.append("purchaseDate", editForm.value.purchaseDate);
    editImages.value.forEach((file, index) => {
      formData.append("images", file);
    });

    await axios.put(`${URL}/warehouse/${editForm.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    editImages.value = [];
    closeEditModal();
    await fetchWarehouse();
  } catch (err) {
    error.value =
      err.response?.data?.message || "Mahsulotni yangilashda xatolik yuz berdi";
    console.error("Update error:", err);
  } finally {
    loading.value = false;
  }
};

const deleteWarehouseAction = async () => {
  loading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/${warehouse.value.id}`);
    closeDeleteModal();
    router.push("/");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Mahsulotni o'chirishda xatolik yuz berdi";
    console.error("Delete error:", err);
  } finally {
    loading.value = false;
  }
};
function printContent1() {
  const printHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Print Receipt</title>
  <style>
    @page {
      size: 50mm 60mm;
      margin: 0mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 9px;
      line-height: 1.2;
      color: #000;
      width: 51mm;
      height: 56mm;
      overflow: hidden;
    }
    
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .decorative-line {
      border-top: 0.5px solid #000;
      margin: 1mm 0;
    }
    
    .header {
      text-align: center;
      margin-bottom: 1mm;
    }
    
    .header h4 {
      font-size: 8px;
      margin-top:5px;
      font-weight: bold;
      line-height: 1.2;
    }
    
    .content-wrapper {
      display: flex;
      flex-direction: column;
    }
    
    .info-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1mm;
    }
    
    .info-left {
      flex: 1;
    }
    
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .info-table td {
      font-size: 9px;
      padding: 0.5mm 0;
      vertical-align: top;
      line-height: 1.2;
    }
    
    .info-table td:first-child {
      font-weight: bold;
      width: 50%;
      padding-right: 1mm;
    }
    
    .info-table td:last-child {
      width: 50%;
      word-break: break-word;
    }
    
    .info-right {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .qr-code {
      width: 20mm;
      height: 20mm;
      border: 0.5px solid #ccc;
    }

    .par{
      font-size: 9px;
    
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .container {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h4>Bu mahsulot "YURIST KONSUL KONSALTING" kompaniyasida ro'yxatga olingan!</h4>
    </div>
    
    <div class="content-wrapper">
      <div class="info-section">
        <div class="info-left">
          <table class="info-table">
            <tr>
              <td>Nomi:</td>
              <td>${warehouse.value.name || "Noma'lum"}</td>
            </tr>
            <tr>
              <td>Miqdor:</td>
              <td>${warehouse.value.quantity || 0} dona</td>
            </tr>
            <tr>
              <td>Seriya:</td>
              <td>№${warehouse.value.id || "Mavjud emas"}</td>
            </tr>
            <tr>
              <td>Holat:</td>
              <td>${warehouse.value.condition || "Noma'lum"}</td>
            </tr>
            <tr>
              <td>Turgan joyi:</td>
              <td>${warehouse.value.location || "Ko'rsatilmagan"}</td>
            </tr>
            <tr>
              <td>To'liq to'plam:</td>
              <td>${warehouse.value.collection ? "Ha" : "Yo'q" || "Ko'rsatilmagan"}</td>
            </tr>
            <tr>
              <td>Mas\'ul shaxs:</td>
              <td>${warehouse.value.whomBelongs || "Ko'rsatilmagan"}</td>
            </tr>
            <tr>
              <td>Bo\'lim nomi:</td>
              <td>${warehouse.value.category.name || "Ko'rsatilmagan"}</td>
            </tr>
          </table>
        </div>
        </div>
        <div class="info-right">
      <p class="par">Chop etilgan ${new Date().toLocaleDateString("uz-UZ")}</p>
          <div class="qr-section">
            <img src="https://backend.arizasud.uz/${
              warehouse.value.qrCodeUrl
            }" alt="QR Code" class="qr-code" />
          </div>
        </div>
    </div>
  </div>
</body>
</html>
`;
  printContent(printHTML);
}

function printContent3() {
  const printHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Print Receipt</title>
  <style>
    @page {
      size: 140% 100%;
      margin: 0mm;
      text-align: center;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    

    
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: center;

    }
    .qr-code {
      width: 14mm;
      height: 14mm;
    }
    .par {
      font-size: 6px;
      font-weight: bold;
    }
    
    @media print {
      body {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        overflow: hidden;text-align: center;
        font-family: Arial, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .container {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">    
    <p class="par">"Yurist Konsul Konsalting" ga tegishli</p>
    <div>
      <img src="https://backend.arizasud.uz/${warehouse.value.qrCodeUrl}" alt="QR Code" class="qr-code" />
    </div>
  </div>
</body>
</html>`;
  printContent(printHTML);
}

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editImages.value = [];
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const toggleExpand1 = (img) => {
  isExpanded1.value = !isExpanded1.value;
  isExpanded2.value = img
};

const goBack = () => {
  router.go(-1);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date
    .toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
  fetchWarehouse();
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark").matches;
  }
});
</script>

<style scoped>
.image-container {
  position: relative;
  width: 220px;
  height: 220px;
  cursor: pointer;
  margin-bottom: 20px;
}

.image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  transition: all 0.4s ease;
}

.image-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-container:not(.expanded) .image-wrapper {
  transform: translate(calc(10px * var(--index)), calc(5px * var(--index)));
  z-index: calc(100 - var(--index));
}

.image-container.expanded {
  display: flex;
  flex-wrap: wrap;
  width: auto;
  height: auto;
  gap: 20px;
}

.image-container.expanded .image-wrapper {
  position: relative;
  top: auto;
  left: auto;
  transform: none;
  z-index: 0;
}
</style>
