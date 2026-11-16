import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "مسار الرخصة | تعلم واستعد للقيادة",
    template: "%s | مسار الرخصة"
  },
  description: "منصة تعليمية مستقلة للتوعية المرورية والاستعداد لاختبارات القيادة في المملكة العربية السعودية.",
  applicationName: "مسار الرخصة",
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: "مسار الرخصة", statusBarStyle: "default" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f7f4"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}