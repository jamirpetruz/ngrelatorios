"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        alert("Usuário ou senha inválidos");
        return;
      }
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('username', data.username)
        router.push("/relatorios/rh/adiantamentos");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-800">
      <div className="flex flex-col items-center w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <img src="petruz-logo2.png" alt="" height={60} width={60}/>
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Petruz Consultas
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Acesse sua conta
        </p>

        <form onSubmit={handleLogin} className="space-y-5 w-full">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Usuário
            </label>

            <input
              type="text"
              placeholder="Seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Senha
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500 text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}