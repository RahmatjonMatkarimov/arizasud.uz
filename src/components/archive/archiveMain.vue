<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-2xl pulse-light"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-2xl pulse-light" style="animation-delay: 2s;"></div>
      <div class="absolute top-3/4 left-1/2 w-64 h-64 bg-green-400/10 dark:bg-green-500/5 rounded-full blur-2xl pulse-light" style="animation-delay: 4s;"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <div class="inline-block relative group">
          <!-- Glowing background -->
          <div class="absolute -inset-4 bg-gradient-to-r from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 pulse-light"></div>
          
          <!-- Main title -->
          <div class="relative bg-gradient-to-r from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-600 p-1 rounded-2xl shadow-md">
            <div class="bg-white dark:bg-gray-800 rounded-xl px-8 md:px-16 lg:px-24 py-6">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
                {{ dat === 'datakril' ? translateText("O'chirilgan elementlar") : "O'chirilgan elementlar" }}
              </h1>
              <div class="h-1 w-32 bg-gradient-to-r from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-600 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <!-- Subtitle -->
        <p class="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          {{ dat === 'datakril' ? translateText(`Arxivlangan ma'lumotlarni boshqarish va tiklash uchun professional interfeys`):`Arxivlangan ma'lumotlarni boshqarish va tiklash uchun professional interfeys` }}
        </p>
      </div>

      <!-- Stats Bar -->
      <div class="mb-12 flex justify-center">
        <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-md border border-white/20 dark:border-gray-700/50 px-8 py-4">
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <span class="text-slate-700 dark:text-slate-300 font-semibold">{{ sections.length }} {{ dat === 'datakril' ? translateText(`ta bo'lim`):`ta bo'lim` }}</span>
            </div>
            <div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-slate-700 dark:text-slate-300 font-semibold">{{ dat === 'datakril' ? translateText(`Aktiv`): `Aktiv` }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections Grid -->
      <div class="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="(item, index) in sections" 
          :key="item.path" 
          @click="goToPath(item.path)"
          class="group relative overflow-hidden bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-md border border-white/20 dark:border-gray-700/50 transition-all duration-300 cursor-pointer card-animate"
          :class="`animate-delay-${index}`"
          ref="cards"
        >
          <!-- Card Background Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <!-- Hover Glow Effect -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-lime-400 to-blue-500 dark:from-lime-500 dark:to-blue-400 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
          
          <!-- Content -->
          <div class="relative z-10 p-6 h-full flex flex-col">
            <!-- Icon Container -->
            <div class="mb-4 flex justify-center">
              <div class="relative">
                <div class="relative p-3 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-gray-600 dark:group-hover:to-gray-500 transition-all duration-300 shadow-md">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Title -->
            <h3 class="text-lg font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-blue-100 capitalize leading-tight mb-2 transition-colors duration-300 text-center">
              {{ dat === 'datakril' ? translateText(item.title) : item.title }}
            </h3>
            
            <!-- Description -->
            <p class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300 text-center leading-relaxed mb-4 line-clamp-3 flex-grow">
              {{ dat === 'datakril' ? translateText(item.description) : item.description }}
            </p>
            
            <!-- Footer section - pushed to bottom -->
            <div class="mt-auto">
              <!-- Subtitle -->
              <p class="text-xs text-slate-500 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300 text-center font-medium mb-4">
                {{ dat === 'datakril' ? translateText(`Bo'lim`):`Bo'lim` }} #{{ index + 1 }} • {{ dat === 'datakril' ? translateText(`Arxiv`) : `Arxiv` }}
              </p>

              <!-- Bottom Accent Line -->
              <div class="h-1 w-0 group-hover:w-full bg-gradient-to-r from-lime-400 to-blue-500 dark:from-lime-500 dark:to-blue-400 rounded-full transition-all duration-300 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate';
import { onMounted, onUnmounted, ref } from 'vue';

const router = useRouter();
const dat = ref(localStorage.getItem("til") || "datalotin");
const cards = ref([]);

