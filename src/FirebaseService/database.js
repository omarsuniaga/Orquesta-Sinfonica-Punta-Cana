import { db } from "./constants.js";
import {
  collection,
  query as firestoreQuery,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  where,
  updateDoc,
  getDoc,
  orderBy,
  startAfter,
  limit as firestoreLimit,
  limit,
} from "firebase/firestore";

/**
 * Crea o actualiza la información de un alumno en la base de datos.
 * @param {Object} alumno - El objeto del alumno a guardar.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando el alumno ha sido guardado.
 */
export async function guardarAlumno(alumno) {
  const alumnoRef = doc(db, "ALUMNOS", alumno.id);
  try {
    await setDoc(alumnoRef, alumno);
    // console.log("Alumno guardado/actualizado exitosamente.");
  } catch (error) {
    console.error("Error al guardar el alumno: ", error);
    throw error;
  }
}
/**
 * Obtiene todos los alumnos de la base de datos.
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de objetos alumno.
 */
export async function obtenerAlumnos() {
  let Alumnos = JSON.parse(localStorage.getItem("ALUMNOS"));
  if (!Alumnos) {
    Alumnos = await fetchAlumnosFromFirebase();
    localStorage.setItem("ALUMNOS", JSON.stringify(Alumnos));
  } else {
    //  obtener alumnos de firebase
    Alumnos = await fetchAlumnosFromFirebase();
  }

  return Alumnos;
}

/**
 * Obtiene todos los alumnos de la base de datos.
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de objetos alumno.
 */
export const fetchAlumnosFromFirebase = async () => {
  try {
    let listadoRef = collection(db, "ALUMNOS");
    let q = firestoreQuery(
      listadoRef
      // where("instrumento", "!=", null),
      // where("grupo", "!=", null)
    );
    let querySnapshot = await getDocs(q);
    let res = querySnapshot.docs
      .map((e) => e.data())
      .filter(
        (alumno) =>
          (alumno.instrumento && alumno.instrumento.length > 0) ||
          (alumno.grupo && alumno.grupo.length > 0)
      );
    return res;
  } catch (error) {
    console.error(error);
  }
};
/**
 * Elimina un alumno de la base de datos.
 * @param {string} id - ID del alumno a eliminar.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando el alumno ha sido eliminado.
 */
export async function eliminarAlumno(id) {
  const alumnoRef = doc(db, "ALUMNOS", id);
  try {
    await deleteDoc(alumnoRef);
    console.log("Alumno eliminado exitosamente.");
  } catch (error) {
    console.error("Error al eliminar el alumno: ", error);
    throw error;
  }
}

/**
 * Actualiza la información de un alumno existente en la base de datos.
 * @param {string} id - ID del alumno a actualizar.
 * @param {Object} datosActualizados - Objeto con los datos actualizados del alumno.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando el alumno ha sido actualizado.
 */
export async function actualizarAlumno(id, datosActualizados) {
  const alumnoRef = doc(db, "ALUMNOS", id);
  try {
    await updateDoc(alumnoRef, datosActualizados);
    console.log("Alumno actualizado exitosamente.");
  } catch (error) {
    console.error("Error al actualizar el alumno: ", error);
    throw error;
  }
}

/**
 * Asigna la asistencia para un grupo en una fecha específica.
 * @param {Array} presentes - IDs de los alumnos presentes.
 * @param {Array} ausentes - IDs de los alumnos ausentes.
 * @param {string} fecha - Fecha de la asistencia en formato 'YYYY-MM-DD'.
 * @param {string} grupo - Identificador del grupo.
 * @returns {Promise<void>} - Una promesa que se resuelve una vez que la asistencia ha sido registrada.
 */

