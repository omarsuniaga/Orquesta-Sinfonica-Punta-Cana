<template>
  <div class="q-py-md">
    <div class="q-gutter-md">
      <q-list class="flex justify-center">
        <BuscarAlumnos
          :text="text"
          class="flex justify-center"
          style="min-width: 360px; width: 100%"
          @onFire="eventEmittedFromChild"
        ></BuscarAlumnos>
      </q-list>
    </div>

    <q-separator />
    <div class="container">
      <div id="alumnos-container " v-for="item in listado" :key="item.id">
        <button id="alumnos" @click="buscar(item.id)">
          <div class="profile">
            <q-img
              :src="url"
              @click="$router.push('/Detalles_Alumnos/' + item.id)"
            >
            </q-img>
          </div>
          <div class="title">
            <span> {{ item.nombre }} </span>
          </div>
        </button>
      </div>
    </div>
    <div class="resultados">
      <div class="container">
        <div
          v-for="(item, index) in recientes"
          :key="index"
          id="alumnos-container"
        >
          <button id="alumnos">
            <div class="profile">
              <q-img
                :src="url"
                @click="$router.push('/Detalles_Alumnos/' + item.id)"
              >
              </q-img>
            </div>
            <div class="title">
              <span> {{ item.nombre }} </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { obtenerAlumnos } from "../FirebaseService/database";
import BuscarAlumnos from "../components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const listado = ref([]);
const recientes = ref([]);
const Alumnos = ref([]);
const data = ref([]);

let loading = ref(false);
let text = ref("");
let url = ref("https://picsum.photos/200/300");

onMounted(async () => {
  Alumnos.value = await obtenerAlumnos();
  if (Alumnos.value !== 0) {
    return (loading.value = true);
  }
});

data.value = {
  ids: JSON.parse(localStorage.getItem("ids")) || [],
  acumuladores: {},
};

for (let id of data.value.ids) {
  data.value.acumuladores[id] = localStorage.getItem(`acumulador-${id}`);
}
const buscar = (id) => {
  // Revisar si el id existe en el localstorage
  let storedIds = JSON.parse(localStorage.getItem("ids")) || [];
  if (storedIds.indexOf(id) !== -1) {
    // Obtener el acumulador del id específico
    let acumulador = parseInt(localStorage.getItem(`acumulador-${id}`)) || 0;
    acumulador++;
    // Guardar el acumulador actualizado
    localStorage.setItem(`acumulador-${id}`, acumulador);
  } else {
    //empuja el id del parametro al array con los ids del localstorage
    storedIds.push(id);
    localStorage.setItem("ids", JSON.stringify(storedIds));
    // Crear un acumulador para el nuevo id
    localStorage.setItem(`acumulador-${id}`, 1);
  }
  // devolver el acumulador
  return localStorage.getItem(`acumulador-${id}`);
};

const eventEmittedFromChild = (res) => {
  try {
    if (res.length != 0) {
      listado.value = res.map((e) => ({ ...e }));
      return listado.value;
    }
  } catch (error) {
    return console.log(error);
  }
};
//devuelve las busquedas recientes
watchEffect(async () => {
  recientes.value = Alumnos.value.filter((elem) =>
    data.value.ids.find((e) => e === elem.id)
  );
  console.log(recientes.value);
});
</script>
<style>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Define la animación de carga */
.loading-container .loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

/* Define la keyframe de la animación */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.container {
  margin: auto;
  width: 100vw;
  display: flex;
  overflow-x: scroll;
}
#alumnos-container {
  padding: 15px 0;
}
#alumnos {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  margin: 0 auto;
}
#alumnos .profile {
  background: rgb(0, 30, 255);
  background: linear-gradient(
    36deg,
    rgb(0, 30, 255) 28%,
    rgb(156, 90, 134) 73%,
    rgb(60, 26, 81) 100%
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
  border-radius: 60%;
  padding: 0;
  margin: 0;
  border: 2px solid rgb(248, 248, 248);
}
#alumnos .title {
  text-align: center;
  padding: 5px 0;
  color: #fff;
}
#alumnos.active .profile {
  animation-duration: 1s;
  animation-name: contorno;
  animation-iteration-count: infinite;
}

@keyframes contorno {
  0% {
    background: linear-gradient(
      36deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  10% {
    background: linear-gradient(
      72deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  20% {
    background: linear-gradient(
      108deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  30% {
    background: linear-gradient(
      144deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  40% {
    background: linear-gradient(
      180deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  50% {
    background: linear-gradient(
      216deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  60% {
    background: linear-gradient(
      252deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  70% {
    background: linear-gradient(
      288deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  80% {
    background: linear-gradient(
      324deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  90% {
    background: linear-gradient(
      360deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 30, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
  100% {
    background: linear-gradient(
      396deg,
      rgb(255, 255, 255) 0%,
      rgb(255, 255, 255) 0%,
      rgb(0, 26, 255) 28%,
      rgb(227, 38, 164) 73%,
      rgb(96, 28, 137) 100%
    );
  }
}
/* pantalla para moviles */
@media screen and (max-width: 668px) {
  #alumnos .profile {
    background: rgb(255, 201, 0);
    background: linear-gradient(
      36deg,
      rgb(0, 30, 255) 13%,
      rgb(227, 38, 164) 73%,
      rgb(255, 9, 057) 100%
    );
    padding: 4.5px;
    box-sizing: border-box;
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
  #alumnos .profile img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    padding: 0;
    margin: 0;
    border: 2px solid rgb(255, 255, 255);
  }
}
.resultados {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
}
</style>
