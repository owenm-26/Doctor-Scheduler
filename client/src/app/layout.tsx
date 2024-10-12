import Footer from "../../components/Footer";
import MainHeader from "../../components/MainNavbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <MainHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
