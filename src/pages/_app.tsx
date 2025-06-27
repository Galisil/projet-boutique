/**
 * _app.tsx est le point d'entrée global de l'application Next.js.
 * Il enveloppe toutes les pages et permet de :
 * - Maintenir l'état entre les changements de pages
 * - Ajouter des styles globaux
 * - Configurer des providers globaux
 *
 * Le fichier doit rester dans le dossier 'pages' car c'est une convention Next.js.
 */

// Styles globaux
import "../styles/globals.scss";

// Styles des composants
import "../components/Banner/Banner.scss";
import "../components/Footer/Footer.scss";
import "../components/Header/Header.scss";
import "../components/auth/LoginForm/LoginForm.scss";
import "../components/auth/RegisterForm/RegisterForm.scss";
import "../components/shop/CreateShopForm/CreateShopForm.scss";
import "../components/shop/ShopsList/ShopsList.scss";
import "../components/warnings/Disconnected/Disconnected.scss";
import "../components/warnings/MustLogin/MustLogin.scss";

import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
