import { createRoute } from "@tanstack/react-router";
import HomePage from "../pages/HomePage";
import { RootRoute } from "./__root";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingPage from "@/pages/SettingPage";
import SwitchPage from "@/pages/SwitchPage";
import BaseLayout from "@/layouts/BaseLayout";
import MainLayout from "@/layouts/MainLayout";
import React from "react";

export const HomeRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/",
    component: () => (
        <MainLayout>
            <HomePage />
        </MainLayout>
    ),
});

export const LoginRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/login",
    component: () => (
        <BaseLayout>
            <LoginPage />
        </BaseLayout>
    ),
});

export const RegisterRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/register",
    component: () => (
        <BaseLayout>
            <RegisterPage />
        </BaseLayout>
    ),
});

export const SettingRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/setting",
    component: () => (
        <MainLayout>
            <SettingPage />
        </MainLayout>
    ),
});

export const SwitchRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/switch",
    component: () => <SwitchPage />,
});


export const rootTree = RootRoute.addChildren([HomeRoute, LoginRoute, RegisterRoute, SettingRoute, SwitchRoute]);