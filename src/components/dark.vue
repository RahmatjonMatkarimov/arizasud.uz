<template>
  <button @click="toggleDarkMode">
    Toggle Dark Mode
  </button>
</template>

<script setup>
function toggleDarkMode() {
  const isDark = document.documentElement.classList.contains('dark')
  if (isDark) {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}
</script>
