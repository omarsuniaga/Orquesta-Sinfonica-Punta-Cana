<template>
  <div class="container">
    <div class="q-pa-md">
      <q-tree
        :nodes="simple"
        dense
        node-key="label"
        v-model:expanded="expanded"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  Buscar_Por_Fecha,
  Buscar_Alumno,
  Mostrar_Listado,
  Eventos_Calendario,
  Mostrar_todo,
  Lista_Ausentes,
  Lista_Presentes,
} from "../firebase";

export default {
  setup() {
    return {
      expanded: ref(["Evolucion del Alumno", "Repertorio"]),

      simple: [
        {
          label: "Evolucion del Alumno",
          children: [
            {
              label: "Repertorio",
              icon: "description",
              children: [
                { label: "El Merengue del Primero" },
                { label: "Happy Blues" },
                { label: "Chorale" },
                { label: "Minuett" },
                { label: "Himno de la Alegria" },
              ],
            },
            {
              label: "Escalas",
              icon: "soap",
              children: [
                { label: "Do Mayor - Dos 8vas" },
                { label: "Re Mayor - Dos 8vas" },
                { label: "Sol Mayor - Dos 8vas" },
                { label: "La Mayor - Dos 8vas" },
              ],
            },
            {
              label: "Teoria y  Solfeo",
              icon: "ballot",
              children: [
                { label: "Lectura en Clave de Fa - Iniciado" },
                { label: "Lectura a primera vista - En proceso" },
              ],
            },
            {
              label: "Metodos / Estudios / Conciertos",
              children: [
                { label: "Aun sin repertorio de estudios individuales" },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script>
