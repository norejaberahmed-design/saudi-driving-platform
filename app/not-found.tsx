import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <p style={{ color: "#245b49", fontWeight: 700 }}>404</p>
        <h1>هذه الصفحة غير متاحة</h1>
        <p style={{ color: "#718078" }}>قد يكون الرابط غير صحيح أو أن الصفحة لم تُنشأ بعد.</p>
        <Link href="/" style={{ color: "#245b49", fontWeight: 700 }}>العودة إلى الرئيسية ←</Link>
      </div>
    </main>
  );
}