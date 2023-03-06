import React from "react";
import { Link } from "react-router-dom";
import { ILinks } from "../types";

export default function Home() {
  const streaming_tools_links: ILinks[] = [
    { href: "discord/obs-overlay", title: "Discord OBS Overlay" },
  ];

  return (
    <div>
      <h1>SenpaiSilver.tools</h1>
      <p>
        Here you'll find some tools that might or might not do stuff.
        <br />
        All the code and binaries provided are provided as-is, with no warranty
        whatsoever, use at your own risks.
      </p>

      <h2>GitHub</h2>
      <p>
        It's on{" "}
        <a
          href="https://github.com/SenpaiSilver/senpaisilver.tools"
          target="_blank"
        >
          GitHub
        </a>
        .
      </p>

      <h2>Streaming tools</h2>
      <ul>
        {streaming_tools_links.map((e) => {
          return (
            <li>
              <Link to={e.href}>{e.title || e.href}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
