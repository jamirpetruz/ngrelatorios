
"use client";

import {
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    UserCircle,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TopbarProps {
    collapsed: boolean;
    onToggleSidebar: () => void;
    onToggleMobile: () => void;
}

export default function Topbar({
    collapsed,
    onToggleSidebar,
    onToggleMobile,
}: TopbarProps) {
    const [mounted, setMounted] = useState(false);
    const [username, setUsername] = useState(" ");

    useEffect(() => {
        setMounted(true);

        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const { resolvedTheme, setTheme } = useTheme();

    const isDark = resolvedTheme === "dark";
    return (
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between bg-slate-200 dark:bg-slate-900 px-4 sm:px-6">
            <div className="flex items-center gap-3">
                {/* Botão para desktop */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
                    title={collapsed ? "Expandir menu" : "Recolher menu"}
                    className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:inline-flex"
                >
                    {collapsed ? (
                        <PanelLeftOpen size={22} />
                    ) : (
                        <PanelLeftClose size={22} />
                    )}
                </button>

                {/* Botão para dispositivos móveis */}
                <button
                    type="button"
                    onClick={onToggleMobile}
                    aria-label="Abrir ou fechar menu"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                >
                    <Menu size={22} />
                </button>

                <h1 className="text-base font-semibold light:text-slate-800 dark:text-slate-300 sm:text-lg">
                    
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">

                <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label={
                        mounted
                            ? isDark
                                ? "Ativar tema claro"
                                : "Ativar tema escuro"
                            : "Alterar tema"
                    }
                    title={
                        mounted
                            ? isDark
                                ? "Tema claro"
                                : "Tema escuro"
                            : "Alterar tema"
                    }
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {mounted ? (
                        isDark ? <Sun size={20} /> : <Moon size={20} />
                    ) : (
                        <Sun size={20} />
                    )}
                </button>


                <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
                    <UserCircle size={28} className="text-slate-500" />

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium dark:text-slate-300 light:text-slate-800">
                            {username}
                        </p>
                        <p className="text-xs text-slate-500">
                            Usuário do sistema
                        </p>
                    </div>
                    <a href="/api/auth/logout" className="ml-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                        <LogOut size={20} className="text-slate-500" />
                    </a>
                </div>
            </div>
        </header>
    );
}
