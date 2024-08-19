import Asistencia from "../pages/Modulo-Asistencia.vue";

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
    path: "/AddInstrument",
    name: "AddInstrument",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/AddInstrument.vue"),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("src/pages/ErrorNotFound.vue"),
  },
  {
    path: "/Asistencia",
    name: "Asistencia",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: Asistencia,
        props: (route) => ({
          grupoSeleccionado: route.params.grupoSeleccionado,
        }),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Dashboard",
    name: "Dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Dashboard_Index.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Nuevo-Alumno",
    name: "Nuevo-Alumno",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Nuevo-Alumno.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Lista_Inactivos",
    name: "Lista_Inactivos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Lista_Inactivos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Buscar",
    name: "Buscar",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Buscar-Alumnos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Detalles_Alumnos/:id",
    name: "Detalles_Alumnos",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Detalles_Alumnos.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Calificacion_Alumno/:id",
    name: "Calificacion_Alumno",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Calificacion-Alumno.vue"),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/Cerrar",
    name: "Cerrar",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Cerrar-Sesion.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/instruments",
    name: "InstrumentDetails",
    component: () => import("src/pages/InstrumentDetails.vue"),
    meta: { requiresAuth: true }, // si necesitas autenticación para esta ruta
  },
  {
    path: "/AddInstrument",
    name: "Add-Instrument",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AddInstrument.vue") },
    ],
    meta: { requiresAuth: true },
  },
  // Crearemos una vista llamada ClaseGrupos
  {
    path: "/GestionarRepertorio",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", // Deja el path vacío aquí para que coincida con la ruta padre
        name: "GestionarRepertorio",
        component: () => import("src/pages/GestionarRepertorio.vue.vue"), // Lazy load del componente
        props: (route) => ({
          grupoSeleccionado: route.params.grupoSeleccionado,
        }),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/ClaseDiaria",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", // Deja el path vacío aquí para que coincida con la ruta padre
        name: "ClaseDiaria",
        component: () => import("src/pages/ClaseDiaria.vue"), // Lazy load del componente
        props: (route) => ({
          grupoSeleccionado: route.params.grupoSeleccionado,
        }),
      },
    ],
    meta: { requiresAuth: true },
  },
];

export default routes;
/*  {
  path: "/ClaseDiaria",
  name: "ClaseDiaria",
  props: true,
  component: () => import("layouts/MainLayout.vue"), // Utiliza MainLayout.vue
  children: [
    {
      path: "",
      component: ClaseDiaria, // Anida ClaseDiaria dentro del layout
      props: (route) => ({
        grupoSeleccionado: route.params.grupoSeleccionado,
      }),
    },
  ],
  meta: { requiresAuth: true },
},
*/
