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

  const checkLoginStatus = () => {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(cookie => cookie.startsWith('session'));
    console.log("Current Cookies:", cookies); // Log all cookies
    console.log("Is Logged In:", sessionCookie); // Check if session cookie exists
    setIsLoggedIn(!!sessionCookie); // Update state based on cookie presence
    return !!sessionCookie;
  };

  useEffect(() => {
    // Check login status initially
    const loggedIn = checkLoginStatus();
    const currentPath = window.location.pathname;
    console.log("Current Path:", currentPath); // Log current path

    if (!loggedIn && !['/login', '/register-patient', '/register-pt', '/register-onboard'].includes(currentPath)) {
      console.log("Redirecting to login"); // Log redirect action
      router.push('/login'); // Redirect to login if not logged in
    }

    // Add a storage event listener for cross-tab logout detection
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'logout') {
        console.log("Detected logout from another tab"); // Log cross-tab logout
        router.push('/login'); // Redirect to login
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange); // Cleanup listener
    };
  }, [router]);

  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.setItem('logout', Date.now().toString()); // Trigger storage event
    setIsLoggedIn(false); // Update state to logged out
    router.push('/login'); // Redirect to login
  };

  return (
    <html>
      <body>
        <div className="h-screen">
          <header className="h-[10%]">
            <MainNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
