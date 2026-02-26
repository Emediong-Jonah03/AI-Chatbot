import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface User {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    is_email_verified: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (
        username: string,
        email: string,
        password: string
    ) => Promise<string>;

    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on startup
    /*useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            const token = localStorage.getItem("access");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/m/");
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch {
                localStorage.clear();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);*/

    // LOGIN
    const login = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const res = await api.post("/v1/auth/login", {
                email,
                password,
            });

            const userData: User = res.data.user;

            localStorage.setItem("access", res.data.tokens.access);
            localStorage.setItem("refresh", res.data.tokens.refresh);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // SIGNUP
    const signup = async (
        username: string,
        email: string,
        password: string
    ): Promise<string> => {
        setIsLoading(true);

        try {
            const res = await api.post("/v1/auth/register", {
                username,
                email,
                password,
                confirm_password: password,
            });

            return (
                res.data.message ||
                "Account created successfully. Please sign in."
            );
        } catch (error: any) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // RESEND VERIFICATION EMAIL
    /* const resendVerificationEmail = async (
         email: string
     ): Promise<string> => {
         try {
             const res = await api.post("/auth/resend-verification/", {
                 email,
             });
 
             return res.data.message || "Verification email sent.";
         } catch (error: any) {
             if (error.response?.data?.error) {
                 throw new Error(error.response.data.error);
             }
             throw error;
         }
     };
     */

    // LOGOUT
    const logout = async () => {
        try {
            const refresh = localStorage.getItem("refresh");

            if (refresh) {
                await api.post("/v1/auth/logout", { refresh });
            }
        } catch {
            // backend failure shouldn't block logout
        } finally {
            localStorage.clear();
            setUser(null);
            window.location.href = "/login";
        }
    };

    // DELETE ACCOUNT
    const deleteAccount = async () => {
        try {
            await api.delete("/v1/auth/delete-account/");
            localStorage.clear();
            setUser(null);
            window.location.href = "/signup";
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        //resendVerificationEmail,
        logout,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};