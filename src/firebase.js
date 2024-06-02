import { initializeApp } from "firebase/app";
// //Modulo del Autenticacion
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
// //Modulo del Storage
import { getStorage } from "firebase/storage";
// //Modulo de Base de Datos
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  deleteDoc,
  where,
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
  onSnapshot,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  set,
  get,
  onValue,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";

import moment from "moment";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  appId: import.meta.env.VITE_APP_APP_ID,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBt5afq5tLeVC1-M5YGp2eql3kISJPBZ90",
//   authDomain: "proyecto-uno-9b46e.firebaseapp.com",
//   databaseURL: "https://proyecto-uno-9b46e-default-rtdb.firebaseio.com",
//   projectId: "proyecto-uno-9b46e",
//   storageBucket: "proyecto-uno-9b46e.appspot.com",
//   messagingSenderId: "817861032607",
//   appId: "1:817861032607:web:cbebdf43b2029dc5cf80aa",
//   measurementId: "G-1YCKB70W0X",
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = "es";
export const db = getFirestore(app);
export const realdb = getDatabase(app);
export const storage = getStorage(app);
const Fecha = moment().format("YYYY/MM/DD");
const ALUMNOS = [];
let Lista_Ausentes = [];
let Lista_Presentes = [];
let __SESION = false;
let __NIVEL;
let __VALIDACION = false;
let __ID;

export {
  Fecha,
  Lista_Presentes,
  Lista_Ausentes,
  ALUMNOS,
  __SESION,
  __NIVEL,
  __ID,
  __VALIDACION,
};

// export const Iniciar_Automaticamente = () => {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         SolicitarCredenciales(user.email).then((nivel) => {
//           user.phoneNumber = nivel;
//         });

//         // __SESION = true;
//         resolve(true);
//         const connectedRef = ref(realdb, ".info/connected");
//         const myConnectionsRef = ref(realdb, `users/${user.uid}/connections`);
//         // almacena la marca de tiempo de mi última desconexión (la última vez que me vieron en línea)
//         const lastOnlineRef = ref(realdb, `users/${user.uid}/connections`);

//         onValue(connectedRef, (snap) => {
//           if (snap.val() === true) {
//             // ¡Estamos conectados (o reconectados)! Haga cualquier cosa aquí que debería suceder solo si está en línea (o al volver a conectarse)
//             const con = push(myConnectionsRef);

//             // Cuando desconecto, elimino este dispositivo
//             onDisconnect(con).remove();

//             // Agregar este dispositivo a mi lista de conexiones
//             // este valor podría contener información sobre el dispositivo o también una marca de tiempo
//             set(con, true);

//             // Cuando me desconecto, actualizo la última vez que me vieron en línea
//             onDisconnect(lastOnlineRef).set(serverTimestamp());
//           }
//         });
//       } else {
//         // __SESION = false;
//         resolve(false);
//       }
//     });
//   });
// };

export const useSignOut = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    alert(e.message);
  }
};
export const SolicitarCredenciales = async (email) => {
  try {
    let RefColeccion = collection(db, "USUARIOS");
    let q = query(RefColeccion, where("email", "==", email));
    let querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    } else {
      let { Nivel } = querySnapshot.docs[0].data();
      return Nivel;
    }
  } catch (error) {
    console.log(error);
  }
};
export const iniciarSesion = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const getUserState = () =>
  new Promise((resolve, reject) =>
    onAuthStateChanged(getAuth(), resolve, reject)
  );
async function ConConexion() {
  await enableNetwork(db);
  console.log("Network disabled!", db);
}
async function SinConexion() {
  await disableNetwork(db);
  console.log("Network disabled!");
}

if (db && db.enablePersistence) {
  db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
    if (err.code == "failed-precondition") {
      console.log(
        "Persistencia no habilitada. Múltiples pestañas abiertas, persistencia solo habilitada en una pestaña."
      );
    } else if (err.code == "unimplemented") {
      console.log(
        "El navegador actual no soporta todas las características necesarias para habilitar la persistencia"
      );
    }
  });
}
export const Crear_Alumnos = async (alumno) => {
  try {
    await setDoc(doc(db, "ALUMNOS", alumno.id.toString()), alumno).then();
  } catch (error) {
    console.log(error);
  }
};

