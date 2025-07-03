import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import HandleShop from "../../../components/shop/HandleShop/HandleShop";

interface ShopDetails {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function HandleShopPage() {
  const router = useRouter();
  const { id } = router.query;
  const { authToken, userId } = useAuth();
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShopDetails() {
      if (!id || !authToken || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/tenants/handleShop/${id}?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Erreur lors de la récupération de la boutique"
          );
        }

        if (data.success) {
          setShopDetails(data.shop);
        } else {
          setError(
            data.message || "Erreur lors de la récupération de la boutique"
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la boutique:", error);
        setError(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    fetchShopDetails();
  }, [id, authToken, userId]);

  if (loading) {
    return <div>Chargement de la boutique...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Erreur</h1>
        <p>{error}</p>
        <button onClick={() => router.push("/shop/shopsListPage")}>
          Retour à la liste des boutiques
        </button>
      </div>
    );
  }

  if (!shopDetails) {
    return (
      <div>
        <h1>Boutique non trouvée</h1>
        <button onClick={() => router.push("/shop/shopsListPage")}>
          Retour à la liste des boutiques
        </button>
      </div>
    );
  }

  return <HandleShop shopDetails={shopDetails} />;
}
