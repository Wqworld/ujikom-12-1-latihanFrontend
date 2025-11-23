"use client";
import FormKategori from "@/components/formKategori";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { Pencil, Tags, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type categories = {
  id: number;
  nama: string;
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
    }
    setCategoriSelected(id.toString());
  };

  useEffect(() => {
    getAllCategories();
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
    </>
  );
}
