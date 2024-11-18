import { closeWindow, maximizeWindow, minimizeWindow } from "@/helpers/window_helpers";
import React, { type ReactNode } from "react";
import { Minus, Maximize2, X } from "lucide-react";

interface DragWindowRegionProps {
    title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
    return (
        <div className="flex w-full items-center justify-between px-4 py-1 bg-red-500/500">
            <div className="draglayer flex flex-1 items-center bg-transparent">

                <img
                    src="/src/assets/logos/logo-no-background.png"
                    alt="Logo"
                    className="mr-1 h-6 w-6"
                />
                {title && (
                    <div className="select-none whitespace-nowrap text-base text-gray-500">
                        {title}
                    </div>
                )}
            </div>
            <WindowButtons />
        </div>
    );
}

function WindowButtons() {
    return (
        <div className="flex items-center space-x-2">
            <WindowButton onClick={minimizeWindow} icon={<Minus />} tooltip="Minimize" hoverColor="yellow" />
            <WindowButton onClick={maximizeWindow} icon={<Maximize2 />} tooltip="Maximize" hoverColor="green" />
            <WindowButton onClick={closeWindow} icon={<X />} tooltip="Close" hoverColor="red" />
        </div>
    );
}

interface WindowButtonProps {
    onClick: () => void;
    icon: ReactNode;
    tooltip: string;
    hoverColor: 'yellow' | 'green' | 'red';
}

function WindowButton({ onClick, icon, tooltip, hoverColor }: WindowButtonProps) {
    const hoverColorClass = {
        yellow: 'hover:bg-color-yellowOpacity',
        green: 'hover:bg-color-greenOpacity',
        red: 'hover:bg-color-redOpacity'
    }[hoverColor];

    return (
        <button
            onClick={onClick}
            className={`p-1 rounded-full ${hoverColorClass} hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
            title={tooltip}
        >
            <span className="w-4 h-4 flex items-center justify-center">
                {icon}
            </span>
        </button>
    );
}