export const registrarAsistenciaDeHoy = async (
  presentes,
  ausentes,
  fecha,
  grupo
) => {
  const docId = `${fecha}_${grupo}`;
  const docRef = doc(db, "ASISTENCIAS", docId);
  const asistenciaData = {
    Fecha: fecha,
    grupo,
    Data: { presentes, ausentes },
  };

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // El documento existe, actualízalo
      await updateDoc(docRef, asistenciaData);
      console.log("Asistencia actualizada exitosamente.");
    } else {
      // El documento no existe, créalo
      await setDoc(docRef, asistenciaData);
      console.log("Asistencia registrada exitosamente.");
    }

    // Actualizar localStorage
    let asistencias = JSON.parse(localStorage.getItem("ASISTENCIAS"));
    // Verificar si 'asistencias' es un array
    if (!Array.isArray(asistencias)) {
      asistencias = [];
    }
    asistencias.push(asistenciaData);
    localStorage.setItem("ASISTENCIAS", JSON.stringify(asistencias));
    console.log("Asistencia guardada en localStorage.");
  } catch (error) {
    console.error("Error al registrar asistencia: ", error);
    throw error;
  }
};
/**
 * Busca asistencias por ID de alumno y mes.
 * @param {string} id - ID del alumno.
 * @param {string} mes - Mes en formato 'MM'.
 * @returns {Promise<Object>} - Un objeto con detalles de asistencias.
 */
export async function buscarAsistenciasPorIdYMensualidad(id, mes) {
  const asistenciasRef = collection(db, "ASISTENCIAS");
  let presentesTotal = 0;
  let ausentesTotal = 0;

  try {
    const snapshot = await getDocs(asistenciasRef);
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.Fecha.split("-")[1] === mes) {
        if (data.Data.presentes.includes(id)) presentesTotal++;
        if (data.Data.ausentes.includes(id)) ausentesTotal++;
      }
    });

    return {
      nombreCompleto: await buscarAlumnoPorId(id),
      asistencias: presentesTotal,
      inasistencias: ausentesTotal,
      mes,
    };
  } catch (error) {
    console.error("Error al buscar asistencias: ", error);
    throw error;
  }
}

// metodo para buscar por grupo usando ASISTENCIAS de localstorage o firebase si no existe
export async function buscarAsistenciasPorGrupo(grupo) {
  const key = `ASISTENCIAS`;
  let asistencias = JSON.parse(localStorage.getItem(key));
  // extraer asistencias donde la propiedad grupo sea igual a la variable grupo
  asistencias = asistencias.filter((asistencia) => asistencia.grupo === grupo);
  if (!asistencias) {
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(asistenciasRef, where("Grupo", "==", grupo));
    const snapshot = await getDocs(q);
    asistencias = snapshot.docs.map((doc) => doc.data());
    localStorage.setItem(key, JSON.stringify(asistencias));
  }

  return asistencias;
}

/**
 * Obtiene todas las asistencias de la base de datos.
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de todas las asistencias.
 */
