<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input
        rounded
        outlined
        v-model="inscripcion"
        label="Tiempo Inscrito"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Repertorio"
        label="Repertorio"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Tecnicas"
        label="Tecnicas"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />

      <q-input
        rounded
        outlined
        v-model="Asistencias"
        label="Asistencias"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Afinacion"
        label="Afinacion"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Sonido"
        label="Sonido"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Actitudes"
        label="Actitudes"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-input
        rounded
        outlined
        v-model="Comportamiento"
        label="Comportamiento"
        bg-color="white"
        min="0"
        max="10"
        type="number"
      />
      <q-btn
        rounded
        bg-color="white"
        color="grey-4"
        text-color="purple"
        unelevated
        icon="camera_enhance"
        label="Calcular"
        @click="calculateGrade"
      />
      <q-circular-progress
        show-value
        class="text-light-blue q-ma-md"
        :value="grade"
        size="50px"
        color="light-blue"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NeuralNetwork, recurrent } from "brain.js";

let inscripcion = ref(0);
let Repertorio = ref(0);
let Tecnicas = ref(0);
let Asistencias = ref(0);
let Afinacion = ref(0);
let Sonido = ref(0);
let Actitudes = ref(0);
let Comportamiento = ref(0);
let grade = ref(0);
// const { RNN } = recurrent;

function reviewFromOutput(output) {
  let review = "El alumno ha demostrado ser ";
  if (output >= 0.9) {
    review += "una estrella, con un desempeño sobresaliente en todos los aspectos.";
  } else if (output >= 0.8) {
    review += "muy bueno, con un desempeño destacado en la mayoría de los aspectos.";
  } else if (output >= 0.7) {
    review += "bueno, con un desempeño promedio en la mayoría de los aspectos.";
  } else if (output >= 0.5) {
    review += "regular, con un desempeño aceptable en algunos aspectos.";
  } else if (output >= 0.2) {
    review +=
      "deficiente, con un desempeño por debajo del promedio en la mayoría de los aspectos.";
  } else {
    review += "muy deficiente, con un desempeño inaceptable en todos los aspectos.";
  }
  return console.log(review);
}
let calculateGrade = () => {
  // const net = new RNN({ hiddenLayers: [10] });
  const net = new NeuralNetwork({
    hiddenLayers: [10],
  });

  // Entrenar la red con datos de ejemplo
  net.train([
    { input: [10, 10, 10, 10, 10, 10, 10, 10], output: [1] },
    { input: [9, 9, 9, 9, 9, 9, 9, 9], output: [0.9] },
    { input: [8, 8, 8, 8, 8, 8, 8, 8], output: [0.8] },
    { input: [7, 7, 7, 7, 7, 7, 7, 7], output: [0.7] },
    { input: [6, 6, 6, 6, 6, 6, 6, 6], output: [0.6] },
    { input: [5, 5, 5, 5, 5, 5, 5, 5], output: [0.5] },
    { input: [4, 4, 4, 4, 4, 4, 4, 4], output: [0.4] },
    { input: [3, 3, 3, 3, 3, 3, 3, 3], output: [0.3] },
    { input: [2, 2, 2, 2, 2, 2, 2, 2], output: [0.2] },
    { input: [1, 1, 1, 1, 1, 1, 1, 1], output: [0.1] },
  ]);

  // Utilizar la red para hacer una predicción
  const review = net.run([
    inscripcion.value,
    Repertorio.value,
    Tecnicas.value,
    Asistencias.value,
    Afinacion.value,
    Sonido.value,
    Actitudes.value,
    Comportamiento.value,
  ]);
  reviewFromOutput(review);

  /**
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
};

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
</script>
