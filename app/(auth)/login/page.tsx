"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import {  useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!username || !password) {
      setError("Username dan password harus diisi");
      setLoading(false);
      return;
    }else if (!username) {
      setError("Username harus diisi");
      setLoading(false);
      return;
    }else if (!password) {
      setError("Password harus diisi");
      setLoading(false);
      return;
    }

    try {
      //tembak ke backend
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      //ambil tokennya dan simpen di localstorage
      const { token } = response.data;
      localStorage.setItem("token", token);

      router.push("/");
      toast.success("Login Berhasil");
    } catch (err) {
      // Kita cek apakah error ini beneran dari Axios?
      if (err instanceof AxiosError) {
        // Sekarang TypeScript tahu ini AxiosError, jadi .response boleh diakses
        const msg = err.response?.data?.message;
        setError(msg || "Login Gagal");
        toast.error(msg || "Login Gagal");
      } else {
        // Kalau error lain (misal codingan error)
        setError("Terjadi kesalahan sistem");
        toast.error("Terjadi kesalah sistem");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen justify-center items-center flex bg-[#EDEDED] ">
      <div className="md:w-220 md:h-100 flex border-[#68868C] border-3 rounded-xl overflow-hidden">
        <div className="bg-[#3E3E3E] rounded-lg max-w-60 w-full justify-center items-center flex flex-col text-center outline-3 outline-[#68868C]">
          <Image
            src="/assets/mainLogo.png"
            alt="logo"
            width={1000}
            height={1000}
            className="max-w-25"
          />
          <h1 className="font-bold text-xl text-white">KasirKu</h1>
          <h2 className="font-bold text-[10px] text-white">
            Kasir Optimal untuk sajian istimewa
          </h2>
        </div>
        <div className="w-full m-15 mx-20 border-l-5 border-[#405559] px-5 overflow-hidden">
          <p className="text-xl font-bold text-[#405559]">
            SELAMAT DATANG KEMBALI!
          </p>
          <p className="text-sm font-medium text-[#535555] ">
            Login untuk memberikan pelayanan terbaik atau kelola restoran Anda
            dengan data yang akurat.
          </p>

          <div className="px-15">
            <div className="w-full h-full mt-5">
              <form onSubmit={handleSubmit} className="space-y-3">
                
                <Label className="text-[#68868C]">Username</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-[#68868C] border-2 focus:border-[#68868C] focus:ring-[#68868C] text-[#4d4d4d]"
                />

                <Label className= "text-[#68868C]">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#68868C] border-2 focus:border-[#68868C] focus:ring-[#68868C]  text-[#4d4d4d]"
                />

                <Button
                  type="submit"
                  className="w-full h-9 bg-[#68868C] rounded-md text-white font-semibold text-sm hover:bg-[#405559] transition duration-300 ease-in-out"
                >
                  {loading ? "Loading..." : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
