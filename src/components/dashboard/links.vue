<template>
  <div
    class="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 text-black/70 min-h-screen p-6"
  >
    <div class="mb-6 flex justify-end pr-2">
      <button
        @click="togle = true"
        class="text-gray-200 bg-[#27375e] px-6 py-2 rounded-2xl"
      >
        {{
          dat === "datakril"
            ? translateText("Yangi Link qo'shish")
            : "Yangi Link qo'shish"
        }}
      </button>
    </div>
    <div
      v-if="togle" @click="togle = false"
      class="fixed inset-0 z-40 flex justify-center items-center bg-black/50"
    >
      <div @click.stop
        class="bg-gray-100 relative border-2 border-gray-600 w-[600px] dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6"
      >
        <h1
          @click="togle = false"
          class="rotate-45 absolute z-40 cursor-pointer text-[50px] -top-3 right-2"
        >
          +
        </h1>
        <h2
          class="text-2xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          {{
            dat === "datakril"
              ? translateText("Yangi link qo'shish:")
              : "Yangi link qo'shish:"
          }}
        </h2>
        <form @submit.prevent="postLinks" class="space-y-4">
          <div>
            <label
              for="name"
              class="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >{{
                dat === "datakril"
                  ? translateText("Link nomini kiriting:")
                  : "Link nomini kiriting:"
              }}</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              :placeholder="
                dat === 'datakril'
                  ? translateText('Masalan: Ariza sud')
                  : 'Masalan: Ariza sud'
              "
              required
              class="mt-2 text-lg w-full p-2 border border-gray-600 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="link"
              class="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >{{
                dat === "datakril"
                  ? translateText("Linkni kiriting:")
                  : "Linkni kiriting:"
              }}</label
            >
            <input
              id="link"
              v-model="link"
              type="url"
              :placeholder="
                dat === 'datakril'
                  ? translateText('Masalan: https://arizasud.uz')
                  : 'Masalan: https://arizasud.uz'
              "
              required
              class="mt-2 w-full p-2 border border-gray-600 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 text-lg dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              @click="togle = false"
              class="px-4 py-2 w-full bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 w-full bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {{ dat === "datakril" ? translateText("Saqlash") : "Saqlash" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <ul class="grid container mx-auto grid-cols-4 gap-10">
      <li
        v-for="item in links"
        :key="item.id"
        @click="openUrl(item)"
        class="rounded-xl group hover:scale-105 duration-300 border border-gray-700 shadow-lg hover:dark:shadow-white/20 hover:shadow-black/20 overflow-hidden"
      >
        <div
          class="flex duration-300 items-center p-6 relative border-b-2 dark:border-white/70 border-gray-700 h-[150px] bg-[#ffff000] justify-center"
        >
          <img :src="getImgURL(item.url)" class="w-[70px]" alt="" />
          <div
            class="group-hover:bg-gradient-to-t duration-300 absolute inset-0 to-[#0000] from-black/40"
          ></div>
          <button
            @click.stop="openActionModal($event, item)"
            class="absolute rotate-90 text-[30px] top-1 right-0 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            ...
          </button>
        </div>
        <div
          class="text-center p-6 duration-300 bg-white dark:bg-gray-700 font-semibold text-lg mb-2 h-[100%]"
        >
          {{ dat === "datakril" ? translateText(item.name) : item.name }}
        </div>
      </li>
    </ul>
    <div class="fixed z-40 inset-0" @click="actionModalLink = null" v-if="actionModalLink">
    <div
      class="absolute z-40" @click.stop
      :style="{ top: modalPosition.y + 'px', left: modalPosition.x -150  + 'px' }"
    >
      <div
        class="bg-gray-100 relative border-2 border-gray-600 w-[300px] dark:bg-gray-800 p-4 rounded-xl shadow-md"
      >
        <div class="flex flex-col space-y-2">
          <button
            @click="editLink(actionModalLink)"
            class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            {{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}
          </button>
          <button
            @click="deleteLink(actionModalLink.id)"
            class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
          >
            {{ dat === "datakril" ? translateText("O'chirish") : "O'chirish" }}
          </button>
          <button
            @click="actionModalLink = null"
            class="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
          >
            {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
          </button>
        </div>
      </div>
    </div>
    </div>

    <div
      v-if="editingLink" @click="editingLink = null"
      class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
    >
      <div @click.stop
        class="bg-gray-100 relative border-2 border-gray-600 w-[600px] dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6"
      >
        <h1
          @click="editingLink = null"
          class="rotate-45 absolute z-40 cursor-pointer text-[50px] -top-3 right-2"
        >
          +
        </h1>
        <h2
          class="text-2xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          {{
            dat === "datakril"
              ? translateText("Linkni tahrirlash:")
              : "Linkni tahrirlash:"
          }}
        </h2>
        <form @submit.prevent="updateLink(editingLink)" class="space-y-4">
          <div>
            <label
              for="edit-name"
              class="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >{{
                dat === "datakril"
                  ? translateText("Link nomini kiriting:")
                  : "Link nomini kiriting:"
              }}</label
            >
            <input
              id="edit-name"
              v-model="editingLink.name"
              type="text"
              required
              class="mt-1 w-full p-2 border border-gray-600 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="edit-link"
              class="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >{{
                dat === "datakril"
                  ? translateText("Linkni kiriting:")
                  : "Linkni kiriting:"
              }}</label
            >
            <input
              id="edit-link"
              v-model="editingLink.url"
              type="url"
              required
              class="mt-1 w-full p-2 border border-gray-600 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex space-x-2">
            <button
              @click="editingLink = null"
              class="px-4 py-2 bg-gray-500 text-white text-lg w-full rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-teal-600 text-white text-lg w-full rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {{ dat === "datakril" ? translateText("Saqlash") : "Saqlash" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { URL } from "@/auth/url";
