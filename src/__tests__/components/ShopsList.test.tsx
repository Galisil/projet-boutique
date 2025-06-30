import React from "react";
import { render, screen } from "@testing-library/react";
import ShopsList from "../../components/shop/ShopsList/ShopsList";

// Mock de Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("ShopsList Component", () => {
  it("devrait afficher le bouton 'créer une boutique ici' quand la liste est vide", () => {
    render(<ShopsList shops={[]} />);

    // Vérifier que le texte du bouton est présent
    expect(screen.getByText("ici")).toBeInTheDocument();
    expect(
      screen.getByText("Pas encore de boutique ? Cliquez")
    ).toBeInTheDocument();
    expect(screen.getByText("pour en créer une !")).toBeInTheDocument();

    // Vérifier que le lien pointe vers la bonne page
    const link = screen.getByRole("link", { name: "ici" });
    expect(link).toHaveAttribute("href", "/shop/createShop");
  });

  it("devrait afficher la liste des boutiques quand il y en a", () => {
    const mockShops = ["Boutique 1", "Boutique 2"];
    render(<ShopsList shops={mockShops} />);

    // Vérifier que les boutiques sont affichées
    expect(screen.getByText("Boutique 1")).toBeInTheDocument();
    expect(screen.getByText("Boutique 2")).toBeInTheDocument();

    // Vérifier que le bouton de création n'est pas présent
    expect(screen.queryByText("ici")).not.toBeInTheDocument();
  });
});
