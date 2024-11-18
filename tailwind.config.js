const { blue } = require('@mui/material/colors');

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
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                // * Text *
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                },
                // * Colors *
                color: {
                    blue: "var(--blue)",
                    green: "var(--green)",
                    red: "var(--red)",
                    yellow: "var(--yellow)",
                    purple: "var(--purple)",
                    orange: "var(--orange)",
                    blueOpacity: "var(--blue-opacity)",
                    greenOpacity: "var(--green-opacity)",
                    redOpacity: "var(--red-opacity)",
                    yellowOpacity: "var(--yellow-opacity)",
                    purpleOpacity: "var(--purple-opacity)",
                    orangeOpacity: "var(--orange-opacity)",
                },
                primary: "var(--primary)",
                // * Card *
                card: {
                    background: "var(--card-background)",
                    backgroundHover: "var(--card-background-hover)",
                },
                // * Sidebar *
                sidebar: {
                    primary: "var(--sidebar-primary)",
                    itemHover: "var(--sidebar-item-hover)",
                    itemActive: "var(--sidebar-item-active)",
                },
                // * Search Bar *
                searchBar: {
                    background: "var(--search-bar-background)",
                    outline: "var(--search-bar-outline)",
                    outlineHover: "var(--search-bar-outline-hover)",
                    outlineFocus: "var(--search-bar-outline-focus)",
                    placeholder: "var(--search-bar-placeholder)",
                },
                // * Button *
                button: {
                    background: "var(--button-background)",
                    backgroundHover: "var(--button-background-hover)",
                    outline: "var(--button-outline)",
                    outlineHover: "var(--button-outline-hover)",
                },
                // * Icon *
                icon: {
                    primary: "var(--icon-primary)",
                    secondary: "var(--icon-secondary)",
                },
                // * Table *
                table: {
                    header: "var(--table-header)",
                    headerHover: "var(--table-header-hover)",
                    body: "var(--table-body)",
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
