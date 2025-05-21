<template>
  <div>
    <button @click="subscribeToPush">🔔 Push ruxsat so‘rash</button>
    <p v-if="token">Token: {{ token }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { messaging, getToken, onMessage } from './firebase/firebaseInit'

const token = ref('')

const subscribeToPush = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'SIZNING_PUBLIC_VAPID_KEY'
      })
      if (currentToken) {
        token.value = currentToken
        alert("Token olingan: " + currentToken)
        // TODO: tokenni serverga yuboring
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
    console.log("Yangi push:", payload)
    alert("Push keldi: " + payload.notification.title)
  })
})
</script>