// Lazy load animations with IntersectionObserver
const observeCards = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.value.forEach((card) => {
    if (card) observer.observe(card);
  });
};

onMounted(() => {
  observeCards();
});

const sections = [
  { 
    path: 'courts', 
    title: '1-bolim',
    description: 'Bu bo‘limda faqat o‘chirilgan sud organlari ro‘yxati saqlanadi. Har bir element haqida alohida ma’lumot ko‘rsatilmaydi, faqatgina ularning nomi va mavjudligi qayd etiladi.'
  },
  { 
    path: 'services', 
    title: '2-bolim',
    description: 'O‘chirilgan xizmatlar ro‘yxati ushbu bo‘limda jamlangan. Xizmatlar bo‘yicha hech qanday tafsilot yoki qo‘shimcha ma’lumot mavjud emas, faqat nomi ko‘rsatiladi.'
  },
  { 
    path: 'applications', 
    title: '3-bolim',
    description: 'Bu yerda o‘chirilgan ariza va murojaatlarning umumiy ro‘yxati saqlanadi. Har bir ariza haqida batafsil ma’lumot mavjud emas.'
  },
  { 
    path: 'admin', 
    title: 'Adminlar',
    description: 'Ushbu bo‘limda tizimdan o‘chirilgan adminlar ro‘yxati joylashgan. Foydalanuvchilar haqida qo‘shimcha tafsilotlar emas, faqatgina ularning mavjud bo‘lganligi qayd etiladi.'
  },
  { 
    path: 'yurist', 
    title: 'Yuristlar',
    description: 'Tizimdan o‘chirilgan yuristlar faqat ro‘yxat ko‘rinishida bu yerda saqlanadi. Har bir yurist haqida batafsil ma’lumot berilmaydi.'
  },
  { 
    path: 'manager', 
    title: 'Devonxona Mudirlari',
    description: 'O‘chirilgan devonxona mudirlari ushbu bo‘limda ro‘yxat tarzida keltiriladi. Ular haqidagi boshqa ma’lumotlar bu yerda mavjud emas.'
  },
  { 
    path: 'yuristAssistant', 
    title: 'Yurist yordamchilari',
    description: 'Bu bo‘limda o‘chirilgan yurist yordamchilari ro‘yxati ko‘rsatiladi. Faqat ismlar yoki identifikatsiya maqsadida ma’lumotlar mavjud bo‘lib, batafsil tafsilotlar keltirilmaydi.'
  },
  { 
    path: 'deliverer', 
    title: 'Kuryerlar',
    description: 'Tizimdan o‘chirilgan kuryerlar faqat ro‘yxat shaklida bu yerda jamlangan. Qo‘shimcha ma’lumotlar yoki tafsilotlar mavjud emas.'
  },
  { 
    path: 'accauntant', 
    title: 'Xisobchilar',
    description: 'O‘chirilgan hisobchilar faqatgina ro‘yxat tarzida saqlanadi. Hech qanday boshqa ma’lumotlar ko‘rsatilmaydi.'
  },
  { 
    path: 'chiefAccauntant', 
    title: 'Bosh xisobchilar',
    description: 'Bu bo‘limda tizimdan o‘chirilgan bosh hisobchilar ro‘yxati saqlanadi. Har bir foydalanuvchi haqida batafsil ma’lumot berilmaydi.'
  },
  { 
    path: 'warehouseman', 
    title: 'Ombor mudiri',
    description: 'Ushbu bo‘limda o‘chirilgan ombor mudirlari ro‘yxati mavjud. Ro‘yxat tarkibida faqat nomlar bo‘lib, boshqa tafsilotlar mavjud emas.'
  },
  { 
    path: 'operator', 
    title: 'Operatorlar',
    description: 'Ushbu bo‘limda o‘chirilgan operatorlar ro‘yxati mavjud. Ro‘yxat tarkibida faqat nomlar bo‘lib, boshqa tafsilotlar mavjud emas.'
  },
  { 
    path: 'partners', 
    title: 'Hamkorlar',
    description: 'Bu yerda o‘chirilgan hamkorlar ro‘yxati jamlangan. Har bir hamkor haqida alohida ma’lumotlar mavjud emas.'
  },
  { 
    path: 'appeal', 
    title: 'Interaktiv xizmatlar',
    description: 'O‘chirilgan interaktiv xizmatlar ushbu bo‘limda umumiy ro‘yxat tarzida keltirilgan. Tafsilotli ma’lumotlar mavjud emas.'
  },
  { 
    path: 'files', 
    title: 'Filelar',
    description: 'O‘chirilgan fayllar bu bo‘limda ro‘yxat shaklida saqlanadi. Fayllar mazmuni yoki tafsilotlari bu yerda mavjud emas.'
  },
  { 
    path: 'signingFiles', 
    title: 'Imzolangan va imzolanmagan fayllar',
    description: 'Imzolangan yoki hali imzolanmagan, lekin o‘chirilgan fayllar ro‘yxati bu yerda jamlangan. Har bir fayl haqida qo‘shimcha ma’lumot mavjud emas.'
  },
  { 
    path: 'enterprise-file', 
    title: 'Kampaniya fayllari',
    description: 'O‘chirilgan kampaniyaga oid fayllar bu bo‘limda faqat ro‘yxat shaklida saqlanadi. Tafsilotlar mavjud emas.'
  },
  { 
    path: 'contract-file', 
    title: 'Shablon shartnoma fayllari',
    description: 'Shablon shartnomalarning o‘chirilgan fayllari faqatgina ro‘yxat sifatida bu yerda mavjud. Fayllar mazmuni ko‘rsatilmaydi.'
  },
  { 
    path: 'category', 
    title: 'Kategoriyalar',
    description: 'O‘chirilgan turkum va kategoriyalar ushbu bo‘limda umumiy ro‘yxat shaklida ko‘rsatiladi. Har bir kategoriya haqida alohida ma’lumot mavjud emas.'
  },
  { 
    path: 'warehouse', 
    title: 'Omborlar',
    description: 'Tizimdan o‘chirilgan omborlar faqat ro‘yxat tarzida bu bo‘limda saqlanadi. Ombor tafsilotlari ko‘rsatilmaydi.'
  }
];


