const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Home-App.vue") }],
  },
  {
    path: "/Pasar_Asistencias",
    name: "Pasar_Asistencias",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Pasar_Asistencias.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Registrar_Alumnos",
    name: "Registrar_Alumnos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Registrar_Alumnos.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Lista_Inactivos",
    name: "Lista_Inactivos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Lista_Inactivos.vue") },
    ],
    // meta: { requiresAuth: true },
  },
  {
    path: "/Buscar",
    name: "Buscar",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Buscar-Alumnos.vue") },
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
    path: "/Login",
    name: "Login",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Iniciar_Sesion.vue") },
    ],
  },
  //agregar una pagina index que este vinculada al archivo Index_OutSession
  {
    path: "/Home",
    name: "Home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/Home-App.vue") }],
  },

  //agregar la pagina SoloCara para que se muestre al iniciar la pagina
  {
    path: "/SoloCara",
    name: "SoloCara",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/SoloCara.vue") }],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
