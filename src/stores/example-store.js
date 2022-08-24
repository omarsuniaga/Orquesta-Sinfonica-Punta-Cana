import { defineStore } from "pinia";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

export const useCounterStore = defineStore("sesion", {
  state: () => ({
    sesion: false,
  }),
  getters: {},
  actions: {
    setSesion(id) {
      // this.state.sesion = id;
      // console.log(this.state.sesion);
    },
  },
});
