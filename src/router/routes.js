const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("src/pages/Log-in.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("src/pages/Home-App.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("src/pages/ErrorNotFound.vue"),
  },

  {
    path: "/Modulo-Asistencia",
    name: "Modulo-Asistencia",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      { path: "", component: () => import("pages/Modulo-Asistencia.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Nuevo-Alumno",
    name: "Nuevo-Alumno",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Nuevo-Alumno.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/Dashboard",
    name: "Dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Dashboard_Index.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Lista_Inactivos",
    name: "Lista_Inactivos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Lista_Inactivos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Buscar",
    name: "Buscar",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Buscar-Alumnos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Detalles_Alumnos/:id",
    name: "Detalles_Alumnos",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Detalles_Alumnos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Cerrar",
    name: "Cerrar",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Cerrar-Sesion.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Calificacion_Alumno/",
    name: "Calificacion_Alumno",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Calificacion-Alumno.vue") },
    ],
    meta: { requiresAuth: true },
  },
];

export default routes;
