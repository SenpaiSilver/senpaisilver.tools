import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";

import Home from "@app/home";
import VocalOverlay from "@app/discord/vocal_overlay";

function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="discord-vs-overlay">Discord Vocal Overlay</Link>
            </nav>
            <Outlet />
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="discord-vs-overlay" element={<VocalOverlay />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
