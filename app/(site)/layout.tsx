import SideBar from "@/components/sideBar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen">
      <Toaster position="top-center" richColors expand={true} />
      <SideBar />
      <div className="p-10 w-full">{children}</div>
    </main>
  );
}
