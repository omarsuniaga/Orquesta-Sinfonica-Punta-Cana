import { db } from "./src/FirebaseService/constants";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  getDoc,
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
    console.log("Alumno guardado/actualizado exitosamente.");
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
  const alumnosRef = collection(db, "ALUMNOS");
  try {
    const snapshot = await getDocs(alumnosRef);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener alumnos: ", error);
    throw error;
  }
}

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
export async function registrarAsistenciaDeHoy(
  presentes,
  ausentes,
  fecha,
  grupo
) {
  const docId = `${fecha}_${grupo}`;
  const docRef = doc(db, "ASISTENCIAS", docId);
  const asistenciaData = {
    Fecha: fecha,
    grupo,
    Data: { presentes, ausentes },
  };

  try {
    await setDoc(docRef, asistenciaData);
    console.log("Asistencia registrada exitosamente.");
  } catch (error) {
    console.error("Error al registrar asistencia: ", error);
    throw error;
  }
}

/**
 * Obtiene un listado de todos los alumnos.
 * @returns {Promise<Array>} - Promesa que resuelve en un array de objetos de alumnos.
 */

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

/**
 * Obtiene todas las asistencias de la base de datos.
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de todas las asistencias.
 */
export async function obtenerAsistencias() {
  const asistenciasRef = collection(db, "ASISTENCIAS");
  try {
    const snapshot = await getDocs(asistenciasRef);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener asistencias: ", error);
    throw error;
  }
}

/**
 * Busca información de un alumno por su ID.
 * @param {string} id - ID del alumno.
 * @returns {Promise<Object>} - Una promesa que resuelve en el objeto de datos del alumno.
 */
export async function buscarAlumnoPorId(id) {
  const alumnoRef = doc(db, "ALUMNOS", id);
  try {
    const alumnoDoc = await getDoc(alumnoRef);
    if (!alumnoDoc.exists()) {
      throw new Error("Alumno no encontrado");
    }
    return alumnoDoc.data();
  } catch (error) {
    console.error("Error al buscar alumno por ID: ", error);
    throw error;
  }
}

/**
 * Genera un resumen global de asistencias combinando información de alumnos y asistencias.
 * @returns {Promise<Object>} - Un objeto con asistencias mapeadas por ID de alumno y fecha.
 */
export async function generarResumenGlobalDeAsistencias() {
  const Alumnos = await obtenerAlumnos();
  const asistencias = await obtenerAsistencias(); // Asegúrate de que esta función devuelve lo que esperas

  const AlumnosMap = Alumnos.reduce((acc, alumno) => {
    acc[alumno.id] = {
      nombre: alumno.nombre + " " + alumno.apellido,
      grupo: alumno.grupo,
    };
    return acc;
  }, {});

  const uniqueAttendance = {};

  asistencias.forEach((elem) => {
    if (!elem.Fecha || !elem.Data) return;
    const presentes = elem.Data.presentes;
    const ausentes = elem.Data.ausentes;

    [...presentes, ...ausentes].forEach((el) => {
      const key = `${el}-${elem.Fecha}`;
      if (!uniqueAttendance[key]) {
        uniqueAttendance[key] = {
          id: el,
          name: AlumnosMap[el]?.nombre,
          date: elem.Fecha,
          grupo: AlumnosMap[el]?.grupo,
          attended: presentes.includes(el),
        };
      }
    });
  });

  return Object.values(uniqueAttendance);
}

/**
 * Solicita las credenciales de un usuario para verificar su nivel de acceso.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<string|null>} - Una promesa que resuelve en el nivel de acceso del usuario o null si el usuario no se encuentra.
 */
export async function solicitarCredenciales(email) {
  try {
    const usuariosRef = collection(db, "USUARIOS");
    const queryUsuarios = query(usuariosRef, where("email", "==", email));
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
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener asistencias por fecha y grupo: ", error);
    throw error;
  }
}
