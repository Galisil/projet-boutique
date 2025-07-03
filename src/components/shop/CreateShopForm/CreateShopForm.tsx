import { FormEvent, useState } from "react";

interface CreateShopFormProps {
  onSubmit: (formData: {
    name: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  error?: string;
}

export default function CreateShopForm({
  onSubmit,
  error,
}: CreateShopFormProps) {
  const [localError, setLocalError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation visuelle uniquement
    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await onSubmit({ name, password, confirmPassword });
    } catch (error) {
      // L'erreur sera gérée par la page
      console.error("Erreur dans le formulaire:", error);
    }
  };

  const displayError = error || localError;

  return (
    <div className="divCreateShopForm">
      {displayError && <div className="error-message">{displayError}</div>}
      <form className="createShopForm" onSubmit={handleSubmit}>
        <input
          className="btnForm"
          type="text"
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
  );
}
