import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { initializeSession } from "../FirebaseService/auth"; // Asegúrate de que esta función esté correctamente definida

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isAuthenticated = false;
let sessionInitialized = false;

const initializeAuth = async () => {
  const user = await initializeSession();
  isAuthenticated = !!user;
  sessionInitialized = true;

  if (isAuthenticated && router.currentRoute.value.meta.noAuth) {
    router.replace({ name: "home" }); // Redirige al home si el usuario ya está autenticado
  }
};

// Inicializa la autenticación
initializeAuth();

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const noAuth = to.matched.some((record) => record.meta.noAuth);

  if (!sessionInitialized) {
    // Espera a que la autenticación esté inicializada antes de continuar
    initializeAuth().then(() => {
      if (requiresAuth && !isAuthenticated) {
        next({ name: "login" });
      } else if (noAuth && isAuthenticated) {
        next({ name: "home" });
      } else {
        next(); // Continúa con la navegación normal
      }
    });
  } else {
    if (requiresAuth && !isAuthenticated) {
      next({ name: "login" });
    } else if (noAuth && isAuthenticated) {
      next({ name: "home" });
    } else {
      next(); // Continúa con la navegación normal
    }
  }
});

export default router;
