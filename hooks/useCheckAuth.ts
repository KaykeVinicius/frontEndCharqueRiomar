"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useCheckAuth() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const isLoginPage = pathname === "/login";

      // 🚫 Se não tem token E não está na página de login → vai para login
      if (!token && !isLoginPage) {
        router.push("/login");
        return;
      }

      // ✅ Se tem token E está na página de login → vai para home
      if (token && isLoginPage) {
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  return { loading };
}