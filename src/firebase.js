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
} from "firebase/firestore";
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

export { auth, db, Fecha };

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

/**
 * CRUD DE ALUMNOS
 */

//create alumno
export const Crear_Alumnos = async (alumno) => {
  try {
    const docRef = await setDoc(
      doc(db, "ALUMNOS", alumno.id.toString()),
      alumno
    ).then(() => alert("Registrado con Exito"));
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
  let eventos = fechas.docs.map((e) => e.data().Fecha.split("-").join("/"));
  return eventos;
};

export const Buscar_Por_Fecha = async (Fecha) => {
  let listadoRef = collection(db, "ASISTENCIAS");
  let q = query(listadoRef, where("Fecha", "==", Fecha)); //"2022-08-03"
  let querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  } else {
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

//Extraer_Data_Alumno
//Extraer_data_asistencias
//Buscar_asistencias_por_fechas
/**
 * GUARDAR ASISTENCIAS
 * ORDENAR ASISTENCIAS
 * GRAFICAR ASISTENCIAS
 */
//GUARDA LA ASISTENCIA DEL DIA
export const Asistencia_de_Hoy = async (presentes, ausentes, Fecha_de_Hoy) => {
  try {
    await setDoc(doc(db, "ASISTENCIAS", Fecha_de_Hoy), {
      Fecha: Fecha_de_Hoy,
      Data: { presentes, ausentes },
    });
    return alert("Asistencia Guardada");
  } catch (error) {
    return alert(error);
  }
};

export const Mostrar_Listado = async () => {
  try {
    //Mostrar listado de Alumnos.
    let listadoRef = collection(db, "ALUMNOS");
    let q = query(listadoRef);
    let querySnapshot = await getDocs(q);
    return querySnapshot.docs;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Que mes buscaremos? //08
 * Obtener Lista de alumnos
 * Obtener Lista de Fechas donde el mes sea igual a 08
 * El [alumno 1] esta en [2022-08-01]? 'SI' esta en [Presentes]? 'SI' Contador.Presentes +1 //1
 * El [alumno 1] esta en [2022-08-02]? 'SI' esta en [Presentes]? 'NO' Esta en [Ausentes]? 'SI' Contador.Ausentes +1 //1
 * El [alumno 1] esta en [2022-08-03]? 'SI' esta en [Presentes]? 'SI' Contador.Presentes +1 //2
 * El [alumno 1] esta en [2022-08-04]? 'SI' esta en [Presentes]? 'NO' Esta en [Ausentes]? 'SI' Contador.Ausentes +1 //2
 *
 *
 *
 */
export const Contar_Ausentes = async (mes = "08") => {
  let Ref = collection(db, "ASISTENCIAS");
  let Listado_Fechas = await getDocs(Ref);

  // let ausentes = Listado_Fechas.docs.map((elem) => elem.data().Data.ausentes);
  // let presentes = Listado_Fechas.docs.map((elem) => elem.data().Data.presentes);

  let Listado_Alumnos =
    (await Mostrar_Listado().then((list_alumno) =>
      list_alumno.map((alumno) => alumno.id)
    )) || [];

  //Aqui se almacenan el listado de todos los ausentes y presentes con sus dias e ids
  let Listado = [];

  let Contador_Ausentes = 0;
  let Fechas = Listado_Fechas.docs.filter((elem) => {
    if (elem.data().Fecha.split("-")[1] === mes) {
      let { ausentes, presentes } = elem.data().Data;
      console.log(ausentes);

      ausentes.filter((e) => {
        if (e === Listado_Alumnos[0]) {
          return Listado.push({
            ID: Listado_Alumnos[0],
            ausencias: Contador_Ausentes++,
          });
        }
      });
      // ausentes.map((e) =>
      //   e === Listado_Alumnos[0]
      //     ? Listado.push({
      //         ID: Listado_Alumnos[0],
      //         ausencias: Contador_Ausentes++,
      //       })
      //     : null
      // );
      return;
    }
  });

  // Fechas = Fechas.map((e) => console.log(e.data()));

  let Contador_Presentes = 0;

  // Bucles
  // let Listado_ausentes = Listado_Alumnos.map((elem) =>
  //   Fechas.map((e) =>
  //     e === null ? null : console.log(e.Data.ausentes === Listado_Alumnos[0])
  //   )
  // );

  // let Listado_ausentes = ausentes.filter((elem) =>
  //   elem.map((e) =>
  //     e === Listado_Alumnos[0]
  //       ? Listado.push({
  //           ID: Listado_Alumnos[0],
  //           ausencias: Contador_Ausentes++,
  //         })
  //       : null
  //   )
  // );

  // let Listado_ausentes = ausentes.filter(
  //   (
  //     elem //Arrays x dia
  //   ) =>
  //     elem.map(
  //       (
  //         e //Listados de los ID de todos los Arrays
  //       ) =>
  //         e === Listado_Alumnos[0]
  //           ? Listado.push({
  //               ID: Listado_Alumnos[0],
  //               ausencias: Contador_Ausentes++,
  //             })
  //           : null
  //     )
  // );

  let acum = 0;
  let contador = 0;
  let ref = "";

  // console.log("Lista de Alumnos", Listado_Alumnos[1]);
  // console.log("Listado_ausentes ", Listado_ausentes);
  console.log("Fechas", Fechas);
  console.log("Listado ", Listado);

  // let maximo = (await Mostrar_Listado().then()).length;

  // let id = await Listado_Alumnos; //Array de id de alumnos

  // while (contador < maximo) {
  //   querySnapshot.docs.map((e) => {
  //     let Array_Fechas = e.data().Fecha.split("-");
  //     if (Array_Fechas[1] === mes) {
  //       e.data().Data.ausentes.map((el) =>
  //         id[contador] === el
  //           ? acum++ && (ref = id[contador])
  //           : (ref = id[contador])
  //       );
  //     }
  //   });
  //   Array_Acumulador.push({ id: ref, coincidencias: acum });
  //   acum = 0;
  //   ref = "";
  //   contador++;
  // }
};

export const Contar_Presentes = async (mes = "08") => {
  //Pedir listado de Alumnos INSCRITOS
  let lista_alumnos = await Mostrar_Listado().then((elem) =>
    elem.map((el) => el.id)
  );
  let Agrupar_Presentes = [];
  let fechas = [];
  let contador = 0;
  let acum = 0;
  let identificador = "";
  let ref = await collection(db, "ASISTENCIAS");
  let querySnapshot = await getDocs(ref);
  let id = lista_alumnos;

  //Empezar Bucle
  querySnapshot.docs.map((e) => {
    let Array_Fechas = e.data().Fecha.split("-");
    if (Array_Fechas[1] === mes) {
      e.data().Data.presentes.filter((el) => {
        console.log(el);
        // id.map((elem) => elem === el)
        //   ? (identificador = el) && acum++ && console.log(el)
        //   : console.log("Nada...", el);
        return;
      });
      contador++;
    }
    Agrupar_Presentes.push({
      id: identificador,
      coincidencias: acum,
    });
    acum = 0;
    identificador = "";
    console.log("Agrupar_Presentes", Agrupar_Presentes);
  });
};
