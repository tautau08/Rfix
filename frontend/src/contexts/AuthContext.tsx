"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService } from "@/lib/api/auth.service";
import { AuthUser } from "@/types/user.types";
import { toast } from "sonner";

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();

        if (storedUser && token) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const authUser = await authService.login(email, password);

            // Store token and user data
            localStorage.setItem("rfix_token", authUser.token);
            localStorage.setItem("rfix_user", JSON.stringify(authUser));
            if (typeof document !== "undefined") {
                document.cookie = `rfix_token=${authUser.token}; Path=/; Max-Age=3600; SameSite=Lax`;
            }

            setUser(authUser);
            toast.success("Login successful!");
        } catch (error: unknown) {
            // Error handled by API client interceptor
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        if (typeof document !== "undefined") {
            document.cookie = "rfix_token=; Path=/; Max-Age=0; SameSite=Lax";
        }
        setUser(null);
        toast.info("Logged out successfully");
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
