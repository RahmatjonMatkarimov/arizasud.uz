<template>
  <div>
    <section class="logo-scroller" ref="container">
      <div class="logo-scroller-content">
        <div class="logo-scroller-items" role="marquee">
          <div class="logo-scroller-row" ref="logoRow">
            <div class="logo-scroller-item">
              <span>Tizim hozircha sinov tariqasida ishga tushirilgan bo‘lib, hozircha to‘liq fa'oliyat
                ko‘rsatmayapti.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer Section -->
    <div
      class="flex mt-10 md:mt-12 justify-between text-white items-center px-3 w-full h-[70px] md:h-[150px] lg:h-[200px] opacity-[88%] relative bg-[#0033FF]">
      <div id="particles-js" class="absolute top-0 left-0 w-full h-full"></div>
      <div class="flex items-center">
        <div @click="router.push('/')" class="flex justify-center items-center relative sm:ml-2 sm:mx-10 z-10">
          <img src="/logo1.png" class="w-[170px] md:w-[330px] lg:w-[400px]" alt="Logo" />
        </div>
        <b
          class="lg:text-[18px] hidden lg:block 2xl:text-[23px] text-[10px] w-[80%] md:w-[60%] lg:w-[35%] z-0 uppercase">
          {{ $t('header') }}
        </b>
      </div>
      <div class="flex mr-2 flex-col lg:mt-10 items-end">
        <div>
          <span v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang.code)"
            class="mx-1 text-[13px] lg:text-[30px] hover:text-gray-300 duration-500 relative z-50 cursor-pointer">
            {{ lang.label }}
          </span>
        </div>
        <div class="flex mt-2 xl:w-[400px] border-b-2 justify-center items-center">
          <input type="search" v-model="searchQuery" @input="searchItems"
            class="bg-opacity-0 bg-[#0033FF] text-[10px] lg:text-[20px] text-ellipsis w-full relative z-50 outline-none"
            :placeholder="$t('qidiruv')">
          <label>
            <img src="/loupe.png" class="w-5" alt="Search">
          </label>
        </div>
        <div v-if="searchQuery && filteredData.length"
          class="absolute z-50 bg-white max-h-[500px] text-black mt-2 overflow-y-auto rounded shadow-lg">
          <div @click="goToPath(item)" v-for="item in filteredData" :key="item.id"
            class="p-2 text-black cursor-pointer">
            {{ item.name }}
          </div>
        </div>
        <div v-else-if="searchQuery && !filteredData.length"
          class="absolute bg-white text-black mt-2 w-full p-2 z-50 rounded shadow-lg">
          Hech narsa topilmadi
        </div>
      </div>
      <button @click="router.push('/CommonerLogin')"
        class="absolute hidden md:block top-1 text-[12px] lg:text-[16px] right-1 lg:right-4 lg:top-4 bg-[#1c9c32] px-6 py-2 rounded-2xl z-50 hover:bg-[#268a37] duration-500">
        {{ $t('kabinetga_kirish') }}
      </button>
    </div>
    <button @click="router.push('/CommonerLogin')"
      class="absolute md:hidden top-1 text-[12px] lg:text-[16px] right-1 lg:right-4 lg:top-4 bg-[#1c9c32] px-6 py-2 rounded-2xl z-50 hover:bg-[#268a37] duration-500">
      {{ $t('kabinetga_kirish') }}
    </button>
  </div>
</template>

<script setup>
import { URL } from "@/auth/url";
import axios from "axios";
import { onMounted, onUnmounted, provide, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const { locale } = useI18n();
const searchdata = ref([]);
const filteredData = ref([]);
const searchQuery = ref("");
const container = ref(null);
const logoRow = ref(null);
const logoScrollers = ref({});
const baseSpeed = 50; // Increased for smoother text scrolling

const languages = ref([
  { code: "uzb", label: "O‘ZB" },
  { code: "ўзб", label: "ЎЗБ" },
  { code: "ru", label: "РУС" },
  { code: "en", label: "ENG" },
]);

const initiateLogoScroller = async () => {
  await nextTick();

  const row = logoRow.value;
  if (!row) {
    console.error("Logo row not found");
    return;
  }

  // Cleanup existing animation
  if (logoScrollers.value[row]) {
    logoScrollers.value[row].kill();
    delete logoScrollers.value[row];
  }

  const rowItems = Array.from(row.children);
  let rowWidth = row.scrollWidth;
  const containerWidth = window.innerWidth;

  // Clone items to ensure seamless looping
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

  // Start from the right edge
  gsap.set(row, { x: containerWidth });

  // Calculate duration based on content width
  const duration = rowWidth / baseSpeed;

  // Create infinite animation
  const tl = gsap.timeline({ repeat: -1, ease: "none" });
  tl.to(row, {
    x: -rowWidth, // Move to the left until the entire width is off-screen
    duration: duration,
    ease: "none",
  });

  logoScrollers.value[row] = tl;

  // Add interactivity
  const pause = () => tl.pause();
  const resume = () => tl.resume();

  row.addEventListener("mouseenter", pause);
  row.addEventListener("mouseleave", resume);
  row.addEventListener("touchstart", pause);
  row.addEventListener("touchend", resume);
};

const goToPath = (value) => {
  const id = value.id;
  if (value?.applications) {
    router.push(`aplications/${id}`);
  } else if (value?.services) {
    router.push(`path/${id}`);
  } else {
    router.push(`service/${id}`);
  }
};

const changeLanguage = (lang) => {
  const data = lang === "uzb" ? "datalotin" : "datakril";
  locale.value = lang;
  localStorage.setItem("til", data);
  searchItems();
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

onMounted(() => {
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
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
          size: { value: 4, random: true, anim: { enable: true, speed: 20, size_min: 0.1 } },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 2 },
          move: { enable: true, speed: 3, direction: "none", random: false, straight: false, out_mode: "out" },
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { grab: { distance: 200, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true,
      });
    })
    .catch(error => console.error("Particles.js yuklashda xatolik:", error));
});

onUnmounted(() => {
  Object.values(logoScrollers.value).forEach(tl => tl.kill());
  logoScrollers.value = {};
});

provide("filteredData", filteredData);
</script>

<style scoped>
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

b {
  color: white;
  font-weight: bold;
}

.logo-scroller {
  position: absolute;
  width: 100%;
  top: 0;
  margin: 0 auto;
}

.logo-scroller-content {
  margin-top: 5px;
}

.logo-scroller-items {
  overflow: hidden;
  cursor: default;
}

.logo-scroller-row {
  display: flex;
  white-space: nowrap;
  gap: 20px;
}

.logo-scroller-item {
  flex: 0 0 auto;
  text-align: center;
  display: flex;
  align-items: center;
}

.logo-scroller-item span {
  display: inline-block;
  font-size: 25px;
  color: #ff0000;
  font-weight: bold;
}

@media (min-width: 1024px) {
  .logo-scroller-item span {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .logo-scroller-item span {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .logo-scroller-item span {
    font-size: 14px;
  }
}
</style>