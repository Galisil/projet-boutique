import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  authToken: string | null;
  userId: number | null;
  btnLoginLogout: string | null;
  href: string;
  login: (token: string, userId: number) => void;
  logout: () => void;
  handleBtnShopRedirect: (redirect: (path: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [btnLoginLogout, setBtnLoginLogout] = useState<string>("");
  const [href, setHref] = useState<string>("/home");

  // Fonction pour mettre à jour l'état en fonction du token
  const updateAuthState = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      if (token && storedUserId) {
        setAuthToken(token);
        setUserId(parseInt(storedUserId, 10));
        setBtnLoginLogout("Déconnexion");
        setHref("/home");
      } else {
        setAuthToken(null);
        setUserId(null);
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

  const login = (token: string, userId: number) => {
    try {
      if (typeof window !== "undefined") {
        if (!userId || !token) {
          throw new Error("Token ou userId manquant");
        }
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId.toString());
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

  const handleBtnShopRedirect = (redirect: (path: string) => void) => {
    if (authToken) {
      redirect("/shop/shopsListPage");
    } else {
      redirect("/warnings/mustLogin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userId,
        btnLoginLogout,
        href,
        login,
        logout,
        handleBtnShopRedirect,
      }}
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
