import { h, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import { useRouter } from "vue-router";

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
    const router = useRouter(); // ✅ setup() ichida ishlatish kerak

    onMounted(() => {
      if (token.value) {
        const currentTime = new Date().getTime();

        if (currentTime > parseInt(expirationTime.value)) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
          router.push('/login');
        }
      }
    });

    return {
      token,
      expirationTime
    };
  },
  render() {
    if (!this.token || !isAuthenticated()) {
      return null;
    }
    return h('div', 'Your content here');
  }
};
