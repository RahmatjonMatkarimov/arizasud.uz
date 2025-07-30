<template>
  <div>
    <!-- Header -->
    <header
      class="flex justify-between items-center px-3 sm:px-4 md:px-6 lg:px-8 w-full h-[70px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] fixed top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-900 dark:from-gray-900 dark:to-gray-700 text-white dark:text-gray-100 shadow-lg transition-colors duration-300">
      <div id="particles-js" class="absolute inset-0 w-full h-full -z-10 opacity-70 dark:opacity-50"></div>

      <!-- Logo Section -->
      <div class="flex items-center flex-shrink-0">
        <router-link to="/"
          class="flex justify-center items-center relative z-10 cursor-pointer transition-transform hover:scale-105 duration-300">
          <img src="/logo1.png" class="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px] xl:w-[280px] h-auto"
            alt="Logo" />
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu"
        class="md:hidden p-2 rounded-lg bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 border border-white/20 dark:border-gray-600/30">
        <Icon :icon="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6 text-white dark:text-gray-100" />
      </button>

      <!-- Desktop Controls -->
      <div class="hidden md:flex items-center justify-end gap-4 sm:gap-6 relative">
        <!-- Navigation Links -->
        <nav class="flex items-center space-x-4">
          <router-link to="/questions"
            class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/20 transition-all duration-300">
            {{ translateText('Savol va javoblar') }}
          </router-link>
          <router-link to="/Vokansiya"
            class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/20 transition-all duration-300">
            {{  translateText('Vokansiyalar') }}
          </router-link>
        </nav>

        <!-- Theme Toggle -->
        <button @click="toggleTheme"
          class="p-2 rounded-full bg-blue-500 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-110">
          <Icon :icon="theme === 'light' ? 'mdi:weather-sunny' : 'mdi:weather-night'"
            class="w-5 h-5 text-white dark:text-gray-100" />
        </button>

        <!-- Language Switcher -->
        <div class="relative">
          <button @click="toggleLanguageDropdown"
            class="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 border border-white/20 dark:border-gray-600/30 backdrop-blur-sm">
            <Icon icon="mdi:translate" class="w-4 h-4 text-white dark:text-gray-100" />
            <span class="text-sm font-medium text-white dark:text-gray-100">
              {{ getCurrentLanguageLabel() }}
            </span>
            <Icon :icon="languageDropdownOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="w-4 h-4 text-white dark:text-gray-100 transition-transform duration-300" />
          </button>

          <!-- Language Dropdown -->
          <div v-if="languageDropdownOpen"
            class="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden min-w-[140px] z-50 backdrop-blur-md">
            <div v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang.code)"
              class="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 group"
              :class="{ 'bg-blue-50 dark:bg-gray-700': isCurrentLanguage(lang.code) }">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                :class="getFlagStyle(lang.code)">
                {{ getFlagEmoji(lang.code) }}
              </div>
              <div class="flex flex-col">
                <span
                  class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {{ lang.label }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getLanguageFullName(lang.code) }}
                </span>
              </div>
              <Icon v-if="isCurrentLanguage(lang.code)" icon="mdi:check"
                class="w-4 h-4 text-blue-600 dark:text-blue-300 ml-auto" />
            </div>
          </div>
        </div>

        <!-- Login Button -->
        <button @click="router.push('/CommonerLogin')"
          class="bg-green-700 dark:bg-green-900 text-sm px-4 py-2 rounded-full hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 font-semibold shadow-md transform hover:scale-105">
          {{ $t('kabinetga_kirish') }}
        </button>

        <!-- Search Bar -->
        <div class="relative">
          <div
            class="flex w-[300px] lg:w-[400px] border-b-2 border-blue-200 dark:border-gray-500 items-center bg-white/10 dark:bg-gray-800/20 rounded-lg px-3 py-2 backdrop-blur-sm">
            <input type="search" v-model="searchQuery" @input="searchItems"
              class="bg-transparent text-sm w-full outline-none text-white dark:text-gray-100 placeholder-blue-200 dark:placeholder-gray-400"
              :placeholder="$t('qidiruv')">
            <Icon icon="mdi:search" class="w-5 h-5 text-white dark:text-gray-100 opacity-80" />
          </div>

          <!-- Search Results -->
          <div v-if="searchQuery && filteredData.length"
            class="absolute top-full mt-2 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md max-h-[400px] w-[300px] lg:w-[400px] overflow-y-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-600">
            <div v-for="item in filteredData" :key="item.id" @click="goToPath(item)"
              class="p-3 text-gray-800 dark:text-gray-100 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200">
              {{ item.name }}
            </div>
          </div>
          <div v-else-if="searchQuery && !filteredData.length"
            class="absolute top-full mt-2 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md w-[300px] lg:w-[400px] p-3 text-gray-600 dark:text-gray-400 text-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-600">
            {{ $t('hech_narsa') }}
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" @click="closeMobileMenu"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"></div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen"
      class="fixed top-[70px] right-0 w-full max-w-sm h-auto bg-white dark:bg-gray-800 shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out"
      :class="mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">
      <div class="p-4 space-y-4">
        <!-- Mobile Navigation -->
        <nav class="flex flex-col space-y-3">
          <router-link to="/"
            class="text-gray-800 dark:text-gray-100 font-medium p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
            @click="closeMobileMenu">
            {{ $t('home') }}
          </router-link>
          <router-link to="/about"
            class="text-gray-800 dark:text-gray-100 font-medium p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
            @click="closeMobileMenu">
            {{ $t('about') }}
          </router-link>
        </nav>

        <!-- Mobile Search -->
        <div class="relative">
          <div
            class="flex w-full border-2 border-blue-200 dark:border-gray-500 items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
            <input type="search" v-model="searchQuery" @input="searchItems"
              class="bg-transparent text-sm w-full outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              :placeholder="$t('qidiruv')">
            <Icon icon="mdi:search" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>

          <!-- Mobile Search Results -->
          <div v-if="searchQuery && filteredData.length"
            class="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-gray-800 max-h-[250px] overflow-y-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-600">
            <div v-for="item in filteredData" :key="item.id" @click="goToPath(item)"
              class="p-3 text-gray-800 dark:text-gray-100 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              {{ item.name }}
            </div>
          </div>
          <div v-else-if="searchQuery && !filteredData.length"
            class="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-400 text-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-600">
            {{ $t('hech_narsa') }}
          </div>
        </div>

        <!-- Mobile Controls -->
        <div class="space-y-3">
          <!-- Theme Toggle -->
          <button @click="toggleTheme"
            class="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
            <span class="text-gray-800 dark:text-gray-100 font-medium">
              {{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}
            </span>
            <Icon :icon="theme === 'light' ? 'mdi:moon' : 'mdi:sun'" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- Language Switcher -->
          <div class="relative">
            <button @click="toggleMobileLanguageDropdown"
              class="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <div class="flex items-center space-x-3">
                <span class="text-gray-800 dark:text-gray-100 font-medium">Language</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ getCurrentLanguageLabel() }}</span>
              </div>
              <Icon :icon="mobileLanguageDropdownOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
            </button>

            <!-- Mobile Language Dropdown -->
            <div v-if="mobileLanguageDropdownOpen"
              class="mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang.code)"
                class="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200 group"
                :class="{ 'bg-blue-50 dark:bg-gray-600': isCurrentLanguage(lang.code) }">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  :class="getFlagStyle(lang.code)">
                  {{ getFlagEmoji(lang.code) }}
                </div>
                <div class="flex flex-col flex-1">
                  <span
                    class="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                    {{ lang.label }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getLanguageFullName(lang.code) }}
                  </span>
                </div>
                <Icon v-if="isCurrentLanguage(lang.code)" icon="mdi:check"
                  class="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <button @click="handleMobileLogin"
            class="w-full bg-green-500 dark:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 shadow-md">
            {{ $t('kabinetga_kirish') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Marquee Section -->
    <section class="absolute z-10 w-full top-[70px] sm:top-[80px] md:top-[100px] lg:top-[120px] xl:top-[140px]" ref="container">
      <div class="overflow-hidden py-2 shadow-sm">
        <div class="flex whitespace-nowrap gap-6" ref="logoRow">
          <div class="flex-shrink-0 text-center flex items-center">
            <span
              class="text-red-500 dark:text-red-400 font-semibold text-[25px] px-4">
              {{ translateText(`Tizim hozircha sinov tariqasida ishga tushirilgan bo'lib, hozircha to'liq fa'oliyat
              ko'rsatmayapti.`) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Language Dropdown Overlay (Desktop) -->
    <div v-if="languageDropdownOpen && !mobileMenuOpen" @click="languageDropdownOpen = false"
      class="fixed inset-0 bg-transparent z-40 hidden md:block"></div>
  </div>
</template>

<script setup>
import { URL } from "@/auth/url";
import axios from "axios";
import { onMounted, onUnmounted, provide, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import gsap from "gsap";
import translateText from "@/auth/Translate copy";
import { Icon } from '@iconify/vue';

const router = useRouter();
const { locale, t } = useI18n();
const searchdata = ref([]);
const filteredData = ref([]);
const searchQuery = ref("");
const container = ref(null);
const logoRow = ref(null);
const logoScrollers = ref({});
const baseSpeed = 60;
const theme = ref(localStorage.getItem("theme") || "light");
const languageDropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const mobileLanguageDropdownOpen = ref(false);

const languages = ref([
  { code: "uzb", label: "O'ZB", fullName: "O'zbekcha" },
  { code: "ўзб", label: "ЎЗБ", fullName: "Ўзбекча" },
  { code: "ru", label: "РУС", fullName: "Русский" },
  { code: "en", label: "ENG", fullName: "English" },
]);

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
  document.documentElement.classList.toggle("dark", theme.value === "dark");
};

const toggleLanguageDropdown = () => {
  languageDropdownOpen.value = !languageDropdownOpen.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    languageDropdownOpen.value = false;
    mobileLanguageDropdownOpen.value = false;
  }
};

const toggleMobileLanguageDropdown = () => {
  mobileLanguageDropdownOpen.value = !mobileLanguageDropdownOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  mobileLanguageDropdownOpen.value = false;
};

const handleMobileLogin = () => {
  closeMobileMenu();
  router.push('/CommonerLogin');
};

const getCurrentLanguageLabel = () => {
  const currentLang = languages.value.find(lang => lang.code === locale.value);
  return currentLang ? currentLang.label : "O'ZB";
};

const getLanguageFullName = (code) => {
  const lang = languages.value.find(l => l.code === code);
  return lang ? lang.fullName : code;
};

const getFlagEmoji = (code) => {
  const flags = {
    'uzb': '🇺🇿',
    'ўзб': '🇺🇿',
    'ru': '🇷🇺',
    'en': '🇺🇸'
  };
  return flags[code] || '🌐';
};

const getFlagStyle = (code) => {
  return 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-600 dark:to-gray-700';
};

const isCurrentLanguage = (code) => {
  return locale.value === code;
};

const initiateLogoScroller = async () => {
  await nextTick();

  const row = logoRow.value;
  if (!row) {
    console.error("Logo row not found");
    return;
  }

  if (logoScrollers.value[row]) {
    logoScrollers.value[row].kill();
    delete logoScrollers.value[row];
  }

  const rowItems = Array.from(row.children);
  let rowWidth = row.scrollWidth;
  const containerWidth = window.innerWidth;

  if (!row.dataset.cloned) {
    let totalWidth = rowWidth;
    while (totalWidth < containerWidth * 2) {
      rowItems.forEach(item => {
        const clone = item.cloneNode(true);
        row.appendChild(clone);
        totalWidth += item.offsetWidth;
      });
    }
    rowWidth = row.scrollWidth;
    row.dataset.cloned = "true";
  }

  gsap.set(row, { x: containerWidth });
  const duration = rowWidth / baseSpeed;
  const tl = gsap.timeline({ repeat: -1, ease: "none" });
  tl.to(row, {
    x: -rowWidth,
    duration: duration,
    ease: "none",
  });

  logoScrollers.value[row] = tl;

  const pause = () => tl.pause();
  const resume = () => tl.resume();

  row.addEventListener("mouseenter", pause);
  row.addEventListener("mouseleave", resume);
  row.addEventListener("touchstart", pause);
  row.addEventListener("touchend", resume);
};

const goToPath = (value) => {
  const id = value.id;
  closeMobileMenu();

  if (value?.applications) {
    router.push(`aplications/${id}`);
  } else if (value?.services) {
    router.push(`path/${id}`);
  } else {
    router.push(`service/${id}`);
  }
};

const changeLanguage = (lang) => {
  const storageLang = lang === "uzb" ? "datalotin" : "datakril";
  locale.value = lang;
  localStorage.setItem("lang", storageLang);
  localStorage.setItem("til", storageLang);
  languageDropdownOpen.value = false;
  mobileLanguageDropdownOpen.value = false;
  closeMobileMenu();
  searchItems();

  setTimeout(() => {
    window.location.reload();
  }, 300);
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [courts, service, applications] = await Promise.all([
      axios.get(`${URL}/courts`, config),
      axios.get(`${URL}/services`, config),
      axios.get(`${URL}/applications`, config),
    ]);
    searchdata.value = [...courts.data, ...service.data, ...applications.data].filter(item => item.status === "active");
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
  }
};

const searchItems = () => {
  const query = searchQuery.value.toLowerCase().trim();
  filteredData.value = searchdata.value.filter(item =>
    item.name && item.name.toLowerCase().includes(query)
  );
};

const handleClickOutside = (event) => {
  if (languageDropdownOpen.value && !event.target.closest('.relative')) {
    languageDropdownOpen.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
    languageDropdownOpen.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeMobileMenu();
  }
};

onMounted(() => {
  if (theme.value === "dark") {
    document.documentElement.classList.add("dark");
  }

  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
  window.addEventListener('resize', handleResize);

  getData();
  initiateLogoScroller();

  const loadParticlesScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  loadParticlesScript()
    .then(() => {
      particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: theme.value === "dark" ? "#A0AEC0" : "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2 } },
          size: { value: 3, random: true, anim: { enable: true, speed: 15, size_min: 0.1 } },
          line_linked: { enable: true, distance: 120, color: theme.value === "dark" ? "#A0AEC0" : "#ffffff", opacity: 0.3, width: 1.5 },
          move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" },
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { grab: { distance: 180, line_linked: { opacity: 0.7 } }, push: { particles_nb: 3 } }
        },
        retina_detect: true,
      });
    })
    .catch(error => console.error("Particles.js yuklashda xatolik:", error));
});

onUnmounted(() => {
  Object.values(logoScrollers.value).forEach(tl => tl.kill());
  logoScrollers.value = {};
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
  window.removeEventListener('resize', handleResize);
});

provide("filteredData", filteredData);
</script>

<style scoped>
/* Custom breakpoint for extra small screens */
@media (min-width: 475px) {
  .xs\:w-\[120px\] {
    width: 120px;
  }

  .xs\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

#particles-js {
  @apply absolute inset-0 w-full h-full -z-10;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform 0.3s ease-in-out;
}

.mobile-menu-enter-from {
  transform: translateX(100%);
}

.mobile-menu-leave-to {
  transform: translateX(100%);
}

/* Smooth scrolling for mobile search results */
@media (max-width: 768px) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Better touch targets for mobile */
@media (max-width: 768px) {

  button,
  .cursor-pointer,
  a {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Prevent horizontal scroll on mobile */
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
}

/* Active router-link styling */
.router-link-active {
  @apply bg-white/20 dark:bg-gray-800/30 text-blue-200 dark:text-blue-300 font-bold;
}
</style>