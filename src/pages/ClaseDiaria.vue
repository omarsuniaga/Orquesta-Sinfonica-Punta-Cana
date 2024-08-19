<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-dark text-white">
        <div class="q-mb-md q-pt-md text-h5 text-center">
          Registro de Clases Diarias - {{ grupoSeleccionado }}
        </div>

        <!-- Botón para agregar nuevo tema -->
        <div class="q-mb-md text-center">
          <q-btn color="primary" @click="abrirDialogoTema">Añadir Nuevo Tema</q-btn>
        </div>

        <!-- Listado de Temas -->
        <q-list bordered dark>
          <q-item v-for="(tema, index) in temas" :key="tema.id" clickable>
            <q-item-section>
              <q-item-label class="text-h6">{{ tema.titulo }}</q-item-label>
              <q-item-label caption>{{ tema.descripcion }}</q-item-label>
              <q-item-label caption>Fecha: {{ tema.fecha }}</q-item-label>
              <q-item-label caption>Valoración: {{ tema.valoracion }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                icon="visibility"
                @click="verAsistencia(index)"
                label="Asistencia"
              />
              <q-btn flat icon="edit" @click="editarTema(index)" />
              <q-btn flat icon="delete" color="negative" @click="eliminarTema(index)" />
              <q-btn
                flat
                icon="assessment"
                @click="abrirEvaluacion(index)"
                label="Evaluar"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Dialogo para agregar/modificar tema -->
        <q-dialog v-model="dialogoTemaVisible" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">
                {{ editando ? "Modificar Tema" : "Añadir Nuevo Tema" }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="nuevoTema.titulo"
                label="Título del Tema"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="nuevoTema.descripcion"
                label="Descripción"
                outlined
                dense
                type="textarea"
              />
              <q-input
                v-model="nuevoTema.valoracion"
                label="Valoración"
                type="number"
                outlined
                dense
                min="0"
                max="10"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" @click="cerrarDialogoTema" />
              <q-btn flat label="Guardar" color="primary" @click="guardarTema" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Dialogo para Evaluar Tema -->
        <q-dialog v-model="dialogoEvaluacionVisible" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">Evaluar Tema - {{ temas[temaIndex].titulo }}</div>
            </q-card-section>

            <q-card-section>
              <!-- Selección de Alumnos para Evaluación -->
              <q-select
                v-model="alumnosSeleccionados"
                :options="alumnos"
                label="Seleccionar Alumnos"
                multiple
                outlined
                dense
              />
              <q-input
                v-model="valoracionEvaluacion"
                label="Valoración de la Evaluación"
                type="number"
                outlined
                dense
                :max="temas[temaIndex].valoracion"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="cerrarDialogoEvaluacion"
              />
              <q-btn flat label="Guardar" color="primary" @click="guardarEvaluacion" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../FirebaseService/constants";

// Recibir el prop grupoSeleccionado
const props = defineProps({
  grupoSeleccionado: {
    type: String,
    required: true,
  },
  fechaSeleccionada: {
    type: String,
    required: true,
  },
});

// Emit para actualizar el grupo o la fecha seleccionada
const emit = defineEmits(["update:grupoSeleccionado", "update:fechaSeleccionada"]);

// Variables reactivas
const router = useRouter();
const $q = useQuasar();
const grupoSeleccionado = ref(props.grupoSeleccionado);
const fechaSeleccionada = ref(props.fechaSeleccionada);
const temas = ref([]);
const alumnos = ref([]);
const dialogoTemaVisible = ref(false);
const dialogoEvaluacionVisible = ref(false);
const editando = ref(false);
const temaIndex = ref(-1);
const alumnosSeleccionados = ref([]);
const valoracionEvaluacion = ref(0);

// Datos del formulario para nuevo tema
const nuevoTema = ref({
  titulo: "",
  descripcion: "",
  fecha: new Date().toISOString().split("T")[0], // Registrar la fecha actual al crear un tema
  valoracion: 0, // Valoración inicial
});

// Función para obtener los formularios desde Firebase según el grupo
const obtenerTemas = async () => {
  if (!grupoSeleccionado.value) {
    console.error("Error: grupoSeleccionado está indefinido o vacío");
    return;
  }

  try {
    const q = query(
      collection(db, "FORMULARIOS"),
      where("Grupo", "==", grupoSeleccionado.value)
    );
    const querySnapshot = await getDocs(q);
    temas.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener los temas:", error);
  }
};

// Función para obtener la lista de alumnos del grupo seleccionado
const obtenerAlumnos = async () => {
  try {
    const q = query(
      collection(db, "ALUMNOS"),
      where("grupo", "array-contains", grupoSeleccionado.value)
    );
    const querySnapshot = await getDocs(q);
    alumnos.value = querySnapshot.docs.map((doc) => ({
      label: doc.data().nombre + " " + doc.data().apellido,
      value: doc.id,
    }));
  } catch (error) {
    console.error("Error al obtener los alumnos:", error);
  }
};

// Llamar a las funciones al montar el componente
onMounted(() => {
  obtenerTemas();
  obtenerAlumnos();
});

// Función para abrir el diálogo para agregar o editar tema
const abrirDialogoTema = (index = -1) => {
  if (index >= 0) {
    editando.value = true;
    temaIndex.value = index;
    nuevoTema.value = { ...temas.value[index] };
  } else {
    editando.value = false;
    temaIndex.value = -1;
    nuevoTema.value = {
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0], // Registrar la fecha actual al crear un tema
      valoracion: 0, // Valoración inicial
    };
  }
  dialogoTemaVisible.value = true;
};

// Función para cerrar el diálogo sin guardar cambios
const cerrarDialogoTema = () => {
  dialogoTemaVisible.value = false;
};

// Función para guardar el tema (agregar o modificar)
const guardarTema = async () => {
  if (nuevoTema.value.titulo && nuevoTema.value.descripcion) {
    if (editando.value) {
      // Modificar tema existente
      try {
        const docRef = doc(db, "FORMULARIOS", temas.value[temaIndex.value].id);
        await updateDoc(docRef, nuevoTema.value);
        temas.value[temaIndex.value] = { ...nuevoTema.value };
      } catch (error) {
        console.error("Error al modificar el tema:", error);
      }
    } else {
      // Añadir nuevo tema con un ID generado por Firebase
      try {
        const docRef = await addDoc(collection(db, "FORMULARIOS"), {
          ...nuevoTema.value,
          Grupo: grupoSeleccionado.value,
        });
        // Usar el ID de documento generado por Firebase como TemaID
        temas.value.push({
          id: docRef.id,
          TemaID: docRef.id,
          ...nuevoTema.value,
        });
      } catch (error) {
        console.error("Error al añadir el tema:", error);
      }
    }
    cerrarDialogoTema();
  } else {
    console.error("Por favor, completa todos los campos requeridos.");
  }
};

// Función para eliminar un tema

const eliminarTema = async (index) => {
  try {
    const docRef = doc(db, "FORMULARIOS", temas.value[index].id);
    await deleteDoc(docRef);
    temas.value.splice(index, 1);
  } catch (error) {
    console.error("Error al eliminar el tema:", error);
  }
};

// Función para abrir el diálogo de evaluación
const abrirEvaluacion = (index) => {
  temaIndex.value = index;
  alumnosSeleccionados.value = [];
  valoracionEvaluacion.value = 0;
  dialogoEvaluacionVisible.value = true;
};

// Función para cerrar el diálogo de evaluación sin guardar cambios
const cerrarDialogoEvaluacion = () => {
  dialogoEvaluacionVisible.value = false;
};

// Función para guardar la evaluación en Firebase
const guardarEvaluacion = async () => {
  if (alumnosSeleccionados.value.length > 0 && valoracionEvaluacion.value >= 0) {
    try {
      // Limitar la valoración máxima según el tema
      if (valoracionEvaluacion.value > temas.value[temaIndex.value].valoracion) {
        alert(
          `La valoración no puede ser mayor que ${
            temas.value[temaIndex.value].valoracion
          }.`
        );
        return;
      }

      const evaluaciones = alumnosSeleccionados.value.map((alumno) => ({
        alumnoID: alumno.value, // ID del alumno
        nombreCompleto: alumno.label, // Nombre completo del alumno
        valoracion: valoracionEvaluacion.value, // Puntuación del alumno
      }));

      const evaluacionData = {
        grupo: grupoSeleccionado.value,
        fecha: fechaSeleccionada.value,
        temaId: temas.value[temaIndex.value].id,
        temaTitulo: temas.value[temaIndex.value].titulo,
        evaluaciones, // Guardar las evaluaciones
      };

      // Registrar la evaluación en la colección "EVALUACION"
      await addDoc(collection(db, "EVALUACION"), evaluacionData);
      alert("Evaluación registrada exitosamente.");
      cerrarDialogoEvaluacion();
    } catch (error) {
      console.error("Error al registrar la evaluación:", error);
    }
  } else {
    console.error("Por favor, selecciona al menos un alumno y asigna una valoración.");
  }
};

// Función para ver asistencia del día antes de guardar la evaluación
const verAsistencia = async (index) => {
  try {
    const q = query(
      collection(db, "ASISTENCIAS"),
      where("fecha", "==", temas.value[index].fecha),
      where("grupo", "==", grupoSeleccionado.value)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      guardarEvaluacion();
    } else {
      $q.dialog({
        title: "Asistencia No Pasada",
        message:
          "No se ha pasado la asistencia para esta fecha. ¿Quieres pasar la asistencia ahora?",
        ok: {
          label: "Sí, pasar asistencia",
          color: "primary",
        },
        cancel: {
          label: "No, continuar sin asistencia",
          color: "negative",
        },
      })
        .onOk(() => {
          emit("update:fechaSeleccionada", temas.value[index].fecha);
          emit("update:grupoSeleccionado", grupoSeleccionado.value);

          router.push({ name: "Asistencia" });
        })
        .onCancel(() => {
          guardarEvaluacion();
        });
    }
  } catch (error) {
    console.error("Error al verificar la asistencia:", error);
  }
};
</script>

<style scoped>
.bg-dark {
  background-color: #121212;
}

.text-white {
  color: #ffffff;
}

/* Estilos para mejorar la apariencia del listado y los diálogos */
.q-list {
  background-color: #1f1f1f;
  border-radius: 8px;
}

.q-item {
  border-bottom: 1px solid #333;
}

.q-item-label {
  color: #e0e0e0;
}

.q-btn {
  margin: 5px;
}
</style>
