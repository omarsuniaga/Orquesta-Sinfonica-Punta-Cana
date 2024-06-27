import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { watchAuthState } from "../FirebaseService/auth";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isAuth = false;

watchAuthState((user) => {
  isAuth = !!user;
  if (!isAuth && router.currentRoute.value.meta.requiresAuth) {
    router.push({ name: "login" });
  } else if (isAuth && router.currentRoute.value.meta.noAuth) {
    router.push({ name: "home" });
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const noAuth = to.matched.some((record) => record.meta.noAuth);
  if (requiresAuth && !isAuth) {
    next({ name: "login" });
  } else if (noAuth && isAuth) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
