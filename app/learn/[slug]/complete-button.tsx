"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function complete() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/lessons/${encodeURIComponent(slug)}/complete`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ التقدم.");
      setMessage("تم حفظ إكمال الدرس في حسابك.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.");
    } finally { setBusy(false); }
  }

  return <div className="complete-control"><button className="button button-primary" onClick={complete} disabled={busy}>{busy ? "جارٍ الحفظ..." : "أكملت هذا الدرس"}</button>{message && <p role="status">{message}</p>}</div>;
}