import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const streaming_tools_links: ILinks[] = [
        { href: "discord/obs-overlay", title: "Discord OBS Overlay" },
    ]

    const misc_tools_links: ILinks[] = [
        { href: "string", title: "String processing" },
    ]

    return (
        <div>
            <h1>SenpaiSilver.tools</h1>

            <p>
                Here you'll find some tools that might or might not do stuff.<br />
                All the code and binaries provided are provided as-is, with no warranty whatsoever, use at your own risks.
            </p>

            <h2>Streaming tools</h2>
            <ul>
                {streaming_tools_links.map((e) => {
                    return (
                        <li key={e.href}><Link to={e.href}>{e.title || e.href}</Link></li>
                    )
                })}
            </ul>

            <h2>Misc</h2>
            <ul>
                {misc_tools_links.map((e) => {
                    return (
                        <li key={e.href}><Link to={e.href}>{e.title || e.href}</Link></li>
                    )
                })}
            </ul>
        </div>
    );
}
