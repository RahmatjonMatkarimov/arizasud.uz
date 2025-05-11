<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <Sidebar />
    <div class="content-wrapper">
      <Header />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  margin-top: 200px;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  padding: var(--space-4);
  padding-left: 285px;
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  main {
    padding: var(--space-3);
  }
}
</style>