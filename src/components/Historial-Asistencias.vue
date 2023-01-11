<script setup>
import moment from "moment";
import { ref, inject, onMounted, watchEffect } from "vue";
import { Mostrar_todo, Mostrar_Listado, Buscar_Alumno } from "../firebase";
import VueApexCharts from "vue3-apexcharts";
const linea = ref({
  // series: [],
  series: [
    // {
    // name: "Coro",
    // data: [],
    // },
  ],
  chartOptions: {
    chart: {
      // type: "bar",
      type: "area",
      height: 550,
      title: "Orquesta",
    },
    // plotOptions: {
    //   bar: {
    //     horizontal: false,
    //     columnWidth: "55%",
    //     endingShape: "rounded",
    //   },
    // },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      // show: false,
      // width: 2,
      // colors: ["transparent"],
    },
    xaxis: {
      type: "datetime",
      categories: [],
    },
    // fill: {
    //   opacity: 1,
    // },
    // legend: {
    //   position: "right",
    //   offsetX: 0,
    //   offsetY: 50,
    // },
    tooltip: {
      x: {
        format: "dd/MM/yy",
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
let Fecha = moment().format("LLLL");
let mesHoy = new Date(Fecha).getMonth() + 1;
let arr = ref([]);
let Dia = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];
let MesesRegistrados = ref({});
let separator = ref("cell");
let rows = ref([]);
let ObjetoGlobal = inject("ObjetoGlobal");
const columns = [
  {
    name: "Fecha",
    label: "Fecha",
    field: "Fecha",
    sortable: true,
    align: "center",
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    align: "center",
    name: "Grupo",
    label: "Grupo",
    field: "Grupo",
    sortable: true,
  },

  {
    name: "Presentes",
    required: true,
    label: "Presentes",
    align: "center",
    field: (row) => row.Presentes,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Ausentes",
    required: true,
    align: "center",
    label: "Ausentes",
    field: (row) => row.Ausentes,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Dia",
    required: true,
    align: "center",
    label: "Dia",
    field: (row) => row.Dia,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "index",
    label: "ID",
    align: "center",
    required: true,
    sortable: true,
    field: (row) => row.index,
    format: (val) => `${val}`,
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
const BuscarAlumno = (id) => {
  let nom = "";
  Alumnos.value.filter((elem) =>
    elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
  );
  return nom;
};
const BuscarGrupo = (id) => {
  let grupo = "";
  Alumnos.value.filter((elem) =>
    elem.id === id ? (grupo = elem.grupo) : null
  );
  return grupo;
};
const DatosColumna = (listado) => {
  rows.value = [];
  rows.value = listado.map((el, i) => {
    let Xmas95 = new Date(el.Fecha);
    let weekday = Xmas95.getDay();

    return {
      index: i + 1,
      Fecha: el.Fecha,
      Ausentes: el.Data.ausentes.map((elem) => BuscarAlumno(elem)).length,
      Presentes: el.Data.presentes.map((elem) => BuscarAlumno(elem)).length,
      Grupo: el.grupo,
      Dia: Dia[weekday],
    };
  });
  return rows.value.sort(
    (a, b) => a.Fecha.split("-")[2] - b.Fecha.split("-")[2]
  );
};

//Segun el mes, se crea un objeto con los alumnos presentes y ausentes.
const _a = (mes) => {
  let ListadoMes = [];
  let Listado = [];
  let ListadoAusentes = [];
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
  ListadoAusentes = AUSENTES.sort((a, b) => a + b).reduce(
    (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
    {}
  );
  for (let id in ListadoAusentes) {
    ListadoAusentes[id] = {
      id: id,
      Inasistencias: ListadoAusentes[id],
    };
  }

  //crea objeto de los registros
  for (let clave in Listado) {
    Listado[clave] = {
      id: clave,
      nombre: BuscarAlumno(clave),
      asistencias: Listado[clave],
      grupo: BuscarGrupo(clave),
    };
    Object.entries(ListadoAusentes).forEach(([key, value]) =>
      key === clave
        ? (Listado[clave].inasistencias = value.Inasistencias)
        : null
    );
  }

  //insertar la asistencia de cada uno en el listado mensual
  MesesRegistrados.value[mes].Listado = Listado;

  return DatosColumna(ListadoMes);
};

//Filtrar todos los registros donde el mes sea igual al seleccionado
const _B = (mes) => {
  let ListadoAusentes = [];
  let AUSENTES = [];
  let ListadoMes = _l.value.filter((elem) => {
    if (!!elem.Fecha) {
      if (elem.Fecha.split("-")[1] === mes.toString()) {
        let { ausentes } = elem.Data;
        ausentes.map((elem) => AUSENTES.push(elem));
        return ausentes;
      }
      return;
    }
  });

  ListadoAusentes = AUSENTES.sort((a, b) => a + b).reduce(
    (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
    {}
  );

  const entries = Object.entries(ListadoAusentes);
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  const topFiveEntries = sortedEntries.slice(0, 5);
  const topFiveKeys = topFiveEntries.map((entry) => entry);

  for (let clave in topFiveKeys) {
    topFiveKeys[clave] = {
      id: topFiveKeys[clave][0],
      nombre: BuscarAlumno(topFiveKeys[clave][0]),
      inasistencias: topFiveKeys[clave][1],
    };
  }
  ObjetoGlobal.topInasistencias = topFiveKeys;

  return ObjetoGlobal.topInasistencias;
};

let pagination = ref({
  rowsPerPage: 10,
});

onMounted(async () => {
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );
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
    MesesRegistrados.value[clave] = {
      id: clave,
      mes: meses[parseInt(clave)],
      registros: MesesRegistrados.value[clave],
    };
  }

  //Iniciar Graficas
  // let ausentesCoro = [];
  let presentesCoro = [];
  // let ausentesOrquesta = [];
  let presentesOrquesta = [];

  //Jalando asistencias

  let Graficar = _l.value.filter((elem) => !!elem.Fecha);

  // Graficar = Graficar.sort((a, b) => a.fecha - b.fecha);

  Graficar = Graficar.filter((e) => {
    if (e.grupo === "Coro") {
      let fecha = new Date(e.Fecha);
      presentesCoro.push({
        data: e.Data.presentes.length,
        fecha: fecha,
        grupo: e.grupo,
      });
      return presentesCoro;
    }
    if (e.grupo === "Orquesta") {
      let fecha = new Date(e.Fecha);
      presentesOrquesta.push({
        data: e.Data.presentes.length,
        fecha: fecha,
        grupo: e.grupo,
      });
      return presentesOrquesta;
    }
  });

  let nuevoArrayPresentes = ref(presentesOrquesta.concat(presentesCoro));
  nuevoArrayPresentes.value = nuevoArrayPresentes.value.sort(
    (a, b) => a.fecha - b.fecha
  );
  nuevoArrayPresentes.value.map((elem) =>
    linea.value.chartOptions.xaxis.categories.push(elem.fecha.toString())
  );

  linea.value.series.push({
    name: "Orquesta",
    data: nuevoArrayPresentes.value.map((elem) =>
      elem.grupo === "Orquesta" ? elem.data : 0
    ),
    color: "#76D7C4",
  });
  linea.value.series.push({
    name: "Coro",
    data: nuevoArrayPresentes.value.map((elem) =>
      elem.grupo === "Coro" ? elem.data : 0
    ),
    color: "#633974",
  });

  _B(mesHoy - 1);
});
watchEffect(async () => {});
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
                    color="primary"
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
                        :class="[
                          user.asistencias < user.inasistencias
                            ? 'bg-red-2'
                            : user.asistencias === user.inasistencias
                            ? 'bg-orange-2'
                            : 'bg-green-1',
                        ]"
                      >
                        <q-item-section avatar>
                          <q-avatar>
                            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                          </q-avatar>
                        </q-item-section>

                        <q-item-section>
                          <q-item-label lines="1"
                            >{{ user.nombre }}
                          </q-item-label>
                          <q-item-label caption lines="2">
                            <q-badge
                              rounded
                              color="green"
                              :label="user.asistencias"
                            >
                            </q-badge>
                            <q-badge
                              v-if="user.inasistencias != null"
                              rounded
                              color="red"
                              :label="user.inasistencias"
                            >
                            </q-badge>
                          </q-item-label>
                          <q-item-label caption lines="3">
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
                        title="Asistencias Por Fechas"
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
      type="area"
      height="350"
      :options="linea.chartOptions"
      :series="linea.series"
    ></VueApexCharts>
  </div>
</template>
