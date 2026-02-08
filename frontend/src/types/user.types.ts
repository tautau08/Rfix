export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active?: boolean;
    created_at?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
}
