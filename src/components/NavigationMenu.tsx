import { Link } from "@tanstack/react-router";
import React from "react";

export default function NavigationMenu() {
    return (
        <nav>
            <ul className="flex gap-2 p-2 text-sm">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/setting">
                        Setting
                    </Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
    );
}
