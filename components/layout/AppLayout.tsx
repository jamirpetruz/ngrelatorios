
"use client";

import { useState } from "react";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      {/* Área principal */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
        />

        <main className="dark:bg-slate-800 light:bg-slate-100 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Fundo escuro para o menu no celular */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}
    </div>
  );
}