export async function obtenerAsistencias() {
  let asistencias = JSON.parse(localStorage.getItem("ASISTENCIAS")).data;
  if (!asistencias) {
    console.log("Extrayendo de Firebase", asistencias);
    asistencias = await fetchAsistenciasFromFirebase();
    localStorage.setItem("ASISTENCIAS", JSON.stringify(asistencias));
  }

  return asistencias;
}
export const fetchAsistenciasFromFirebase = async () => {
  try {
    let listadoRef = collection(db, "ASISTENCIAS");
    let q = firestoreQuery(listadoRef);
    let querySnapshot = await getDocs(q);
    let res = querySnapshot.docs.map((e) => e.data());
    return res;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Busca información de un alumno por su ID.
 * @param {string} id - ID del alumno.
 * @returns {Promise<Object>} - Una promesa que resuelve en el objeto de datos del alumno.
 */
export async function buscarAlumnoPorId(id) {
  const alumnos = await obtenerAlumnos();
  return alumnos.find((alumno) => alumno.id === id);
}

// Función para buscar asistencias por fecha y grupo

export const buscarAsistenciasPorFechaYGrupo = async (fecha, grupo) => {
  let asistencias = await obtenerAsistencias();
  // console.log("obtenerAsistencias() parametros", fecha, grupo);
  // si grupo = All o vacio, no realizar busqueda por grupo
  if (grupo === "All" || grupo === "") {
    // console.log("Selecciona un grupo");
  }
  if (grupo !== "All" && grupo !== "") {
    asistencias = asistencias.filter(
      (asistencia) => asistencia.Fecha === fecha && asistencia.grupo === grupo
    );
    // console.log("obtenerAsistencias() de localStorage", asistencias);
  }
  if (!asistencias) {
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(
      asistenciasRef,
      where("Fecha", "==", fecha),
      where("Grupo", "==", grupo)
    );
    const snapshot = await getDocs(q);
    asistencias = snapshot.docs.map((doc) => doc.data());
    localStorage.setItem(key, JSON.stringify(asistencias));
    // console.log("buscarAsistenciasPorFechaYGrupo() de Firebase", asistencias);
  }

  return asistencias;
};

/**
 * Solicita las credenciales de un usuario para verificar su nivel de acceso.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<string|null>} - Una promesa que resuelve en el nivel de acceso del usuario o null si el usuario no se encuentra.
 */
export async function solicitarCredenciales(email) {
  try {
    const usuariosRef = collection(db, "USUARIOS");
    const queryUsuarios = firestoreQuery(
      usuariosRef,
      where("email", "==", email)
    );
    const resultado = await getDocs(queryUsuarios);

    if (resultado.empty) {
      // console.log("No se encontró ningún usuario con ese correo electrónico.");
      return null; // Retorna null si no se encuentra el usuario
    } else {
      const { Nivel } = resultado.docs[0].data();
      return Nivel; // Retorna el nivel de acceso del usuario
    }
  } catch (error) {
    console.error("Error al solicitar credenciales: ", error);
    throw error; // Lanza un error para manejo externo si es necesario
  }
}

/**
 * Calcula y devuelve los días únicos en los que se registraron asistencias.
 * @returns {Promise<Array>} Una promesa que resuelve en un array de fechas únicas de asistencias.
 */
export async function diasTrabajados() {
  try {
    // Obtener todas las asistencias de la base de datos.
    const asistencias = await obtenerAsistencias();
    const fechasUnicas = new Set();

    // Iterar sobre las asistencias y agregar la fecha de cada una a un conjunto para garantizar la unicidad.
    asistencias.forEach((asistencia) => {
      if (asistencia.Fecha) {
        fechasUnicas.add(asistencia.Fecha);
      }
    });

    // Convertir el conjunto en un array para devolver las fechas.
    return [...fechasUnicas];
  } catch (error) {
    console.error("Error al calcular los días trabajados: ", error);
    throw error; // Lanza el error para manejo externo si es necesario.
  }
}

/**
 * Calcula y devuelve el número de alumnos por género.
 * @returns {Promise<Object>} - Una promesa que resuelve en un objeto con la cantidad de alumnos femeninos y masculinos.
 */
export async function clasificacionGeneros() {
  const generos = { femenino: 0, masculino: 0 };

  try {
    // Consulta para obtener todos los alumnos y luego filtrar por género en el cliente para reducir las llamadas a la base de datos.
    const alumnosRef = collection(db, "ALUMNOS");
    const snapshot = await getDocs(alumnosRef);

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        const alumno = doc.data();
        if (alumno.sexo === "Femenino") {
          generos.femenino += 1;
        } else if (alumno.sexo === "Masculino") {
          generos.masculino += 1;
        }
      });
    }
  } catch (error) {
    console.error("Error al clasificar géneros: ", error);
    throw error; // Lanza el error para manejo externo si es necesario.
  }

  return generos;
}

/**
 * Cuenta la cantidad de alumnos en cada grupo especificado.
 * @returns {Promise<Object>} Una promesa que resuelve en un objeto con la cantidad de alumnos por grupo.
 */
export async function contarAlumnosPorGrupo() {
  const grupos = {
    Orquesta: 0,
    Coro: 0,
    "Iniciacion 1": 0,
    "Iniciacion 2": 0,
  };

  try {
    // Acceder a la colección de alumnos
    const alumnosRef = collection(db, "ALUMNOS");
    const snapshot = await getDocs(alumnosRef);

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        const alumno = doc.data();
        // Asumimos que 'grupo' es un array de nombres de grupos en los que el alumno está inscrito
        alumno.grupo.forEach((g) => {
          if (grupos.hasOwnProperty(g)) {
            grupos[g] += 1; // Incrementa el contador para cada grupo al que pertenece el alumno
          }
        });
      });
    }
  } catch (error) {
    console.error("Error al contar alumnos por grupo: ", error);
    throw error; // Propaga el error para manejo externo
  }

  return grupos;
}

/**
 * Cuenta la cantidad de alumnos por cada instrumento registrado.
 * @returns {Promise<Object>} Una promesa que resuelve en un objeto con la cantidad de alumnos por instrumento.
 */
