import React, { useEffect, useState } from "react";

import Preview from "./preview";
import UserInfoForm from "./userform";

interface Size {
    width: number | "auto";
    height: number | "auto";
}

// Based on https://blog.senpaisilver.com/web/discord-animated-voice-pngs/
export default function VocalOverlay() {
    const [users, setUsers] = useState<DiscordUser[]>([
        {
            id: "1234",
            username: "SilentUser",
            speaking: false,
            avatar: 'https://images-ext-2.discordapp.net/external/GCPKEebWHN0PcTwg_uCnYUOpfmqijumMmHbAyarbXss/https/media.discordapp.net/attachments/272202136035786754/966366314941788270/IMG_20220418_095430.jpg?width=678&height=528'
        },
        {
            id: "5678",
            username: "ChatterBox",
            speaking: true,
        },
    ]);
    const [nameDisplay, setNameDisplay] = useState<boolean>(true);
    const [silentDim, setSilentDim] = useState<boolean>(false);
    const [speakBump, setSpeakBump] = useState<boolean>(false);
    const [freeCSS, setFreeCSS] = useState<string>("");
    const [animation, setAnimation] = useState<string>("");
    const [alignement, setAlignement] = useState<"horizontal" | "vertical">("vertical");
    const [margin, setMargin] = useState<number | null>(null);
    const [padding, setPadding] = useState<number | null>(null);
    const [border, setBorder] = useState<number | null>(null);
    const [size, setSize] = useState<Size>({
        width: "auto",
        height: "auto"
    });

    // FIXME: Not adding a new user, new form fields and new preview
    function newUser() {
        const newuser: DiscordUser = {
            id: Math.random().toString().replace('.', ''),
            username: "New User",
            speaking: false,
        };
        setUsers(users => {
            return (users.concat([newuser]))
        })
    }

    function removeUser(index: number) {
        setUsers(users.filter((_, i) => i !== index));
    }

    function editUser(ev: any, index: number) {
        const field: string = ev.target.name;
        var value: string | boolean = ev.target.value;

        if (ev.target.type === "checkbox") {
            value = ev.target.checked;
        }
        console.log(index, field, value, { ...users[index], [field]: value });
        setUsers([
            ...users.slice(0, index),
            { ...users[index], [field]: value },
            ...users.slice(index + 1)
        ]);
    }

    function buildRule(selector: string, rules: Record<string, string>) {
        if (Object.keys(rules).length == 0) {
            return ("");
        }

        var plain_text = selector;
        plain_text += " {\n";

        for (let k in rules) {
            plain_text += `\t${k}: ${rules[k]};\n`
        }
        plain_text += "}\n";
        return (plain_text);
    }

    function compileStyle() {
        var plain_text = ""
        const voice_state: Record<string, string> = {};
        const avatar: Record<string, string> = {};
        const speakingAvatar: Record<string, string> = {};
        const name: Record<string, string> = {};

        if (alignement == "horizontal") {
            voice_state["display"] = "inline-block !important";
        }

        if (silentDim) {
            avatar["filter"] = "brightness(50%)";
            speakingAvatar["filter"] = "brightness(100%)";
        }

        if (!nameDisplay) {
            name["display"] = "none";
        }

        plain_text += buildRule(".voice-state", voice_state);
        plain_text += buildRule(".avatar", avatar);
        plain_text += buildRule(".speaking", speakingAvatar);
        plain_text += buildRule(".name", name);

        return (plain_text.trim());
    }

    function compileCustomAvatar(users: DiscordUser[]) {
        var plain_text = "";
        for (let usr of users) {
            if (usr.avatar || usr.talk_avatar)
                plain_text += `/* User: ${usr.username} (${usr.id}) */\n`
            if (usr.avatar)
                plain_text += `.avatar[data-reactid*="${usr.id}"] {content: url("${usr.avatar}");}\n`;
            if (usr.talk_avatar)
                plain_text += `.avatar.speaking[data-reactid*="${usr.id}"] {content: url("${usr.talk_avatar}");}\n`;
        }
        plain_text += "\n" + freeCSS;
        return (plain_text.trim())
    }

    const compiled_css = compileStyle() + "\n\n" + compileCustomAvatar(users);

    return (
        <div className="">
            <h1>Discord Vocal Overlay</h1>
            <div>
                <input type="checkbox" id="display-name" onChange={() => setNameDisplay(!nameDisplay)} defaultChecked={!nameDisplay} />
                <label htmlFor="display-name" >Hide usernames</label>
            </div>

            <div>
                <label htmlFor="free_css">Other CSS:</label>
                <textarea style={{ display: "block" }} onChange={(e) => setFreeCSS(e.target.value)}></textarea>
            </div>

            <h2>Users</h2>
            {users.map((usr, index) => {
                return (<UserInfoForm key={index} user={usr} index={index} removeUser={removeUser} handleChange={(ev: any) => {
                    editUser(ev, index);
                }} />);
            })}
            <button type="button" onClick={newUser}>+</button>

            <h2>Code</h2>
            <pre style={{ padding: "5px", fontFamily: "monospace", border: "3px solid black", display: "block" }}>
                <code>{compiled_css.trim() || "/* Make changes to generate CSS */"}</code>
            </pre>

            <h2>Preview</h2>
            <p>Click the user to make them "speak".</p>
            <div style={{ border: "3px solid black" }}>
                <Preview users={users} style={compiled_css.trim()} />
            </div>
        </div>
    );
}
