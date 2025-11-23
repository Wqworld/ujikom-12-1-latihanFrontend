"use client";
import FormBarang from "@/components/formBarang";
import FormKategori from "@/components/formKategori";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { DialogClose } from "@radix-ui/react-dialog";
import { jwtDecode } from "jwt-decode";
import { Pencil, PlusCircle, Tags, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type categories = {
  id: number;
  nama: string;
};

type barangs = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategoriId: number;
  kategori: {
    id: number;
    nama: string;
  };
  gambar: string;
};

interface TokenPayLoad {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export default function MenusPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<categories[]>([]);
  const [categoriSelected, setCategoriSelected] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [barangs, setBarangs] = useState<barangs[]>([]);

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/kategoris");
      setCategories(response.data);
    } catch (error) {
      toast.error("internal server error" + error);
    } finally {
      setLoading(false);
    }
  };

  const getAllBarangs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/produks");
      setBarangs(response.data.data);
    } catch (error) {
      toast.error("internal server error" + error);
    } finally {
      setLoading(false);
    }
  };

  const admin = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode<TokenPayLoad>(token);
        if (decode.role === "ADMIN") {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      toast.error("internal server error" + error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Yakin hapus kategori ini?")) return;

    try {
      await api.delete(`/kategoris/${id}`);
      toast.success("Kategori berhasil dihapus");

      getAllCategories(); // Refresh setelah hapus
    } catch (error) {
      toast.error("Gagal menghapus kategori" + error);
    }
  };

  const deleteBarang = async (id: number) => {
    try {
      await api.delete(`/produks/${id}`);
      toast.success("Produk berhasil dihapus");

      getAllBarangs(); // Refresh setelah hapus
    } catch (error) {
      toast.error("Gagal menghapus produk" + error);
    }
  };

  const updateCategory = async (item: categories) => {
    const newName = prompt("Masukan nama baru:", item.nama);
    if (!newName || !newName.trim()) return;

    try {
      await api.put(`/kategoris/${item.id}`, { nama: newName });
      toast.success("Kategori berhasil diperbarui");

      getAllCategories();
    } catch (error) {
      toast.error("Gagal memperbarui kategori" + error);
    }
  };

  const handleClickCategori = (id: number) => () => {
    if (id == 100) {
      setCategoriSelected("");
      return;
    }
    setCategoriSelected(id.toString());
  };

  useEffect(() => {
    getAllCategories();
    getAllBarangs();
    admin();
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="flex gap-2">
          <div className="bg-[#68868C] text-[#404748] size-12 flex justify-center items-center rounded-lg border-4 border-[#404748] hover:-translate-y-1 transition-all duration-300">
            <Tags className="w-full size-7" />
          </div>
          <p className="text-2xl font-bold flex text-center hover:-translate-y-1 transition-all duration-300 items-center justify-center text-[#68868C]">
            KATEGORI
          </p>
        </div>

        {loading ? (
          "loading..."
        ) : (
          <div className="mt-4 space-y-2 grid grid-cols-7 gap-2 ">
            {isAdmin && (
              <Dialog>
                <DialogTrigger>
                  <div className="bg-[#869ca0] text-[#404748] border-4 border-[#757575] hover:-translate-y-1 font-bold transition-all duration-300 rounded-md h-9">
                    Tambah Kategori
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white">
                  <DialogHeader>
                    <DialogTitle>Tambah Kategori</DialogTitle>
                  </DialogHeader>
                  <FormKategori />
                  <DialogFooter>
                    {/* <DialogClose asChild>
                      <Button className="bg-[#869ca0] text-[#404748] border-4 border-[#757575] hover:-translate-y-1 font-bold transition-all duration-300">Close</Button>
                    </DialogClose> */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button
              onClick={handleClickCategori(100)}
              className={
                categoriSelected === "100"
                  ? "bg-[#68868C] font-bold text-white border-[#404748] border-4 hover:-translate-y-1 transition-all duration-300"
                  : "bg-[#869ca0] text-[#404748] border-4 border-[#757575] hover:-translate-y-1 font-bold transition-all duration-300"
              }
            >
              Semua
            </Button>

            {categories.map((item) => (
              <Button
                onClick={handleClickCategori(item.id)}
                key={item.id}
                className={
                  categoriSelected === item.id.toString()
                    ? "bg-[#68868C] font-bold text-white border-[#404748] border-4 hover:-translate-y-1 transition-all duration-300"
                    : "bg-[#869ca0] text-[#404748] border-4 border-[#757575] hover:-translate-y-1 font-bold transition-all duration-300"
                }
              >
                {item.nama}
                {isAdmin && (
                  <div className="flex gap-3">
                    <div
                      onClick={() => updateCategory(item)}
                      className="hover:text-white transition-all duration-300"
                    >
                      <Pencil />
                    </div>
                    <div
                      onClick={() => deleteCategory(item.id)}
                      className="hover:text-red-500 transition-all duration-300"
                    >
                      <Trash />
                    </div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className={isAdmin ? "" : "max-w-250"}>
        <div className={isAdmin ? "grid grid-cols-6 gap-2" : "grid grid-cols-4 "}>
          {loading ? "loading..." : ""}
          {isAdmin && (
            <Dialog>
              <DialogTrigger>
                <Card className="bg-[#EDEDED] border-4 border-[#68868C] w-full h-70">
                  <CardHeader className="justify-center items-center font-bold text-xl text-[#68868C]">
                    Tambah Barang
                  </CardHeader>
                  <CardContent className="-m-2">
                    <PlusCircle className="w-full h-full text-[#68868C] " />
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-white">
                <DialogTitle>Tambah Produk</DialogTitle>
                <FormBarang />
              </DialogContent>
            </Dialog>
          )}
          {barangs
            .filter((item) =>
              categoriSelected
                ? item.kategoriId.toString() === categoriSelected
                : true
            )
            .map((item) => (
              <Card
                key={item.id}
                className="bg-[#EDEDED] border-4 border-[#68868C] w-58 h-70"
              >
                <CardContent className="-m-2">
                  <Image
                    unoptimized
                    src={`http://localhost:3000/uploads/${item.gambar}`}
                    alt=""
                    width={1000}
                    height={1000}
                    className="rounded-xl max-w-48 h-30 border-3 object-cover border-[#404748]"
                  />
                  <div className="flex justify-between">
                    <div className="">
                      <CardTitle className="text-[#404748] mt-2 -mb-1 font-bold text-2xl">
                        {item.nama}
                      </CardTitle>
                      <p className="text-md font-bold text-[#68868C]">
                        {item.kategori.nama}
                      </p>
                      <p className="text-xl font-bold text-[#404748]">
                        {item.stok} Stok
                      </p>
                      <p className="text-xl font-bold text-[#404748]">
                        Rp. {item.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col gap-3 mt-3">
                        <Dialog>
                          <DialogTrigger className="text-[#68868C] hover:text-yellow-200 transition-all duration-300">
                            <Pencil />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg bg-white">
                            <DialogTitle>Ubah Produk</DialogTitle>
                            <FormBarang item={item} />
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger className="text-[#68868C] hover:text-red-500 transition-all duration-300">
                            <Trash />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg bg-white">
                            <DialogTitle>Hapus Produk</DialogTitle>
                            <DialogClose className="bg-[#68868C] text-white border-4 border-[#404748] hover:-translate-y-1 transition-all duration-300">
                              Cancel
                            </DialogClose>
                            <Button
                              onClick={() => deleteBarang(item.id)}
                              className="bg-[#68868C] text-white border-4 border-[#404748] hover:-translate-y-1 transition-all duration-300"
                            >
                              Hapus
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}
