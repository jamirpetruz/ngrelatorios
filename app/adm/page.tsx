"use client";

import { useCallback, useEffect, useState } from "react";
import type { IUser } from "@/types/Usuario";
import AppLayout from "@/components/layout/AppLayout";
import { createUsuarioActions, getAllUsuariosActions, updateUsuarioActions } from "@/actions/usuarioActions";

type UsuarioForm = {
  username: string;
  name: string;
  email: string;
  password: string;
  ativo: number;
  role: string;
};

const formularioInicial: UsuarioForm = {
  username: "",
  name: "",
  email: "",
  password: "",
  ativo: 1,
  role: "user",
};

// Classes compartilhadas (inputs/selects e labels)
const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] =
    useState<IUser | null>(null);
  const [form, setForm] = useState<UsuarioForm>(formularioInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const usuarios = await getAllUsuariosActions();
      console.log("Usuarios carregados:", usuarios);
      setUsuarios(usuarios);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar usuários."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarUsuarios();
  }, [carregarUsuarios]);

  function abrirCriacao() {
    setUsuarioEditando(null);
    setForm(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(usuario: IUser) {
    setUsuarioEditando(usuario);
    setForm({
      username: usuario.username,
      name: usuario.name,
      email: usuario.email,
      password: "",
      ativo: usuario.ativo,
      role: usuario.role,
    });
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setUsuarioEditando(null);
    setForm(formularioInicial);
    setErro("");
  }

  function atualizarCampo<K extends keyof UsuarioForm>(
    campo: K,
    valor: UsuarioForm[K]
  ) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarUsuario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const editando = usuarioEditando !== null;

      const url = editando
        ? `/api/usuarios/${usuarioEditando.userId}`
        : "/api/usuarios";
      if (editando) {
        const result = await updateUsuarioActions(usuarioEditando.userId!, form);
        if (result) {
          alert("Usuário atualizado com sucesso!");
        } else {
          alert("Erro ao atualizar usuário.");
        }
      } else {
        const result = await createUsuarioActions(form);
        if (result) {
          alert("Usuário atualizado com sucesso!");
        } else {
          alert("Erro ao atualizar usuário.");
        }
      }

      setModalAberto(false);
      setUsuarioEditando(null);
      setForm(formularioInicial);

      await carregarUsuarios();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao salvar usuário."
      );
    } finally {
      setSalvando(false);
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = busca.toLowerCase().trim();

    return (
      usuario.name.toLowerCase().includes(termo) ||
      usuario.username.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

  const totalAtivos = usuarios.filter((u) => u.ativo).length;
  const totalInativos = usuarios.length - totalAtivos;

  return (
    <AppLayout>
      <main className="min-h-screen bg-slate-50 p-3 text-slate-800 md:p-5">
        <div className="mx-auto max-w-7xl">
          {/* Cabeçalho */}
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-lg font-bold tracking-tight">Usuários</h1>
              <p className="text-xs text-slate-500">
                Gerencie os usuários e suas permissões de acesso.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirCriacao}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <span className="text-base leading-none">+</span>
              Novo usuário
            </button>
          </div>

          {/* Indicadores */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-lg font-bold">{usuarios.length}</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Ativos</p>
              <p className="text-lg font-bold text-emerald-600">{totalAtivos}</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Inativos</p>
              <p className="text-lg font-bold text-slate-500">{totalInativos}</p>
            </div>
          </div>

          {/* Listagem */}
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-2.5">
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, usuário ou e-mail..."
                className={`${inputClass} max-w-sm`}
              />
            </div>

            {erro && !modalAberto && (
              <div className="mx-2.5 mt-2.5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {erro}
                <button
                  type="button"
                  onClick={() => void carregarUsuarios()}
                  className="ml-2 font-semibold underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Usuário</th>
                    <th className="px-4 py-2 font-semibold">E-mail</th>
                    <th className="px-4 py-2 font-semibold">Perfil</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-right font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {carregando ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center">
                        <p className="font-medium text-slate-700">
                          Nenhum usuário encontrado
                        </p>
                        <p className="text-xs text-slate-500">
                          Tente outra busca ou cadastre um novo usuário.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((usuario) => (
                      <tr
                        key={usuario.userId}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {usuario.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="leading-tight">
                              <p className="font-medium text-slate-800">
                                {usuario.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                @{usuario.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-2 text-slate-600">
                          {usuario.email}
                        </td>

                        <td className="px-4 py-2">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">
                            {usuario.role}
                          </span>
                        </td>

                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${usuario.ativo
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${usuario.ativo
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                                }`}
                            />
                            {usuario.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(usuario)}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!carregando && usuariosFiltrados.length > 0 && (
              <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
                Exibindo {usuariosFiltrados.length} de {usuarios.length} usuários
              </div>
            )}
          </section>
        </div>

        {/* Modal de criação e edição */}
        {modalAberto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) fecharModal();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-titulo"
              className="my-auto w-full max-w-lg rounded-xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-3">
                <div>
                  <h2
                    id="modal-titulo"
                    className="text-base font-bold text-slate-800"
                  >
                    {usuarioEditando ? "Editar usuário" : "Novo usuário"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {usuarioEditando
                      ? "Atualize os dados e as permissões do usuário."
                      : "Preencha os dados para cadastrar um usuário."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  aria-label="Fechar modal"
                  className="rounded-md px-2 py-0.5 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  ×
                </button>
              </div>

              <form onSubmit={salvarUsuario}>
                <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className={labelClass}>
                      Nome completo *
                    </label>
                    <input
                      id="name"
                      required
                      maxLength={150}
                      value={form.name}
                      onChange={(e) => atualizarCampo("name", e.target.value)}
                      placeholder="Nome do usuário"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className={labelClass}>
                      Nome de usuário *
                    </label>
                    <input
                      id="username"
                      required
                      maxLength={80}
                      autoComplete="username"
                      value={form.username}
                      onChange={(e) => atualizarCampo("username", e.target.value)}
                      placeholder="Ex.: jamir"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => atualizarCampo("email", e.target.value)}
                      placeholder="usuario@empresa.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="password" className={labelClass}>
                      Senha {usuarioEditando ? "(opcional)" : "*"}
                    </label>
                    <input
                      id="password"
                      type="password"
                      required={!usuarioEditando}
                      minLength={8}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => atualizarCampo("password", e.target.value)}
                      placeholder={
                        usuarioEditando
                          ? "Deixe em branco para manter a senha atual"
                          : "Mínimo de 8 caracteres"
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className={labelClass}>
                      Perfil de acesso *
                    </label>
                    <select
                      id="role"
                      required
                      value={form.role}
                      onChange={(e) => atualizarCampo("role", e.target.value)}
                      className={inputClass}
                    >
                      <option value="USER">Usuário</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ativo" className={labelClass}>
                      Status *
                    </label>
                    <select
                      id="ativo"
                      value={String(form.ativo)}
                      onChange={(e) =>
                        atualizarCampo("ativo", Number(e.target.value))
                      }
                      className={inputClass}
                    >
                      <option value="1">Ativo</option>
                      <option value="0">Inativo</option>
                    </select>
                  </div>

                  {erro && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:col-span-2">
                      {erro}
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-5 py-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={fecharModal}
                    disabled={salvando}
                    className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={salvando}
                    className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {salvando
                      ? "Salvando..."
                      : usuarioEditando
                        ? "Salvar alterações"
                        : "Cadastrar usuário"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </AppLayout>
  );
}