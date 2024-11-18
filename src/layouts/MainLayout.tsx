import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import 'react-modern-drawer/dist/index.css'
import { User, Settings, LogOut, Maximize2, X, Minus, Search, Bell, Sun, Moon } from 'lucide-react';
import { closeWindow, maximizeWindow, minimizeWindow } from "@/helpers/window_helpers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import NavigationMenu from "@/components/NavigationMenu";


const fakeNotifications = [
    { id: 1, message: "Bạn có một tin nhắn mới", time: "5 phút trước" },
    { id: 2, message: "Dự án mới được chia sẻ", time: "1 giờ trước" },
];

function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <nav className="bg-sidebar-primary text-sidebar-foreground pl-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold">Flowright</h1>
            </div>

            <div className="flex items-center gap-4 mr-4">
               
                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-full hover:bg-gray-700"
                    title={isDark ? "Light Mode" : "Dark Mode"}
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full hover:bg-gray-700 relative"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            2
                        </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                            {fakeNotifications.map((notif) => (
                                <div key={notif.id} className="px-4 py-2 hover:bg-gray-700">
                                    <p className="text-sm">{notif.message}</p>
                                    <p className="text-xs text-gray-400">{notif.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                    <Avatar
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="cursor-pointer hover:ring-2 hover:ring-gray-300 rounded-sm w-6 h-6"
                    >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-gray-400">john@example.com</p>
                            </div>
                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Hồ sơ
                            </button>
                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Cài đặt
                            </button>
                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2 text-red-400">
                                <LogOut className="w-4 h-4" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>

                {/* Window Controls */}
                <div className="relative space-x-2">
                    <button
                        onClick={minimizeWindow}
                        className="p-1 rounded-full hover:bg-color-blueOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Minimize"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <Minus />
                        </span>
                    </button>
                    <button
                        onClick={maximizeWindow}
                        className="p-1 rounded-full hover:bg-color-greenOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Maximize"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <Maximize2 />
                        </span>
                    </button>
                    <button
                        onClick={closeWindow}
                        className="p-1 rounded-full hover:bg-color-redOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Close"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <X />
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col ">
            <NavigationMenu />
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 ">
                    {children}
                </main>
            </div>
        </div>
    );
}

