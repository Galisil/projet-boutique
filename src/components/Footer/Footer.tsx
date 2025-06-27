import logoInstagram from "../../../public/images/logo-instagram.svg";
import logoFacebook from "../../../public/images/logo-facebook.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="footer-container">
      <ul className="list-footer">
        <li className="li-footer">Conditions générales de vente</li>
        <li className="li-footer">Contact</li>
        <li className="li-footer">truc qui fait pro avec le petit © là</li>
        <li className="li-footer">blablabla</li>
        <li className="li-footer">bref on a compris</li>
      </ul>
      <ul className="footer-networks">
        <li className="li-networks">
          <a target="_blank" href="https://www.facebook.com/">
            <Image
              src={logoFacebook}
              alt="logo facebook"
              width={40}
              height={40}
            />
          </a>
        </li>
        <li className="li-networks">
          <a target="_blank" href="https://www.instagram.com/">
            <Image
              src={logoInstagram}
              alt="logo instagram"
              width={40}
              height={40}
            />
          </a>
        </li>
      </ul>
    </div>
  );
}