export async function contarAlumnosPorInstrumento() {
  const conteoInstrumentos = {};

  try {
    // Accede a la colección de alumnos en Firestore
    const alumnosRef = collection(db, "ALUMNOS");
    const snapshot = await getDocs(alumnosRef);

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        const alumno = doc.data();
        const instrumento = alumno.instrumento;

        // Si el instrumento ya está registrado en el objeto, incrementa su contador
        if (conteoInstrumentos[instrumento]) {
          conteoInstrumentos[instrumento]++;
        } else {
          // Si es la primera vez que se encuentra este instrumento, inicializa su contador
          conteoInstrumentos[instrumento] = 1;
        }
      });
    }
  } catch (error) {
    console.error("Error al contar alumnos por instrumento: ", error);
    throw error; // Propaga el error para manejo externo
  }

  return conteoInstrumentos;
}

/**
 * Obtiene el historial de inasistencias de un alumno por mes.
 * @param {string} id - El ID del alumno.
 * @returns {Promise<Object>} Una promesa que resuelve en un objeto con el número de inasistencias por mes.
 */
export async function historialInasistenciasPorId(id) {
  const inasistenciasPorMes = {};
  try {
    // Preparar la referencia a la colección 'ASISTENCIAS' y realizar la consulta
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const snapshot = await getDocs(asistenciasRef);

    // Inicializar los conteos de inasistencias para cada mes del año en curso
    snapshot.docs.forEach((doc) => {
      const asistencia = doc.data();
      const fecha = asistencia.Fecha;
      const mes = fecha ? fecha.split("-")[1] : undefined;

      // Filtrar por el ID del alumno y contar las inasistencias
      if (fecha && asistencia.Data.ausentes.includes(id)) {
        if (!inasistenciasPorMes[mes]) {
          inasistenciasPorMes[mes] = 0;
        }
        inasistenciasPorMes[mes]++;
      }
    });
  } catch (error) {
    console.error("Error al obtener el historial de inasistencias: ", error);
    throw error;
  }

  return inasistenciasPorMes;
}

// obtener el historial de asistencias de una fecha y grupo específicos
export async function obtenerAsistenciasPorFechaYGrupo(fecha, grupo) {
  const docId = `${fecha}_${grupo}`;
  const docRef = doc(db, "ASISTENCIAS", docId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      a;
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener asistencias por fecha y grupo: ", error);
    throw error;
  }
}

// Función para buscar asistencias por fecha

export const buscarAsistenciasPorFecha = async (fecha) => {
  let asistencias = await obtenerAsistencias();

  asistencias = asistencias.filter((asistencia) => asistencia.Fecha === fecha);
  if (!asistencias) {
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(asistenciasRef, where("Fecha", "==", fecha));
    const snapshot = await getDocs(q);
    asistencias = snapshot.docs.map((doc) => doc.data());
    localStorage.setItem(key, JSON.stringify(asistencias));
  }

  return asistencias;
};

// buscar nombre del alumno segun nombre o apellido
export async function buscarAlumnoPorNombre(nombre) {
  const alumnosRef = collection(db, "ALUMNOS");
  try {
    const snapshot = await getDocs(alumnosRef);
    return snapshot.docs
      .map((doc) => doc.data())
      .filter(
        (alumno) =>
          alumno.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
          alumno.apellido.toLowerCase().includes(nombre.toLowerCase())
      );
  } catch (error) {
    console.error("Error al buscar alumno por nombre: ", error);
    throw error;
  }
}

/**
 * Genera un resumen global de asistencias combinando información de alumnos y asistencias.
 * @returns {Promise<Object>} - Un objeto con asistencias mapeadas por ID de alumno y fecha.
 */
const TTL = 86400000; // Tiempo de vida en milisegundos, p.ej., 1 día