//Buscar algun alumno con detalles en el registro
export const Leer_Alumnos = async () => {
  try {
    let alumnosRef = collection(db, "ALUMNOS");
    let res = await getDocs(alumnosRef);
    res.forEach((doc) => {
      doc.data().instrumento === "Interés: Flauta";
    });
    return await getDocs(alumnosRef);
  } catch (error) {
    console.log(error);
  }
};
export const Actualizar_Alumno = async (alumno) => {
  try {
    const Ref = doc(db, "ALUMNOS", alumno.id);
    await setDoc(Ref, alumno);
  } catch (error) {
    console.log(error);
  }
};
export const Eliminar_Alumno = async (id) => {
  try {
    await deleteDoc(doc(db, "ALUMNOS", id)).then(() => {
      alert("Alumno Eliminado");
    });
  } catch (error) {
    console.log(error);
  }
};
export const Mover_Alumnos = async (alumno) => {
  try {
    const Ref = doc(db, "INACTIVOS", alumno.id);
    await setDoc(Ref, alumno).then();
  } catch (error) {
    console.log(error);
  }
  console.log(alumno);
};
/** NUEVAS FUNCIONES REFACTORIZADAS PARA HACER UN SOLO LLAMADO A LA API, ESTAN EN INGLES PARA DIFERENCIARLAS*/
/**ALUMNOS */
//getAlumnos
export const getAlumnos = async () => {
  let Alumnos = JSON.parse(localStorage.getItem("ALUMNOS"));
  if (!Alumnos) {
    Alumnos = await fetchAlumnosFromFirebase();
    localStorage.setItem("ALUMNOS", JSON.stringify(Alumnos));
  }

  return Alumnos;
};
export const fetchAlumnosFromFirebase = async () => {
  try {
    let listadoRef = collection(db, "ALUMNOS");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
    let res = querySnapshot.docs.map((e) => e.data());
    return res;
  } catch (error) {
    console.log(error);
  }
};
//searchAlumnoId
export const searchAlumno = async (id) => {
  try {
    let alumnos = await getAlumnos();
    let res = alumnos.filter((e) => e.id == id);
    return res;
  } catch (error) {
    console.log(error);
  }
};

//classification by genres
export const classificationByGenre = async () => {
  try {
    const alumnos = await getAlumnos();
    return alumnos.reduce((acc, alumno) => {
      acc[alumno.sexo] = (acc[alumno.sexo] || 0) + 1;
      return acc;
    }, {});
  } catch (error) {
    console.log(error);
  }
};

export const classificationByGroup = async () => {
  try {
    const alumnos = await getAlumnos();
    let set = new Set();
    alumnos.forEach((alumno) => alumno.grupo.forEach((g) => set.add(g)));
    return [...set];
  } catch (error) {
    console.log(error);
  }
};
/**ASISTENCIAS */

export const getAsistencias = async () => {
  let asistencias = JSON.parse(localStorage.getItem("ASISTENCIAS"));
  console.log("asistencias", asistencias);
  if (!asistencias) {
    asistencias = await fetchAsistenciasFromFirebase();
    localStorage.setItem("ASISTENCIAS", JSON.stringify(asistencias));
  }

  return asistencias;
};

