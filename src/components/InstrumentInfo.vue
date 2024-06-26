<template>
  <div>
    <div>
      URL:
      <a
        :href="`https://orquestasinfonicapuntacana.netlify.app/instruments/${instrument.id}`"
        target="_blank"
      >
        https://orquestasinfonicapuntacana.netlify.app/instruments/{{
          instrument.id
        }}
      </a>
    </div>
    <div v-if="qrCodeUrl">
      <div>QR Code:</div>
      <img :src="qrCodeUrl" alt="QR Code" />
      <q-btn
        @click="$emit('downloadQRCode')"
        label="Descargar QR"
        color="secondary"
      ></q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "InstrumentInfo",
  props: {
    instrument: {
      type: Object,
      required: true,
    },
    qrCodeUrl: {
      type: String,
      required: false,
    },
  },
};
</script>
