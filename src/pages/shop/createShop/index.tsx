import CreateShopForm from "../../../components/shop/CreateShopForm/CreateShopForm";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

export default function CreateShop() {
  const router = useRouter();
  const { userId } = useAuth();

  const handleSubmit = async (
    name: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    if (password !== confirmPassword) {
      throw new Error("Les mots de passe ne correspondent pas.");
    }

    if (!userId) {
      throw new Error("Utilisateur non trouvé. Veuillez vous reconnecter.");
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
        throw new Error(
          data.message || "Erreur lors de la création de la boutique"
        );
      }

      if (data.success) {
        // Redirection vers la page de connexion
        router.push("/home"); //changer pour aller vers la page gestion du shop
      } else {
        throw new Error(
          data.message || "Erreur lors de la création de la boutique"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Une erreur est survenue lors de la création de la boutique"
      );
    }
  };

  return (
    <>
      <CreateShopForm onSubmit={handleSubmit} />
    </>
  );
}
