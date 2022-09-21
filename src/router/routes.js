const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/Registrar_Alumnos",
    name: "Registrar_Alumnos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Registrar_Alumnos.vue") },
      { path: "", component: () => import("pages/Perfil_Alumnos.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Perfil_Alumnos",
    name: "Perfil_Alumnos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Perfil_Alumnos.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Detalles_Alumnos/:id",
    name: "Detalles_Alumnos",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Detalles_Alumnos.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Registrar-Progresos/:id",
    name: "Registrar-Progresos",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Registrar-progresos.vue") },
    ],
    // meta: { requiresAuth: true },
  },

  {
    path: "/Login",
    name: "Login",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Iniciar_Sesion.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
