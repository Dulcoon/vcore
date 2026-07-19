"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/students", label: "Data Siswa" },
    { href: "/admin/professions", label: "Data Profesi" },
  ];

  return (
    <nav className="flex space-x-1 mt-4">
      {links.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-4 py-2 text-sm font-semibold rounded-t-lg transition-all
              ${isActive
                ? "bg-[#242058] text-[#F9CA75] border-t-2 border-[#F2A93B]"
                : "text-[#B6B2DA] hover:text-white hover:bg-[#1B1A3E]"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
