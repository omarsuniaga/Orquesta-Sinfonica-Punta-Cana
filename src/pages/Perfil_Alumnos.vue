<template>
  <div class="q-mx-lg flex justify-center">
    <q-list bordered separator style="">
      <q-item-label header>Listado de Alumnos</q-item-label>
      <q-separator />
      <!-- Card del alumno -->
      <div v-for="(card, i) in cards" :key="i">
        <q-item
          clickable
          class="q-pa-sm flex justify-between col-auto"
          style="height: 90px; width: 80vw"
        >
          <q-item-section class="col-2 row items-center q-py-xs">
            <q-avatar>
              <q-img :src="card.avatar" style="height: 240px; max-width: 240px">
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>

          <div class="col-3 col-sx-1">
            <q-item-section class="row items-center">
              <q-item-label class="">{{ card.grupo }}</q-item-label>
              <q-item-label caption class="row">
                {{ card.instrumento }}
              </q-item-label>
            </q-item-section>
          </div>
          <div class="col-5 col-xs-3">
            <q-item-section class="row flex justify-center q-pa-md">
              <q-item-label class="text-weight-medium"
                >{{ card.nombreCompleto }}
              </q-item-label>
            </q-item-section>
          </div>

          <div class="text-grey-8 col-1 col-xs-none">
            <q-item-section side>
              <q-btn
                :to="{
                  name: 'Detalles_Alumnos',
                  paths: '/Alumno:' + card.id,
                  params: { id: card.id },
                }"
                size="11px"
                flat
                round
                icon="edit"
              />
            </q-item-section>
          </div>
          <div class="text-grey-8 col-1">
            <q-item-section side>
              <q-btn
                @click="Eliminar(card.id)"
                size="11px"
                flat
                round
                icon="delete"
              />
            </q-item-section>
          </div>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Mostrar_Listado } from "../firebase";

const Eliminar = (id) => console.log("Eliminando Perfil...", id);
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());

const cards = ref([]);
onMounted(() => {
  Mostrar_Listado().then((elem) => {
    elem.map((e) =>
      cards.value.push({
        nombreCompleto: e.data().nombre + " " + e.data().apellido,
        id: e.data().id,
        avatar: e.data().img
          ? e.data().img
          : "https://placeimg.com/500/300/nature?t=" + Math.random(),
        grupo: e.data().grupo ? e.data().grupo : "Inicial",
        instrumento: e.data().instrumento ? e.data().instrumento : "Teoria",
      })
    );
  });
  console.log(cards.value);
});
</script>
