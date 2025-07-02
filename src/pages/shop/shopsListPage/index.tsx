import ShopsList from "../../../components/shop/ShopsList/ShopsList";
// import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

interface Shop {
  id: number;
  name: string;
}

export default function ShopsListPage() {
  // const router = useRouter();
  const { userId } = useAuth();

  const displayShopsList = async (): Promise<Shop[]> => {
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
        return data.shopsList;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  return (
    <>
      <ShopsList onLoad={displayShopsList} />
    </>
  );
}
