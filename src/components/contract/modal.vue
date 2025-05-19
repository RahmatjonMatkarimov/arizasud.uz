<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div 
        class="bg-white rounded-xl shadow-lg w-80 overflow-hidden transform transition-all"
        :class="visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="p-6">
          <h3 class="text-gray-800 text-lg font-semibold text-center mb-5">Haqiqatan ham chiqmoqchimisiz?</h3>
          <div class="flex space-x-3 mt-6">
            <button
              @click="$emit('cancel')"
              class="flex-1 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Ha, chiqish
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: Boolean
})
defineEmits(['confirm', 'cancel'])
</script>
