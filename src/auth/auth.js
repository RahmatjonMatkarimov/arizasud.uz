import { h, ref, onMounted, onUnmounted, watch, computed } from "vue";
import jwtDecode from "jwt-decode";
import { useRouter } from "vue-router";

// Composable function - qayta ishlatish uchun
export function useAuth() {
  const router = useRouter();
  const token = ref(localStorage.getItem("token"));
  const expirationTime = ref(localStorage.getItem("tokenExpiration"));
  
  const isLoggedIn = computed(() => {
    if (!token.value || !expirationTime.value) return false;
    const currentTime = new Date().getTime();
    return currentTime < parseInt(expirationTime.value);
  });

  const logout = () => {
    // localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    token.value = null;
    expirationTime.value = null;
    // router.push('/login');
  };

  return {
    token,
    expirationTime,
    isLoggedIn,
    logout
  };
}

export function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("tokenExpiration");
  if (!token || !expirationTime) return false;
  
  const currentTime = new Date().getTime();
  return currentTime < parseInt(expirationTime);
}

export default {
  setup() {
    const token = ref(localStorage.getItem("token"));
    const expirationTime = ref(localStorage.getItem("tokenExpiration"));
    const router = useRouter();
    let intervalId = null;

    // Token va expiration time o'zgarishini kuzatish
    const updateTokenRefs = () => {
      token.value = localStorage.getItem("token");
      expirationTime.value = localStorage.getItem("tokenExpiration");
    };

    // Token expired bo'lganini tekshirish va logout qilish
    const checkTokenExpiry = () => {
      if (token.value && expirationTime.value) {
        const currentTime = new Date().getTime();
        
        if (currentTime >= parseInt(expirationTime.value)) {
          // Token expired bo'ldi
          // localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
          updateTokenRefs();
          // router.push('/login');
        }
      }
    };

    // localStorage o'zgarishlarini kuzatish (boshqa tab/window)
    const handleStorageChange = (event) => {
      if (event.key === 'token' || event.key === 'tokenExpiration') {
        updateTokenRefs();
        
        // Agar token o'chirilgan bo'lsa
        if (!event.newValue && event.key === 'token') {
          // router.push('/login');
        }
      }
    };

    onMounted(() => {
      // Dastlabki tekshiruv
      checkTokenExpiry();
      
      // Har 30 soniyada token ni tekshirish
      intervalId = setInterval(checkTokenExpiry, 30000);
      
      // localStorage o'zgarishlarini kuzatish
      window.addEventListener('storage', handleStorageChange);
    });

    onUnmounted(() => {
      // Interval va event listener ni tozalash
      if (intervalId) {
        clearInterval(intervalId);
      }
      window.removeEventListener('storage', handleStorageChange);
    });

    // Token o'zgarishini kuzatish
    watch([token, expirationTime], () => {
      checkTokenExpiry();
    });

    return {
      token,
      expirationTime,
      isAuthenticated: () => isAuthenticated(),
      checkTokenExpiry
    };
  },
  
  render() {
    if (!this.token || !this.isAuthenticated()) {
      return null;
    }
    return h('div', 'Your content here');
  }
};