"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setExpanded(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setExpanded(false);
        }, 200);
    };

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "bg-white border-r border-gray-200 flex flex-col relative z-30",
                "transition-all duration-300 ease-in-out",
                expanded ? "w-60" : "w-[72px]"
            )}
        >
            <div className="h-16 flex items-center px-4 border-b border-gray-200 overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <h2
                        className={cn(
                            "text-lg font-bold text-gray-900 whitespace-nowrap transition-all duration-300",
                            expanded
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2 pointer-events-none"
                        )}
                    >
                        Rfix
                    </h2>
                </div>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                {menuItems.length > 0 ? (
                    <ul className="space-y-1 px-3">
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
                                            "flex items-center gap-3 rounded-lg transition-all duration-200 group relative",
                                            "h-10 px-3",
                                            isActive
                                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                                        )}
                                        <Icon className="flex-shrink-0 w-5 h-5" />
                                        <span
                                            className={cn(
                                                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                                                expanded
                                                    ? "opacity-100 translate-x-0"
                                                    : "opacity-0 -translate-x-2 pointer-events-none w-0"
                                            )}
                                        >
                                            {item.label}
                                        </span>

                                        {!expanded && (
                                            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200 shadow-lg">
                                                {item.label}
                                                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="px-3 py-8 text-center overflow-hidden">
                        <p
                            className={cn(
                                "text-sm text-gray-400 whitespace-nowrap transition-all duration-300",
                                expanded
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        >
                            No menu items
                        </p>
                    </div>
                )}
            </nav>

            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 -right-[5px] w-[5px] h-8 rounded-full transition-all duration-300",
                    expanded ? "opacity-0" : "opacity-100 bg-gray-300 hover:bg-primary"
                )}
            />
        </aside>
    );
}
