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
  let Alumnos = loadFromLocalStorage("ALUMNOS");
  if (!Alumnos) {
    Alumnos = await fetchAlumnosFromFirebase();
    saveToLocalStorage("ALUMNOS", Alumnos);
  }
  return Alumnos;
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
 * @returns {Promise<void>}
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
 * @returns {Promise<void>}
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
    let asistencias = loadFromLocalStorage("ASISTENCIAS");
    if (!Array.isArray(asistencias)) {
      asistencias = [];
    }
    asistencias.push(asistenciaData);
    saveToLocalStorage("ASISTENCIAS", asistencias);
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

// /**
//  * Obtiene el historial de inasistencias de un alumno por mes.
//  * @param {string} id - El ID del alumno.
//  * @returns {Promise<Object>}
//  */ // historial de asistencias
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
    saveToLocalStorage("ASISTENCIAS", asistencias);
  }
  return asistencias;
};

/**
 * Busca el nombre del alumno según nombre o apellido.
 * @param {string} nombre - Nombre o apellido del alumno.
 * @returns {Promise<Array>}
 */
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
    console.log("item.data", item.data);

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

  const Alumnos = await obtenerAlumnos(); // Obtenemos los alumnos solo una vez

  try {
    if (!Array.isArray(items)) {
      console.error("Asistencias no es un array:", items);
      return [];
    }

    const uniqueAttendance = {};
    const AlumnosMap = new Map(Alumnos.map((alumno) => [alumno.id, alumno])); // Mapa para acceso rápido

    items.forEach((elem) => {
      if (!elem.Fecha || !elem.Data) return;
      const { presentes, ausentes } = elem.Data;
      [...presentes, ...ausentes].forEach((el) => {
        const key = `${el}-${elem.Fecha}`;
        if (!uniqueAttendance[key] && AlumnosMap.has(el)) {
          const alumno = AlumnosMap.get(el);
          uniqueAttendance[key] = {
            id: el,
            name: `${alumno.nombre} ${alumno.apellido}`,
            date: elem.Fecha,
            grupo: alumno.grupo,
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

    saveToLocalStorage("ASISTENCIAS", items);
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
  return fecha; // Mantener el formato original
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

    console.log("Fechas con eventos:", fechasUnicas);

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
      const { Grupos, Niveles } = configuraciones[0];
      return Grupos, Niveles;
    }
  } catch (error) {
    console.error("Error al obtener las configuraciones: ", error);
    throw error;
  }
};
export const classificationByGroup = async () => {
  try {
    const alumnos = await obtenerAlumnos();
    let set = new Set();
    alumnos.forEach((alumno) => alumno.grupo.forEach((g) => set.add(g)));
    return [...set];
  } catch (error) {
    console.log(error);
  }
};

export async function Actualizar_Alumno(alumno) {
  const alumnoRef = doc(db, "ALUMNOS", alumno.id);
  try {
    await updateDoc(alumnoRef, alumno);
    console.log("Alumno actualizado exitosamente.");
  } catch (error) {
    console.error("Error al actualizar el alumno: ", error);
    throw error;
  }
}

// Función para buscar un alumno en el documento ALUMNOS y extraer toda la data del alumno, recibe el id
export const Buscar_Alumno = async (alumno) => {
  const alumnoRef = collection(db, "ALUMNOS");
  try {
    const q = firestoreQuery(alumnoRef, where("id", "==", alumno)); // Usar "==" en lugar de "==="
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No se encontró el alumno con el ID especificado.");
      return null;
    }

    const datosAlumno = snapshot.docs.map((doc) => doc.data());

    // Si esperas un único documento, retorna el primero de la lista

    return datosAlumno[0];
  } catch (error) {
    console.error("Error al buscar al alumno: ", error);
    throw error;
  }
};

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
  const docRef = doc(db, "CONFIGURACION", "UBNvhQi4Nphm2ZJNdkh2"); // Asegúrate de usar el ID correcto del documento de configuración
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log(data);
      // return data.Niveles; // Asume que el array de niveles se llama "niveles" en el documento de configuración
    } else {
      console.warn("El documento de configuración no existe.");
      return [];
    }
  } catch (error) {
    console.error("Error al cargar los niveles de Firebase:", error);
    return [];
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
