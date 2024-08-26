import { defineStore } from "pinia";

export const useAlumnoStore = defineStore("alumnoStore", {
  state: () => ({
    alumnos: [],
    presentes: [],
    ausentes: [],
    demorados: [],
    justificados: [],
  }),
  actions: {
    setAlumnos(alumnos) {
      this.alumnos = alumnos;
    },
    resetEstados() {
      this.presentes = [];
      this.ausentes = [];
      this.demorados = [];
      this.justificados = [];
    },
    marcarComoPresente(id) {
      if (!this.presentes.includes(id)) {
        this.presentes.push(id);
        this.ausentes = this.ausentes.filter((alumnoId) => alumnoId !== id);
        this.demorados = this.demorados.filter((alumnoId) => alumnoId !== id);
      }
    },
    marcarComoAusente(id) {
      if (!this.ausentes.includes(id)) {
        this.ausentes.push(id);
        this.presentes = this.presentes.filter((alumnoId) => alumnoId !== id);
        this.demorados = this.demorados.filter((alumnoId) => alumnoId !== id);
      }
    },
    marcarComoDemorado(id) {
      if (!this.demorados.includes(id)) {
        this.demorados.push(id);
        if (!this.presentes.includes(id)) {
          this.presentes.push(id);
        }
        this.ausentes = this.ausentes.filter((alumnoId) => alumnoId !== id);
      }
    },
    marcarComoJustificado(id) {
      if (!this.justificados.includes(id)) {
        this.justificados.push(id);
        this.ausentes = this.ausentes.filter((alumnoId) => alumnoId !== id);
        this.presentes = this.presentes.filter((alumnoId) => alumnoId !== id);
      }
    },
    quitarEstadoDemorado(id) {
      this.demorados = this.demorados.filter((alumnoId) => alumnoId !== id);
    },
    quitarEstadoJustificado(id) {
      this.justificados = this.justificados.filter(
        (alumnoId) => alumnoId !== id
      );
    },
  },
});
