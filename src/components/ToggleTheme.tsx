import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleTheme, getCurrentTheme } from "@/helpers/theme_helpers";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ToggleTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const initTheme = async () => {
            const { system } = await getCurrentTheme();
            setIsDark(system === "dark");
        };
        initTheme();
    }, []);

    const handleToggle = async () => {
        await toggleTheme();
        setIsDark(!isDark);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={handleToggle}
                        size="icon"
                        variant="ghost"
                        className="relative w-9 h-9 rounded-full"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={isDark ? "dark" : "light"}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute"
                            >
                                {isDark ? (
                                    <Moon className="h-4 w-4" />
                                ) : (
                                    <Sun className="h-4 w-4" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isDark ? "Light mode" : "Dark mode"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}