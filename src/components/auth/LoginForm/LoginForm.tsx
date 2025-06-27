import { FormEvent, useState } from "react";
import Link from "next/link";

interface RegisterFormProps {
  onSubmit: (emailOrName: string, password: string) => Promise<void>;
}

export default function LoginForm({ onSubmit }: RegisterFormProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const emailOrName = formData.get("emailOrName") as string;
      const password = formData.get("password") as string;

      await onSubmit(emailOrName, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    }
  };

  return (
    <>
      <div className="divRegisterForm">
        {error && <div className="error-message">{error}</div>}
        <form className="registerForm" onSubmit={handleSubmit}>
          <input
            className="btnForm"
            type="text"
            name="emailOrName"
            placeholder="adresse mail ou pseudo d'utilisateur"
            required
          />
          <input
            className="btnForm"
            type="password"
            name="password"
            placeholder="mot de passe"
            required
          />
          <button className="submitBtnForm" type="submit">
            Se connecter
          </button>
        </form>
      </div>
      <div className="loginFormRedirect">
        <p>
          Pas encore de compte ? Enregistrez-vous en cliquant{" "}
          <button className="btnRegister">
            {" "}
            <Link href="/auth/register">ici</Link>
          </button>
        </p>
      </div>
    </>
  );
}
