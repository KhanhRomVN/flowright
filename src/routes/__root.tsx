import React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFound from "../pages/NotFoundPage";
import { TeamProvider } from "@/Context/TeamContext";

export const RootRoute = createRootRoute({
    component: Root,
    errorComponent: NotFound,
});

function Root() {
    return (
        <TeamProvider>
            <Outlet />
        </TeamProvider>
    );
}