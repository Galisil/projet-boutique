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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      if (data.success) {
        // Redirection vers la page de connexion
        router.push("/auth/login");
      } else {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propager l'erreur au composant RegisterForm
      }
      throw new Error("Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <>
      <RegisterForm onSubmit={handleSubmit} />
    </>
  );
}
