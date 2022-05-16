import React from "react";
import { Link } from "react-router-dom";

export default function DiscordIndex() {
    const streaming_tools_links: ILinks[] = [
        { href: "discord/obs-overlay", title: "Discord OBS Overlay" },
    ]

    return (
        <ul>
            {streaming_tools_links.map((e) => {
                return (
                    <li><Link to={e.href}>{e.title || e.href}</Link></li>
                )
            })}
        </ul>
    );
}
