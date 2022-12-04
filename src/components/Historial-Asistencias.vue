<script setup>
import moment from "moment";
import { ref, onMounted, watchEffect } from "vue";
import { Mostrar_todo, Mostrar_Listado, Contar_Ausentes } from "../firebase";
import VueApexCharts from "vue3-apexcharts";
const linea = ref({
  series: [],
  chartOptions: {
    chart: {
      type: "bar",
      height: 350,
      title: "Orquesta",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      type: "datetime",
      categories: [],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Alumnos";
        },
      },
    },
  },
});
let _l = ref([]);
let Alumnos = ref([]);
let meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
let arr = ref([]);
let pre = ref([]);
let MesesRegistrados = ref({});
let separator = ref("cell");
const mesActual = new Date().getMonth() + 1;
let mes = ref("");
let num = ref(0);
let numMes = ref(0);
let rows = ref([]);
const columns = [
  {
    name: "Fecha",
    label: "Fecha",
    field: "Fecha",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "Grupo",
    align: "center",
    label: "Grupo",
    field: "Grupo",
    sortable: true,
  },

  {
    name: "Presentes",
    required: true,
    label: "Presentes",
    align: "left",
    field: (row) => row.Presentes,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Ausentes",
    required: true,
    align: "left",
    label: "Ausentes",
    field: (row) => row.Ausentes,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "index",
    label: "ID",
    field: "index",
  },
];
const ObtenerDia = (dia) => {
  let f = moment(dia).day();
  let Semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  f = Semana.filter((e, i) => (i === f ? e : null));
  return f;
};
let BuscarAlumno = (id) => {
  let nom = "";
  Alumnos.value.filter((elem) =>
    elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
  );
  return nom;
};
let BuscarGrupo = (id) => {
  let grupo = "";
  Alumnos.value.filter((elem) =>
    elem.id === id ? (grupo = elem.grupo) : null
  );
  return grupo;
};
const DatosColumna = (listado) => {
  rows.value = [];
  rows.value = listado.map((el, i) => {
    return {
      index: i + 1,
      Fecha: el.Fecha,
      Ausentes: el.Data.ausentes.map((elem) => BuscarAlumno(elem)).length,
      Presentes: el.Data.presentes.map((elem) => BuscarAlumno(elem)).length,
      Grupo: el.grupo,
    };
  });
  return rows.value.sort(
    (a, b) => a.Fecha.split("-")[2] - b.Fecha.split("-")[2]
  );
};
const _a = (mes) => {
  let ListadoMes = [];
  let Listado = [];
  let PRESENTES = [];
  let AUSENTES = [];
  //Filtrar todos los registros donde el mes sea igual al seleccionado
  ListadoMes = _l.value.filter((elem) => {
    if (elem.Fecha === null) {
      return null;
    } else {
      if (elem.Fecha.split("-")[1] === mes.toString()) {
        let { ausentes, presentes } = elem.Data;
        presentes.map((elem) => PRESENTES.push(elem));
        ausentes.map((elem) => AUSENTES.push(elem));
        return ausentes, presentes;
      } else {
        return null;
      }
    }
  });
  //Ordenan los registros
  Listado = PRESENTES.reduce(
    (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
    {}
  );

  //crea objeto de los registros
  for (let clave in Listado) {
    Listado[clave] = {
      id: clave,
      nombre: BuscarAlumno(clave),
      asistencias: Listado[clave],
      grupo: BuscarGrupo(clave),
    };
  }
  //insertar la asistencia de cada uno en el listado mensual
  MesesRegistrados.value[mes].Listado = Listado;
  DatosColumna(ListadoMes);
  return;
};
let pagination = ref({
  rowsPerPage: 10,
});

onMounted(async () => {
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));

  //Iniciar meses registrados
  _l.value.filter((elem) =>
    elem.Fecha === null ? null : arr.value.push(elem.Fecha.split("-")[1])
  );
  // Meses Registrados
  MesesRegistrados.value = arr.value.reduce(
    (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
    {}
  );

  for (let clave in MesesRegistrados.value) {
    MesesRegistrados.value[clave] = await {
      id: clave,
      mes: meses[parseInt(clave)],
      registros: MesesRegistrados.value[clave],
      // obj: _a(clave),
    };
  }

  //Iniciar Graficas
  let ausentesCoro = [];
  let presentesCoro = [];
  let ausentesOrquesta = [];
  let presentesOrquesta = [];

  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );

  //Jalando asistencias

  _l.value.filter((elem) => {
    if (elem.grupo === "Coro") {
      elem.Data.ausentes.length === null
        ? ausentesCoro.push(0)
        : ausentesCoro.push(elem.Data.ausentes.length);
      elem.Data.presentes.length === null
        ? presentesCoro.push(0)
        : presentesCoro.push(elem.Data.presentes.length);
      linea.value.chartOptions.xaxis.categories.push(elem.Fecha);
      return linea.value.chartOptions.xaxis.categories.sort((a, b) => a - b);
    }
    if (elem.grupo === "Orquesta") {
      elem.Data.ausentes.length === null
        ? ausentesOrquesta.push(0)
        : ausentesOrquesta.push(elem.Data.ausentes.length);
      elem.Data.presentes.length === null
        ? presentesOrquesta.push(0)
        : presentesOrquesta.push(elem.Data.presentes.length);
      linea.value.chartOptions.xaxis.categories.push(elem.Fecha);
      return linea.value.chartOptions.xaxis.categories.sort((a, b) => a - b);
    }
  });
  linea.value.series.push({
    name: "Ausentes de Coro",
    data: ausentesCoro,
    color: "#C39BD3", //light red
  });
  linea.value.series.push({
    name: "Ausentes de Orquesta",
    data: ausentesOrquesta,
    color: "#76D7C4",
  });
  linea.value.series.push({
    name: "Presentes de Coro",
    data: presentesCoro,
    color: "#633974",
  });
  linea.value.series.push({
    name: "Presentes de Orquesta",
    data: presentesOrquesta,
    color: "#117864",
  });
});
watchEffect(async () => {
  // _a(mes);
});
</script>
<template>
  <div class="col-auto">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="receipt"
        label="Asistencias"
        caption="Meses Registrados"
        default-opened
      >
        <div
          v-for="(item, i) of MesesRegistrados"
          :key="item.id"
          @click="_a(i)"
        >
          <q-expansion-item>
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar icon="list" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section> {{ item.mes }} </q-item-section>

              <q-item-section side>
                <div class="row items-center">
                  <q-badge
                    rounded
                    color="red"
                    :label="item.registros"
                  ></q-badge>
                </div>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <q-card>
                  <q-card-section>
                    <div class="cols">
                      <q-item
                        clickable
                        v-ripple
                        v-for="user of item.Listado"
                        :key="user.id"
                      >
                        <q-item-section avatar>
                          <q-avatar>
                            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                          </q-avatar>
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1"
                            >{{ user.nombre }}
                            <q-badge
                              rounded
                              color="green"
                              :label="user.asistencias"
                            >
                            </q-badge>
                          </q-item-label>
                          <q-item-label caption lines="2">
                            <span class="text-weight-bold">{{
                              user.grupo
                            }}</span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-option-group
                        v-model="separator"
                        inline
                        class="q-mb-md"
                        :options="[
                          {
                            label: 'Horizontal (default)',
                            value: 'horizontal',
                          },
                          { label: 'Vertical', value: 'vertical' },
                          { label: 'Cell', value: 'cell' },
                          { label: 'None', value: 'none' },
                        ]"
                      />
                      <q-table
                        style="min-height: 350px"
                        title="Asistencias"
                        :rows="rows"
                        :columns="columns"
                        row-key="ID"
                        virtual-scroll
                        v-model:pagination="pagination"
                        :separator="separator"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-expansion-item>
    </q-list>

    <VueApexCharts
      type="bar"
      :options="linea.chartOptions"
      :series="linea.series"
    ></VueApexCharts>
  </div>
</template>
