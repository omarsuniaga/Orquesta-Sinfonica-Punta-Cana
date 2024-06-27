<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ instrument.name }}</div>
        <div>{{ instrument.description }}</div>
        <div>Assigned to: {{ instrument.assignedTo }}</div>
        <div>Registration Date: {{ instrument.registrationDate }}</div>
        <div>Details: {{ instrument.details }}</div>
        <q-img :src="instrument.imageUrl" alt="Instrument Image" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { db } from "../firebase"; // Asegúrate de tener configurado Firebase

export default {
  name: "InstrumentDetails",
  data() {
    return {
      instrument: {},
    };
  },
  created() {
    this.fetchInstrument();
  },
  methods: {
    async fetchInstrument() {
      const instrumentId = this.$route.params.id;
      const doc = await db.collection("instruments").doc(instrumentId).get();
      if (doc.exists) {
        this.instrument = doc.data();
      } else {
        this.$q.notify({
          type: "negative",
          message: "Instrument not found",
        });
      }
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
