import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

interface DisplayShopsListProps {
  onLoad: (
    shopsList: Array<string>
    // link: string,
    // image: string,
  ) => Promise<unknown>;
}

export default function ShopsList({ onLoad }: DisplayShopsListProps) {
  const [shops, setShops] = useState<string[]>([]);
  const { authToken } = useAuth();

  useEffect(() => {
    async function fetchShops() {
      if (!authToken) return;
      try {
        const result = await onLoad([]); // Appel de la fonction onLoad pour récupérer les boutiques
        // Mettre à jour l'état avec les données reçues
        if (Array.isArray(result)) {
          setShops(result);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des boutiques:", error);
      }
    }
    fetchShops();
  }, [authToken, onLoad]);

  return (
    <div className="container-shopsList">
      <h2 className="shopsList-title">Mes boutiques</h2>
      <div className="container-shops-cards">
        <ul className="shopsList-cards">
          {shops.length > 0 || shops.length ? (
            shops.map((shop, index) => <li key={index}>{shop}</li>)
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
