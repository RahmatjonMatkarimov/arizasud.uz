<script setup>
import translateText from '@/auth/Translate' 
import { URL } from '@/auth/url' 
import axios from 'axios' 
import { onMounted, ref, provide, computed, onBeforeUnmount, watch } from 'vue' 
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

const dat = ref('datalotin') // Default language setting 
const isAsideVisible = ref(false) // Sidebar initially closed for better mobile experience
provide('isAsideVisible', isAsideVisible) // Provide to parent 
const router = useRouter() 
const currentRoute = router.currentRoute 
const user = ref(null)
const activeItemIndex = ref(0)
const animationComplete = ref(false)
const isAnimating = ref(false) // Prevent animation overlap

// Add hover state for menu items
const hoveredItem = ref(null)

const menuItems = [
  { name: 'Bosh sahifa', icon: 'chart-line', path: '/dashboard' },
  { name: 'Soliqlar', icon: 'file-invoice', path: '/invoices' },
  { name: 'Ishchilar oyligini hisoblash', icon: 'money-check-dollar', path: '/salary' },
  { name: 'Xarajatlar', icon: 'chart-pie', path: '/reports' },
  { name: 'Shartnoma qarzlari', icon: 'user', path: '/clients' },
]

// Timeline for better animation control
const sidebarTimeline = gsap.timeline({paused: true})
const menuTimeline = gsap.timeline({paused: true})

// Find initial active menu item
const initActiveMenuItem = () => {
  const activeIndex = menuItems.findIndex(item => item.path === currentRoute.value.path)
  activeItemIndex.value = activeIndex >= 0 ? activeIndex : 0
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth < 768 && isAsideVisible.value) {
    isAsideVisible.value = false
    animateSidebar(false)
  }
}

