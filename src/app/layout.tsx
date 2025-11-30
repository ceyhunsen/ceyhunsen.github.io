import type { Metadata } from "next";
import "./theme.css";
import Footer from "@/_components/ui/footer";
import Nav from "@/_components/ui/nav";
import { Main } from "@/_components/ui/main";

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
        <Nav />

        <Main>{children}</Main>

        <Footer />
      </body>
    </html>
  );
}
