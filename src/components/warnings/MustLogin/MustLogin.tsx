import Link from "next/link";
// import { useRouter } from "next/router";

// interface MustLoginProps {
//   onLoad: () => void;
// }

export default function MustLogin() {
  return (
    <div className="mustLoginRedirect">
      <p>Vous devez vous connecter pour créer une boutique</p>
      <ul className="btnsRedirect">
        <li>
          <Link href="/auth/login">Je m&apos;authentifie</Link>
        </li>
        <li>
          <Link href="/auth/register">Je m&apos;inscris</Link>
        </li>
      </ul>
    </div>
  );
}
