<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          no-caps
          no-wrap
          class="q-ml-xs"
          v-if="$q.screen.gt.xs"
          @click="$router.push('/')"
        >
          <img src="~assets/logo.png" style="width: 40px; height: 40px" />
          <q-toolbar-title shrink class="text-weight-bold">
            La Sinfónica de Punta Cana
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <!-- <div class="no-wrap">
          <h5>a</h5>
        </div> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="language"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Ingles</q-tooltip>
          </q-btn>
          <q-btn v-if="sesion" to="/" @click="Salir()" round flat>
            <q-avatar size="26px" icon="home"> </q-avatar>
            <q-tooltip> Salir </q-tooltip>
          </q-btn>
          <q-btn v-else round flat to="/Login">
            <q-avatar size="26px" icon="login"> </q-avatar>
            <q-tooltip> Entrar </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-separator class="q-mt-md q-mb-xs" />
      <q-item-label header class="text-weight-bold text-uppercase">
        Operaciones
      </q-item-label>
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.text"
            v-ripple
            :to="link.to"
            clickable
          >
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-my-md" />

          <!-- <q-item v-for="link in links2" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item> -->

          <!--
          <q-item v-for="link in links3" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item> -->

          <!-- <q-separator class="q-my-md" /> -->

          <!-- <div class="q-px-md text-grey-9">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons1"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
              >
                {{ button.text }}
              </a>
            </div> -->
          <!-- </div> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-footer reveal elevated class="bg-orange-8 text-white">
      <q-toolbar>
        <q-toolbar-title />
        <q-btn
          flat
          round
          dense
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { inject, ref } from "vue";
import { ref, reactive } from "vue";

import { fabYoutube } from "@quasar/extras/fontawesome-v6";
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
const search = ref("");
const sesion = true;

// const sesion = inject("SESION");
const links1 = ref([
  { icon: "watch_later", text: "Asistencia", to: "/" },
  { icon: "add", text: "Registrar Alumnos", to: "/Registrar_Alumnos" },
  { icon: "chat", text: "Perfil de Alumnos" },
]);

const links2 = ref([
  { icon: "folder", text: "Library" },
  { icon: "restore", text: "History" },
  { icon: "watch_later", text: "Watch later" },
  { icon: "thumb_up_alt", text: "Liked videos" },
]);

const links3 = ref([
  { icon: fabYoutube, text: "YouTube Premium" },
  { icon: "local_movies", text: "Movies & Shows" },
  { icon: "videogame_asset", text: "Gaming" },
  { icon: "live_tv", text: "Live" },
]);

const buttons1 = ref([
  { text: "About" },
  { text: "Press" },
  { text: "Copyright" },
  { text: "Contact us" },
  { text: "Creators" },
  { text: "Advertise" },
  { text: "Developers" },
]);
</script>

<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
