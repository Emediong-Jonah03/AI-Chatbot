import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoFlash, IoMail, IoLockClosed, IoPerson, IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const message = await signup(formData.username, formData.email, formData.password);

            // Show success message from backend
            setSuccessMessage(message || "Account created successfully. You can now sign in.");

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Account created successfully. Please sign in.'
                    }
                });
            }, 3000);

        } catch (error: any) {
            // Handle backend validation errors
            if (error.email) {
                setErrors({ email: Array.isArray(error.email) ? error.email[0] : error.email });
            } else if (error.username) {
                setErrors({ username: Array.isArray(error.username) ? error.username[0] : error.username });
            } else if (error.password) {
                setErrors({ password: Array.isArray(error.password) ? error.password[0] : error.password });
            } else {
                setErrors({ submit: 'Sign up failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
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
                    <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
                    <p className="text-text-muted">Join AI Interviewer and start your journey</p>
                </div>

                {/* Sign Up Card */}
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 text-sm p-4 rounded-lg mb-4">
                            <p className="font-semibold mb-1">✓ Account Created!</p>
                            <p>{successMessage}</p>
                            <p className="mt-2 text-xs">Redirecting to login...</p>
                        </div>
                    )}

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Show general error */}
                        {errors.submit && (
                            <div className="bg-error/10 border border-error text-error text-sm p-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

                        {/* Full Name / Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <IoPerson className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isLoading || !!successMessage}
                                    className={`w-full bg-input border ${errors.username ? "border-error" : "border-border"
                                        } text-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition disabled:opacity-50`}
                                    placeholder="johndoe"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-error text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

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
                                    disabled={isLoading || !!successMessage}
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
                                    disabled={isLoading || !!successMessage}
                                    className={`w-full bg-input border ${errors.password ? "border-error" : "border-border"
                                        } text-text rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-accent transition disabled:opacity-50`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading || !!successMessage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition disabled:opacity-50"
                                >
                                    {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-error text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading || !!successMessage}
                                    className={`w-full bg-input border ${errors.confirmPassword ? "border-error" : "border-border"
                                        } text-text rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-accent transition disabled:opacity-50`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={isLoading || !!successMessage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition disabled:opacity-50"
                                >
                                    {showConfirmPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                                required
                                disabled={isLoading || !!successMessage}
                            />
                            <label htmlFor="terms" className="text-sm text-text-muted">
                                I agree to the{" "}
                                <Link to="/terms" className="text-accent hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-accent hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !!successMessage}
                            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating account...
                                </span>
                            ) : successMessage ? (
                                "✓ Account Created"
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-text-muted mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-text-muted mt-6">
                    By signing up, you agree to our Terms and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export default SignUp;