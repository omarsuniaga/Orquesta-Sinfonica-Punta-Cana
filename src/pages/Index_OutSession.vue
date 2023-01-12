<template>
  <div class="q-pa-md">
    <!-- Carrusel -->
    <div class="q-pa-xl">
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        padding
        arrows
        height="350px"
        class="bg-grey-1 shadow-2 rounded-borders"
      >
        <q-carousel-slide :name="1" class="column wrap-sm">
          <div class="flex justify-between items-center content-center">
            <q-card class="my-card" style="width: 250px">
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />

              <q-card-section>
                <div class="text-h6">Primer Concierto</div>
                <div class="text-subtitle2">del Coro</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Diciembre de 2021
              </q-card-section>
            </q-card>
            <q-card class="my-card" style="width: 250px">
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />

              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                asdasdasdasdasdasdasdas
              </q-card-section>
            </q-card>
            <q-card class="my-card" style="width: 250px">
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />

              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                asdasdasdasdasdasdasdas
              </q-card-section>
            </q-card>
            <q-card class="my-card" style="width: 250px">
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />

              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                asdasdasdasdasdasdasdas
              </q-card-section>
            </q-card>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/quasar.jpg"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/cat.jpg"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/linux-avatar.png"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/material.png"
            />

            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/donuts.png"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Mensaje de Ayuida -->
    <div class="row justify-center items-center content-end">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-overline text-orange-9">Overline</div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            Ayúdanos a mantener la música
          </div>
          <div class="text-caption text-grey">
            Su donación mantendrá a nuestra orquesta y a nuestro personal y
            garantizará que nuestros programas de aprendizaje y comunitarios
            sigan siendo apoyados mientras hacemos música para millones de
            personas en el Este del Pais y en todo el mundo.
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="dark" label="Share">
            CONVIÉRTETE EN UN HÉROE DE LAS ARTES
          </q-btn>

          <q-space />
        </q-card-actions>
      </q-card>
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const slide = ref(1);
</script>
<style scoped></style>
