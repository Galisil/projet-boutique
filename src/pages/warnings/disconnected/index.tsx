import Disconnected from "../../../components/warnings/Disconnected/Disconnected";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function DisconnectedPage() {
  const router = useRouter();

  const redirect = useCallback(() => {
    setTimeout(() => {
      router.push("/home");
    }, 1500);
  }, [router]);

  return (
    <>
      <Disconnected onLoad={redirect} />
    </>
  );
}
