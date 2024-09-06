<template>
  <q-page padding class="bg-grey-1">
    <q-card flat bordered class="my-card q-pa-md">
      <q-splitter v-model="splitterModel" style="height: 600px">
        <!-- Sección para el árbol de indicadores -->
        <template v-slot:before>
          <div class="q-pa-md">
            <q-tree
              :nodes="arbolIndicadores"
              node-key="label"
              selected-color="secondary"
              v-model:selected="selectedIndicador"
              :default-expand-all="true"
              color="primary"
            >
              <!-- Personalización del encabezado de los nodos principales del árbol -->
              <template v-slot:header-root="prop">
                <div class="row items-center">
                  <img
                    src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
                    class="q-mr-sm"
                    style="width: 30px; height: 30px"
                  />
                  <div>
                    <span class="text-h6 text-bold">{{ prop.node.label }}</span>
                    <q-badge color="orange" class="q-ml-sm">Nivel</q-badge>
                  </div>
                </div>
              </template>

              <!-- Personalización de los nodos genéricos -->
              <template v-slot:header-generic="prop">
                <div class="row items-center">
                  <q-icon :name="prop.node.icon || 'star'" color="orange" size="28px" class="q-mr-sm" />
                  <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
                </div>
              </template>
            </q-tree>
          </div>
        </template>

        <!-- Sección para los detalles del indicador seleccionado -->
        <template v-slot:after>
          <q-tab-panels
            v-model="selectedIndicador"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
            color="primary"
          >
            <!-- Panel para cada indicador existente -->
            <q-tab-panel v-for="(indicador, index) in indicadores" :name="indicador.nombre" :key="index">
              <div class="text-h4 q-mb-md">{{ indicador.nombre }}</div>
              <p>{{ indicador.descripcion }}</p>
              <div class="q-mb-md">
                <q-rating v-model="indicador.puntuacion" :max="5" />
                <p>Puntuación: {{ indicador.puntuacion }} / 5</p>
              </div>
              <q-input v-model="indicador.comentario" type="textarea" label="Comentario" />

              <div class="q-mt-md q-gutter-sm row justify-center">
                <q-btn icon="save" color="green" @click="guardarEvaluacion(indicador)" />
                <q-btn icon="edit" color="orange" @click="modificarIndicador(indicador)" />
                <q-btn icon="delete" color="red" @click="confirmarEliminar(indicador)" />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>

      <!-- Botón flotante para agregar un nuevo indicador -->
      <q-btn
        fab
        color="green"
        icon="add"
        class="q-fab-bottom-right"
        @click="abrirDialogoAgregarIndicador"
      />

      <!-- Formulario de diálogo para agregar un nuevo indicador -->
      <q-dialog v-model="dialogoAgregarIndicador">
        <q-card>
          <q-card-section>
            <div class="text-h6">Agregar Nuevo Indicador</div>
          </q-card-section>

          <q-card-section>
            <q-input v-model="nuevoIndicador.nombre" label="Nombre del Indicador" />
            <q-input v-model="nuevoIndicador.descripcion" label="Descripción del Indicador" type="textarea" />
            <q-input v-model="nuevoIndicador.max_puntuacion" label="Máxima Puntuación" type="number" :max="5" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" @click="dialogoAgregarIndicador = false" />
            <q-btn flat label="Guardar" color="positive" @click="agregarIndicador" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../FirebaseService/constants';
import { obtenerAlumnosPorId } from '../../FirebaseService/database';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
//obtener id de url
import { useRoute } from 'vue-router';

const splitterModel = ref(50);
const selectedIndicador = ref(null);
const indicadores = ref([]);
const arbolIndicadores = ref([]);
const dialogoAgregarIndicador = ref(false);
const id = ref(useRoute().params.id); // Cambia por el ID dinámico que corresponda
const nuevoIndicador = ref({
  nombre: '',
  descripcion: '',
  max_puntuacion: 5
});
const alumno = ref({ instrumento: '', nombreCompleto: '', nivel: '' });
const indicadorAEliminar = ref(null);
const nombreCompleto = ref('');

// Cargar Evaluaciones del Alumno segun los indicadores
const evaluaciones = ref({});

// Función para cargar las evaluaciones del alumno desde Firebase
const cargarEvaluaciones = async () => {
  const docRef = doc(db, 'EVALUACIONES', id.value);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    evaluaciones.value = docSnap.data().indicadores.reduce((acc, ev) => {
      acc[ev.idEvaluacion] = ev;
      return acc;
    }, {});

    // iterar sobre indicadores y evaluaciones para asignar puntuaciones
    indicadores.value.forEach((indicador) => {
      Object.values(evaluaciones.value).forEach((evaluacion) => {
        if (indicador.nombre === evaluacion.nombre_indicador) {
          indicador.puntuacion = evaluacion.puntuacion;
          indicador.comentario = evaluacion.observacion;
        }
      })
    });
  }
};

