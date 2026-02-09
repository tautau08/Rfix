"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface MenuItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
}

interface SidebarProps {
    menuItems?: MenuItem[];
}

export function Sidebar({ menuItems = [] }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative",
                collapsed ? "w-16" : "w-60"
            )}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Rfix</h2>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-sm">R</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 py-4 overflow-y-auto">
                {menuItems.length > 0 ? (
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(item.href + "/");

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                            collapsed && "justify-center"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon
                                            className={cn(
                                                "flex-shrink-0 w-5 h-5"
                                            )}
                                        />
                                        {!collapsed && (
                                            <span className="text-sm font-medium truncate">
                                                {item.label}
                                            </span>
                                        )}

                                        {collapsed && (
                                            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className={cn(
                        "px-4 py-8 text-center",
                        collapsed && "px-2"
                    )}>
                        {!collapsed && (
                            <p className="text-sm text-gray-400">
                                No menu items
                            </p>
                        )}
                    </div>
                )}
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                    "h-12 flex items-center justify-center border-t border-gray-200 hover:bg-gray-50 transition-colors",
                    collapsed ? "px-2" : "px-4"
                )}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Collapse</span>
                    </div>
                )}
            </button>
        </aside>
    );
}
