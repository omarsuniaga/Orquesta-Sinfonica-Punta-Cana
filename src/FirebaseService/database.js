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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const asistenciaCache = [];

/**
 * Crea o actualiza la información de un alumno en la base de datos.
 * @param {Object} alumno - El objeto del alumno a guardar.
 * @returns {Promise<void>}
 */
export async function guardarAlumno(alumno) {
  const alumnoRef = doc(db, "ALUMNOS", alumno.id);
  try {
    await setDoc(alumnoRef, alumno);
    console.log("Alumno guardado/actualizado exitosamente.");
  } catch (error) {
    console.error("Error al guardar el alumno: ", error);
    throw error;
  }
}

/**
 * Obtiene todos los alumnos de la base de datos.
 * @returns {Promise<Array>}
 */
export async function obtenerAlumnos() {
  try {
    let Alumnos = loadFromLocalStorage("ALUMNOS");
    if (!Alumnos) {
      Alumnos = await fetchAlumnosFromFirebase();
      saveToLocalStorage("ALUMNOS", Alumnos);
    }
    return Alumnos;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

export async function obtenerAlumnosPorId(id) {
  const alumnosRef = collection(db, "ALUMNOS");
  try {
    // Convertir el ID de string a número
    const idNumerico = Number(id);
    // Crear la consulta con `where` para obtener el alumno con el ID especificado
    const q = firestoreQuery(alumnosRef, where("id", "==", idNumerico));
    const snapshot = await getDocs(q);
    // Si se encuentra un documento, devolver sus datos
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data(); // Retorna el primer documento encontrado
    } else {
      return null; // Retorna null si no se encontró ningún documento
    }
  } catch (error) {
    console.error("Error al obtener el alumno por ID: ", error);
    throw error;
  }
}
/**
 * Obtiene todos los alumnos desde Firebase.
 * @returns {Promise<Array>}
 */
export const fetchAlumnosFromFirebase = async () => {
  try {
    const listadoRef = collection(db, "ALUMNOS");
    const q = firestoreQuery(listadoRef);
    const querySnapshot = await getDocs(q);
    const res = querySnapshot.docs
      .map((e) => e.data())
      .filter(
        (alumno) =>
          (alumno.instrumento && alumno.instrumento.length > 0) ||
          (alumno.grupo && alumno.grupo.length > 0)
      );
    return res;
  } catch (error) {
    console.error("Error fetching alumnos from Firebase:", error);
    return [];
  }
};

/**
 * Elimina un alumno de la base de datos.
 * @param {string} id - ID del alumno a eliminar.
 * @returns {Promise<void>}
 */
export async function eliminarAlumno(id) {
  if (!id) {
    console.error("El ID del alumno es requerido para eliminar.");
    return;
  }
  const alumnoRef = doc(db, "ALUMNOS", id);
  try {
    // eliminar del localStorage
    let alumnos = loadFromLocalStorage("ALUMNOS");
    if (!Array.isArray(alumnos)) {
      alumnos = [];
    }
    alumnos = alumnos.filter((alumno) => alumno.id !== id);
    saveToLocalStorage("ALUMNOS", alumnos);
    // Eliminar de Firebase
    await deleteDoc(alumnoRef);
    console.log(`Alumno con ID ${id} eliminado exitosamente.`);
  } catch (error) {
    console.error(`Error al eliminar el alumno con ID ${id}: `, error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el contexto donde se llame la función
  }
}

/**
 * Actualiza la información de un alumno existente en la base de datos.
 * @param {string} id - ID del alumno a actualizar.
 * @param {Object} datosActualizados - Objeto con los datos actualizados del alumno.
 * @returns {Promise<void>}
 */

export async function actualizarAlumno(id, datosActualizados) {
  // Asegúrate de que el ID es numérico
  const idNumerico = Number(id);

  // Verifica que el ID sea un número válido
  if (isNaN(idNumerico)) {
    console.error("El ID proporcionado no es un número válido.");
    return;
  }

  // Crear referencia al documento con el ID numérico
  const alumnoRef = doc(db, "ALUMNOS", idNumerico.toString()); // Convertir a string solo al referenciar

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
 * @param {Array} demorados - IDs de los alumnos demorados.
 * @param {Array} justificados - IDs de los alumnos justificados.
 * @param {string} fecha - Fecha de la asistencia en formato 'YYYY-MM-DD'.
 * @param {string} grupo - Identificador del grupo.
 * @param {Array} nota - Nota adicional para la asistencia.
 * @returns {Promise<void>}
 */
export const registrarAsistenciaDeHoy = async (
  presentes,
  ausentes,
  demorados,
  justificados,
  fecha,
  grupo,
  nota
) => {
  const docId = `${fecha}_${grupo}`;
  const docRef = doc(db, "ASISTENCIAS", docId);
  const asistenciaData = {
    Fecha: fecha,
    grupo,
    Data: { presentes, ausentes, demorados, justificados },
    nota,
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
    let asistencias = loadFromLocalStorage("ASISTENCIAS");
    if (!Array.isArray(asistencias)) {
      asistencias = [];
    }
    asistencias.push(asistenciaData);
    // saveToLocalStorage("ASISTENCIAS", asistencias);
    // console.log("Asistencia guardada en localStorage.");
  } catch (error) {
    console.error("Error al registrar asistencia: ", error);
    throw error;
  }
};

/**
 * Busca asistencias por ID de alumno y mes.
 * @param {string} id - ID del alumno.
 * @param {string} mes - Mes en formato 'MM'.
 * @returns {Promise<Object>}
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

/**
 * Busca asistencias por grupo, usando ASISTENCIAS de localStorage o Firebase si no existe.
 * @param {string} grupo - El grupo a buscar.
 * @returns {Promise<Array>}
 */
export async function buscarAsistenciasPorGrupo(grupo) {
  const key = `ASISTENCIAS`;
  let asistencias = loadFromLocalStorage(key);

  if (!asistencias || asistencias.length === 0) {
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(asistenciasRef, where("grupo", "==", grupo));
    const snapshot = await getDocs(q);
    asistencias = snapshot.docs.map((doc) => doc.data());
    saveToLocalStorage(key, asistencias);
  } else {
    // Filtrar asistencias del caché
    asistencias = asistencias.filter(
      (asistencia) => asistencia.grupo === grupo
    );
  }

  return asistencias;
}

/**
 * Obtiene todas las asistencias de la base de datos.
 * @returns {Promise<Array>}
 */
export const obtenerAsistencias = async () => {
  let asistencias = loadFromLocalStorage("ASISTENCIAS");

  if (!asistencias) {
    asistencias = await fetchAsistenciasFromFirebase();

    if (asistencias) {
      saveToLocalStorage("ASISTENCIAS", asistencias);
    } else {
      console.error("Error al obtener asistencias desde Firebase");
    }
  }

  return asistencias;
};

/**
 * Obtiene las asistencias desde Firebase.
 * @returns {Promise<Array>}
 */
export const fetchAsistenciasFromFirebase = async () => {
  try {
    const listadoRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(listadoRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((e) => e.data());
  } catch (error) {
    console.error("Error fetching asistencias from Firebase:", error);
    return [];
  }
};

/**
 * Busca información de un alumno por su ID.
 * @param {string} id - ID del alumno.
 * @returns {Promise<Object>}
 */
export async function buscarAlumnoPorId(id) {
  const alumnos = await obtenerAlumnos();
  return alumnos.find((alumno) => alumno.id === id);
}

/**
 * Busca asistencias por fecha y grupo, utilizando la caché para optimizar el rendimiento.
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
 * @param {string} grupo - Grupo a buscar.
 * @returns {Promise<Array>} - Lista de asistencias.
 */
export const buscarAsistenciasPorFechaYGrupo = async (fecha, grupo) => {
  const asistenciasRef = collection(db, "ASISTENCIAS");
  const q = firestoreQuery(
    asistenciasRef,
    where("Fecha", "==", fecha),
    where("grupo", "==", grupo)
  );
  const snapshot = await getDocs(q);
  const asistencias = snapshot.docs.map((doc) => doc.data());
  return asistencias;
};
/**
 * Solicita las credenciales de un usuario para verificar su nivel de acceso.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<string|null>}
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
      console.log("No se encontró ningún usuario con ese correo electrónico.");
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
 * @returns {Promise<Array>}
 */
export async function diasTrabajados() {
  try {
    const asistencias = await obtenerAsistencias();
    const fechasUnicas = new Set();

    asistencias.forEach((asistencia) => {
      if (asistencia.Fecha) {
        fechasUnicas.add(asistencia.Fecha);
      }
    });

    return [...fechasUnicas];
  } catch (error) {
    console.error("Error al calcular los días trabajados: ", error);
    throw error;
  }
}

/**
 * Calcula y devuelve el número de alumnos por género.
 * @returns {Promise<Object>}
 */
export async function clasificacionGeneros() {
  const generos = { femenino: 0, masculino: 0 };

  try {
    const alumnosRef = collection(db, "ALUMNOS");
    const qFemenino = firestoreQuery(
      alumnosRef,
      where("sexo", "==", "Femenino")
    );
    const qMasculino = firestoreQuery(
      alumnosRef,
      where("sexo", "==", "Masculino")
    );

    const snapshotFemenino = await getDocs(qFemenino);
    generos.femenino = snapshotFemenino.docs.length;

    const snapshotMasculino = await getDocs(qMasculino);
    generos.masculino = snapshotMasculino.docs.length;
  } catch (error) {
    console.error("Error al clasificar géneros: ", error);
    throw error;
  }

  return generos;
}

/**
 * Cuenta la cantidad de alumnos en cada grupo especificado.
 * @returns {Promise<Object>}
 */
export async function contarAlumnosPorGrupo() {
  const grupos = {
    Orquesta: 0,
    Coro: 0,
    "Iniciacion 1": 0,
    "Iniciacion 2": 0,
  };

  try {
    for (const grupo in grupos) {
      const alumnosRef = collection(db, "ALUMNOS");
      const q = firestoreQuery(
        alumnosRef,
        where("grupo", "array-contains", grupo)
      );
      const snapshot = await getDocs(q);
      grupos[grupo] = snapshot.docs.length;
    }
  } catch (error) {
    console.error("Error al contar alumnos por grupo: ", error);
    throw error;
  }

  return grupos;
}

/**
 * Cuenta la cantidad de alumnos por cada instrumento registrado.
 * @returns {Promise<Object>}
 */
export async function contarAlumnosPorInstrumento() {
  const conteoInstrumentos = {};

  try {
    const alumnosRef = collection(db, "ALUMNOS");
    const snapshot = await getDocs(alumnosRef);

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        const alumno = doc.data();
        const instrumento = alumno.instrumento;

        if (instrumento) {
          conteoInstrumentos[instrumento] =
            (conteoInstrumentos[instrumento] || 0) + 1;
        }
      });
    }
  } catch (error) {
    console.error("Error al contar alumnos por instrumento: ", error);
    throw error;
  }

  return conteoInstrumentos;
}

/**
 * Obtiene el historial de inasistencias de un alumno por mes.
 * @param {string} id - El ID del alumno.
 * @returns {Promise<Object>}
 */ // historial de asistencias
// export async function obtenerMarcasDelCalendario() {
//   const asistencias = await obtenerAsistencias();
//   // comprobar si hay datos en asistencias
//   if (!asistencias) {
//     console.error("No se pudieron obtener las asistencias");
//     return;
//   }

//   try {
//     const historial = {};
//     // itera las asistencias y obtiene las fechas únicas
//     asistencias.forEach((asistencia) => {
//       const fecha = asistencia.Fecha;
//       // cambiar formato de fecha de 'YYYY-MM-DD' a 'YYYY/MM/DD'
//       const fechaFormateada = cambiarFormatoFecha(fecha);
//       // console.log("Cambiando formato - asistencias", fechaFormateada);
//       if (fechaFormateada) {
//         if (!historial[fechaFormateada]) {
//           historial[fechaFormateada] = [];
//         }
//         historial[fechaFormateada].push(asistencia);
//       }
//     });
//     // convierte el objeto historial en un array de fechas
//     const fechas = Object.keys(historial);
//     return fechas;
//   } catch (error) {
//     console.error(
//       "Error al obtener marcas del calendario de 'obtenerMarcasDelCalendario()' ",
//       error
//     );
//     throw error;
//   }
// }

/**
 * Obtiene el historial de asistencias de una fecha y grupo específicos.
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
 * @param {string} grupo - El grupo a buscar.
 * @returns {Promise<Object|null>}
 */
export async function obtenerAsistenciasPorFechaYGrupo(fecha, grupo) {
  const docId = `${fecha}_${grupo}`;
  const docRef = doc(db, "ASISTENCIAS", docId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener asistencias por fecha y grupo: ", error);
    throw error;
  }
}

/**
 * Busca asistencias por fecha.
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>}
 */
export const buscarAsistenciasPorFecha = async (fecha) => {
  let asistencias = await obtenerAsistencias();
  asistencias = asistencias.filter((asistencia) => asistencia.Fecha === fecha);
  if (!asistencias || asistencias.length === 0) {
    const asistenciasRef = collection(db, "ASISTENCIAS");
    const q = firestoreQuery(asistenciasRef, where("Fecha", "==", fecha));
    const snapshot = await getDocs(q);
    asistencias = snapshot.docs.map((doc) => doc.data());
    //saveToLocalStorage("ASISTENCIAS", asistencias);
  }
  return asistencias;
};

/**
 * Busca el nombre del alumno según nombre o apellido.
 * @param {string} nombre - Nombre o apellido del alumno.
 * @returns {Promise<Array>}
 */
// Función para buscar alumnos por nombre o apellido
// Función para buscar alumnos por nombre o apellido
export const buscarAlumnoPorNombre = async (nombre) => {
  try {
    // Supongamos que obtienes una lista de alumnos desde Firebase o alguna otra fuente
    const alumnos = await obtenerAlumnos(); // Esta es tu función que obtiene los alumnos

    // Filtrar alumnos por nombre o apellido
    return alumnos.filter((alumno) => {
      const nombreAlumno =
        typeof alumno.nombre === "string" ? alumno.nombre.toLowerCase() : "";
      const apellidoAlumno =
        typeof alumno.apellido === "string"
          ? alumno.apellido.toLowerCase()
          : "";

      return (
        nombreAlumno.includes(nombre.toLowerCase()) ||
        apellidoAlumno.includes(nombre.toLowerCase())
      );
    });
  } catch (error) {
    console.error("Error al buscar alumno por nombre: ", error);
    return [];
  }
};

/**
 * Genera un resumen global de asistencias combinando información de alumnos y asistencias.
 * @returns {Promise<Object>}
 */
const TTL = 86400000; // Tiempo de vida en milisegundos, e.g., 1 día

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

  try {
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now - item.timestamp > TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error("Error al cargar datos del localStorage: ", error);
    return null;
  }
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
      return [];
    }

    const uniqueAttendance = {};
    const AlumnosMap = new Map(Alumnos.map((alumno) => [alumno.id, alumno]));

    items.forEach((elem) => {
      if (!elem.Fecha || !elem.Data) return;

      // Aseguramos que estas variables sean arreglos vacíos si no están definidas
      const presentes = Array.isArray(elem.Data.presentes)
        ? elem.Data.presentes
        : [];
      const ausentes = Array.isArray(elem.Data.ausentes)
        ? elem.Data.ausentes
        : [];
      const justificados = Array.isArray(elem.Data.justificados)
        ? elem.Data.justificados
        : [];
      const demorados = Array.isArray(elem.Data.demorados)
        ? elem.Data.demorados
        : [];

      const allStudents = [
        ...presentes,
        ...ausentes,
        ...justificados,
        ...demorados,
      ];

      allStudents.forEach((el) => {
        const key = `${el}-${elem.Fecha}`;
        if (!uniqueAttendance[key] && AlumnosMap.has(el)) {
          const alumno = AlumnosMap.get(el);
          uniqueAttendance[key] = {
            id: el,
            name: `${alumno.nombre} ${alumno.apellido}`,
            date: elem.Fecha,
            grupo: alumno.grupo.join(", "),
            attended: presentes.includes(el),
            attendanceStatus: presentes.includes(el)
              ? "Presente"
              : ausentes.includes(el)
              ? "Ausente"
              : justificados.includes(el)
              ? "Justificado"
              : demorados.includes(el)
              ? "Demorado"
              : "N/A",
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
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Obtiene un lote de documentos de la base de datos.
 * @param {Object} lastVisibleItem - El último documento visible en la lista.
 * @returns {Promise<Object>}
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

    // saveToLocalStorage("ASISTENCIAS", items);
  }

  return { items, lastVisible };
};

/**
 * Verifica si la fecha es válida y en el formato 'YYYY-MM-DD'.
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
 * @returns {string|null} - Fecha original si es válida, de lo contrario null.
 */
function cambiarFormatoFecha(fecha) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    console.error("Formato de fecha no válido: ", fecha);
    return null;
  }

  // Separar el año, mes y día
  const [year, month, day] = fecha.split("-");

  // Devolver la fecha en formato AAAA/MM/DD
  return `${year}/${month}/${day}`;
}

/**
 * Obtiene el historial de asistencias en formato de calendario.
 * @returns {Promise<Array<string>>}
 */
export async function obtenerMarcasDelCalendario() {
  try {
    const asistencias = await obtenerAsistencias();
    if (!asistencias) {
      console.error("No se pudieron obtener las asistencias");
      return [];
    }

    const historial = {};
    asistencias.forEach((asistencia) => {
      const fecha = asistencia.Fecha;
      const fechaFormateada = cambiarFormatoFecha(fecha);

      if (fechaFormateada) {
        if (!historial[fechaFormateada]) {
          historial[fechaFormateada] = [];
        }
        historial[fechaFormateada].push(asistencia);
      }
    });

    // Solo devuelve las fechas únicas en formato correcto
    const fechasUnicas = Object.keys(historial);
    return fechasUnicas; // Devuelve las fechas formateadas
  } catch (error) {
    console.error("Error al obtener marcas del calendario: ", error);
    throw error;
  }
}

/**
 * Cuenta los alumnos por género y grupo.
 * @returns {Promise<Object>}
 */
export const conteoGeneros = async () => {
  const alumnos = await obtenerAlumnos();
  const masculinos = alumnos.filter(
    (alumno) => alumno.sexo === "Masculino"
  ).length;
  const femeninos = alumnos.filter(
    (alumno) => alumno.sexo === "Femenino"
  ).length;
  const totalAlumnos = alumnos.length;

  const grupos = ["Coro", "Orquesta", "Iniciacion 1", "Iniciacion 2"];
  const conteoPorGrupo = grupos.reduce((acc, grupo) => {
    acc[`femenino${grupo}`] = alumnos.filter(
      (alumno) => alumno.grupo.includes(grupo) && alumno.sexo === "Femenino"
    ).length;
    acc[`masculino${grupo}`] = alumnos.filter(
      (alumno) => alumno.grupo.includes(grupo) && alumno.sexo === "Masculino"
    ).length;
    return acc;
  }, {});

  return {
    masculinos,
    femeninos,
    totalAlumnos,
    ...conteoPorGrupo,
  };
};

/**
 * Obtiene las asistencias de un alumno por su ID.
 * @param {string} id - ID del alumno.
 * @returns {Promise<Array>}
 */
export const obtenerAsistenciaPorId = async (id) => {
  const asistenciasRef = collection(db, "ASISTENCIAS");
  const q = firestoreQuery(
    asistenciasRef,
    where("Data.presentes", "array-contains", id),
    where("Data.ausentes", "array-contains", id)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

/**
 * Mueve a un alumno a la colección de inactivos.
 * @param {string} id - ID del alumno.
 * @returns {Promise<void>}
 */
export const moverAlumnoAInactivos = async (id) => {
  const alumno = await buscarAlumnoPorId(id);
  if (!alumno) {
    console.error(`Alumno con ID ${id} no encontrado`);
    return;
  }

  const inactivosRef = collection(db, "INACTIVOS");
  try {
    await setDoc(doc(inactivosRef, id), alumno);
    await eliminarAlumno(id);

    const alumnos = await obtenerAlumnos();
    saveToLocalStorage("ALUMNOS", alumnos);
    console.log(`Alumno con ID ${id} movido a inactivos.`);
  } catch (error) {
    console.error("Error al mover el alumno a inactivos: ", error);
    throw error;
  }
};

/**
 * Actualiza el localStorage después de cambios en Firebase.
 * @param {Object} alumno - Datos del alumno actualizado.
 */
export const actualizarLocalStorage = async (alumno) => {
  let alumnos = loadFromLocalStorage("ALUMNOS") || [];
  alumnos = alumnos.filter((a) => a.id !== alumno.id);
  alumnos.push(alumno);
  saveToLocalStorage("ALUMNOS", alumnos);
};

/**
 * Obtiene las configuraciones para el dashboard.
 * @returns {Promise<Array>}
 */
export const obtenerConfiguraciones = async () => {
  const configuracionesRef = collection(db, "CONFIGURACIONES");
  try {
    const snapshot = await getDocs(configuracionesRef);
    const configuraciones = snapshot.docs.map((doc) => doc.data());
    if (configuraciones.length > 0) {
      let set = new Set();
    }
  } catch (error) {
    console.error("Error al cargar los niveles: ", error);
    throw error;
  }
};
export const classificationByGroup = async () => {
  try {
    //obtener alumnos
    const alumnos = await obtenerAlumnos();
    //iterar los alumnos y obtener sus grupos
    const grupos = new Set();
    alumnos.forEach((alumno) => {
      if (alumno.grupo) {
        alumno.grupo.forEach((grupo) => grupos.add(grupo));
      }
    });
    //devolver los grupos
    return grupos;
  } catch (error) {
    console.log(error);
  }
};

export async function Actualizar_Alumno(alumno) {
  const idNumerico = Number(alumno.id);
  const alumnoRef = doc(db, "ALUMNOS", idNumerico);
  try {
    console.log("Datos del alumno a actualizar:", alumno); // Agregar esta línea para verificar los datos
    await updateDoc(alumnoRef, alumno);
    console.log("Alumno actualizado exitosamente.");
  } catch (error) {
    console.error("Error al actualizar el alumno: ", error);
    throw error;
  }
}
export const ObtenerAlumnosPorGrupo = async (grupo) => {
  const alumnosRef = collection(db, "ALUMNOS");
  try {
    const q = firestoreQuery(
      alumnosRef,
      where("grupo", "array-contains", grupo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener los alumnos por grupo: ", error);
    throw error;
  }
};

// Función para cargar niveles desde Firebase
export const cargarNiveles = async () => {
  // Cargar niveles de firebase del Documento CONFIGURACIONES >> Niveles
  const configuracionesRef = collection(db, "CONFIGURACIONES");
  try {
    const snapshot = await getDocs(configuracionesRef);
    const configuraciones = snapshot.docs.map((doc) => doc.data());
    if (configuraciones.length > 0) {
      let set = new Set();
    }
  } catch (error) {
    console.error("Error al cargar los niveles: ", error);
    throw error;
  }
};
// Función para guardar niveles en Firebase
export const guardarNivelesEnFirebase = async () => {
  try {
    let set = new Set();
    alumnos.forEach((alumno) => alumno.grupo.forEach((g) => set.add(g)));
    return [...set];
  } catch (error) {
    console.log(error);
  }
};

export const obtenerInstrumentosYAlumnos = async () => {
  // Obtener los alumnos y sus instrumentos
  const alumnos = await obtenerAlumnos();
  const instrumentos = new Set();
  // iterar los alumnos y obtener sus instrumentos
  alumnos.forEach((alumno) => {
    if (alumno.instrumento) {
      instrumentos.add(alumno.instrumento);
    }
  });

  return {
    alumnos,
    instrumentos: Array.from(instrumentos), // Convertir Set a Array
  };
};

// Obtener los alumnos y sus grupos
export const obtenerGruposYAlumnos = async () => {
  // Obtener los alumnos y sus grupos
  const alumnos = await obtenerAlumnos();
  const grupos = new Set();

  // Iterar los alumnos y obtener sus grupos
  alumnos.forEach((alumno) => {
    if (alumno.grupo) {
      alumno.grupo.forEach((grupo) => grupos.add(grupo));
    }
  });

  return {
    alumnos,
    grupos: Array.from(grupos), // Convertir Set a Array
  };
};

// Funcion para agregar notas de alumnos justificados en la coleccion ASISTENCIAS >>> Data >>> Justificados
export const agregarJustificados = async (id, justificados) => {
  const asistenciasRef = collection(db, "ASISTENCIAS");
  try {
    const q = firestoreQuery(
      asistenciasRef,
      where("Data.ausentes", "array-contains", id)
    );
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(async (doc) => {
      const asistencia = doc.data();
      if (asistencia.Data.presentes.includes(id)) {
        asistencia.Data.justificados = justificados;
        await updateDoc(doc.ref, asistencia);
      }
    });
    console.log("Justificados agregados exitosamente.");
  } catch (error) {
    console.error("Error al agregar los justificados: ", error);
    throw error;
  }
};
