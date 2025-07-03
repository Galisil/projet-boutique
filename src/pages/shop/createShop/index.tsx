import CreateShopForm from "../../../components/shop/CreateShopForm/CreateShopForm";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

export default function CreateShop() {
  const router = useRouter();
  const { userId } = useAuth();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: {
    name: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> => {
    setError("");

    const { name, password, confirmPassword } = formData;

    // Validation métier
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!userId) {
      setError("Utilisateur non trouvé. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch("/api/tenants/createShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de la création de la boutique");
        return;
      }

      if (data.success) {
        // Redirection vers la page de gestion du shop
        router.push("/home"); //changer pour aller vers la page gestion du shop
      } else {
        setError(data.message || "Erreur lors de la création de la boutique");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setError("Une erreur est survenue lors de la création de la boutique");
    }
  };

  return <CreateShopForm onSubmit={handleSubmit} error={error} />;
}
