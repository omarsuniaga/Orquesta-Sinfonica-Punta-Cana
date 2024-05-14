<script setup>
import { ref, onMounted, defineProps, onUnmounted } from "vue";
const listadoAgrupado = ref([]);
let url = ref("https://picsum.photos/200/300");
const props = defineProps(["grupo", "Alumnos"]);
const scrollContainer = ref(null);
// Define el orden de los grupos
const groupOrder = ["Coro", "Orquesta", "Iniciacion 1", "Iniciacion 2"];

function handleScroll() {
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  // Carga más datos si estás a 100px del final del scroll
  if (scrollLeft + clientWidth >= scrollWidth - 100) {
    cargarMasDatos();
  }
}

async function cargarMasDatos() {
  // Aquí tu lógica para cargar más datos
  // Simulando una carga de datos
  const nuevosDatos = props.Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === props.grupo)
  ); // Filtrar y añadir más datos
  listadoAgrupado.value.push(...nuevosDatos);
}

onMounted(() => {
  listadoAgrupado.value = props.Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === props.grupo)
  ).sort((a, b) => {
    return (
      groupOrder.indexOf(a.grupo.find((g) => groupOrder.includes(g))) -
      groupOrder.indexOf(b.grupo.find((g) => groupOrder.includes(g)))
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
  <h5 class="text-white q-mx-sm">{{ grupo }}</h5>
  <div class="container" ref="scrollContainer">
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
}
#alumnos-container {
  padding: 10px 0;
}
#alumnos {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  margin: 0;
}
#alumnos .profile {
  background: rgb(34, 181, 181);
  background: linear-gradient(
    150deg,
    rgb(97, 124, 233) 10%,
    rgb(140, 255, 146) 50%,
    rgb(23, 157, 74) 80%
  );
  padding: 9px;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
#alumnos .profile img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  border: 2px solid rgb(248, 248, 248);
  object-fit: cover;
  /* estirar imagen */
}
#alumnos .title {
  text-align: center;
  padding: 15px 0;
  color: #fff;
  font-size: 1.2rem;
}

/* pantalla para moviles */
@media screen and (max-width: 668px) {
  #alumnos .profile {
    background: rgb(34, 181, 181);
    background: linear-gradient(
      150deg,
      rgb(97, 124, 233) 10%,
      rgb(140, 255, 146) 50%,
      rgb(23, 157, 74) 80%
    );
    padding: 4px;
    box-sizing: border-box;
    width: 75px;
    height: 75px;
    border-radius: 60%;
  }
  #alumnos .profile img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    padding: 2px;
    margin: 0.5px;
    border: 3px solid rgb(152, 213, 186);
  }
}
</style>
