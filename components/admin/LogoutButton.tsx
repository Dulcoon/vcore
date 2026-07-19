"use client";

import { useState } from "react";
import { logout } from "@/app/admin/login/actions";

export default function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-md border border-red-500/20"
    >
      {isPending ? "Keluar..." : "Logout"}
    </button>
  );
}
