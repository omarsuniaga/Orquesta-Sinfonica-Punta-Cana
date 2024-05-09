import { ref } from "vue";
import { auth } from "src/firebase";

export default function useAuthState() {
  const user = ref(null);
  const error = ref(null);
  const isAuthenticated = ref(false);

  auth.onAuthStateChanged(
    (_user) => {
      if (_user) {
        user.value = _user;
        isAuthenticated.value = true;
      } else {
        user.value = null;
        isAuthenticated.value = false;
      }
    },
    (_error) => {
      error.value = _error;
    }
  );

  return { user, error, isAuthenticated };
}
