<template>
    <button @click="scanFingerprint">Scan Fingerprint</button>
  </template>
  
  <script>
  export default {
    methods: {
      async scanFingerprint() {
        try {
          const response = await fetch("http://localhost:3000");
          const data = await response.json();
        } catch (error) {
          alert("Fingerprint agent ishga tushmagan yoki qurilma ulanmagan.");
          console.error(error);
        }
      },
    },
  };
  </script>