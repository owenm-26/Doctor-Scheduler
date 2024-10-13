"use client"

import Footer from "../../components/Footer";
import MainNavbar from "../../components/MainNavbar";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const isLoggedIn = cookies.find(cookie => cookie.startsWith('session'));
    console.log("Current Cookies:", cookies); // Check all cookies
    console.log("Is Logged In:", isLoggedIn); // Check if session cookie is found

    const currentPath = window.location.pathname;
    console.log("Current Path:", currentPath); // Log current path

    if (!isLoggedIn && !['/login', '/register-patient', '/register-pt', '/register-onboard'].includes(currentPath)) {
      console.log("Redirecting to login"); // Log redirect
      router.push('/login');
    }
  }, [router]);

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
