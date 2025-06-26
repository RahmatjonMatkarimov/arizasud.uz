import { reactive } from 'vue';

// 🔐 JWT tokenni ochuvchi funksiya
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT decode error:', err);
    return null;
  }
}

// 🌐 Reaktiv foydalanuvchi ma'lumotlari
export const userInfo = reactive({
  userId: null,
  role: null,
});

// 🔄 token asosida userInfo ni yangilash
export function updateUserInfoFromToken() {
  const token = localStorage.getItem('token');
  const payload = token ? decodeJwt(token) : null;

  userInfo.userId = payload?.id || payload?.sub || null;
  userInfo.role = payload?.role || null;
}

// 🔁 token bilan localStorage ni sinxronlash
export function syncLocalStorageWithToken() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const payload = decodeJwt(token);
  if (!payload) return;

  const tokenUserId = payload.id || payload.sub || null;
  const tokenRole = payload.role || null;

  const lsUserId = localStorage.getItem('id');
  const lsRole = localStorage.getItem('role');

  if (lsUserId !== String(tokenUserId)) {
    localStorage.setItem('id', tokenUserId);
  }

  if (lsRole !== tokenRole) {
    localStorage.setItem('role', tokenRole);
  }

  updateUserInfoFromToken();
}
