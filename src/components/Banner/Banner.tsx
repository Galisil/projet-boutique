import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.svg";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

export default function Banner() {
  const router = useRouter();
  const { btnLoginLogout, href, handleBtnShopRedirect, logout } = useAuth();

  const handleAuthClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (btnLoginLogout === "Déconnexion") {
      event.preventDefault(); // Empêche le Link de naviguer tout de suite
      logout();
      router.push("/warnings/disconnected");
    }
  };

  return (
    <div className="div-banner">
      <Image src={logo} width={100} height={100} alt="logo" />
      <h1 className="banner-title">Artlantide</h1>
      <nav>
        <ul className="banner-nav-container">
          <li className="banner-nav-li">
            <Link href="/home">Accueil</Link>
          </li>
          <li className="banner-nav-li">
            <Link href="/about">A propos</Link>{" "}
            {/*remplacer lien qd j'aurais fait une page à propos*/}
          </li>
          <li className="banner-nav-li">
            <button
              onClick={() => handleBtnShopRedirect(router.push)}
              className="banner-nav-li"
            >
              Ma boutique
            </button>
          </li>
          <li className="banner-nav-li">
            <Link
              href={href}
              className="banner-nav-li"
              onClick={handleAuthClick}
            >
              {btnLoginLogout}
            </Link>
          </li>
          <li className="banner-nav-li">
            <Link href="/auth/register">Inscription</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
