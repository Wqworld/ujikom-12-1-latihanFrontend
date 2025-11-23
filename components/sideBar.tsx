"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import Image from "next/image";
import {
  Banknote,
  ClipboardCheckIcon,
  LayoutDashboard,
  LucideLogOut,
  MenuSquareIcon,
  Timer,
  User2,
  UserCog2,
  Users2,
} from "lucide-react";

interface TokenPayLoad {
  id: number;
  role: string;
  name: string;
  iat: number;
  exp: number;
}
export default function SideBar() {
  const path = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [userNama, setUserNama] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);

  const listMenu = [
    {
      nama: "Dashboard",
      link: "/dashboard",
      icon: LayoutDashboard,
      role: ["ADMIN", "KASIR"],
    },
    {
      nama: "Menus",
      link: "/menus",
      icon: MenuSquareIcon,
      role: ["ADMIN", "KASIR"],
    },
    {
      nama: "Member",
      link: "/members",
      icon: Users2,
      role: ["ADMIN", "KASIR"],
    },
    { nama: "Kasir", link: "/kasirs", icon: UserCog2, role: ["ADMIN"] },
    {
      nama: "Riwayat Order",
      link: "/orders",
      icon: Timer,
      role: ["ADMIN", "KASIR"],
    },
    {
      nama: "Promo",
      link: "/promos",
      icon: Banknote,
      role: ["ADMIN", "KASIR"],
    },
    {
      nama: "Laporan",
      link: "/laporans",
      icon: ClipboardCheckIcon,
      role: ["KASIR"],
    },
  ];

  const handleLogout = () =>{
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logout Berhasil"); 
  }

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
      setUserNama(decode.name);
    } catch (error) {
      // Jaga-jaga kalau tokennya rusak/palsu
      console.error("Token error:", error);
      toast.error("Token error" + error);
      localStorage.removeItem("token");
      router.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#F5F5F5] max-w-100 w-full h-screen px-6">
      <header className=" w-full h-40 border-b-5 border-[#68868C] flex justify-center items-center text-center">
        <Image
          src="/assets/mainLogo.png"
          alt="logo"
          width={1000}
          height={1000}
          className="mt-6 max-w-30"
        />
        <h1 className="text-5xl items-center font-bold mt-8 ml-2 text-[#68868C]">
          KasirKu
        </h1>
      </header>
      <div className="flex flex-col gap-2 mt-6 mx-5">
        {listMenu.map((item, index) => {
          if (item.role.includes(userRole)) {
            return (
              <div
                key={index}
                onClick={() => router.push(item.link)}
                className={`${
                  path === item.link
                    ? "bg-[#68868C] text-[#FFFFFF]"
                    : "bg-[#468284] text-[#FFFFFF] hover:bg-[#68868C] hover:text-white"
                } flex items-center gap-2 p-3 rounded-xl transition-all cursor-pointer border-5 border-[#404748]`}
              >
                <item.icon size={30} />
                <span>{item.nama}</span>
              </div>
            );
          }
        })}
      </div>
      <div className="justify-center items-center flex flex-col absolute bottom-20 w-full max-w-90 transition-all duration-500">
        {logoutPopup && (
          <button onClick={handleLogout} className="bg-[#468284] hover:bg-red-500 text-[#FFFFFF]  hover:text-white gap-2 p-1 flex rounded-xl transition-all duration-500 cursor-pointer border-5 border-[#404748] bottom-0 w-70 m-1 relative animate-in slide-in-from-bottom ">
            <LucideLogOut size={30} />
            <span className="text-lg">Logout</span>
          </button>
        )}
        <button
          onClick={() => setLogoutPopup(!logoutPopup)}
          className="bg-[#468284] text-[#FFFFFF] hover:bg-[#68868C] hover:text-white gap-2 p-3 flex rounded-xl transition-all cursor-pointer border-5 border-[#404748] bottom-0 w-full mx-5 relative"
        >
          <User2 size={30} />
          <span className="mt-1 text-lg">{userNama}</span>
        </button>
      </div>
    </div>
  );
}
