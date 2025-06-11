import "./RegisterForm.scss";
import { FormEvent, useState } from "react";
import Link from "next/link";

interface RegisterFormProps {
  onSubmit: (email: string, name: string, password: string) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const confirmEmail = formData.get("confirmEmail") as string;
      const name = formData.get("name") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      // Validation des champs
      if (email !== confirmEmail) {
        setError("Les adresses email ne correspondent pas");
        return;
      }

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      await onSubmit(email, name, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
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
            type="email"
            name="email"
            placeholder="email"
            required
          />
          <input
            className="btnForm"
            type="email"
            name="confirmEmail"
            placeholder="confirmer email"
            required
          />
          <input
            className="btnForm"
            type="text"
            name="name"
            placeholder="pseudo"
            required
          />
          <input
            className="btnForm"
            type="password"
            name="password"
            placeholder="mot de passe"
            required
          />
          <input
            className="btnForm"
            type="password"
            name="confirmPassword"
            placeholder="confirmer mot de passe"
            required
          />
          <button className="submitBtnForm" type="submit">
            S&apos;inscrire
          </button>
        </form>
      </div>
      <div className="redirect">
        <p>
          Déjà membre ? Cliquez{" "}
          <button className="btnLogin">
            <Link href="/auth/login">ici</Link>
          </button>{" "}
          pour vous connecter.
        </p>
      </div>
    </>
  );
}

//pour supprimer l'erreur de l'apostrophe, écrire d&apos; et S&apos;
