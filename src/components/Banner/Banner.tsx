import "./Banner.scss";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.svg";

export default function Banner() {
  return (
    <div className="div-banner">
      <Image src={logo} width={100} height={100} alt="logo" />
      <h1 className="banner-title">Artlantide</h1>
      <nav>
        <ul className="banner-nav-container">
          <li className="banner-nav-li">
            <Link href="/home">accueil</Link>
          </li>
          <li className="banner-nav-li">
            <Link href="/home">à propos</Link>{" "}
            {/*remplacer lien qd j'aurais fait une page à propos*/}
          </li>
          <li className="banner-nav-li">
            <Link href="/auth/login">connexion</Link>
          </li>
          <li className="banner-nav-li">
            <Link href="/auth/register">inscription</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
