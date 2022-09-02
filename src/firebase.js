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
  arrayUnion,
  arrayRemove,
  updateDoc,
  query,
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
    const docRef = await setDoc(doc(db, "ALUMNOS", alumno.id), alumno);
  } catch (error) {
    alert("No se pudo completar esta operacion");
  }
};
export const Eliminar_Alumno = async (alumno) => {
  try {
    let alumnoRef = collection(db, "ALUMNOS");
    await addDoc(alumnoRef, alumno).then(() => {
      alert("Alumno Eliminado");
    });
  } catch (error) {
    console.log(error);
  }
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

export const Busqueda_Por_Fecha = async (Fecha) => {
  let listadoRef = collection(db, "ASISTENCIAS");
  let q = query(listadoRef, where("Fecha", "==", Fecha)); //"2022-08-03"
  let querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  } else {
    console.log(querySnapshot.docs[0].data());
    return querySnapshot.docs[0].data();
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

export const Contar_Ausentes = async (mes = "08") => {
  let Ref = collection(db, "ASISTENCIAS");
  let querySnapshot = await getDocs(Ref);
  let Listado_Alumnos = [];
  let Array_Acumulador = [];
  let acum = 0;
  let contador = 0;
  let ref = "";
  Listado_Alumnos = Mostrar_Listado().then((list_alumno) =>
    list_alumno.map((alumno) => {
      return alumno.id;
    })
  );
  let maximo = (await Mostrar_Listado().then()).length;

  let id = await Listado_Alumnos; //Array de id de alumnos

  while (contador < maximo) {
    querySnapshot.docs.map((e) => {
      let Array_Fechas = e.data().Fecha.split("-");
      if (Array_Fechas[1] === mes) {
        e.data().Data.ausentes.map((el) =>
          id[contador] === el
            ? acum++ && (ref = id[contador])
            : (ref = id[contador])
        );
      }
    });
    Array_Acumulador.push({ id: ref, coincidencias: acum });
    acum = 0;
    ref = "";
    contador++;
  }
  console.log("Array", Array_Acumulador);
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