export const Generar_Asistencias_Global = async () => {
  const Alumnos = await getAlumnos();
  const Asistencias = await getAsistencias();

  const AlumnosMap = Alumnos.reduce((acc, alumno) => {
    acc[alumno.id] = {
      nombre: alumno.nombre + " " + alumno.apellido,
      grupo: alumno.grupo,
    };
    return acc;
  }, {});

  const uniqueAttendance = {};

  Asistencias.forEach((elem) => {
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
};

export const diasTrabajados = async () => {
  try {
    const asistencias = await Generar_Asistencias_Global();
    let set = new Set();
    asistencias.forEach((elem) => elem.date && set.add(elem.date));
    return [...set];
  } catch (error) {
    console.log(error);
  }
};

/*
 ****** BUSCAR ALUMNO en FIREBASE******
 */
export const Buscar_Alumno = async (id) => {
  try {
    //  buscar alumno en localstorage
    let alumnos = await getAlumnos();
    let res = alumnos.find((e) => e.id == id);
    return res;
  } catch (error) {
    console.log(error);
  }
  return null;
};
export const Buscar_Alumno_Nombre = async (text) => {
  if (text !== "") {
    try {
      let RefColeccion = collection(db, "ALUMNOS");
      let alumnos = await getDocs(RefColeccion);
      let Li = alumnos.docs;
      let resultado = [];
      Li.filter((elem) =>
        elem.data().nombre.toLowerCase().search(text) != -1
          ? resultado.push(elem.data())
          : null
      );
      Li.filter((elem) =>
        elem.data().id.search(text) != -1 ? resultado.push(elem.data()) : null
      );
      return resultado;
    } catch (error) {
      console.log(error);
    }
  }
  return;
};
export const Eventos_Calendario = async () => {
  let listadoRef = collection(db, "ASISTENCIAS");
  let fechas = await getDocs(listadoRef);
  let eventos = fechas.docs.map((e) => e.data().Fecha); //"2022/11/01"
  eventos = eventos.map((e) => (e === null ? "" : e.split("-").join("/")));
  return eventos;
};
export const Buscar_Por_Fecha = async (fecha) => {
  // Intentar obtener los datos de localStorage primero
  const asistenciasLocalStorage = localStorage.getItem(`ASISTENCIA`);
  if (asistenciasLocalStorage) {
    // buscar en localStorage si existe la propiedad Fecha
    // comprobar que Fecha sea igual a la fecha que se busca
    //devolver el valor de la propiedad Data y grupo en la variable resultado
    return JSON.parse(asistenciasLocalStorage).find(
      (asistencia) => asistencia.Fecha === fecha
    );
  } else {
    // Consulta a Firebase si no se encuentra en localStorage
    let listadoRef = collection(db, "ASISTENCIAS");
    let q = query(listadoRef, where("Fecha", "==", fecha));
    let querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No hay registros para esta fecha en Firebase.");
      return null; // Manejar como creas conveniente
    } else {
      // Suponiendo que cada fecha solo tiene un documento, ajusta según tu caso de uso
      let data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data().Data,
      }));

      // Guardar en localStorage para uso futuro
      // localStorage.setItem(`asistencias_${fecha}`, JSON.stringify(data));

      return data;
    }
  }
};

/*
 ****** CRUD USER SESION ******
 */
export const Crear_User_Sesion = async (user) => {
  try {
    let userRef = collection(db, "USER_SESION");
    await addDoc(userRef, user).then(() => {
      alert("Usuario Guardado");
    });
  } catch (error) {
    console.log(error);
  }
};
export const Leer_User_Sesion = async (user) => {
  try {
    let userRef = collection(db, "USER_SESION");
    return await getDocs(userRef);
  } catch (error) {
    console.log(error);
  }
};
export const Actualizar_User_Sesion = async (user) => {
  try {
    let userRef = collection(db, "USER_SESION");
    await updateDoc(userRef, user).then(() => {
      alert("Usuario Actualizado");
    });
  } catch (error) {
    console.log(error);
  }
};
export const Eliminar_User_Sesion = async (user) => {
  try {
    let userRef = collection(db, "USER_SESION");
    await removeDoc(userRef, user).then(() => {
      alert("Usuario Eliminado");
    });
  } catch (error) {
    console.log(error);
  }
};
/*
 ****** LOGIN Y LOGOUT *******
 */

