import { useEffect } from "react";

interface DisconnectedProps {
  onLoad: () => void;
}

export default function Disconnected({ onLoad }: DisconnectedProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className="redirectPage">
      <h2>Déconnexion ...</h2>
      <p>
        Vous allez être redirigé vers la page d&apos;accueil dans un instant
      </p>
    </div>
  );
}
