import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../FirebaseService/constants";

export const useRepertorioStore = defineStore("repertorioStore", {
  state: () => ({
    repertorios: [],
    loading: false, // Para gestionar el estado de carga
    error: null, // Para gestionar errores
  }),
  actions: {
    async obtenerRepertorio() {
      this.loading = true;
      this.error = null;
      try {
        const querySnapshot = await getDocs(collection(db, "REPERTORIO"));
        this.repertorios = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        this.error = "Error al obtener el repertorio.";
        console.error(this.error, error);
      } finally {
        this.loading = false;
      }
    },
    async guardarObra(obra) {
      this.loading = true;
      this.error = null;
      try {
        if (obra.id) {
          // Modificar obra existente
          const docRef = doc(db, "REPERTORIO", obra.id);
          await updateDoc(docRef, obra);
          this.repertorios = this.repertorios.map((o) =>
            o.id === obra.id ? { id: o.id, ...obra } : o
          );
        } else {
          // Añadir nueva obra
          const docRef = await addDoc(collection(db, "REPERTORIO"), obra);
          this.repertorios.push({ id: docRef.id, ...obra });
        }
      } catch (error) {
        this.error = "Error al guardar la obra.";
        console.error(this.error, error);
      } finally {
        this.loading = false;
      }
    },
    async eliminarObra(id) {
      this.loading = true;
      this.error = null;
      try {
        const docRef = doc(db, "REPERTORIO", id);
        await deleteDoc(docRef);
        this.repertorios = this.repertorios.filter((obra) => obra.id !== id);
      } catch (error) {
        this.error = "Error al eliminar la obra.";
        console.error(this.error, error);
      } finally {
        this.loading = false;
      }
    },
  },
});
