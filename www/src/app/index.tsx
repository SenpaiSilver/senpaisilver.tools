import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";

import "./main.scss";

import Home from "@app/home";
import VocalOverlay from "@app/discord/vocal_overlay";

function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Tools</Link>
                <a href="https://blog.senpaisilver.com">Blog</a>
                <a href="https://twitter.com/SenpaiSilver">Twitter</a>
                <a href="https://youtube.com/SenpaiSilver">YouTube</a>
                <a href="https://github.com/SenpaiSilver">GitHub</a>
            </nav>
            <div className="outlet">
                <Outlet />
            </div>
        </>
    );
}

function NotFound() {
    return (
        <>
            Page not found, sorry about that I guess.
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="discord/obs-overlay" element={<VocalOverlay />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
