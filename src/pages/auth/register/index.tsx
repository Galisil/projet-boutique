import RegisterForm from "../../../components/auth/RegisterForm/RegisterForm";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (
    email: string,
    name: string,
    password: string
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      const data = await response.json();

      if (data.success && data.token) {
        // Stocker le token dans le localStorage
        localStorage.setItem("token", data.token);
        // Redirection vers la page de connexion ou le dashboard
        router.push("/auth/login");
      } else {
        // Gérer l'erreur (afficher un message à l'utilisateur)
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
      // Gérer l'erreur (afficher un message à l'utilisateur)
    }
  };

  return (
    <>
      <RegisterForm onSubmit={handleSubmit} />
    </>
  );
}
