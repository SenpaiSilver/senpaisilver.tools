import React, { useEffect, useState } from "react";

import Preview from "./preview";
import UserInfoForm from "./userform";

import "@app/discord/discord.css";
import { CopyButton } from "@app/components/CopyButton";

interface ISize {
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
        },
        {
            id: "5678",
            username: "ChatterBox",
            speaking: true,
        },
    ]);
    const [nameDisplay, setNameDisplay] = useState<boolean>(false);
    const [silentDim, setSilentDim] = useState<boolean>(true);
    const [speakBump, setSpeakBump] = useState<boolean>(true);
    const [loopAnimation, setLoopAnimation] = useState<boolean>(false);
    const [borderRadius, setBorderRadius] = useState<number>(50);
    const [freeCSS, setFreeCSS] = useState<string>("");
    const [animation, setAnimation] = useState<string>("");
    const [defaultAvatar, setDefaultAvatar] = useState<string>("");
    const [defaultAvatarSpeaking, setDefaultAvatarSpeaking] = useState<string>("");
    const [singleLine, setSingleLine] = useState<boolean>(true);
    const [margin, setMargin] = useState<number | null>(null);
    const [padding, setPadding] = useState<number | null>(null);
    const [size, setSize] = useState<ISize>({
        width: 84,
        height: "auto"
    });

    function newUser() {
        const newuser: DiscordUser = {
            id: "",
            username: `New User #${users.length}`,
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
        const speaking_avatar: Record<string, string> = {};
        const voice_user: Record<string, string> = {};
        const name: Record<string, string> = {};

        if (singleLine) {
            voice_state["height"] = "unset !important";
            voice_state["display"] = "inline-block !important";
            voice_user["text-align"] = "center";
        }

        if (silentDim) {
            avatar["filter"] = "brightness(50%)";
            speaking_avatar["filter"] = "brightness(100%) !important";
            speaking_avatar["border-color"] = "rgba(0, 0, 0, 0) !important";
        }

        if (!nameDisplay) {
            name["display"] = "none";
        }

        if (borderRadius < 50) {
            avatar["border-radius"] = `${borderRadius}% !important`;
        }

        // Must be run after height to override if needed
        if (size.width === "auto" || size.width > 0) {
            if (!singleLine && size.width > 0) {
                voice_state["min-height"] = `${size.width}px`;
            }
            avatar["width"] = (size.width === "auto" ? "auto" : `${size.width}px`) + " !important";
            avatar["height"] = "auto !important";
        }

        if (speakBump) {
            speaking_avatar["position"] = "relative";
            speaking_avatar["animation-name"] = "speaking-now";
            speaking_avatar["animation-duration"] = "1s";
            speaking_avatar["animation-fill-mode"] = "forwards";

            if (loopAnimation) {
                speaking_avatar["animation-iteration-count"] = "infinite";
            }

            plain_text += "@keyframes speaking-now {\n"
                + "\t0%  { bottom:0px; }\n"
                + "\t15% { bottom:15px; }\n"
                + "\t30% { bottom:0px; }\n"
                + "}\n";
        }

        if (defaultAvatar) {
            avatar["content"] = `url(${defaultAvatar})`;
        }

        if (defaultAvatarSpeaking) {
            speaking_avatar["content"] = `url(${defaultAvatarSpeaking})`;
        }

        plain_text += buildRule('[class*="Voice_voiceState__"]', voice_state);
        plain_text += buildRule('img[class*="Voice_avatar__"]', avatar);
        plain_text += buildRule('[class*="Voice_avatarSpeaking__"]', speaking_avatar);
        plain_text += buildRule('[class*="Voice_user__"]', voice_user);
        plain_text += buildRule('[class*="Voice_name__"]', name);

        return (plain_text.trim());
    }

    function compileCustomAvatar(users: DiscordUser[]) {
        var plain_text = "";
        for (const usr of users.filter((v) => v.id !== "")) {
            if (usr.avatar || usr.talk_avatar)
                plain_text += `/* User: ${usr.username} (${usr.id}) */\n`
            if (usr.avatar)
                plain_text += `img[class*="Voice_avatar__"]:([class*="Voice_avatarSpeaking__"])[src*="/${usr.id}/"] {content: url("${usr.avatar}");}\n`;
            if (usr.talk_avatar)
                plain_text += `img[class*="Voice_avatar__"][class*="Voice_avatarSpeaking__"][src*="/${usr.id}/"] {content: url("${usr.talk_avatar}") !important;}\n`;
            plain_text = plain_text.trimEnd();
            plain_text += "\n\n";
        }
        plain_text += "\n" + freeCSS;
        return (plain_text.trim())
    }

    const compiled_css = compileStyle() + "\n\n" + compileCustomAvatar(users);

    return (
        <div className="">
            <h1>Discord Vocal Overlay</h1>
            <div className="controls">
                <ul>
                    <li>
                        <input type="checkbox" id="display-name" onChange={() => setNameDisplay(!nameDisplay)} defaultChecked={!nameDisplay} />
                        <label htmlFor="display-name">Hide usernames</label>
                    </li>
                    <li>
                        <input type="checkbox" id="silent-dim" onChange={() => setSilentDim(!silentDim)} defaultChecked={silentDim} />
                        <label htmlFor="silent-dim">Dim silent users</label>
                    </li>
                    <li>
                        <input type="checkbox" id="single-line" onChange={() => setSingleLine(!singleLine)} defaultChecked={singleLine} />
                        <label htmlFor="single-line">Single line</label>
                    </li>
                    <li>
                        <label htmlFor="avatar-border-radius">Round avatar:</label>
                        <input type="number" id="avatar-border-radius" min="0" onChange={(ev) => setBorderRadius(Number(ev.target.value))} defaultValue={borderRadius} />
                    </li>
                    <li>
                        <input type="checkbox" id="speak-bump" onChange={() => setSpeakBump(!speakBump)} defaultChecked={speakBump} />
                        <label htmlFor="speak-bump">Speak bump</label>
                    </li>
                    <li>
                        <input type="checkbox" id="loop-animation" disabled={!speakBump} onChange={() => setLoopAnimation(!loopAnimation)} defaultChecked={loopAnimation} />
                        <label htmlFor="loop-animation">Loop speaking animation</label>
                    </li>
                    <li>
                        <label htmlFor="set-width" >Avatar width:</label>
                        <input type="number" id="set-width" onChange={(ev) => {
                            const value = Number(ev.target.value);
                            const sizing: ISize = {
                                width: isNaN(value) || value <= 0 ? "auto" : value,
                                height: size.height
                            }
                            setSize(sizing);
                        }} defaultValue={size.width || 0} />
                    </li>
                </ul>

                <div className="free-css">
                    <label htmlFor="free_css">Other CSS:</label>
                    <textarea onChange={(e) => setFreeCSS(e.target.value)}></textarea>
                </div>
            </div>

            <h2>Users</h2>
            {users.map((usr, index) => {
                return (<UserInfoForm key={index} user={usr} index={index} removeUser={removeUser} handleChange={(ev: any) => {
                    editUser(ev, index);
                }} />);
            })}
            <button type="button" onClick={newUser}>+</button>

            <h2>Preview</h2>
            <p>Ordered alphabetically just like on Discord, click the user to make them "speak".</p>
            <div className="preview-box">
                <Preview users={users} style={compiled_css.trim()} />
            </div>

            <h2>Code</h2>
            <textarea className="copy-paste" value={compiled_css.trim()} readOnly></textarea>
            <CopyButton value={compiled_css.trim()} />
        </div>
    );
}
