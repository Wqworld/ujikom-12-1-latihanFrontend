"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Kategori = {
  id: number;
  nama: string;
};

type FormBarangProps = {
  item?: {
    id: number;
    nama: string;
    harga: number;
    stok: number;
    kategoriId: number;
    gambar: string;
  };
  refresh?: () => void;
};

export default function FormBarang({ item, refresh }: FormBarangProps) {
  const [namaProduk, setNamaProduk] = useState(item?.nama || "");
  const [hargaProduk, setHargaProduk] = useState(item?.harga?.toString() || "");
  const [stokProduk, setStokProduk] = useState(item?.stok?.toString() || "");
  const [kategoriId, setKategoriId] = useState(item?.kategoriId?.toString() || "");
  const [gambar, setGambar] = useState<File | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllKategori = async () => {
    try {
      const res = await api.get("/kategoris");
      setKategori(res.data);
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  useEffect(() => {
    getAllKategori();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nama", namaProduk);
    formData.append("harga", hargaProduk);
    formData.append("stok", stokProduk);
    formData.append("kategoriId", kategoriId);
    if (gambar) formData.append("gambar", gambar);

    try {
      if (item) {
        await api.put(`/produks/${item.id}`, formData);
        toast.success("Produk berhasil diperbarui!");
      } else {
        await api.post("/produks", formData);
        toast.success("Produk berhasil ditambahkan!");
      }

      refresh?.();
    } catch {
      toast.error("Gagal menyimpan produk!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="Nama Produk"
        value={namaProduk}
        onChange={(e) => setNamaProduk(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Harga"
        value={hargaProduk}
        onChange={(e) => setHargaProduk(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Stok"
        value={stokProduk}
        onChange={(e) => setStokProduk(e.target.value)}
      />

      <Select value={kategoriId} onValueChange={setKategoriId}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih Kategori" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {kategori.map((k) => (
              <SelectItem key={k.id} value={k.id.toString()}>
                {k.nama}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input type="file" onChange={(e) => setGambar(e.target.files?.[0] ?? null)} />

      {(gambar || item?.gambar) && (
        <Image
          unoptimized
          src={
            gambar
              ? URL.createObjectURL(gambar)
              : `http://localhost:3000/uploads/${item?.gambar}`
          }
          width={200}
          height={200}
          alt="Preview"
          className="rounded-lg border"
        />
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : item ? "Update Produk" : "Tambah Produk"}
      </Button>
    </form>
  );
}
