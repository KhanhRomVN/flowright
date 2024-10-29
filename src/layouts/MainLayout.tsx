import React, { useState } from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/NavigationMenu";
import Sidebar from "@/components/Sidebar";
import 'react-modern-drawer/dist/index.css'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <DragWindowRegion title="Soladal" />
            <NavigationMenu />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col">

                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <div className="flex-1 flex flex-col">
                            <main className="flex-1 overflow-auto custom-scrollbar">{children}</main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}