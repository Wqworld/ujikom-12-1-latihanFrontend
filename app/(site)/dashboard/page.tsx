"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TokenPayLoad {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. CEK DULU: Kalau gak ada token, langsung tendang. JANGAN decode dulu.
    if (!token) {
      router.push("/login");
      return; // Stop di sini, jangan lanjut ke bawah
    }

    try {
      // 2. Kalau token ada, baru decode
      const decode = jwtDecode<TokenPayLoad>(token);
      // 3. Set state
      setUserRole(decode.role);
      
    } catch (error) {
      // Jaga-jaga kalau tokennya rusak/palsu
      console.error("Token error:", error);
      toast.error("Token error" + error);
      localStorage.removeItem("token");
      router.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <--- PENTING: Kosongkan array ini biar cuma jalan 1x pas halaman dibuka

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Selamat Datang!</h1>
      <p>
        Anda login sebagai:{" "}
        <span className="font-bold text-emerald-600 uppercase">
          {userRole} 
        </span>
      </p>
    </div>
  );
}
