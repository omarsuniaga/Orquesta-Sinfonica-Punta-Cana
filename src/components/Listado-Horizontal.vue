<script setup>
import { ref, onMounted, defineProps, onUnmounted } from "vue";
import { obtenerConfiguraciones } from "../FirebaseService/database";
const props = defineProps({
  grupo: String,
  Alumnos: Array,
});
let url = ref("https://picsum.photos/200/300");
const listadoAgrupado = ref([]);
const scrollContainer = ref(null);
// Define el orden de los grupos
const groupOrder = ref([]);

function handleScroll() {
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  // Carga más datos si estás a 100px del final del scroll
  if (scrollLeft + clientWidth >= scrollWidth - 100) {
    cargarMasDatos();
  }
}

async function cargarMasDatos() {
  const nuevosDatos = props.Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === props.grupo)
  ); // Filtrar y añadir más datos
  listadoAgrupado.value.push(...nuevosDatos);
}

onMounted(async () => {
  // obtener datos de obtenerConfiguraciones
  groupOrder.value = await obtenerConfiguraciones();
  listadoAgrupado.value = props.Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === props.grupo)
  ).sort((a, b) => {
    return (
      groupOrder.value.indexOf(
        a.grupo.find((g) => groupOrder.value.includes(g))
      ) -
      groupOrder.value.indexOf(
        b.grupo.find((g) => groupOrder.value.includes(g))
      )
    );
  });
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <div class="container" ref="scrollContainer">
    <span class="text-white">{{ grupo }}</span>
    <q-scroll-area class="horizontal">
      <div class="row no-wrap">
        <div v-for="(item, index) in listadoAgrupado" :key="index">
          <button id="alumnos">
            <div class="profile">
              <q-img
                :src="(item.avatar ||= url)"
                @click="$router.push('/Detalles_Alumnos/' + item.id)"
              >
              </q-img>
            </div>
            <div class="title">
              <span>{{ item.nombre }}</span>
            </div>
          </button>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<style>
.container .horizontal {
  height: 35vh;
  width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
#alumnos-container {
  padding: 1px 10px;
}
#alumnos {
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
  margin: auto;
}
#alumnos .profile {
  background: rgb(10, 11, 11);
  background: linear-gradient(
    150deg,
    rgb(97, 124, 233) 10%,
    rgb(144, 54, 234) 50%,
    rgb(23, 74, 157) 80%
  );
  padding: 10px;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
#alumnos .profile img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 1px;
  margin: 0;
  object-fit: cover;
  /* estirar imagen */
}
#alumnos .title {
  text-align: center;
  padding: 1px 0;
  color: #fff;
  font-size: 1.1rem;
}

/* pantalla para moviles */
@media screen and (max-width: 668px) {
  #alumnos .profile {
    background: rgb(34, 181, 181);
    background: linear-gradient(
      150deg,
      rgb(97, 124, 233) 10%,
      rgb(144, 54, 234) 50%,
      rgb(23, 74, 157) 80%
    );
    padding: 4.3px;
    box-sizing: border-box;
    width: 75px;
    height: 75px;
    border-radius: 60%;
  }
  .container .horizontal {
    height: 35vh;
    width: 100vw;
    overflow-y: hidden;
  }
  #alumnos .profile img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    padding: 1px;
    margin: 0.5px;
  }
  #alumnos .title {
    text-align: center;
    padding: 1px 0;
    color: #fff;
    font-size: 0.8rem;
  }
}
</style>
