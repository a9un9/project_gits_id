"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // router.push("/login");
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block py-2 hover:bg-gray-700 px-2 rounded">
            Home
          </Link>

          <Link href="/dashboard/author" className="block py-2 hover:bg-gray-700 px-2 rounded">
            Authors
          </Link>

          <Link href="/dashboard/book" className="block py-2 hover:bg-gray-700 px-2 rounded">
            Books
          </Link>

          <Link href="/dashboard/publisher" className="block py-2 hover:bg-gray-700 px-2 rounded">
            Publishers
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 py-2 rounded text-center"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
