import "next-auth";

declare module "next-auth" {
  /**
   * Modèle User retourné par la fonction `session` et `jwt`
   */
  interface User {
    id: number;
  }

  /**
   * Modèle Session retourné par `useSession`, `getSession` et reçu en props par le `SessionProvider`
   */
  interface Session {
    user: User;
  }
}
