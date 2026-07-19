import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Admin - ViCore",
  description: "Dashboard pengelolaan data ViCore",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#17153A] text-white flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-[#1B1A3E]/80 backdrop-blur-md border-b border-[#3B366E] pt-2">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/logo-removebg-preview.png" 
              alt="ViCore Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <h1 className="text-[#F9CA75] font-bold text-lg hidden sm:block">
              ViCore Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#B6B2DA]">Mode Kelola</div>
            {user && <LogoutButton />}
          </div>
        </div>
        {user && (
          <div className="max-w-7xl mx-auto px-4">
            <AdminNav />
          </div>
        )}
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
