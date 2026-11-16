"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }
  return <button type="button" className="button button-quiet" onClick={signOut}>تسجيل الخروج</button>;
}