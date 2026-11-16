"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await authClient.signIn.email({ email, password, callbackURL: "/dashboard" });
    setBusy(false);
    if (result.error) setError("تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.");
    else router.push("/dashboard");
  }

  return <main className="auth-shell"><Link href="/" className="auth-brand">مسار الرخصة</Link><section className="auth-card">
    <span className="section-kicker">مرحباً بعودتك</span><h1>سجّل دخولك</h1><p>تابع تقدمك وواصل التعلم من حيث توقفت.</p>
    <form onSubmit={submit} className="auth-form">
      <label>البريد الإلكتروني<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>كلمة المرور<input type="password" autoComplete="current-password" required minLength={10} value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "جارٍ الدخول..." : "تسجيل الدخول"}</button>
    </form>
    <div className="auth-switch">ليس لديك حساب؟ <Link href="/register">أنشئ حساباً جديداً</Link></div>
  </section><p className="auth-note">لا تستخدم كلمة مرور أبشر هنا. أنشئ كلمة مرور مستقلة للمنصة.</p></main>;
}