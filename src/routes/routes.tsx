import React from "react";
import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "./__root";
// auth pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
// layouts
import BaseLayout from "@/layouts/BaseLayout";
import MainLayout from "@/layouts/MainLayout";
// pages
import DashboardPage from "../pages/DashboardPage";
import TeamPage from "../pages/TeamPage";
import MemberPage from "../pages/MemberPage";
import ProjectPage from "../pages/ProjectPage";
import TaskPage from "../pages/TaskPage";
import CalendarPage from "../pages/CalendarPage";
import SettingPage from "@/pages/SettingPage";
import SwitchPage from "@/pages/SwitchPage";
import ProfilePage from "@/pages/ProfilePage";

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

export const DashboardRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/",
    component: () => (
        <MainLayout>
            <DashboardPage />
        </MainLayout>
    ),
});



export const TeamRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/team",
    component: () => (
        <MainLayout>
            <TeamPage />
        </MainLayout>
    ),
});

export const MemberRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/member",
    component: () => (
        <MainLayout>
            <MemberPage />
        </MainLayout>
    ),
});

export const ProjectRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/project",
    component: () => (
        <MainLayout>
            <ProjectPage />
        </MainLayout>
    ),
});

export const TaskRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/task",
    component: () => (
        <MainLayout>
            <TaskPage />
        </MainLayout>
    ),
});

export const CalendarRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/calendar",
    component: () => (
        <MainLayout>
            <CalendarPage />
        </MainLayout>
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

export const ProfileRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/profile",
    component: () => (
        <MainLayout>
            <ProfilePage member_id={null} />
        </MainLayout>
    ),
});


export const rootTree = RootRoute.addChildren([
    DashboardRoute,
    LoginRoute,
    RegisterRoute,
    TeamRoute,
    MemberRoute,
    ProjectRoute,
    TaskRoute,
    CalendarRoute,
    SettingRoute,
    SwitchRoute,
    ProfileRoute
]);