
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Boxes,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

const menuItems = [
  { label: "Adiantamentos", href: "/relatorios/adiantamentos", icon: DollarSign },
  { label: "Verbas Cestas Básicas", href: "/relatorios/cestas-basicas", icon: Package },
  { label: "Verbas Cestas Básicas Novo", href: "/relatorios/cestas-basicas-novo", icon: Package }
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col dark:bg-slate-900 bg-slate-300 shadow-lg
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <img src="/petruz-logo.png" alt="" height="25" width="25" />
        </div>

        {!collapsed && (
          <span className="truncate text-lg font-bold light:text-slate-800 dark:text-slate-300">
            NG RELATÓRIOS
          </span>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-3
                transition-colors
                ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "dark:text-slate-400 light:text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
                ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={21} className="shrink-0" />

              {!collapsed && (
                <span className="truncate text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-slate-200 p-4">
        {!collapsed && (
          <p className="text-xs text-slate-400">
            Sistema interno · v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
