"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, User, ChevronRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const generateBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs = segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label = segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            return { label, href };
        });
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Home</span>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span
                            className={
                                index === breadcrumbs.length - 1
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-500"
                            }
                        >
                            {crumb.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-medium text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.role}
                                </p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-xs text-gray-500 font-normal">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
