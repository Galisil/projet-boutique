import RequiredPassword from "../../../components/warnings/RequiredPassword/RequiredPassword";
import { useRouter } from "next/router";

export default function RequiredPasswordPage() {
  const router = useRouter();
  const { shopId } = router.query;

  const handleSubmit = async (userId: number | null, password: string) => {
    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }
    try {
      const response = await fetch("/api/warnings/requiredPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: Number(shopId),
          userId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      if (data.success) {
        // Redirection vers la page de gestion de la boutique
        router.push(`/shop/handleShop/${shopId}`);
      } else {
        throw new Error(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propager l'erreur au composant LoginForm
      }
      throw new Error("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <>
      <RequiredPassword onSubmit={handleSubmit} />
    </>
  );
}
