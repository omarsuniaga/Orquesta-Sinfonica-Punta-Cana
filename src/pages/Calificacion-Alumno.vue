<template>
  <h3 style="color:white">Registrar Progreso</h3>
  <div class="q-ma-sm row  justify-around wrap " style="min-width: 80%">
    <q-form @submit="guardarRegistro" class="col-3">
      <main>
        <q-btn @click="agregarTema" label="Agregar Tema" color="primary" />
        <q-btn type="submit" label="Guardar" color="primary" v-if="!ocultar" />

      </main>
      <div v-for="(tema, temaIndex) in temas" :key="temaIndex">
        <q-input v-model="tema.nombre" label="Tema/Objetivo" filled outlined class="bg-white" id="tema" />
        <q-btn @click="agregarObservacion(temaIndex)" label="Agregar Observación" color="primary" />
        <q-btn @click="eliminarTema(temaIndex)" label="Eliminar Tema" color="negative" />

        <div v-for="(observacion, observacionIndex) in tema.observaciones" :key="observacionIndex">
          <q-input v-model="observaciones[temaIndex][observacionIndex]" label="Observación" filled outlined
            class="bg-white" id="observaciones" />
          <q-btn @click="eliminarObservacion(temaIndex, observacionIndex)" label="Eliminar Observacion" color="negative"
            dense />
        </div>
      </div>


    </q-form>
    <!-- Consulta -->
    <div class="col-6">
      <q-card class="my-card" flat bordered v-for="(tema, temaIndex) in ConsultaTemas" :key="temaIndex">
        <q-card-section>
          <q-btn fab color="primary" icon="edit" class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);" @click="editarTema(temaIndex)" />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ tema.nombre }}
              {{ tema.itemKey }}
            </div>
          </div>

          <q-rating v-model="tema.calificacion" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none" v-for="(observacion, observacionIndex) in tema.observaciones"
          :key="observacionIndex">
          <div class="text-subtitle">
            {{ observacion }}
          </div>

        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn label="Guardar" color="primary" @click="guardarEdicion()" v-if="ocultar" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

import { realdb, Buscar_Alumno, Fecha } from '../firebase'
import { useRouter } from 'vue-router';
import { ref as REF, child, onValue, set, push, update } from "firebase/database";
let itemKey = ref('')
const ocultar = ref(false)
const id = useRouter().currentRoute._rawValue.params.id;
const temas = reactive([{ nombre: '', observaciones: [], calificacion: 0 }]);
const observaciones = ref([]);
const calificacion = ref(0);
const ConsultaTemas = ref([])
const instrumento = async (id) => {
  const { instrumento } = await Buscar_Alumno(id)
  return instrumento
}

instrumento(id)

const agregarTema = () => {
  temas.push({ nombre: '', observaciones: [], calificacion: 0 });
};

const eliminarTema = (temaIndex) => {
  temas.splice(temaIndex, 1);
};

const agregarObservacion = (temaIndex) => {
  temas[temaIndex].observaciones.push('');
};

const eliminarObservacion = (temaIndex, observacionIndex) => {
  temas[temaIndex].observaciones.splice(observacionIndex, 1);
};

const editarTema = (temaIndex) => {
  ocultar.value = true
  const tema = temas[temaIndex];
  if (ConsultaTemas.value.length > 0) {
    tema.nombre = ConsultaTemas.value[temaIndex].nombre;
    tema.observaciones = ConsultaTemas.value[temaIndex].observaciones;
    tema.calificacion = ConsultaTemas.value[temaIndex].calificacion;
  }
};

// guardar edicion
const guardarEdicion = () => {
  ocultar.value = false
  const { nombre, calificacion, observaciones } = temas[0];
  const edit = push(child(REF(realdb), 'Alumno/' + id), nombre, calificacion, observaciones)
  const updates = {};
  updates['Alumno/' + id + itemKey.value] = edit;
};

const guardarRegistro = async () => {
  ConsultaTemas.value = []
  for (const tema of temas) {
    const nombreTema = tema.nombre;
    const observaciones = tema.observaciones;
    const calificacion = tema.calificacion;
    writeUserData(id, nombreTema, observaciones, calificacion)
    temas.nombre = ''
    temas.observaciones = []
    temas.calificacion = 0
    temas.key = itemKey
  }

};

// Observar cambios en el arreglo de temas y actualizar la matriz de observaciones
watch(temas, () => {
  observaciones.value = temas.map((tema) => tema.observaciones);
});

