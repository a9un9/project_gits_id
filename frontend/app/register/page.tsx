"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Registrasi gagal");
      return;
    }

    alert("Registrasi berhasil, silakan login");
    router.replace("/login");
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
          Registrasi
        </h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nama lengkap"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <button
          disabled={loading}
          className={`px-4 py-2 text-white w-full rounded ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Registrasi"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Already have an account ?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}
