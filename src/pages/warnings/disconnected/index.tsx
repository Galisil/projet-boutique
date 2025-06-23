import Disconnected from "../../../components/warnings/Disconnected/Disconnected";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function DisconnectedPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const redirect = useCallback(() => {
    setTimeout(() => {
      router.push("/home");
      logout();
    }, 1500);
  }, [router, logout]);

  return (
    <>
      <Disconnected onLoad={redirect} />
    </>
  );
}
