/**
 * Guardar calificaciones de los alumnos
 *
 * Orquesta
 * Objetivos General
 *
 * Objetivos Especificos en la interpretacion del instrumento
 *  Escalas:
 *    Nombre de la Escala
 *    Octavas: 1,2,3,4
 *    Articulacion
 *  Afinacion -> 1 - 5
 *  Punto de Contacto -> 1 - 5
 *  Calidad del Sonido -> 1 - 5
 *  Nivel del Vibrato  -> 1 - 5
 *  Cambio de posicion:
 *     De 1era a 3era -> 1 - 5
 *     De 1era a 2da -> 1 - 5
 *     De 1era a 4ta -> 1 - 5
 *     De 1era a 5ta -> 1 - 5
 *     De 2da a 3era -> 1 - 5
 *     De 2da a 4era -> 1 - 5
 *     De 3era a 5ta -> 1 - 5
 *     De 2da a 5ta -> 1 - 5
 *  Patrones Ritmicos:
 *     Cuadradas
 *     Redondas
 *     Blacas
 *     Negras
 *     Corcheas
 *     Tresillos
 *     Semicorcheas
 *     Galopes
 *     Saltillos
 *  Ligaduras:
 *    Cada 2 Notas
 *    Cada 3 Notas
 *    Cada 4 Notas
 *    Cada 6 Notas
 *    Cada 8 Notas
 *  Golpes de Arcos:
 *    Martele
 *    Spicatto
 *    Marcatto
 *    Detache
 *    Balzato
 * Repertorio
 *    Nombre de la Obra
 *      Tocar pasajes de Memoria -> 1 - 10
 *      Nivel de lectura de la obra -> 1 - 10
 *      Interpretacion
 *        Afinacion
 *        Articulacion
 *        Dinamica
 *
 * Objetivo General: Conocer y Practicar
 *
 */
/**
 * Omar Suniaga / ID
 * Instrumento = Violin
 * Fila = 2do Violin
 * Atril = B1   //Atril B lado 1
 * TiempoTocando = 6 meses
 * Nivel 1:
 * Escalas
 * Golpes de Arcos
 * Repertorio
 * Ligaduras
 * Patrones Ritmicos
 * Afinacion -> 1 - 5
 * Punto de Contacto -> 1 - 5
 * Calidad del Sonido -> 1 - 5
 * Nivel del Vibrato  -> 1 - 5
 */
const Cuerdas_0 = {
  Posiciones: {
    Parado: "Mala/Regular/Buena",
    Sentado: "Mala/Regular/Buena",
    ColocacionViolin: "Mala/Regular/Buena",
    ManoIzquierda: "Mala/Regular/Buena",
    CodoDerecho: "Mala/Regular/Buena",
  },
  Arco: {
    Agarre: "Mala/Regular/Buena",
    Presion: "Mala/Regular/Buena",
    Velocidad: "Mala/Regular/Buena",
    Distribucion: "Mala/Regular/Buena",
    PuntoContacto: "Mala/Regular/Buena",
  },
  CuardasAlAire: {
    1: "3",
    2: "3",
    3: "3",
    4: "3",
  },
  DedosIzquierdos: {
    1: "Mal/Regular/Bien",
    2: "Mal/Regular/Bien",
    3: "Mal/Regular/Bien",
    4: "Mal/Regular/Bien",
  },
};
const Tecnicas = {
  Tecnicas: {
    CambioPosicion: {
      PrimeraSegunda: 5,
      PrimeraTercera: 5,
      PrimeraCuarta: 5,
      PrimeraQuinta: 5,
      SegundaTercera: 5,
      SegundaCuarta: 5,
      SegundaQuinta: 5,
      TerceraCuarta: 5,
      TerceraQuinta: 5,
      TerceraSexta: 5,
    },
    Ligaduras: {
      Cada2: 5,
      Cada3: 5,
      Cada4: 5,
      Cada5: 5,
      Cada6: 5,
      Cada7: 5,
      Cada8: 5,
    },
    GolpesArcos: {
      Martele: 5,
      Spicatto: 5,
      Marcatto: 5,
      Detache: 5,
      Balzato: 5,
    },
  },
};
const Escalas = {
  Escalas: [
    {
      Nombre: "Do Mayor",
      Octavas: 4,
      Afinacion: 5,
      Articulacion: 5,
      PatronesRitmicos: {
        Cuadradas: 5,
        Redondas: 5,
        Blacas: 5,
        Negras: 5,
        Corcheas: 5,
        Tresillos: 5,
        Semicorcheas: 5,
        Galopes: 5,
        Saltillos: 5,
      },
    },
  ],
};
const Repertorio = {
  Repertorios: [
    {
      Nombre: "Allegreto",
      NivelLeido: "50%",
      NivelMemorizado: "50%",
      Interpretacion: {
        Afinacion: "",
        Articulacion: "",
        Dinamica: "",
      },
    },
  ],
};
const Metodos = {
  Metodos: [
    {
      Nombre: "Suzuki 1",
      Leccion: [
        {
          Nombre: "Minuett",
          Numero: "01",
          NivelLeido: "50%",
          NivelMemorizado: "50%",
          Interpretacion: {
            Afinacion: "",
            Articulacion: "",
            Dinamica: "",
          },
        },
      ],
    },
  ],
};
const PatronesRitmicos = {
  PatronesRitmicos: {
    Cuadradas: 5,
    Redondas: 5,
    Blacas: 5,
    Negras: 5,
    Corcheas: 5,
    Tresillos: 5,
    Semicorcheas: 5,
    Galopes: 5,
    Saltillos: 5,
  },
};
const Data = {
  ID: 1662342863129,
  Grupo: "Orquesta",
  FechaRegistrado: "13-Abril-2022",
  Instrumento: "Chelo",
  Fila: "Chelos",
  Atril: "A1",
  TiempoTocando: "6 Meses",
  Nivel: "1",
  CalidadSonido: 5,
  NivelVibrato: 5,
  Escalas: [
    {
      Nombre: "Do Mayor",
      Octavas: "4",
      Afinacion: 5,
      Articulacion: 5,
    },
  ],
  Tecnicas: {
    CambioPosicion: {
      PrimeraSegunda: 5,
      PrimeraTercera: 5,
      PrimeraCuarta: 5,
      PrimeraQuinta: 5,
      SegundaTercera: 5,
      SegundaCuarta: 5,
      SegundaQuinta: 5,
      TerceraCuarta: 5,
      TerceraQuinta: 5,
      TerceraSexta: 5,
    },
    Ligaduras: {
      Cada2: 5,
      Cada3: 5,
      Cada4: 5,
      Cada5: 5,
      Cada6: 5,
      Cada7: 5,
      Cada8: 5,
    },
    GolpesArcos: {
      Martele: 5,
      Spicatto: 5,
      Marcatto: 5,
      Detache: 5,
      Balzato: 5,
    },
  },
  Repertorios: [
    {
      Nombre: "Allegreto",
      NivelLeido: "50%",
      NivelMemorizado: "50%",
      Interpretacion: {
        Afinacion: "",
        Articulacion: "",
        Dinamica: "",
      },
    },
  ],
  Metodos: [
    {
      Nombre: "Suzuki 1",
      Leccion: [
        {
          Nombre: "Minuett",
          Numero: "01",
          NivelLeido: "50%",
          NivelMemorizado: "50%",
          Interpretacion: {
            Afinacion: "",
            Articulacion: "",
            Dinamica: "",
          },
        },
      ],
    },
  ],
};

export const Nivel_Alumno = () => {
  return Data;
};
