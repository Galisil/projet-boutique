import LoginForm from "../../../components/auth/LoginForm/LoginForm";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (emailOrName: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      if (data.success && data.token) {
        // Utiliser la fonction login du contexte pour mettre à jour l'état
        console.log("DATA: ", data);
        login(data.token, data.userId);
        // Redirection vers la page home
        router.push("/home");
      } else {
        throw new Error(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propager l'erreur au composant LoginForm
      }
      throw new Error("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <>
      <LoginForm onSubmit={handleSubmit} />
    </>
  );
}
