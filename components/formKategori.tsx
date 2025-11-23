import api from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function FormKategori({ onSuccess }: { onSuccess?: () => void }) {
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
      toast.error("Nama kategori harus diisi");
      return;
    }

    try {
      setLoading(true);
      await api.post("/kategoris", { nama: namaKategori });

      toast.success("Kategori berhasil dibuat");
      setNamaKategori("");

      // 🔥 Panggil refresh data kategori
      onSuccess?.();
    } catch (error) {
      toast.error( "Terjadi kesalahan" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <Input
        type="text"
        placeholder="Nama Kategori"
        value={namaKategori}
        onChange={(e) => setNamaKategori(e.target.value)}
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#869ca0] text-[#404748] border-4 border-[#757575] hover:-translate-y-1 font-bold transition-all duration-300"
      >
        {loading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}
