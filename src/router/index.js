import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { initializeSession } from "../FirebaseService/auth"; // Asumiendo que esta función se ha definido correctamente en tu archivo auth.js

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isAuthenticated = false;

// Inicializa la sesión de autenticación
initializeSession().then((user) => {
  isAuthenticated = !!user; // Establece el estado de autenticación
  if (isAuthenticated && router.currentRoute.value.meta.noAuth) {
    router.replace({ name: "home" }); // Redirige al home si el usuario ya está autenticado
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const noAuth = to.matched.some((record) => record.meta.noAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" }); // Redirige a login si la ruta requiere autenticación y el usuario no está autenticado
  } else if (noAuth && isAuthenticated) {
    next({ name: "home" }); // Redirige al home si el usuario está autenticado y está tratando de acceder a una página de no autenticación
  } else {
    next(); // Continúa con la navegación normal
  }
});

export default router;
