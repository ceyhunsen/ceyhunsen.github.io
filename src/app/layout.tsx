import type { Metadata } from "next";
import "../_components/css/global.css";
import $footer from "@/_components/footer/footer";
import $navigationPane from "@/_components/navigation_bar/navigation";

export const metadata: Metadata = {
  title: "Ceyhun Şen",
  description: "Ceyhun Şen's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {$navigationPane()}

        <main>
          <div className="page_outline">{children}</div>
        </main>

        {$footer()}
      </body>
    </html>
  );
}
