import { defineStore } from "pinia";
import { auth, SolicitarCredenciales } from "../firebase";
export const useNivelStore = defineStore("nivel", {
  state: () => ({
    nivel: null,
    imagenList: [],
  }),
  getters: {},
  actions: {
    // registrar nivel
    async setNivel(email) {
      return (this.nivel = await SolicitarCredenciales(email));
    },
    // Lista de imagenes
    async setImagenList() {
      const imagenes = await auth.currentUser.getIdTokenResult();
      return (this.imagenList = imagenes.claims.imagenes);
    },
  },
});
