<script setup>

</script>

<template>
  <aside :class="[
    'fixed top-0 left-0 h-screen bg-gradient-to-br from-blue-600 to-purple-700',
    'shadow-2xl transition-all duration-500 z-50 backdrop-blur-sm',
    isCollapsed ? 'w-20' : 'w-96'
  ]">
    <!-- Toggle Button -->
    <button 
      @click="isCollapsed = !isCollapsed" 
      class="absolute -right-4 top-5 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
    >
      <Icon 
        :icon="isCollapsed ? 'mdi:menu' : 'mdi:close'" 
        class="text-white text-xl transition-transform duration-300"
      />
    </button>

    <div class="pt-20 px-4 h-full overflow-y-auto">
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-32 gap-4">
        <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <p v-if="!isCollapsed" class="text-white font-medium">Yuklanmoqda...</p>
      </div>

      <!-- Menu Items -->
      <nav v-else class="space-y-2">
        <router-link 
          v-for="(item, i) in filteredMenu" 
          :key="i"
          :to="item.to" 
          :class="[
            'flex items-center p-3 rounded-xl text-white/90 hover:text-white',
            'bg-white/10 hover:bg-white/20 transition-all duration-300 group',
            'hover:translate-x-2 hover:shadow-lg relative',
            route.path === item.to ? 'bg-white/25 translate-x-3 shadow-lg' : ''
          ]"
        >
          <div class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg mr-3 group-hover:bg-white/20 transition-colors">
            <Icon :icon="item.icon" class="text-lg" />
          </div>
          
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <div class="text-xs opacity-75 font-semibold">{{ i + 1 }}</div>
            <div class="text-sm font-medium truncate">
              {{ dat === 'datakril' ? translateText(item.label) : item.label }}
            </div>
          </div>

          <!-- Tooltip -->
          <div v-if="isCollapsed" class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {{ dat === 'datakril' ? translateText(item.label) : item.label }}
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </router-link>

        <!-- GitHub -->
        <div @click="open()" class="flex items-center p-3 rounded-xl text-white/90 hover:text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 group hover:translate-x-2 hover:shadow-lg cursor-pointer relative">
          <div class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg mr-3 group-hover:bg-white/20 transition-colors">
            <Icon icon="mdi:github" class="text-lg" />
          </div>
          
          <div v-if="!isCollapsed" class="flex-1">
            <div class="text-xs opacity-75 font-semibold">{{ filteredMenu.length + 1 }}</div>
            <div class="text-sm font-medium">GitHub</div>
          </div>

          <div v-if="isCollapsed" class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            GitHub
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>