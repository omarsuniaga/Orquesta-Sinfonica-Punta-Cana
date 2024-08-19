<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-dark text-white">
        <div class="q-mb-md q-pt-md text-h5 text-center">
          {{ grupoSelecionado }}
        </div>
        <!-- <div class="q-mb-md q-pt-md text-h5 text-center">Gestión de Repertorio</div> -->
        <!-- Botón para agregar nueva obra -->
        <div class="q-mb-md text-center">
          <q-btn color="primary" @click="abrirDialogoObra">Añadir Nueva Obra</q-btn>
        </div>

        <!-- Listado de Repertorio -->
        <q-list bordered dark>
          <q-item v-for="(obra, index) in repertorios" :key="obra.id" clickable>
            <q-item-section>
              <q-item-label class="text-h6">{{ obra.Titulo }}</q-item-label>
              <q-item-label caption>{{ obra.Compositor }}</q-item-label>
              <q-item-label caption>Dificultad: {{ obra.Dificultad }}</q-item-label>
              <q-item-label caption>Grupo: {{ obra.Grupo }}</q-item-label>
              <q-item-label caption>
                Área de Trabajo: Compases
                {{ obra.AreaTrabajo?.desde ?? "N/A" }} -
                {{ obra.AreaTrabajo?.hasta ?? "N/A" }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="edit" @click="editarObra(index)" />
              <q-btn flat icon="delete" color="negative" @click="eliminarObra(index)" />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Dialogo para agregar/modificar obra -->
        <q-dialog v-model="dialogoObraVisible" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">
                {{ editando ? "Modificar Obra" : "Añadir Nueva Obra" }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="nuevaObra.Titulo"
                label="Título"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="nuevaObra.Compositor"
                label="Compositor"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-select
                v-model="nuevaObra.Dificultad"
                :options="['Fácil', 'Intermedio', 'Difícil']"
                label="Dificultad"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="nuevaObra.Grupo"
                label="Grupo"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="nuevaObra.AreaTrabajo.desde"
                label="Compás Desde"
                type="number"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-model="nuevaObra.AreaTrabajo.hasta"
                label="Compás Hasta"
                type="number"
                outlined
                dense
                class="q-mb-sm"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" @click="cerrarDialogoObra" />
              <q-btn flat label="Guardar" color="primary" @click="guardarObra" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../FirebaseService/constants";

// Variables reactivas
const repertorios = ref([]);
const dialogoObraVisible = ref(false);
const editando = ref(false);
const obraIndex = ref(-1);

// Datos del formulario para nueva obra
const nuevaObra = ref({
  Titulo: "",
  Compositor: "",
  Dificultad: "",
  Grupo: "",
  AreaTrabajo: {
    desde: 0,
    hasta: 0,
    fecha: new Date().toISOString().split("T")[0],
  },
});

// Función para obtener el repertorio desde Firebase
const obtenerRepertorio = async () => {
  try {
    const q = collection(db, "REPERTORIO");
    const querySnapshot = await getDocs(q);
    repertorios.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      AreaTrabajo: doc.data().AreaTrabajo || {
        desde: 0,
        hasta: 0,
        fecha: new Date().toISOString().split("T")[0],
      },
    }));
  } catch (error) {
    console.error("Error al obtener el repertorio:", error);
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  obtenerRepertorio();
});

// Función para abrir el diálogo para agregar o editar obra
const abrirDialogoObra = (index = -1) => {
  if (index >= 0) {
    editando.value = true;
    obraIndex.value = index;
    nuevaObra.value = { ...repertorios.value[index] };
  } else {
    editando.value = false;
    obraIndex.value = -1;
    nuevaObra.value = {
      Titulo: "",
      Compositor: "",
      Dificultad: "",
      Grupo: "",
      AreaTrabajo: {
        desde: 0,
        hasta: 0,
        fecha: new Date().toISOString().split("T")[0],
      },
    };
  }
  dialogoObraVisible.value = true;
};

// Función para cerrar el diálogo sin guardar cambios
const cerrarDialogoObra = () => {
  dialogoObraVisible.value = false;
};

// Función para guardar la obra (agregar o modificar)
const guardarObra = async () => {
  if (nuevaObra.value.Titulo && nuevaObra.value.Compositor && nuevaObra.value.Grupo) {
    if (editando.value) {
      // Modificar obra existente
      try {
        const docRef = doc(db, "REPERTORIO", repertorios.value[obraIndex.value].id);
        await updateDoc(docRef, nuevaObra.value);
        repertorios.value[obraIndex.value] = { ...nuevaObra.value };
      } catch (error) {
        console.error("Error al modificar la obra:", error);
      }
    } else {
      // Añadir nueva obra
      try {
        const docRef = await addDoc(collection(db, "REPERTORIO"), nuevaObra.value);
        repertorios.value.push({ id: docRef.id, ...nuevaObra.value });
      } catch (error) {
        console.error("Error al añadir la obra:", error);
      }
    }
    cerrarDialogoObra();
  } else {
    console.error("Por favor, completa todos los campos requeridos.");
  }
};

// Función para eliminar una obra del repertorio
const eliminarObra = async (index) => {
  try {
    const docRef = doc(db, "REPERTORIO", repertorios.value[index].id);
    await deleteDoc(docRef);
    repertorios.value.splice(index, 1);
  } catch (error) {
    console.error("Error al eliminar la obra:", error);
  }
};

// Función para editar una obra
const editarObra = (index) => {
  abrirDialogoObra(index);
};
</script>
<style scoped>
.bg-dark {
  background-color: #121212;
}

.text-white {
  color: #ffffff;
}

/* Estilos para mejorar la apariencia del listado y los diálogos */
.q-list {
  background-color: #1f1f1f;
  border-radius: 8px;
}

.q-item {
  border-bottom: 1px solid #333;
}

.q-item-label {
  color: #e0e0e0;
}

.q-btn {
  margin: 5px;
}
</style>