// Create animation timelines
const setupAnimations = () => {
  // Expand timeline
  sidebarTimeline.clear()
  sidebarTimeline
    .to('.sidebar', {
      width: '16rem',
      duration: 0.4,
      ease: 'power2.out'
    })
    .to('.menu-icon', {
      marginRight: '0.75rem',
      x: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.menu-text', {
      opacity: 1,
      width: 'auto',
      display: 'block',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=0.2')
    .to('.toggle-icon', {
      rotation: 180,
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.4')
    
  // Menu items entrance
  menuTimeline.clear()
  menuTimeline
    .fromTo('.menu-item', 
      { x: -20, opacity: 0 }, 
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out'
      }
    )
    .to(`.menu-item-${activeItemIndex.value}`, {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderLeftWidth: '3px',
      borderLeftColor: 'rgba(250, 204, 21, 1)',
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.2')
}

const toggleAside = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  
  isAsideVisible.value = !isAsideVisible.value
  animateSidebar(isAsideVisible.value)
}

const animateSidebar = (expand) => {
  if (expand) {
    sidebarTimeline.play()
  } else {
    sidebarTimeline.reverse()
  }
  
  // Release animation lock after completion
  sidebarTimeline.eventCallback('onComplete', () => {
    isAnimating.value = false
  })
  sidebarTimeline.eventCallback('onReverseComplete', () => {
    isAnimating.value = false
  })
}

const getUser = async () => {
  try {
    const res = await axios.get(`${URL}/accauntant/${localStorage.getItem('id')}`)
    user.value = res.data
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

// Enhanced hover effects
const setHoveredItem = (index) => {
  if (activeItemIndex.value !== index) {
    hoveredItem.value = index
    gsap.to(`.menu-item-${index}`, {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      duration: 0.3,
      ease: 'power1.out'
    })
  }
}

const clearHoveredItem = (index) => {
  hoveredItem.value = null
  if (activeItemIndex.value !== index) {
    gsap.to(`.menu-item-${index}`, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      duration: 0.3,
      ease: 'power1.out'
    })
  }
}

const navigateTo = (path, index) => {
  if (activeItemIndex.value === index) return
  
  // Reset previous active item
  gsap.to(`.menu-item-${activeItemIndex.value}`, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderLeftWidth: '0px',
    duration: 0.3,
    ease: 'power2.out'
  })
  
  // Set active menu item
  activeItemIndex.value = index
  
  // Animate new active item
  gsap.timeline()
    .to(`.menu-item-${index}`, {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderLeftWidth: '3px',
      borderLeftColor: 'rgba(250, 204, 21, 1)',
      duration: 0.4,
      ease: 'power2.out'
    })
    .fromTo(`.menu-item-${index} .glow-dot`, 
      { scale: 0.5, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' },
      '-=0.2'
    )
  
  // Auto close sidebar after navigation (for all screen sizes)
  if (isAsideVisible.value) {
    isAsideVisible.value = false
    animateSidebar(false)
  }
  
  router.push(path)
}

// Initialize animations
const initAnimations = () => {
  // Set initial states
  gsap.set('.sidebar', { 
    x: -100, 
    opacity: 0,
    width: '4rem'
  })
  
  gsap.set('.menu-text', {
    opacity: 0,
    width: 0,
    display: 'none'
  })
  
  gsap.set('.menu-item', { 
    x: -20, 
    opacity: 0,
    borderLeftWidth: '0px'
  })
  
  // Create timelines
  setupAnimations()
  
  // Entrance animation
  gsap.timeline()
    .to('.sidebar', {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        menuTimeline.play()
        animationComplete.value = true
      }
    })
}

// Create ripple effect
const createRipple = (event) => {
  const button = event.currentTarget
  
  // Remove any existing ripple
  const oldRipple = button.querySelector('.ripple')
  if (oldRipple) {
    oldRipple.remove()
  }
  
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2
  
  const rect = button.getBoundingClientRect()
  
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - rect.left - radius}px`
  circle.style.top = `${event.clientY - rect.top - radius}px`
  circle.classList.add('ripple')
  
  button.appendChild(circle)
  
  // Auto cleanup ripple
  setTimeout(() => {
    if (circle && circle.parentElement) {
      circle.remove()
    }
  }, 600)
}

// Determine if item is active
const isActive = (path) => {
  return currentRoute.value.path === path
}

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for route changes and auto-close sidebar
watch(() => currentRoute.value.path, (newPath, oldPath) => {
  // Auto-close sidebar when route changes (if it was open)
  if (newPath !== oldPath && isAsideVisible.value) {
    isAsideVisible.value = false
    animateSidebar(false)
  }
  
  // Update active menu item
  const newIndex = menuItems.findIndex(item => item.path === newPath)
  if (newIndex >= 0 && newIndex !== activeItemIndex.value) {
    // Reset previous active item
    gsap.to(`.menu-item-${activeItemIndex.value}`, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderLeftWidth: '0px',
      duration: 0.3,
      ease: 'power2.out'
    })
    
    // Set new active item
    activeItemIndex.value = newIndex
    
    // Animate new active item
    gsap.timeline()
      .to(`.menu-item-${newIndex}`, {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderLeftWidth: '3px',
        borderLeftColor: 'rgba(250, 204, 21, 1)',
        duration: 0.4,
        ease: 'power2.out'
      })
  }
})

onMounted(() => {
  getUser()
  initActiveMenuItem()
  setupAnimations()
  initAnimations()
  
  // Add window resize listener
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div class="sidebar" :class="[
    'bg-[#1e2a46] text-white flex flex-col h-screen fixed top-[90px] overflow-hidden transition-all duration-300 ease-in-out z-20',
    isAsideVisible ? 'w-64' : 'w-14'
  ]">
    <!-- Toggle button with animation -->
    <div class="header-container  border-b justify-end border-white border-opacity-10 flex items-center ">
      
      <button @click="toggleAside" @mousedown="createRipple" class="toggle-button relative overflow-hidden"
        :class="[
          ' h-11 transition-all duration-300 ',
        ]">
        <img src="/menu1.png"
          class="toggle-icon w-4 h-4 mx-6" />
      </button>
    </div>
    
    <!-- Menu items with animations -->
    <nav class="py-3 flex-1 overflow-y-auto scrollbar-hide">
      <div v-for="(item, index) in menuItems" :key="item.name"
        :class="[
          `menu-item menu-item-${index}`,
          'flex items-center py-3 px-5 text-white text-opacity-80 transition-all duration-300 ease-in-out mb-1 cursor-pointer relative',
          isActive(item.path) ? 'active-item border-l-3 border-yellow-400 bg-white bg-opacity-15 text-white' : '',
          !isAsideVisible ? 'px-2' : '',
        ]"
        @mouseenter="setHoveredItem(index)"
        @mouseleave="clearHoveredItem(index)"
        @click="navigateTo(item.path, index)">
        
        <!-- Glowing dot for active item -->
        <div v-if="isActive(item.path)" class="absolute left-0 w-1 h-1 bg-yellow-400 rounded-full glow-dot"></div>
        
        <!-- Hover overlay -->
        <div class="hover-overlay absolute inset-0  h-full pointer-events-none"></div>
        
        <!-- Icon with animations -->
        <font-awesome-icon :icon="item.icon" class="menu-icon w-5 transition-all duration-300 ease-in-out"
          :class="{ 'mr-3': isAsideVisible }" />
        
        <!-- Text with fade animation -->
        <span class="menu-text transition-all duration-300 ease-in-out whitespace-nowrap"
          :class="{ 'opacity-0 w-0': !isAsideVisible }">
          {{ dat === 'datakril' ? translateText(item.name) : item.name }}
        </span>
        
        <!-- Active indicator bar -->
        <div v-if="isActive(item.path)" class="active-indicator absolute right-0 top-0 h-full w-1 bg-yellow-400 opacity-50"></div>
      </div>
    </nav>
    
    <!-- Bottom user info section with animation -->
    <div v-if="user" class="user-info mt-auto border-t border-white border-opacity-10 p-3 flex items-center transition-all duration-300"
      :class="{ 'justify-center': !isAsideVisible }">
      <div class="avatar w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden"
        :class="{ 'mr-3': isAsideVisible }">
        <span class="text-[#1e2a46] font-bold">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</span>
      </div>
      <div class="user-details transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': !isAsideVisible }">
        <div class="user-name font-medium">{{ user.name || 'Foydalanuvchi' }}</div>
        <div class="user-role text-xs text-white text-opacity-60">Buxgalter</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Custom scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Menu item hover */
.menu-item {
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease-in-out, border-left-width 0.3s ease-in-out;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  transition: left 0.8s ease-in-out;
  pointer-events: none;
}

.menu-item:hover::before {
  left: 100%;
}

/* Active item effects */
.active-item {
  position: relative;
}

.active-indicator {
  box-shadow: 0 0 8px rgba(250, 204, 21, 0.6);
  animation: pulseIndicator 2.5s infinite;
}

.glow-dot {
  box-shadow: 0 0 10px 5px rgba(250, 204, 21, 0.5);
  animation: pulse 2.5s infinite;
}

/* Toggle button ripple effect */
.toggle-button {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple 0.6s linear;
}

/* User info section */
.user-info {
  animation: slideUp 0.5s ease-out;
  background-color: rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}

.avatar {
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
  animation: avatarPulse 4s infinite alternate;
  transition: margin-right 0.3s ease-in-out;
}

/* Animations */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    box-shadow: 0 0 5px 2px rgba(250, 204, 21, 0.5);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px 5px rgba(250, 204, 21, 0.7);
  }
  100% {
    opacity: 0.6;
    box-shadow: 0 0 5px 2px rgba(250, 204, 21, 0.5);
  }
}

@keyframes pulseIndicator {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.3;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes avatarPulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

/* Ensure smooth text fade */
.menu-text {
  transition: opacity 300ms ease-in-out, width 300ms ease-in-out;
}

/* Add subtle gradient to sidebar */
.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Custom elevation effect for hover */
.hover-overlay {
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.menu-item:hover .hover-overlay {
  opacity: 1;
}

/* Add pulsating effect to active item */
.active-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 0;
  height: 0;
  background: rgba(250, 204, 21, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: activeRipple 2s infinite;
  pointer-events: none;
}

@keyframes activeRipple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
</style>