function goToPath(path) {
  router.push(`/archiveBody/${path}`);
}
</script>

<style scoped>
/* Optimized pulse animation */
.pulse-light {
  animation: pulse-light 3s ease-in-out infinite;
}
@keyframes pulse-light {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

/* Optimized card animation */
.card-animate {
  transform: translateY(30px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  will-change: opacity, transform;
}
.card-animate.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Staggered delays */
.animate-delay-0 { transition-delay: 0ms; }
.animate-delay-1 { transition-delay: 100ms; }
.animate-delay-2 { transition-delay: 200ms; }
.animate-delay-3 { transition-delay: 300ms; }
.animate-delay-4 { transition-delay: 400ms; }
.animate-delay-5 { transition-delay: 500ms; }
.animate-delay-6 { transition-delay: 600ms; }
.animate-delay-7 { transition-delay: 700ms; }
.animate-delay-8 { transition-delay: 800ms; }
.animate-delay-9 { transition-delay: 900ms; }
.animate-delay-10 { transition-delay: 1000ms; }
.animate-delay-11 { transition-delay: 1100ms; }
.animate-delay-12 { transition-delay: 1200ms; }
.animate-delay-13 { transition-delay: 1300ms; }
.animate-delay-14 { transition-delay: 1400ms; }
.animate-delay-15 { transition-delay: 1500ms; }
.animate-delay-16 { transition-delay: 1600ms; }
.animate-delay-17 { transition-delay: 1700ms; }
.animate-delay-18 { transition-delay: 1800ms; }

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Lighter backdrop blur */
.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>