const saveToLocalStorage = (key, data) => {
  const now = new Date().getTime();
  const item = {
    data: data,
    timestamp: now,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const loadFromLocalStorage = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  if (now - item.timestamp > TTL) {
    // Datos vencidos
    localStorage.removeItem(key);
    return null;
  }
  return item.data;
};

export async function generarResumenGlobalDeAsistencias() {
  let items = loadFromLocalStorage("ASISTENCIAS");
  if (!items) {
    items = await fetchItemsFromFirebase();
    saveToLocalStorage("ASISTENCIAS", items);
  }

  const Alumnos = await obtenerAlumnos();

  try {
    if (!Array.isArray(items)) {
      console.error("Asistencias no es un array:", items);
      return;
    }
    const uniqueAttendance = {};
    const AlumnosMap = Alumnos.reduce((acc, alumno) => {
      acc[alumno.id] = {
        nombre: `${alumno.nombre} ${alumno.apellido}`,
        grupo: alumno.grupo,
      };
      return acc;
    }, {});

    items.forEach((elem) => {
      if (!elem.Fecha || !elem.Data) return;
      const { presentes, ausentes } = elem.Data;
      [...presentes, ...ausentes].forEach((el) => {
        const key = `${el}-${elem.Fecha}`;
        if (!uniqueAttendance[key] && AlumnosMap[el]) {
          uniqueAttendance[key] = {
            id: el,
            name: AlumnosMap[el].nombre,
            date: elem.Fecha,
            grupo: AlumnosMap[el].grupo,
            attended: presentes.includes(el),
          };
        }
      });
    });

    return Object.values(uniqueAttendance);
  } catch (error) {
    console.error("Error al generar resumen global de asistencias: ", error);
    throw error;
  }
}

const fetchItemsFromFirebase = async () => {
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
  const fechaFiltro = tresMesesAtras.toISOString().split("T")[0];

  const myQuery = firestoreQuery(
    collection(db, "ASISTENCIAS"),
    orderBy("Fecha", "desc"),
    where("Fecha", ">=", fechaFiltro)
  );

  const snapshot = await getDocs(myQuery);
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return items;
};
/**
 * Obtiene un lote de documentos de la base de datos.
 * @param {Object} lastVisibleItem - El último documento visible en la lista.
 * @returns {Promise<Object>} - Una promesa que resuelve en un objeto con los documentos cargados y el último documento visible.
 */
export const fetchItems = async (lastVisibleItem, firestoreLimit = 10) => {
  let items = loadFromLocalStorage("ASISTENCIAS");
  let lastVisible = null;
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
  const fechaFiltro = tresMesesAtras.toISOString().split("T")[0];

  if (!items) {
    let myQuery = firestoreQuery(
      collection(db, "ASISTENCIAS"),
      orderBy("Fecha", "desc"),
      where("Fecha", ">=", fechaFiltro),
      limit(firestoreLimit)
    );

    if (lastVisibleItem) {
      myQuery = firestoreQuery(
        collection(db, "ASISTENCIAS"),
        orderBy("Fecha", "desc"),
        where("Fecha", ">=", fechaFiltro),
        startAfter(lastVisibleItem),
        limit(firestoreLimit)
      );
    }

    const snapshot = await getDocs(myQuery);
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    saveToLocalStorage("ASISTENCIAS", items);
  }

  return { items, lastVisible };
};

// funcion que recibe el formato de fecha y lo cambia
function cambiarFormatoFecha(fecha) {
  if (!fecha) {
    console.error("Error al cambiar el formato de la fecha: ", error);
    return;
  }
  // cambiar formato de fecha de 'YYYY-MM-DD' a 'YYYY/MM/DD'
  return fecha.split("-").join("/");
}

// historial de asistencias
export async function obtenerMarcasDelCalendario() {
  const asistencias = await obtenerAsistencias();
  // comprobar si hay datos en asistencias
  if (!asistencias) {
    console.error("No se pudieron obtener las asistencias");
    return;
  }

  try {
    const historial = {};
    // itera las asistencias y obtiene las fechas únicas
    asistencias.forEach((asistencia) => {
      const fecha = asistencia.Fecha;
      // cambiar formato de fecha de 'YYYY-MM-DD' a 'YYYY/MM/DD'
      const fechaFormateada = cambiarFormatoFecha(fecha);
      // console.log("Cambiando formato - asistencias", fechaFormateada);
      if (fechaFormateada) {
        if (!historial[fechaFormateada]) {
          historial[fechaFormateada] = [];
        }
        historial[fechaFormateada].push(asistencia);
      }
    });
    // convierte el objeto historial en un array de fechas
    const fechas = Object.keys(historial);
    return fechas;
  } catch (error) {
    console.error(
      "Error al obtener marcas del calendario de 'obtenerMarcasDelCalendario()' ",
      error
    );
    throw error;
  }
}
