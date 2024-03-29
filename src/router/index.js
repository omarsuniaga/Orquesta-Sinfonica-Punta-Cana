import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { Iniciar_Automaticamente } from "../firebase";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const noAuth = to.matched.some((record) => record.meta.noAuth);
  const isAuth = await Iniciar_Automaticamente();
  if (requiresAuth && !isAuth) next({ name: "login" });
  else if (noAuth && isAuth) next({ name: "home" });
  else next();
});

export default router;
