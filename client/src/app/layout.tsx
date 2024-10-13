"use client"

import Footer from "../../components/Footer";
import MainNavbar from "../../components/MainNavbar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from "jsonwebtoken";
import "./globals.css";

interface DecodedJWT {
  userId: string; // Add other properties as needed
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
  const [userId, setUserId] = useState<number>(-1);

  const checkLoginStatus = () => {
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith("session")
    );

    if (!sessionCookie) {
      setIsLoggedIn(false);
      return false;
    }

    const token = sessionCookie.split("=")[1];

    if (!secretKey) {
      console.error("JWT secret key is undefined");
      setIsLoggedIn(false);
      return false;
    }

    try {
      // Verify and decode the JWT
      const decoded = jwt.verify(token, secretKey) as DecodedJWT;

      // Check if decoded is an object and has userId
      if (decoded && decoded.userId) {
        setIsLoggedIn(true);
        setUserId(Number(decoded.userId));
        return true;
      } else {
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error("Invalid or expired token:", error);
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    // Check login status initially
    // const loggedIn = checkLoginStatus();
    const loggedIn = true;
    const currentPath = window.location.pathname;

    if (
      !loggedIn &&
      ![
        "/login",
        "/register-patient",
        "/register-pt",
        "/register-onboard",
      ].includes(currentPath)
    ) {
      console.log("Redirecting to login"); // Log redirect action
      router.push("/login"); // Redirect to login if not logged in
    }

    // Add a storage event listener for cross-tab logout detection
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout") {
        console.log("Detected logout from another tab"); // Log cross-tab logout
        router.push("/login"); // Redirect to login
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange); // Cleanup listener
    };
  }, [router]);

  const handleLogout = () => {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.setItem("logout", Date.now().toString()); // Trigger storage event
    setIsLoggedIn(false); // Update state to logged out
    router.push("/login"); // Redirect to login
  };

  return (
    <html>
      <body>
        <div className="h-screen">
          <header className="h-[10%]">
            <MainNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </header>
          <main className="h-[80%] overflow-hidden">{children}</main>
          <footer className="h-[10%]">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
