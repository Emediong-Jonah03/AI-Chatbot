import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoFlash, IoMail, IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, resendVerificationEmail } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    // Get message from signup redirect
    const signupMessage = location.state?.message;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setResendMessage("");

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);

            // Extract the error message
            const errorMessage = error.message || error.toString();

            if (errorMessage.includes('verify your email')) {
                setErrors({
                    submit: 'Please verify your email before signing in. Check your inbox for the verification link.'
                });
            } else if (errorMessage.includes('Invalid')) {
                setErrors({ submit: 'Invalid email or password.' });
            } else {
                setErrors({ submit: 'Login failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email.trim()) {
            setErrors(prev => ({ ...prev, email: "Enter your email to resend verification." }));
            return;
        }

        setIsResending(true);
        setResendMessage("");

        try {
            const message = await resendVerificationEmail(formData.email);
            setResendMessage(message);
        } catch (error: any) {
            const message = error?.error || error?.email?.[0] || "Unable to resend verification email.";
            setErrors(prev => ({ ...prev, submit: message }));
        } finally {
            setIsResending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        if (name === 'email' && resendMessage) {
            setResendMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4">
                        <IoFlash className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
                    <p className="text-text-muted">Sign in to continue your interviews</p>
                </div>

                {/* Login Card */}
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl">
                    {/* Info message from signup */}
                    {signupMessage && (
                        <div className="bg-blue-500/10 border border-blue-500 text-blue-500 text-sm p-3 rounded-lg mb-4">
                            {signupMessage}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Show general error */}
                        {errors.submit && (
                            <div className="bg-error/10 border border-error text-error text-sm p-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

                        {resendMessage && (
                            <div className="bg-green-500/10 border border-green-500 text-green-500 text-sm p-3 rounded-lg">
                                {resendMessage}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`w-full bg-input border ${errors.email ? "border-error" : "border-border"
                                        } text-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition disabled:opacity-50`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-error text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`w-full bg-input border ${errors.password ? "border-error" : "border-border"
                                        } text-text rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-accent transition disabled:opacity-50`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition disabled:opacity-50"
                                >
                                    {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-error text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-4 h-4 accent-accent cursor-pointer disabled:opacity-50"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-text-muted cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                        {errors.submit && errors.submit.includes('verify') && (
                            <button
                                type="button"
                                className="text-accent text-sm hover:underline mt-2 disabled:opacity-60"
                                onClick={handleResendVerification}
                                disabled={isResending || isLoading}
                            >
                                {isResending ? 'Resending verification email...' : 'Resend verification email'}
                            </button>
                        )}
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-text-muted mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-accent hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
