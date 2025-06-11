import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  authToken: string | null;
  btnLoginLogout: string | null;
  href: string;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [btnLoginLogout, setBtnLoginLogout] = useState<string>("");
  const [href, setHref] = useState<string>("/home");

  // Fonction pour mettre à jour l'état en fonction du token
  const updateAuthState = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        setBtnLoginLogout("Déconnexion");
        setHref("/home");
      } else {
        setAuthToken(null);
        setBtnLoginLogout("Connexion");
        setHref("/auth/login");
      }
    }
  };

  // Écouter les changements dans le localStorage
  useEffect(() => {
    // Mise à jour initiale
    updateAuthState();

    // Fonction pour écouter les changements
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        updateAuthState();
      }
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener("storage", handleStorageChange);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        updateAuthState();
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        updateAuthState();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authToken, btnLoginLogout, href, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
}
