import apiClient from "./client";
import { LoginResponse, AuthUser } from "@/types/user.types";

export const authService = {
    login: async (email: string, password: string): Promise<AuthUser> => {
        const response = await apiClient.post<LoginResponse>("/auth/login", {
            email,
            password,
        });

        // Extract user and token from the nested response
        const { user, token } = response.data.data;
        return {
            ...user,
            token,
        };
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("rfix_token");
            localStorage.removeItem("rfix_user");
        }
    },

    getStoredToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("rfix_token");
        }
        return null;
    },

    getStoredUser: (): AuthUser | null => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("rfix_user");
            return user ? JSON.parse(user) : null;
        }
        return null;
    },
};
