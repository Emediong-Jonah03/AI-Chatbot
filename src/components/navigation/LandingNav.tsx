import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoSunny, IoMoon } from "react-icons/io5"
import Theme from "../Theme";

function LandingNav() {
    const { theme, toggleTheme } = Theme()
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-bg/95 backdrop-blur-lg border-b border-slate-800 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                    >
                        <span className="text-xl font-bold text-text hidden sm:block">
                            Interview<span className="text-primary">Ace</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => scrollToSection("how-it-works")}
                            className="text-text hover:text-primary transition-colors duration-200"
                        >
                            How it Works
                        </button>

                        <button
                            onClick={() => scrollToSection("creator")}
                            className="text-text hover:text-primary transition-colors duration-200"
                        >
                            About
                        </button>
                    </div>

                    {/* CTA Button (Desktop) */}
                    <div className="items-center gap-4 hidden md:flex">
                        <Link
                            to="/login"
                            className="group relative px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/25 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Login
                            </span>
                        </Link>

                        <Link
                            to="/signup"
                            className="group relative px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/25 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started
                            </span>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-text hover:text-text/80 cursor-pointer transition-color rounded-lg"
                        >
                            {theme === "dark" ? <IoSunny /> : <IoMoon />}
                        </button>
                    </div>

                    <header className="flex items-center justify-between gap-4 w-full md:hidden">
                        <div>
                            Interview<span className="text-primary">Ace</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="ml-auto md:ml-0 md:mr-4 p-2 text-text hover:text-text/80 cursor-pointer transition-colors rounded-lg"
                        >
                            {theme === "dark" ? <IoSunny /> : <IoMoon />}
                        </button>
                    </header>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-text hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-6 py-4 bg-surface/95 backdrop-blur-lg border-t border-slate-800 space-y-4">
                    <button
                        onClick={() => scrollToSection("how-it-works")}
                        className="block w-full text-center text-text hover:text-primary transition-colors duration-200 py-2"
                    >
                        How it Works
                    </button>
                    <div className="flex items-center justify-between w-full">

                        <button
                            onClick={() => scrollToSection("creator")}
                            className="block w-full text-center text-text hover:text-primary transition-colors duration-200 py-2"
                        >
                            About
                        </button>
                    </div>



                    <Link
                        to="/login"
                        className="block w-full text-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-primary/25"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="block w-full text-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-primary/25"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default LandingNav;