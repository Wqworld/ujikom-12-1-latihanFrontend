import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


const poppins = Poppins({
  weight: ["800" ,"300", "500", "600", "700", "900"],
  style: "normal",
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "KasirKu App",
  description: "KasirKu App Solusi untuk kebutuhan kasir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}  antialiased`}
      >
        <Toaster position="bottom-right" expand={true} />
        {children}
      </body>
    </html>
  );
}
