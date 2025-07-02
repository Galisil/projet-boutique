import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

interface RequiredPasswordFormProps {
  onSubmit: (userId: number | null, password: string) => Promise<void>;
}

export default function RequiredPasswordForm({
  onSubmit,
}: RequiredPasswordFormProps) {
  const [error, setError] = useState<string>("");
  const { userId } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const password = formData.get("password") as string;

      await onSubmit(userId, password);
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
      <div className="divRequiredPasswordForm">
        {error && <div className="error-message">{error}</div>}
        <form className="registerForm" onSubmit={handleSubmit}>
          <input
            className="btnForm"
            type="password"
            name="password"
            placeholder="mot de passe"
            required
          />
          <button className="submitBtnForm" type="submit">
            Valider
          </button>
        </form>
      </div>
      <div className="shopsListRedirect">
        <p>
          Retour à la liste des boutiques
          <button className="redirectBtn">
            {" "}
            <Link href={`/shop/shopsListPage?userId=${userId}`}>ici</Link>
          </button>
        </p>
      </div>
    </>
  );
}
