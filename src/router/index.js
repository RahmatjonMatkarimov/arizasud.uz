import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, getRoleFromToken } from '@/auth/auth';
import { routes } from './routes.js';

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      next({ name: 'home' });
    } else {
      const userRole = getRoleFromToken();
      if (to.meta.allowedRoles?.length && !to.meta.allowedRoles.includes(userRole)) {
        next({ name: 'home' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;