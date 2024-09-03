<script setup>
import { ref, onMounted, defineProps, onUnmounted } from "vue";
import { obtenerConfiguraciones } from "../FirebaseService/database";

const props = defineProps({
  grupo: String,
  Alumnos: Array,
});

let defaultAvatar = ref("https://picsum.photos/200/300"); // URL por defecto
const listadoAgrupado = ref([]);
const scrollContainer = ref(null);
const groupOrder = ref([]);

function handleScroll() {
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  if (scrollLeft + clientWidth >= scrollWidth - 100) {
    cargarMasDatos();
  }
}

async function cargarMasDatos() {
  const nuevosDatos = props.Alumnos.filter((elem) =>
    elem.grupo.includes(props.grupo)
  );
  listadoAgrupado.value.push(...nuevosDatos);
}

onMounted(async () => {
  //groupOrder.value = await obtenerConfiguraciones();
  listadoAgrupado.value = props.Alumnos.filter((elem) =>
    elem.grupo.includes(props.grupo)
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

function cargarAvatar(url) {
  const avatarCacheado = localStorage.getItem(url);
  if (avatarCacheado) {
    return avatarCacheado;
  } else {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      localStorage.setItem(url, img.src);
    };
    return url;
  }
}
</script>

<template>
  <div class="container" ref="scrollContainer">
    <h4 class="text-white">{{ grupo }}</h4>
    <q-scroll-area class="horizontal">
      <div class="row no-wrap">
        <div v-for="(item, index) in listadoAgrupado" :key="index">
          <button id="alumnos">
            <div class="profile">
              <q-img
                :src="cargarAvatar(item.avatar || defaultAvatar)"
                :alt="item.nombre"
                loading="lazy"
                @click="$router.push('/Detalles_Alumnos/' + item.id)"
              />
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
  width: 150vw;
  overflow-x: hidden;
  overflow-y: hidden;
}
#alumnos-container {
  padding: 1px 1px;
}
#alumnos {
  border: transparent;
  background-color: transparent;
  cursor: pointer;
  /* margin: auto; */
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
}
#alumnos .title {
  text-align: center;
  padding: 1px 0;
  color: #fff;
  font-size: 1.1rem;
}

@media screen and (max-width: 668px) {
  #alumnos .profile {
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
    width: 150vw;
    overflow-y: hidden;
    overflow-x: hidden;
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
