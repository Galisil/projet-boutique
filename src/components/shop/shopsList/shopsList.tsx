import Link from "next/link";
import "./ShopsList.scss";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ShopsList() {
  const [shops, setShops] = useState<any[]>([]);
  const { authToken } = useAuth();

  useEffect(() => {
    async function fetchShops() {
      if (!authToken) return;
      // Remplace cette partie par ta vraie requête API
      // const response = await fetch("/api/shops", { headers: { Authorization: `Bearer ${authToken}` } });
      // const data = await response.json();
      // setShops(data);
      setShops([]); // Simule "pas de boutique"
      // setShops([{ id: 1, name: "Ma boutique" }]); // Simule "au moins une boutique"
    }
    fetchShops();
  }, [authToken]);

  return (
    <>
      <h2>Mes boutiques</h2>
      {/*faire apparaître dynamiquement la liste (sous forme de cards) des shops gérés par l'utilisateur connecté*/}
      <div>
        Pas encore de boutique ? Cliquez{" "}
        <button className="redirect">
          <Link href="/shop/createShop">ici</Link>
        </button>{" "}
        pour en créer une !
      </div>
    </>
  );
}
