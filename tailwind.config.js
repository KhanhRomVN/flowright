/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--brder)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                // color
                primary: {
                    DEFAULT: "var(--primary)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                sidebar: {
                    primary: "var(--sidebar-primary)",
                    foreground: "var(--sidebar-foreground)",
                },
                searchBar: {
                    background: "var(--search-bar-background)",
                    outline: "var(--search-bar-outline)",
                    outlineHover: "var(--search-bar-outline-hover)",
                    outlineFocus: "var(--search-bar-outline-focus)",
                    placeholder: "var(--search-bar-placeholder)",
                },
                button: {
                    background: "var(--button-background)",
                    backgroundHover: "var(--button-backgroundHover)",
                    hover1: "var(--button-hover-1)",
                },
                outline: "var(--outline)",
                icon: {
                    primary: "var(--icon-primary)",
                    secondary: "var(--icon-secondary)",
                },
                table: {
                    headerBackground: "var(--table-header-background)",
                    headerHover: "var(--table-header-hover)",
                    bodyBackground: "var(--table-body-background)",
                    bodyHover: "var(--table-body-hover)",
                },
            },
            fontFamily: {
                sans: ["Geist", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
