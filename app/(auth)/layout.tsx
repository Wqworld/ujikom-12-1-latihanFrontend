import { Toaster } from "sonner"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>){
  return(
    <main className="flex min-h-screen">
      <Toaster position="top-center" richColors expand={true} />
      {children}
    </main>
  )
}