// Observar cambios en la matriz de observaciones y actualizar el arreglo de temas
watch(observaciones, () => {
  temas.forEach((tema, temaIndex) => {
    tema.observaciones = observaciones.value[temaIndex];
  });
});

watch(calificacion, () => {
  temas.forEach((tema, temaIndex) => {
    tema.calificacion = calificacion.value[temaIndex];
  });
})


function writeUserData(id, nombreTema, observaciones, calificacion) {
  const userData = {
    nombreTema, observaciones, calificacion, Fecha
  }
  const newPostKey = push(child(REF(realdb), 'Alumno/' + id), userData)
  itemKey.value = newPostKey.key
  const updates = {};
  updates['Alumno/' + id + itemKey.value] = userData;


}
// Función para extraer el contenido del alumno por ID
const obtenerContenidoPorIdAlumno = (id) => {
  const DireccionRef = REF(realdb, 'Alumno/' + id);
  onValue(DireccionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      for (let item in data) {
        const { Fecha, nombreTema, calificacion, observaciones } = data[item]
        ConsultaTemas.value.push({ nombre: nombreTema, observaciones, calificacion, Fecha, itemKey: itemKey.value });
      }
    }
  });

};

obtenerContenidoPorIdAlumno(id)
</script>

<style scoped>
.q-input.bg-white {
  background-color: #ffffff;
}
</style>

/**
const $q = useQuasar();
* Nombre es un alumno talentoso y dedicado que lleva 20 años tocando el violín.
* Con más de 100 obras en su repertorio, su técnica es impresionante,
* obteniendo una calificación de 7 de 10. Además,
 * su asistencia y afinación son excepcionales,
 * con calificaciones de 9 de 10 en ambos aspectos.
 *  La calidad de su sonido es buena, también con una calificación de 7 de 10.
 * Omar demuestra una buena conducta en clase y es claro que su dedicación y
 * talento han contribuido a su desarrollo como músico. En general,
 * es un placer tener a un alumno tan comprometido y talentoso como
 * Omar en la clase de violín.
 *
 *
 * Años tocando el violín: 20 años.
 * Repertorio musical: más de 100 obras.
 * Técnica: 7 de 10.
 * Asistencia: 9 de 10.
 * Afinación: 9 de 10.
 * Sonido: 7 de 10.
 * Talento: presente.
 * Conducta en clase: buena.
 */

//para un alumno de 1año en el instrumento debe haber superado el nivel 1
//Nivel 1
//Al finalizar el primer nivel el ejecutante de Violín estará en capacidad de:
//Conocer y practicar una correcta postura corporal de pie y sentado, al ejecutar el Violín.
//Conocer y practicar la forma correcta de colocación del violín.
// Conocer y practicar la forma correcta de agarrar el arco del violín.
// Conocer y manejar correctamente los tres elementos que intervienen en la emisión del sonido: presión, velocidad y punto de contacto.
// Pasar el arco del talón a la punta sin variar la velocidad del paso del arco.
// Conocer y practicar la primera posición en todas las cuerdas del violín.
// Conocer y ejecutar con pleno conocimiento las siguientes escalas en primera posición: Sol Mayor y La Mayor en dos octavas, Re Mayor y Re menor a una octava, manteniendo una buena afinación y calidad del sonido.
// Conocer y ejecutar con pleno conocimiento, los arpegios de las escalas del nivel, manteniendo una buena afinación y calidad del sonido.
// Articular estas escalas en redondas, blancas, negras y corcheas utilizando los golpes de arco: Detaché, Martelé y Spicatto.
// Distribuir el arco ligando hasta cuatro corcheas por arcada, a una velocidad de 60 de negra según la marca de metrónomo, manteniendo una buena afinación y calidad del sonido.
// Manejar dos dinámicas, piano y forte.
// Reconocer las notas y las figuras en el pentagrama, así como leer ritmos y melodías sencillas.

//Bibliografía Técnica Recomendada para el Nivel
//Laureux, Jean Claude. Método de Violín Vol. 1.
//Hrimaly, J. Estudios de Escalas para Violín.
//Flesh, Carl. El Sistema de Escala.
//Suzuky, S. Método para Violín. Vol. 1 y Vol. 2.
//Se realizará una selección y secuenciación de los estudios comprendidos en estos métodos, que ejerciten los propósitos descritos en el nivel.
