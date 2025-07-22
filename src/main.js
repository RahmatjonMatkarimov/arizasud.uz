import { createApp } from 'vue';
import '@/style.css';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import ўзб from "@/kril.json";
import uzb from "@/lotin.json";
import axios from "axios"; 
import { Icon } from '@iconify/vue';
// ✅ Pinia import va yaratish
import { createPinia } from 'pinia';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.mjs';
// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faChartLine, 
  faFileInvoice, 
  faMoneyBillTransfer, 
  faMoneyCheckDollar, 
  faChartPie,faGlobe,
  faUser,
  faSearch,
  faBell
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faChartLine, 
  faFileInvoice, 
  faMoneyBillTransfer, 
  faMoneyCheckDollar, 
  faChartPie,
  faUser,
  faSearch,faGlobe,
  faBell
);

function getLocaleFromStorage() {
  const key = localStorage.getItem('til');
  return key === 'datalotin' ? 'uzb'
       : key === 'datakril' ? 'ўзб'
       : 'uzb';
}
const i18n = createI18n({
    legacy: false,
    locale: getLocaleFromStorage(),
    fallbackLocale: 'uzb',
    messages: { uzb, ўзб },
});


// IP location tekshirish
const checkLocation = async () => {
    try {
        const response = await axios.get("https://ipwhois.app/json/");
        const country = response.data.country_code; 
        if (country !== "UZ") {
            alert("Ushbu sayt faqat Oʻzbekiston hududida ishlaydi!");
            window.location.href = "https://google.com";
        }
    } catch (error) {
        console.error("Joylashuvni olishda xatolik:", error);
    }
};
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
    }).catch((err) => {
      console.error("Service Worker xatolik:", err)
    })
}
// App yaratish
const app = createApp(App);

// ✅ Pinia yaratish va ulash
const pinia = createPinia();
app.use(pinia); // << Bu qatorda xatolik bartaraf etiladi

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(i18n);
app.use(router);

// Global xatoliklar
app.provide("globalError", null); 
app.config.errorHandler = (err) => {
    console.error("Xatolik:", err);
    app.provide("globalError", 500); 
};
app.component('iconify-icon', Icon);
app.component('IconifyIcon', Icon);
// Joylashuvni tekshirib bo‘lgandan keyin mount qilish
checkLocation().then(() => {
    app.mount('#app'); 
});
