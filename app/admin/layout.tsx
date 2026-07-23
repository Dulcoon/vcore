import AdminSidebar from "@/components/admin/AdminSidebar";
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
    <div className="min-h-screen bg-[#17153A] text-white flex flex-col lg:flex-row font-sans">
      {user && <AdminSidebar userEmail={user.email} />}
      
      <main className={`flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 transition-all ${user ? "lg:ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
}
