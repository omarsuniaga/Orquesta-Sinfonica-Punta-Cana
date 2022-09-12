export const dias = [
  {
    Fecha: "2020-08-01",
    Data: {
      ausentes: ["Luis", "Juan", "Jose"],
      presentes: ["Pedro", "Maria", "Daniel"],
    },
  },
  {
    Fecha: "2020-08-03",
    Data: {
      ausentes: ["Pedro", "Juan", "Daniel"],
      presentes: ["Luis", "Maria", "Jose"],
    },
  },
  {
    Fecha: "2020-08-05",
    Data: {
      ausentes: ["Luis", "Pedro", "Daniel"],
      presentes: ["Maria", "Juan", "Jose"],
    },
  },
];

export const alumnos = ["Luis", "Maria", "Jose", "Pedro", "Juan", "Daniel"];

export const Contar = async (mes = "08") => {
  console.log("aqui");
  // let Listado = [];
  // let Contador_Ausentes = 0;

  // let Fechas = dias.filter((elem) => {
  //   if (elem.data().Fecha.split("-")[1] === mes) {
  //     let { ausentes, presentes } = elem.data().Data;
  //     console.log(ausentes);

  //     ausentes.filter((e) => {
  //       if (e === Listado_Alumnos[0]) {
  //         return Listado.push({
  //           ID: Listado_Alumnos[0],
  //           ausencias: Contador_Ausentes++,
  //         });
  //       }
  //     });
  // ausentes.map((e) =>
  //   e === Listado_Alumnos[0]
  //     ? Listado.push({
  //         ID: Listado_Alumnos[0],
  //         ausencias: Contador_Ausentes++,
  //       })
  //     : null
  // );
  return;
};
0
