
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DollarSign,
  Package,
  ChevronDown,
  Users,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

const menuItems = [
  {
    label: "Adiantamentos",
    href: "/relatorios/adiantamentos",
    icon: DollarSign,
  },
  {
    label: "Verbas Cestas Básicas",
    href: "/relatorios/cestas-basicas",
    icon: Package,
  },
  {
    label: "Verbas Cestas Básicas Novo",
    href: "/relatorios/cestas-basicas-novo",
    icon: Package,
  },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const rhActive = menuItems.some(
    (item) => pathname === item.href
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        bg-slate-300 shadow-lg dark:bg-slate-900
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <img
            src="/petruz-logo.png"
            alt="Petruz"
            height="25"
            width="25"
          />
        </div>

        {!collapsed && (
          <span className="truncate text-lg font-bold text-slate-800 dark:text-slate-300">
            CONSULTAS
          </span>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <details
          className="group w-full"
          open={rhActive}
        >
          <summary
            title={collapsed ? "R.H." : undefined}
            className={`
              flex h-12 cursor-pointer list-none
              items-center gap-3 rounded-lg px-3
              transition-colors
              hover:bg-slate-200 dark:hover:bg-slate-800
              ${rhActive
                ? "text-blue-700 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"}
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <Users size={21} className="shrink-0" />

            {!collapsed && (
              <>
                <span className="flex-1 text-sm font-semibold">
                  R.H.
                </span>

                <ChevronDown
                  size={17}
                  className="shrink-0 transition-transform group-open:rotate-180"
                />
              </>
            )}
          </summary>

          {!collapsed && (
            <div className="ml-4 mt-1 space-y-1 border-l border-slate-400/50 pl-3 dark:border-slate-700">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`
                      flex min-h-10 items-center gap-3
                      rounded-lg px-3 py-2
                      transition-colors
                      ${
                        active
                          ? "bg-blue-50 font-semibold text-blue-700 dark:bg-slate-800 dark:text-blue-400"
                          : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </details>
      </nav>

      {/* Rodapé */}
      <div className="shrink-0 border-t border-slate-400/40 p-4 dark:border-slate-700">
        {!collapsed && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sistema interno · v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
