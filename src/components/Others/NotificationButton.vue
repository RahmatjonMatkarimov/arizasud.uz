<template>
  <div>
    <button @click="subscribeToPush">🔔 Push ruxsat so‘rash</button>
    <p v-if="token">Token: {{ token }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { messaging, getToken, onMessage } from '../firebase/firebaseInit'

const token = ref('')

const subscribeToPush = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BKeIjiuLlJ7oF1TjaLSH04F5aEIzNApGMV1THrNGj9GRX5vF4xv6L1xqzdmjopWI8dimQK5LDM89zRy9y9d0Aag'
      })
      if (currentToken) {
        token.value = currentToken
      }
    } else {
      alert("Ruxsat berilmadi")
    }
  } catch (error) {
    console.error("Push ruxsat olishda xatolik:", error)
  }
}

// Oldindan push kelganini tinglash
onMounted(() => {
  onMessage(messaging, (payload) => {
  })
})
</script>
