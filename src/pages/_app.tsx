/**
 * _app.tsx est le point d'entrée global de l'application Next.js.
 * Il enveloppe toutes les pages et permet de :
 * - Maintenir l'état entre les changements de pages
 * - Ajouter des styles globaux
 * - Configurer des providers globaux
 *
 * Le fichier doit rester dans le dossier 'pages' car c'est une convention Next.js.
 */

import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import "../styles/globals.scss";
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
