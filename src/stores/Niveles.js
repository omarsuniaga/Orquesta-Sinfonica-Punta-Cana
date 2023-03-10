import { defineStore } from "pinia";
import { auth, SolicitarCredenciales } from "../firebase";
export const useNivelStore = defineStore("nivel", {
  state: () => ({
    nivel: null,
  }),
  getters: {},
  actions: {
    // registrar nivel
    async setNivel(email) {
      return (this.nivel = await SolicitarCredenciales(email));
    },
  },
});
