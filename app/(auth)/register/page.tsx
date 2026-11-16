"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await authClient.signUp.email({ name, email, password, callbackURL: "/dashboard" });
    setBusy(false);
    if (result.error) setError("تعذر إنشاء الحساب. قد يكون البريد مستخدماً أو أن إعداد قاعدة البيانات غير مكتمل.");
    else router.push("/dashboard");
  }

  return <main className="auth-shell"><Link href="/" className="auth-brand">مسار الرخصة</Link><section className="auth-card">
    <span className="section-kicker">ابدأ رحلتك</span><h1>أنشئ حسابك</h1><p>احفظ نتائجك وتابع تقدمك التعليمي.</p>
    <form onSubmit={submit} className="auth-form">
      <label>الاسم<input autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={e=>setName(e.target.value)} /></label>
      <label>البريد الإلكتروني<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>كلمة المرور<input type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} /><small>10 أحرف على الأقل. استخدم كلمة مرور لا تستعملها في خدمات أخرى.</small></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}</button>
    </form>
    <div className="auth-switch">لديك حساب؟ <Link href="/login">سجّل الدخول</Link></div>
  </section><p className="auth-note">لن نطلب كلمة مرور أبشر أو رمز التحقق الخاص بك.</p></main>;
}