import { useState, useEffect } from "react";

const Theme = () => {
    const [theme, setTheme] = useState("light");

    // Apply theme with smooth transition
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return { theme, toggleTheme }
}
export default Theme