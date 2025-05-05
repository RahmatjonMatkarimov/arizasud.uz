<template>
    <div
        class="bg-blue-600 hidden md:flex fixed right-0 z-50 top-[40%] p-[10px] rounded-tl-xl rounded-bl-xl flex-col gap-6">
        <img src="/telephone.png" alt="Telephone" class="cursor-pointer w-10" />
        <img @click="goToPath()" src="/consult.png" alt="Keyboard" class="cursor-pointer w-10" />
        <img src="/keyboard.png" alt="Keyboard" class="cursor-pointer w-10" />
    </div>
    <Header />
    <Time />
    <Main />
    <Appeal />
    <scaners />
    <Card />
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

const router = useRouter();

function goToPath() {
    router.push('/ticket');
}
</script>