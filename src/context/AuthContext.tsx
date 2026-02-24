import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

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
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<string>;
    resendVerificationEmail: (email: string) => Promise<string>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const API_URL = "http://localhost:8000/api";

// Configure axios to include JWT token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh on 401 errors
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh');

                if (!refreshToken) {
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('access', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/auth/me/`);
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Failed to load user:', error);
                localStorage.clear();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_URL}/auth/signin/`, {
                email,
                password,
            });

            const userData: User = res.data.user;

            setUser(userData);

            localStorage.setItem("access", res.data.tokens.access);
            localStorage.setItem("refresh", res.data.tokens.refresh);
            localStorage.setItem("user", JSON.stringify(userData));

        } catch (error: any) {
            console.error('Login failed:', error);

            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (username: string, email: string, password: string): Promise<string> => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/signup/`, {
                username: username,
                email,
                password,
                confirm_password: password,
            });

            // Return the success message from backend
            return res.data.message || "Account created successfully. Please check your email to verify your account.";

        } catch (error: any) {
            console.error('Signup failed:', error);

            if (error.response?.data) {
                throw error.response.data;
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = async (email: string): Promise<string> => {
        setIsLoading(true);

        const payload = { email };
        const endpoints = [
            `${API_URL}/auth/resend-verification/`,
            `${API_URL}/auth/resend-verification-email/`,
        ];

        try {
            for (const endpoint of endpoints) {
                try {
                    const res = await axios.post(endpoint, payload);
                    return res.data.message || "Verification email sent. Please check your inbox.";
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        continue;
                    }

                    if (error.response?.data) {
                        throw error.response.data;
                    }

                    throw error;
                }
            }

            throw new Error("Resend verification endpoint not found.");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                await axios.post(`${API_URL}/auth/signout/`, {
                    refresh: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
        }
    };

    const deleteAccount = async () => {
        try {
            await axios.delete(`${API_URL}/auth/delete-account/`);
            setUser(null);
            localStorage.clear();
        } catch (error) {
            console.error('Delete account failed:', error);
            throw error;
        }
    };

    const value = {
        user,
        isLoading,
        login,
        signup,
        resendVerificationEmail,
        logout,
        deleteAccount,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
