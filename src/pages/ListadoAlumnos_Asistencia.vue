<template>
  <div class="q-pa-xs" style="min-width: 375px; width: 100%">
    <div class="row col-12">
      <!-- Sección de alumnos ausentes -->
      <div class="col-6">
        <span class="text-body1 text-white">Ausentes</span>
        <div v-if="loading">
          <q-spinner-cube color="indigo" />
        </div>
        <div v-else class="row flex justify-center scrollList" ref="chatRef">
          <!-- Mostrar lista de alumnos ausentes -->
          <template v-if="resultadoBusqueda.length > 0">
            <q-card
              class="q-ma-xs bg-red-3"
              v-for="(item, index) in resultadoBusqueda"
              :key="index"
              @click="comprobar(item)"
              v-touch-hold:2000.mouse="handleHold"
            >
              <q-item v-if="!item.asistencia" :id="item.id">
                <q-item-section>
                  <q-item-label class=""
                    >{{ item.nombre }}
                    {{ $q.screen.gt.sm ? item.apellido : "" }}</q-item-label
                  >
                  <q-item-label class="">
                    <q-virtual-scroll
                      :items="item.grupo"
                      virtual-scroll-horizontal
                      v-slot="{ item, index }"
                    >
                      <div :key="index" :class="item.class" class="q-px-sm">
                        <q-badge top color="red" :label="item" />
                      </div>
                    </q-virtual-scroll>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </template>
          <!-- Si no hay resultados de búsqueda, mostrar el listado completo -->
          <template v-else>
            <q-card
              class="q-ma-xs bg-red-3"
              v-for="(item, index) in listado"
              :key="index"
              @click="agregar(item)"
              v-touch-hold:2000.mouse="handleHold"
            >
              <q-item v-if="!item.asistencia" :id="item.id">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon
                      :name="item.nombre[0]"
                      size="sm"
                      style="
                        background-color: rgba(152, 80, 54, 0.685);
                        border-radius: 50%;
                        padding: 10px;
                        align-items: center;
                        color: white;
                      "
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-regular"
                    >{{ item.nombre }}
                    {{ $q.screen.gt.xs ? item.apellido : "" }}</q-item-label
                  >
                  <q-item-label>
                    <q-virtual-scroll
                      :items="item.grupo"
                      virtual-scroll-horizontal
                      v-slot="{ item, index }"
                    >
                      <div :key="index" :class="item.class" class="q-ma-xs">
                        <q-badge top color="red-6" :label="item" />
                      </div>
                    </q-virtual-scroll>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </template>
        </div>
      </div>
      <!-- Sección de alumnos presentes -->
      <div class="col-6">
        <span class="text-body1 text-white">Presentes</span>
        <div class="row flex justify-center scrollList" ref="chatRef">
          <!-- Mostrar lista de alumnos presentes -->
          <template v-if="presentes.length > 0">
            <q-card
              v-for="(item, index) in presentes"
              :key="index"
              class="q-ma-xs bg-green-3"
              @click="quitar(item)"
              v-touch-hold:2000.mouse="handleHold"
            >
              <q-item :id="item.id">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon
                      :name="item.nombre[0]"
                      size="sm"
                      style="
                        background-color: rgba(46, 119, 63, 0.685);
                        border-radius: 50%;
                        padding: 10px;
                        align-items: center;
                        color: white;
                      "
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-weight-regular">
                  <q-item-label>
                    {{ item.nombre }} {{ $q.screen.gt.xs ? item.apellido : "" }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-virtual-scroll
                      :items="item.grupo"
                      virtual-scroll-horizontal
                      v-slot="{ item, index }"
                    >
                      <div :key="index" :class="item.class" class="q-ma-xs">
                        <q-badge top color="green-6" :label="item" />
                      </div>
                    </q-virtual-scroll>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </template>
          <!-- Si no hay alumnos presentes, mostrar un mensaje -->
          <template v-else>
            <q-card v-if="presentes.length === 0" class="q-ma-xs bg-white">
              <q-item> No hay registros </q-item>
            </q-card>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const Resultado_Busqueda = ref([]);
const Presentes = ref([]);
const Listado = ref([]);
const Loading = ref(false);

function handleHold({ evt }) {
  let id = evt.path[2].id;
  return router.push(`/Detalles_Alumnos/${id}`);
}

// Función para comprobar si un alumno ya está en la lista de presentes
const comprobar = async (item) => {
  let index = Presentes.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    $q.notify({
      message: "Ya está en la lista de presentes",
      color: "red-2",
      textColor: "red-9",
      icon: "priority_high",
    });
  } else {
    agregar(item);
  }
};

// Función para agregar un alumno a la lista de presentes
const agregar = async (item) => {
  let index = Listado.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    Listado.value.splice(index, 1);
  }
  Presentes.value.unshift({ ...item, asistencia: true });
  Listado.value = Listado.value.filter((e) => e.id !== item.id);
};

// Función para quitar un alumno de la lista de presentes
const quitar = (item) => {
  let index = Presentes.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    Presentes.value.splice(index, 1);
  }
  Listado.value.unshift({ ...item, asistencia: false });
  Presentes.value = Presentes.value.filter((e) => e.id !== item.id);
};
</script>

<style>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
