import React, { useEffect, useState } from "react";

import "@app/discord/vocal_preview.css";

interface DiscordUser {
    id: string;
    username: string;
    speaking: boolean;
    avatar?: string;
    talk_avatar?: string;
};

interface Size {
    width: number | "auto";
    height: number | "auto";
}

interface UserInfoFormProps {
    user: DiscordUser;
    index: number;
    handleChange: any;
}

function UserInfoForm({ user, index, handleChange }: UserInfoFormProps) {
    return (<form onChange={handleChange}>
        <label htmlFor={`username-${index}`}>Username: </label>
        <input type="text" name="username" id={`username-${index}`} defaultValue={user.username} />

        <label htmlFor={`userid-${index}`}>User ID: </label>
        <input type="number" name="id" id={`userid-${index}`} pattern="\d+" defaultValue={user.id} />

        <label htmlFor={`avatar-url-${index}`}>Avatar URL: </label>
        <input type="text" name="avatar" id={`avatar-url-${index}`} defaultValue={user.avatar} />

        <label htmlFor={`avatar-talking-url-${index}`}>Avatar Talking URL: </label>
        <input type="text" name="talk_avatar" id={`avatar-talking-url-${index}`} defaultValue={user.talk_avatar} />

        {/* <input type="checkbox" id={`is-talking-${index}`} checked={user.speaking}/>
        <label htmlFor={`is-talking-${index}`}>Speaking</label> */}
    </form>)
}


interface PreviewProps {
    users: DiscordUser[];
    style: string;
}

function Preview({ users, style }: PreviewProps) {
    return (<>
        <style>{style}</style>

        <div id="discord-preview">
            <div style={{ fontFamily: 'Whitney, sans-serif, sans', backgroundColor: 'transparent' }}>
                <div className="voice-container">
                    <ul className="voice-states">
                        {users.map((usr: DiscordUser, index) => {
                            const attr_id = `$${usr.id}/=1$${usr.id}`
                            const [speaking, setSpeaking] = useState<boolean>(usr.speaking);

                            return (
                                <li key={index} className="voice-state" data-reactid={`.0.0.0.${attr_id}`} onClick={() => setSpeaking(!speaking)}>
                                    <img className={`avatar ${speaking ? "speaking" : ""}`} src={`${usr.avatar || "https://cdn.discordapp.com/avatars/160110285066207232/d4312fc4392c0cd1a4796c57b7a36b3d.jpg"}`} data-reactid={`.0.0.0.${attr_id}.$=10`} />
                                    <div className="user" data-reactid={`.0.0.0.${attr_id}.$/=11`}>
                                        <span className="name" style={{ color: '#ffffff', fontSize: '14px', backgroundColor: 'rgba(30, 33, 36, 0.95)' }} data-reactid={`.0.0.0.${attr_id}.$/=11.0`}>{usr.username}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    </>);
}

// Based on https://blog.senpaisilver.com/web/discord-animated-voice-pngs/
export default function VocalOverlay() {
    const [users, setUsers] = useState<DiscordUser[]>([
        {
            id: "1234",
            username: "SilentUser",
            speaking: false,
            avatar: 'https://cdn.discordapp.com/avatars/160110285066207232/d4312fc4392c0cd1a4796c57b7a36b3d.jpg'
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
        console.log(users.concat(newuser))
        setUsers(users => {
            return (users.concat([newuser]))
        })
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
                <input type="checkbox" id="display-name" onChange={() => setNameDisplay(!nameDisplay)} defaultChecked={nameDisplay} />
                <label htmlFor="display-name" defaultChecked={nameDisplay}>Hide usernames</label>
            </div>

            <div>
                <label htmlFor="free_css">Other CSS:</label>
                <textarea style={{display: "block"}} onChange={(e) => setFreeCSS(e.target.value)}></textarea>
            </div>

            <h2>Users</h2>
            {users.map((usr, index) => {
                // FIXME: Not updating the user element
                return (<UserInfoForm key={index} user={usr} index={index} handleChange={(e: any) => {
                    console.log(index, e, e.target.name, e.target.value);
                    const field: string = e.target.name as string;
                    const value: string = e.target.value as string;
                    var current_users: DiscordUser[] = users;
                    var cur_usr = Object(current_users[index])
                    cur_usr[field] = value
                    current_users[index] = cur_usr;
                    console.log(current_users[index]);
                    setUsers(current_users);
                }}/>);
            })}
            <button type="button" onClick={newUser}>+</button>

            <h2>Code</h2>
            <pre style={{ padding: "5px", fontFamily: "monospace", border: "3px solid black", display: "block" }}>
                <code>{compiled_css.trim()}</code>
            </pre>

            <h2>Preview</h2>
            <div style={{ border: "3px solid black" }}>
                <Preview users={users} style={compiled_css.trim()} />
            </div>
        </div>
    );
}
