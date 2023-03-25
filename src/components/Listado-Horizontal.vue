<script setup>
import { ref, onMounted } from "vue";
const listado = ref([]);
let url = ref("https://picsum.photos/200/300");
const props = defineProps(["grupo", "Alumnos"]);
onMounted(async () => {
  const TotalAlumnos = props.Alumnos;
  listado.value = TotalAlumnos.filter((elem) =>
    elem.grupo.find((e) => e === props.grupo)
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));
});
</script>

<template>
  <h5 class="text-white q-mx-sm">{{ grupo }}</h5>
  <div class="container">
    <q-scroll-area class="horizontal">
      <div class="row no-wrap">
        <div v-for="(item, index) of listado" :key="index">
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