// Función para cargar los indicadores desde Firebase
const cargarIndicadores = async (instrumento) => {
  try {
    const docRef = doc(db, 'INDICADORES', `nivel_1_${instrumento.toLowerCase()}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      indicadores.value = data.indicadores.map((indicador) => ({
        ...indicador,
        puntuacion: 0, // Inicializamos la puntuación en 0
        comentario: '', // Inicializamos el comentario vacío
      }));

      // Cargar el árbol de indicadores para la visualización
      arbolIndicadores.value = [
        {
          label: data.nombre,
          header: 'root',
          children: data.indicadores.map((indicador) => ({
            label: indicador.nombre,
            icon: 'mdi-note-edit',
            header: 'generic',
          })),
        },
      ];

      // Una vez cargados los indicadores, cargar las evaluaciones
      await cargarEvaluaciones(); // Aquí llamamos a cargar las evaluaciones
    } else {
      console.error('No se encontró el documento de indicadores');
    }
  } catch (error) {
    console.error('Error al cargar los indicadores:', error);
  }
};

// Función para cargar los datos del alumno y los indicadores
const cargarAlumno = async () => {
  try {
    const alumnoData = await obtenerAlumnosPorId(id.value);
    alumno.value = alumnoData;

    const { nombre = '', apellido = '' } = alumnoData;
    nombreCompleto.value = `${nombre} ${apellido}`.trim();

    if (!nombreCompleto.value) {
      console.error('El nombre completo del alumno no está disponible.');
    }

    // Cargar los indicadores basados en el instrumento del alumno
    await cargarIndicadores(alumno.value.instrumento);
  } catch (error) {
    console.error('Error al cargar los datos del alumno:', error);
  }
};

// Guardar evaluación en la colección EVALUACIONES
const guardarEvaluacion = async (indicador) => {
  if (!indicador.nombre || typeof indicador.puntuacion !== 'number') {
    console.error('El indicador no está correctamente definido:', indicador);
    return;
  }

  const fechaActual = new Date().toISOString();
  const docRef = doc(db, 'EVALUACIONES', id.value);

  try {
    const indicadorEvaluacion = {
      idEvaluacion: indicador.id || Date.now(),
      nombre_indicador: indicador.nombre,
      puntuacion: indicador.puntuacion,
      observacion: indicador.comentario || ''
    };

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        indicadores: arrayUnion(indicadorEvaluacion)
      });
    } else {
      await setDoc(docRef, {
        id: id.value,
        nombreCompleto: nombreCompleto.value,
        indicadores: [indicadorEvaluacion],
        fecha: fechaActual
      });
    }

    console.log('Evaluación guardada:', indicadorEvaluacion);
  } catch (error) {
    console.error('Error al guardar la evaluación en Firebase:', error);
  }
};

// Función para agregar un nuevo indicador
const agregarIndicador = async () => {
  const indicador = {
    ...nuevoIndicador.value,
    puntuacion: 0,
    comentario: '',
    fecha_creacion: new Date().toISOString()
  };

  const docRef = doc(db, 'INDICADORES', `nivel_1_${alumno.value.instrumento.toLowerCase()}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      indicadores: arrayUnion(indicador)
    });
  } else {
    await setDoc(docRef, {
      nombre: `Nivel 1 - ${alumno.value.instrumento}`,
      instrumento: alumno.value.instrumento,
      indicadores: [indicador],
      fecha_creacion: new Date().toISOString()
    });
  }

  indicadores.value.push(indicador);
  dialogoAgregarIndicador.value = false;
  nuevoIndicador.value = { nombre: '', descripcion: '', max_puntuacion: 5 };

  cargarIndicadores(alumno.value.instrumento);
};

// Confirmar eliminar indicador
const confirmarEliminar = (indicador) => {
  indicadorAEliminar.value = indicador;
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de eliminar el indicador "${indicador.nombre}"?`,
    ok: { label: 'Eliminar', color: 'negative' },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => eliminarIndicador());
};

// Eliminar indicador
const eliminarIndicador = async () => {
  const docRef = doc(db, 'INDICADORES', `nivel_1_${alumno.value.instrumento.toLowerCase()}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const nuevosIndicadores = data.indicadores.filter((ind) => ind.nombre !== indicadorAEliminar.value.nombre);

    await updateDoc(docRef, {
      indicadores: nuevosIndicadores
    });

    cargarIndicadores(alumno.value.instrumento);
  }
};

// Modificar indicador
const modificarIndicador = (indicador) => {
  console.log('Modificando indicador:', indicador);
};

// Cargar los datos del alumno y los indicadores
onMounted(() => {
  id.value = '1662342682409';
  cargarAlumno(id);
});

const abrirDialogoAgregarIndicador = () => {
  dialogoAgregarIndicador.value = true;
};
</script>

<style scoped>
.my-card {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
}
.q-fab-bottom-right {
  position: fixed;
  right: 16px;
  bottom: 16px;
  margin-bottom: 4%;
}
</style>
