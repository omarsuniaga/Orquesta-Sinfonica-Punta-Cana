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
    // get nivel
    async getNivel() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          return (this.nivel = await SolicitarCredenciales(user.email));
        }
      });
    },
  },
});
