<template>
  <Header />
  <Time />
  <div class="hidden md:flex fixed right-0 z-50 top-[35%] p-[10px] rounded-tl-xl rounded-bl-xl flex-col gap-2">
      <img src="/telephone.png" alt="Telephone" class="bg-blue-600 p-2 rounded-xl cursor-pointer w-14" />
      <img @click="goToPath()" src="/consult.png" alt="Keyboard"
          class="cursor-pointer bg-blue-600 p-2 rounded-xl  w-14" />
      <img src="/keyboard.png" alt="Keyboard" class="bg-blue-600 p-2 rounded-xl cursor-pointer w-14" />
  </div>
  <div class="mt-[70px] sm:mt-[80px] md:mt-[100px] lg:mt-[120px] xl:mt-[140px]"></div>
  <MainSection />
  <div class="container mx-auto">
      <Main />
      <Appeal />
      <scaners />
      <Card />
  </div>
  <Footer />
</template>

<script setup>
import Appeal from "@/components/appeal/appeal.vue";
import Main from "@/components/main/main.vue";
import Card from "@/components/sponsor/card.vue";
import Time from "@/components/time/time.vue";
import Footer from "@/components/footer/footer.vue";
import Header from "@/components/header.vue";
import scaners from "@/components/main/scaners/scaners.vue";
import { useRouter } from 'vue-router';
import MainSection from "@/components/main/meinSection.vue";

const router = useRouter();

function goToPath() {
  router.push('/ticket');
}
</script>