"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import SplashScreen from "./SplashScreen";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const userLogged = window.localStorage.getItem("isUserLogged");

    if (userLogged) {
      router.push("/home");
    }

    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) return <SplashScreen />;

  return <>{children}</>;
};

export default AuthRedirect;
