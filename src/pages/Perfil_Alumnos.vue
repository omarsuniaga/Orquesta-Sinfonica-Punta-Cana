<template>
  <div class="q-py-md">
    <div class="q-gutter-md">
      <q-list class="flex justify-center">
        <q-item-label header
          >Listado de Alumnos
          <q-icon name="format_list_numbered" />
        </q-item-label>
        <BuscarAlumnos
          :text="text"
          class="flex justify-center"
          style="min-width: 360px; width: 100%"
          @onFire="eventEmittedFromChild"
        ></BuscarAlumnos>
        <!-- Filtro -->
        <div
          class="justify-center q-my-sm flex row"
          style="min-width: 375px; width: 100%"
        >
          <q-btn-toggle
            class="col-auto flex justify-around"
            v-model="grupo"
            rounded
            spread
            stack
            no-caps
            no-wrap
            toggle-color="primary"
            color="while"
            text-color="primary"
            :options="[
              { label: 'Inicio 1', value: 'Ini1' },
              { label: 'Inicio 2', value: 'Ini2' },
              { label: 'Coro', value: 'Coro' },
              { label: 'Orquesta', value: 'Orq' },
              { label: 'Todos', value: 'All' },
            ]"
          >
          </q-btn-toggle>
        </div>
      </q-list>
    </div>

    <q-separator />
    <div class="coleccionDos">
      <!-- Clasificaciones por Grupos -->
      <h4 class="text-white">Orquesta</h4>
      <q-virtual-scroll
        :items="Listado"
        virtual-scroll-horizontal
        v-slot="{ item, index }"
      >
        <div :key="index" class="container q-img-responsive">
          <q-img
            :src="url"
            syle="height: 280px; max-width: 370px"
            @click="$router.push('/Detalles_Alumnos/' + item.id)"
          >
            <div class="name">
              {{ item.nombre }}
              <div class="instrument">{{ item.instrumento }}</div>
            </div>

            <!-- <q-virtual-scroll
                :items="item.grupo"
                virtual-scroll-horizontal
                v-slot="{ item, index }"
              >
                <span :key="index" :class="item.class">
                  <q-badge top outline color="secondary" :label="item" />
                </span>
              </q-virtual-scroll> -->
          </q-img>
        </div>
      </q-virtual-scroll>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from "vue";
import { Mostrar_Listado, Mostrar_todo, ObtenerAsistencias } from "../firebase";
import { useQuasar } from "quasar";
import BuscarAlumnos from "../components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
const $q = useQuasar();
let url = ref("https://cdn.quasar.dev/img/parallax2.jpg");
const _l = ref([]);
let Listado = ref([]);
let text = ref("");
let timer;
let grupo = ref("");
let Alumnos = ref("");
const router = useRouter();
const styleObject = ref({
  color: "red",
  fontSize: "13px",
  "background-image": `url(${url.value})`,
  "background-position": "center",
  "background-size": "cover",
});
let filter = ref(router.currentRoute._rawValue.params.filter);
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Listado.value = res.map((e) => ({ ...e }));
    return Listado.value;
  } else {
    return cargar_alumnos();
  }
};
const cargar_alumnos = async () => {
  let algo = async (id) => {
    const obj = {};
    obj.presente = await ObtenerAsistencias(id).then((e) => e.presente);
    obj.ausente = await ObtenerAsistencias(id).then((e) => e.ausente);
    return { obj };
  };

  Listado.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => ({ ...e.data() }))
  );
  Listado.value.map((elem) =>
    algo(elem.id).then(
      (e) =>
        (elem.presente = e.obj.presente) &&
        (elem.ausente = e.obj.ausente) &&
        (elem.min = 0.22) &&
        (elem.totalClases = e.obj.ausente + e.obj.presente)
    )
  );

  return Listado.value;
};

const Funcion_Switch = async (res) => {
  Listado.value.length = 0;

  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  Listado.value = await Alumnos.value
    .filter((elem) => elem.grupo.find((e) => e === res))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  return router.push(`/Perfil_Alumnos/${res}`);
};

const Filtrar = async (res) => {
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  switch (res) {
    case "Orq":
      Funcion_Switch("Orquesta");
      break;
    case "Coro":
      Funcion_Switch("Coro");
      break;
    case "Ini2":
      Funcion_Switch("Iniciacion 2");
      break;
    case "Ini1":
      Funcion_Switch("Iniciacion 1");
      break;
    case "All":
      router.push(`/Perfil_Alumnos/All`);
      Listado.value.length = 0;
      Listado.value = await Mostrar_Listado().then((elem) =>
        elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
      break;
    default:
      break;
  }
};

onMounted(async () => {
  await cargar_alumnos();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
const slideRatio = ref({
  left: 0,
  right: 0,
});
const rightColor = computed(() =>
  slideRatio.value.right >= 2
    ? "green-10"
    : "green-" + (3 + Math.round(Math.min(3, slideRatio.value.right * 3)))
);
const onSlide = ({ side, ratio, isReset }) => {
  clearTimeout(timer);
  timer = setTimeout(
    () => {
      slideRatio.value[side] = ratio;
    },
    isReset === true ? 200 : void 0
  );
};
watchEffect(async () => {
  filter.value = grupo.value;
  grupo.value = filter.value;
  // await Filtrar(router.currentRoute._rawValue.params.filter);
  await Filtrar(filter.value);
});
</script>
<style lang="css">
.container {
  align-content: center;
  justify-content: center;
  align-items: center;
  min-width: 260px;
  min-height: 135px;
  margin: 10px;
  transform: scale(1);
  box-shadow: 0px 8px 10px #000000;
}
/* necesito animar la scala al pasar el cursor sobre el items */
.q-img-responsive:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.coleccionDos {
  width: 100vw;
  height: 100vh;
  border-radius: 4%;
}

@media only screen and (max-width: 720px) {
  .q-img-responsive {
    border-radius: 4%;
    min-width: 130px;
    min-height: 45px;
    margin-right: 4px;
    margin-left: 4px;
    transform: scale(1);
  }
  .name {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #fff;
    text-align: justify;
    margin-top: 0px;
    width: 100%;
  }
  .instrument {
    font-size: 8px;
    color: rgb(73, 148, 156);
    margin-bottom: 10px;
  }
}
</style>
