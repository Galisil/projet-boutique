import CreateShopForm from "../../../components/shop/CreateShopForm/CreateShopForm";
import { useRouter } from "next/router";

export default function CreateShop() {
  const router = useRouter();

  const handleSubmit = async (name: string, description: string) => {
    try {
      const response = await fetch("/api/shop/registerShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de l'enregistrement de la boutique"
        );
      }

      if (data.success) {
        // Redirection vers la page de connexion
        router.push("/home"); //changer pour rediriger vers la boutique (/:id)
      } else {
        throw new Error(
          data.message || "Erreur lors de la création de la boutique"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propager l'erreur au composant RegisterForm
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

// export default function RegisterShop() {
//   const router = useRouter();

//   const handleSubmit = async (
//     email: string,
//     name: string,
//     password: string
//   ) => {
//     try {
//       const response = await fetch("/api/shop/registerShop", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           name,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Erreur lors de l'inscription");
//       }

//       if (data.success) {
//         // Redirection vers la page de connexion
//         router.push("/home");
//       } else {
//         throw new Error(data.message || "Erreur lors de la création de la boutique");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         throw error; // Propager l'erreur au composant RegisterShop
//       }
//       throw new Error("Une erreur est survenue lors de la création de la boutique");
//     }
//   };

//   return (
//     <>
//       <RegisterShop onSubmit={handleSubmit} />
//     </>
//   );
// }
