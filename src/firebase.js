import { onMounted, onUnmounted } from "vue";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  where,
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
// import { algo } from "./data";
// Subsequent
import moment from "moment";
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const Fecha = moment().format("YYYY/MM/DD");
let Lista_Ausentes = [];
let Lista_Presentes = [];
export { auth, db, Fecha, Lista_Presentes, Lista_Ausentes };
export const useAuthState = () => {
  const user = ref(null);
  const error = ref(null);
  let unsubscribe;
  onMounted(() => {
    unsubscribe = onAuthStateChanged(
      auth,
      (u) => (user.value = u),
      (e) => (error.value = e)
    );
  });
  onUnmounted(() => unsubscribe());

  const isAuthenticated = computed(() => user.value != null);
  return { user, error, isAuthenticated };
};
async function ConConexion() {
  await enableNetwork(db);
  console.log("Network disabled!", db);
  // Do online actions
  // ...
}
async function SinConexion() {
  await disableNetwork(db);
  console.log("Network disabled!");

  // Do offline actions
}
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log(err.code);
    ConConexion();
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == "unimplemented") {
    SinConexion();
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});
export const Crear_Alumnos = async (alumno) => {
  try {
    const docRef = await setDoc(
      doc(db, "ALUMNOS", alumno.id.toString()),
      alumno
    ).then();
  } catch (error) {
    console.log(error);
  }
};
export const Leer_Alumnos = async () => {
  try {
    let alumnosRef = collection(db, "ALUMNOS");
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
/*
 ****** BUSCAR ALUMNO POR ID ******
 */
export const Buscar_Alumno = async (id) => {
  try {
    let RefColeccion = collection(db, "ALUMNOS");
    let q = query(RefColeccion, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data();
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
export const Buscar_Por_Fecha = async (Fecha) => {
  let listadoRef = collection(db, "ASISTENCIAS");
  let q = query(listadoRef, where("Fecha", "==", Fecha)); //"2022-08-03"
  let querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  } else {
    let { ausentes, presentes } = querySnapshot.docs[0].data().Data;
    Lista_Presentes = presentes;
    Lista_Ausentes = ausentes;
    return querySnapshot.docs[0].data();
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
    await signInWithEmailAndPassword(auth, email, password).then((e) =>
      console.log("user logged", e.user)
    );
  } catch (error) {
    console.log(error);
  }
};
export const Salir = async () => {
  try {
    await signOut(auth).then(() => console.log("Sesion Cerrada!"));
  } catch (e) {
    alert(e.message);
  }
};
export const Iniciar_Automaticamente = () => {
  new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));
};
export const Crear_Progresos = async (alumno) => {
  try {
    const Ref = doc(db, "ORQUESTA", alumno.id);
    await setDoc(Ref, alumno);
  } catch (error) {
    console.log(error);
  }
};
export const Buscar_Grupo = async (fecha, grupo) => {
  try {
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
export const Asistencia_de_Hoy = async (
  presentes,
  ausentes,
  Fecha_de_Hoy,
  grupo
) => {
  let res = await Buscar_Grupo(Fecha_de_Hoy, grupo).then((e) =>
    e.id === undefined ? null : e.id
  );
  try {
    if (res === null) {
      return await addDoc(collection(db, "ASISTENCIAS"), {
        Fecha: Fecha_de_Hoy,
        Data: { presentes, ausentes },
        grupo,
      });
    } else {
      const Ref = doc(db, "ASISTENCIAS", res);
      return await setDoc(Ref, {
        Fecha: Fecha_de_Hoy,
        Data: { presentes, ausentes },
        grupo,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const Mostrar_Listado = async () => {
  try {
    let listadoRef = collection(db, "ALUMNOS");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
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
export const Mostrar_todo = async () => {
  try {
    let asistenciasRef = collection(db, "ASISTENCIAS");
    let q = query(asistenciasRef);
    let asistencia = await getDocs(q);
    return asistencia.docs;
  } catch (error) {
    console.log(error);
  }
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
  //Filtrar todos los registros donde el mes sea igual al seleccionado
  // _l.filter((elem) =>
  //   !!elem.Fecha
  //     ? elem.Fecha.split("-")[1] === mes.toString()
  //       ? elem.Data.presentes.filter((el) =>
  //           !!el
  //             ? Buscar_Alumno(el).then((e) =>
  //                 !!e.nombre && !!e.apellido
  //                   ? (NOMBRE = e.nombre + " " + e.apellido)
  //                   : null
  //               ) && PRESENTES++
  //             : null
  //         ) &&
  //         elem.Data.ausentes.filter((el) =>
  //           !!el
  //             ? Buscar_Alumno(el).then((e) => {
  //                 !!e.nombre && !!e.apellido
  //                   ? (NOMBRE = e.nombre + " " + e.apellido)
  //                   : null;
  //               }) && AUSENTES++
  //             : null
  //         ) &&
  //         RESULTADO.push({
  //           nombre: NOMBRE,
  //           inasistencias: AUSENTES,
  //           asistencias: PRESENTES,
  //           mes: mes,
  //         }) &&
  //         ((NOMBRE = ""), (PRESENTES = 0), (AUSENTES = 0))
  //       : null
  //     : null
  // );

  // return console.log("Resultados", RESULTADO);
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
/**
 * Data para graficas del Dashboard
 */

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
Clasificacion_Generos();
