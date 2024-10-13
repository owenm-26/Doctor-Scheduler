import Footer from "../../components/Footer";
import MainNavbar from "../../components/MainNavbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="h-screen">
          <header className="h-[10%]">
            <MainNavbar />
          </header>
          <main className="h-[80%] overflow-hidden">
            {children}
          </main>
          <footer className="h-[10%]">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