export const Entrar = async (email, password) => {
  try {
    let res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const Salir = async () => {
  await signOut(auth);
  __SESION = false;
  window.location.replace("/");
  return console.log("Usuario Deslogeado");
};

export const Iniciar_Automaticamente = async () => {
  new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));
  console.log("Iniciar_Automaticamente");
};
// export const Crear_Progresos = async (alumno) => {
//   try {
//     const Ref = doc(db, "ORQUESTA", alumno.id);
//     await setDoc(Ref, alumno);
//   } catch (error) {
//     console.log(error);
//   }
// };
export const Buscar_Grupo = async (fecha, grupo) => {
  try {
    // Primero, intenta obtener los datos del localStorage
    const asistencias = await getAsistencias();
    if (asistencias) {
      const asistencia = asistencias.find(
        (asistencia) => asistencia.Fecha === fecha && asistencia.grupo === grupo
      );
      if (asistencia) {
        return asistencia;
      }
    }
    console.log("Solicitando a Firebase");
    // Si no se encontraron los datos en el localStorage, haz la consulta a Firebase
    let q = query(
      collection(db, "ASISTENCIAS"),
      where("Fecha", "==", fecha),
      where("grupo", "==", grupo)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty === false) {
      return querySnapshot.docs[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};
// // export const Buscar_Grupo = async (fecha, grupo) => {
// //   try {
// //     const docId = `${fecha}_${grupo}`;
// //     const docRef = doc(db, "ASISTENCIAS", docId);
// //     const docSnapshot = await getDoc(docRef);
// //     if (docSnapshot.exists()) {
// //       return docSnapshot.data();
// //     } else {
// //       return false;
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     return null;
// //   }
// // };
// // export const Asistencia_de_Hoy = async (presentes, ausentes, Fecha_de_Hoy, grupo) => {
// //   try {
// //     const grupoEncontrado = await Buscar_Grupo(Fecha_de_Hoy, grupo);
// //     const asistenciaData = {
// //       Fecha: Fecha_de_Hoy,
// //       Data: { presentes, ausentes },
// //       grupo,
// //     };

// //     if (grupoEncontrado?.id === undefined) {
// //       return await addDoc(collection(db, "ASISTENCIAS"), asistenciaData);
// //     } else {
// //       const Ref = doc(db, "ASISTENCIAS", grupoEncontrado.id);
// //       return await setDoc(Ref, asistenciaData);
// //     }
// //   } catch (error) {
// //     console.error(error);
// //   }
// // };
export const Asistencia_de_Hoy = async (
  presentes,
  ausentes,
  Fecha_de_Hoy,
  grupo
) => {
  try {
    console.log("Solicitando a Firebase");
    const docId = `${Fecha_de_Hoy}_${grupo}`;
    const docRef = doc(db, "ASISTENCIAS", docId);
    const asistenciaData = {
      Fecha: Fecha_de_Hoy,
      grupo,
      Data: { presentes, ausentes },
    };

    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return await setDoc(docRef, asistenciaData);
    } else {
      return await setDoc(docRef, asistenciaData);
    }
  } catch (error) {
    console.error(error);
  }
};

export const Mostrar_Carrusel = async () => {
  try {
    let listadoRef = collection(db, "CARRUSEL");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
    let res = querySnapshot.docs.map((e) => e.data());
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const Mostrar_Listado = async () => {
  try {
    let listadoRef = collection(db, "ALUMNOS");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
    let res = querySnapshot.docs.map((e) => e.data());
    return querySnapshot.docs;
  } catch (error) {
    console.log(error);
  }
};
export const Mostrar_Listado_Inactivos = async () => {
  try {
    let listadoRef = collection(db, "INACTIVOS");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
    return querySnapshot.docs;
  } catch (error) {
    console.log(error);
  }
};
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
export const Mostrar_todo = async () => {
  let asistencias = JSON.parse(localStorage.getItem("ASISTENCIAS")).data;
  if (!asistencias) {

    asistencias = await fetchAsistenciasFromFirebase();
    // console.log("de Firebase", asistencias);
    localStorage.setItem("ASISTENCIAS", JSON.stringify(asistencias));
  }

  return asistencias;
};
export const Buscar_Asistencias_id = async (id, mes) => {
  let RESULTADO = {};
  let PRESENTES = 0;
  let AUSENTES = 0;
  let _l = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));
  //Filtrar todos los registros donde el mes sea igual al seleccionado
  _l.filter((elem) =>
    !!elem.Fecha
      ? elem.Fecha.split("-")[1] === mes.toString()
        ? elem.Data.presentes.filter((el) =>
            el === id ? PRESENTES++ : null
          ) &&
          elem.Data.ausentes.filter((el) => (el === id ? AUSENTES++ : null))
        : null
      : null
  );

  RESULTADO.Nombre = await Buscar_Alumno(id).then(
    (e) => e.nombre + " " + e.apellido
  );
  RESULTADO.Asistencia = PRESENTES;
  RESULTADO.Inasistencia = AUSENTES;
  RESULTADO.Mes = mes;
  //insertar la asistencia de cada uno en el listado mensual
  // DatosColumna(ListadoMes);
  return console.log(RESULTADO);
};
export const Buscar_Asistencias_mes = async (mes) => {
  let Listado = [];
  let ListadoAusentes = [];
  let PRESENTES = [];
  let AUSENTES = [];
  let _l = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));

  _l.filter((elem) => {
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
  // //crea objeto de los registros
  for (let clave in Listado) {
    Listado[clave] = {
      nombre: await Buscar_Alumno(clave).then(
        (e) => e.nombre + " " + e.apellido
      ),
      asistencias: Listado[clave],
    };
    Object.entries(ListadoAusentes).forEach(([key, value]) =>
      key === clave
        ? (Listado[clave].inasistencias = value.Inasistencias)
        : null
    );
  }
  return Listado;
};
//Obtener asistencias
export const ObtenerAsistencias = async (id) => {
  let objeto = {};
  try {
    let pres = 0;
    let ause = 0;
    let _l = await Mostrar_todo().then((elem) => elem.map((e) => e.data())); //Jalando asistencias
    _l.filter(
      (elem) =>
        elem.Data.presentes.filter((e) =>
          e === id ? (pres = pres + 1) : null
        ) &&
        elem.Data.ausentes.filter((e) => (e === id ? (ause = ause + 1) : null))
    );
    objeto.presente = pres;
    objeto.ausente = ause;
    objeto.id = id;
    return objeto;
  } catch (error) {
    console.log(error);
  }
};
export const Contar_Ausentes = async (mes = "09") => {
  let Ref = collection(db, "ASISTENCIAS");
  let Listado_Fechas = await getDocs(Ref);
  return Listado_Fechas;
};
// Contar alumnos de la orquesta
export const Total_Orquesta = async () => {
  let Alumnos = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  Alumnos = await Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === "Orquesta")
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));
  return Alumnos;
};
export const Total_Coro = async () => {
  let Alumnos = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  Alumnos = await Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === "Coro")
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));
  return Alumnos;
};
export const Total_Solfeo = async () => {
  let Alumnos = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  Alumnos = await Alumnos.filter((elem) =>
    elem.grupo.find((e) => e === "Iniciacion 1" || e === "Iniciacion 2")
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));
  return Alumnos;
};
export const Grupo_Porcentaje_Fechas = async (grupo) => {
  let array = [];
  let _l = [];
  _l = await Mostrar_todo().then((elem) => elem.map((e) => e.data())); //Jalando asistencias
  _l.filter((elem) => {
    if (elem.grupo === grupo) {
      array.push({
        fecha: elem.Fecha,
        presentes: elem.Data.presentes.length,
        ausentes: elem.Data.ausentes.length,
        porcentaje: (elem.Data.presentes.length * 100) / 22,
      });
      return array.sort((a, b) => a.Fecha - b.Fecha);
    }
  });
  return array;
};
export const Clasificacion_Generos = async () => {
  const generos = {};
  try {
    let ConsultaFemenino = query(
      collection(db, "ALUMNOS"),
      where("sexo", "==", "Femenino")
    );
    let ConsultaMasculino = query(
      collection(db, "ALUMNOS"),
      where("sexo", "==", "Masculino")
    );
    const femenino = await getDocs(ConsultaFemenino);
    const masculino = await getDocs(ConsultaMasculino);
    femenino.empty === false || masculino === false
      ? (generos.femenino = femenino.docs.length) &&
        (generos.masculino = masculino.docs.length)
      : false;
  } catch (error) {
    console.log(error);
  }
  return generos;
};
export const PROCESOS = async (id) => {
  try {
    let RefColeccion = collection(db, "PROGRESOS");
    let q = query(RefColeccion, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.log(error);
  }
  return null;
};
export const guardarRegistroEnFirebase = (id, nombreTema, observacion) => {
  const connectedRef = ref(realdb, ".info/connected");
  const myConnectionsRef = ref(realdb, `alumno/${id}/calificaciones`);
  const nuevoRegistro = {
    nombreTema,
    observacion,
    fecha: Date.now(),
  };
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      const con = push(myConnectionsRef);
      set(con, nuevoRegistro);
      alert("Registro Guardado");
    }
  });
};

Iniciar_Automaticamente();
// Leer_Alumnos();
