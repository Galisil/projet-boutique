/**
 * _app.tsx est le point d'entrée global de l'application Next.js.
 * Il enveloppe toutes les pages et permet de :
 * - Maintenir l'état entre les changements de pages
 * - Ajouter des styles globaux
 * - Configurer des providers globaux
 *
 * Le fichier doit rester dans le dossier 'pages' car c'est une convention Next.js.
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
