import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

interface Shop {
  id: number;
  name: string;
}

interface DisplayShopsListProps {
  onLoad: (
    shopsList: Array<Shop>
    // link: string,
    // image: string,
  ) => Promise<Shop[]>;
}

export default function ShopsList({ onLoad }: DisplayShopsListProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    async function fetchShops() {
      if (!authToken) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const result = await onLoad([]); // Appel de la fonction onLoad pour récupérer les boutiques
        // Mettre à jour l'état avec les données reçues
        if (Array.isArray(result)) {
          setShops(result);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des boutiques:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShops();
  }, [authToken, onLoad]);

  return (
    <div className="container-shopsList">
      <h2 className="shopsList-title">Mes boutiques</h2>
      <div className="container-shops-cards">
        <ul className="shopsList-cards">
          {isLoading ? (
            <li>
              <div className="loading-message">Chargement des boutiques...</div>
            </li>
          ) : shops.length > 0 ? (
            shops.map((shop) => (
              <li key={shop.id}>
                <Link href={`/warnings/requiredPassword?shopId=${shop.id}`}>
                  {shop.name}
                </Link>
              </li>
            ))
          ) : (
            <li>
              <div className="container-btn-redirect">
                Pas encore de boutique ? Cliquez{" "}
                <button className="redirectBtn">
                  <Link href="/shop/createShop">ici</Link>
                </button>{" "}
                pour en créer une !
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
