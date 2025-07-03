import { FormEvent, useState } from "react";

interface ModalAdminFormProps {
  onSubmit: (email: string, name: string, password: string) => Promise<void>;
}

export default function ModalAdminForm({ onSubmit }: ModalAdminFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onSubmit(formData.email, formData.name, formData.password);
      // Réinitialiser le formulaire après soumission réussie
      setFormData({ email: "", name: "", password: "" });
    } catch (error) {
      // L'erreur sera gérée par le composant parent (HandleShop)
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <>
      <form className="modalAdminForm" onSubmit={handleSubmit}>
        <input
          className="btnForm"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Entrez le mail de l'utilisateur"
          required
        />
        <input
          className="btnForm"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Entrez le pseudo de l'utilisateur"
          required
        />
        <input
          className="btnForm"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Entrez le mot de passe de la boutique"
          required
        />
        <button className="submitBtnForm" type="submit">
          Valider le nouvel administrateur
        </button>
      </form>
    </>
  );
}
