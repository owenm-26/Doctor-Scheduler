"use client"

import Footer from "../../components/Footer";
import MainNavbar from "../../components/MainNavbar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(cookie => cookie.startsWith('session'));
    console.log("Current Cookies:", cookies); // Check all cookies
    console.log("Is Logged In:", sessionCookie); // Check if session cookie is found

    setIsLoggedIn(!!sessionCookie);

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
            <MainNavbar isLoggedIn={isLoggedIn}/>
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
