import React from "react";
import Sidebar from "@/components/Sidebar";
import 'react-modern-drawer/dist/index.css'
import { _GET } from "@/utils/auth_api";
import DragWindowRegion from "@/components/DragWindowRegion";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <DragWindowRegion />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}