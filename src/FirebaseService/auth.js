// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
//   setPersistence,
//   browserSessionPersistence,
// } from "firebase/auth";

// import { firebaseConfig } from "./constants";

// // Inicializa la aplicación Firebase con la configuración especificada.
// const app = initializeApp(firebaseConfig);

// // Obtiene la instancia de autenticación de Firebase.
// const auth = getAuth(app);
// auth.languageCode = "es"; // Establece el código de idioma predeterminado para la autenticación.
// auth.useDeviceLanguage(); // Utiliza el idioma del dispositivo para la autenticación.

// /**
//  * Inicia sesión en Firebase utilizando email y contraseña.
//  * @param {string} email - El correo electrónico del usuario.
//  * @param {string} password - La contraseña del usuario.
//  * @returns {Promise<Firebase.User>} Una promesa que resuelve al objeto usuario de Firebase.
//  */
// export async function signIn(email, password) {
//   try {
//     // Intenta iniciar sesión con las credenciales proporcionadas.
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     return userCredential.user;
//   } catch (error) {
//     // Registra y re-lanza el error si el inicio de sesión falla.
//     console.error("Error al iniciar sesión: ", error);
//     throw error;
//   }
// }

// /**
//  * Cierra la sesión del usuario actual en Firebase.
//  * @returns {Promise<void>} Una promesa que se resuelve cuando el usuario ha cerrado sesión.
//  */
// export async function signOutUser() {
//   try {
//     // Cierra la sesión del usuario actual.
//     await signOut(auth);
//     console.log("Usuario ha cerrado sesión exitosamente");
//   } catch (error) {
//     // Registra y re-lanza el error si el cierre de sesión falla.
//     console.error("Error al cerrar sesión: ", error);
//     throw error;
//   }
// }

// /**
//  * Observa los cambios en el estado de autenticación del usuario.
//  * @param {function} changeHandler - Función que maneja los cambios de estado.
//  */
// export function watchAuthState(changeHandler) {
//   onAuthStateChanged(auth, changeHandler);
// }

// /**
//  * Inicializa la sesión automáticamente al cargar la aplicación.
//  * Utiliza 'onAuthStateChanged' para detectar si el usuario ya está autenticado.
//  * @returns {Promise<Firebase.User|null>} Una promesa que resuelve al usuario actual o null si no está autenticado.
//  */
// export async function initializeSession() {
//   return new Promise((resolve, reject) => {
//     watchAuthState((user) => {
//       if (user) {
//         // Usuario está autenticado, resuelve con el objeto usuario.
//         resolve(user);
//       } else {
//         // No hay usuario autenticado, resuelve con null.
//         resolve(null);
//       }
//     });
//   });
// }
