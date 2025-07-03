import { useRouter } from "next/router";
import { useState } from "react";
import ModalAdminForm from "../ModalAdminForm/ModalAdminForm";

interface ShopDetails {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface HandleShopProps {
  shopDetails: ShopDetails;
}

export default function HandleShop({ shopDetails }: HandleShopProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (
    email: string,
    name: string,
    password: string
  ) => {
    setError("");

    try {
      const response = await fetch(
        `/api/tenants/handleShop/${shopDetails.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création de l'administrateur"
        );
      }

      // Fermer la modale après soumission réussie
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Une erreur est survenue lors de la création de l'administrateur"
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  return (
    <div>
      <h1>Gestion de la boutique : {shopDetails.name}</h1>
      <div>
        <p>
          <strong>ID :</strong> {shopDetails.id}
        </p>
        <p>
          <strong>Nom :</strong> {shopDetails.name}
        </p>
        <p>
          <strong>Créée le :</strong>{" "}
          {new Date(shopDetails.createdAt).toLocaleDateString("fr-FR")}
        </p>
        <p>
          <strong>Modifiée le :</strong>{" "}
          {new Date(shopDetails.updatedAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <button onClick={() => router.push("/shop/shopsListPage")}>
        Retour à la liste des boutiques
      </button>
      <div className="container-btn-redirect">
        Cliquez{" "}
        <button className="redirectBtn" onClick={() => setIsModalOpen(true)}>
          ici
        </button>{" "}
        pour ajouter un nouvel administrateur à la boutique.
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            {error && <div className="error-message">{error}</div>}
            <ModalAdminForm onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}
