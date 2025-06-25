import "./CreateShopForm.scss";
import { FormEvent, useState } from "react";

interface CreateShopFormProps {
  onSubmit: (
    name: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export default function CreateShopForm({ onSubmit }: CreateShopFormProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      // Validation des champs

      await onSubmit(name, password, confirmPassword);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue lors de la création de la boutique");
      }
    }
  };

  return (
    <>
      <div className="divCreateShopForm">
        {error && <div className="error-message">{error}</div>}
        <form className="createShopForm" onSubmit={handleSubmit}>
          <input
            className="btnForm"
            type="name"
            name="name"
            placeholder="Donnez un nom à votre boutique"
            required
          />
          <input
            className="btnForm"
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
          />
          <input
            className="btnForm"
            type="password"
            name="confirmPassword"
            placeholder="Confirmation de votre mot de passe"
            required
          />
          <button className="submitBtnForm" type="submit">
            Créer ma boutique
          </button>
        </form>
      </div>
    </>
  );
}
