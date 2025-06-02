import "./CreateShopForm.scss";
import { FormEvent, useState } from "react";

interface CreateShopFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
}

export default function CreateShopForm({ onSubmit }: CreateShopFormProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;

      // Validation des champs

      await onSubmit(name, description);
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
        {/*{error && <div className="error-message">{error}</div>}*/}
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
            type="text"
            name="description"
            placeholder="Décrivez votre boutique en quelques mots"
            required
          />
          <input
            type="image"
            id="logo-shop"
            alt="logo-boutique"
            src="../../../public/images/{image-du-user}"
            width={40}
            height={40}
          />
          <button className="submitBtnForm" type="submit">
            Créer ma boutique
          </button>
        </form>
      </div>
    </>
  );
}
