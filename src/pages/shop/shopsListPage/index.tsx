import ShopsList from "../../../components/shop/ShopsList/ShopsList";
// import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

export default function ShopsListPage() {
  // const router = useRouter();
  const { userId } = useAuth();

  const displayShopsList = async () => {
    try {
      const response = await fetch(`/api/tenants/shopsList?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      if (data.success && Array.isArray(data.shopsList)) {
        console.log("VOILA la shoplist: ", data.shopsList);
        const filteredShopsList = Array.isArray(data.shopsList)
          ? data.shopsList.filter((shop: string) => shop !== "Public")
          : [];
        if (filteredShopsList.length > 0) {
          return filteredShopsList;
        } else {
          return [];
        }
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ShopsList onLoad={displayShopsList} />
    </>
  );
}