import translateText from "@/auth/Translate.js";

export default {
  data() {
    return {
      links: [],
      name: "",
      link: "",
      userId: parseInt(localStorage.getItem("id")),
      dat: localStorage.getItem("til") || "datalotin",
      intervalId: null,
      editingLink: null,
      togle: false,
      actionModalLink: null,
      modalPosition: { x: 0, y: 0 },
    };
  },
  methods: {
    translateText,
    async fetchLinks() {
      try {
        const response = await axios.get(URL + "/accauntant-links");
        this.links = response.data.sort((a, b) => a.id - b.id);
      } catch (error) {
        console.log(error);
      }
    },
    async postLinks() {
      try {
        const response = await axios.post(URL + "/accauntant-links", {
          name: this.name,
          url: this.link,
          userId: +this.userId,
        });
        this.name = "";
        this.link = "";
        this.togle = false;
        await this.fetchLinks();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteLink(linkId) {
      try {
        const response = await axios.delete(`${URL}/accauntant-links/${linkId}`);
        this.actionModalLink = null;
        await this.fetchLinks();
      } catch (error) {
        console.log(error);
      }
    },
    async updateLink(link) {
      try {
        const response = await axios.put(`${URL}/accauntant-links/${link.id}`, {
          name: link.name,
          url: link.url,
          userId: +this.userId,
        });
        this.editingLink = null;
        this.actionModalLink = null;
        await this.fetchLinks();
      } catch (error) {
        console.log(error);
      }
    },
    openUrl(link) {
      window.open(link.url, "_blank");
    },
    editLink(link) {
      this.editingLink = { ...link };
      this.actionModalLink = null;
    },
    getImgURL(img) {
      return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${img}&size=64`;
    },
    openActionModal(event, link) {
      const modalWidth = 200;
      const modalHeight = 150;
      let x = event.clientX + 10;
      let y = event.clientY + 10;
      const maxX = window.innerWidth - modalWidth;
      const maxY = window.innerHeight - modalHeight;

      if (x > maxX) x = maxX - 10;
      if (y > maxY) y = maxY - 10;
      if (x < 0) x = 10;
      if (y < 0) y = 10;

      this.modalPosition = { x, y };
      this.actionModalLink = link;
    },
    checkLanguageChange() {
      const currentLang = localStorage.getItem("til") || "datalotin";
      if (currentLang !== this.dat) {
        this.dat = currentLang;
      }
    },
  },
  async mounted() {
    await this.fetchLinks();
    this.intervalId = setInterval(this.checkLanguageChange, 0);
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
};
</script>
