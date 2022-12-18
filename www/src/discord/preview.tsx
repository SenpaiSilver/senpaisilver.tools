import React, { useEffect, useState } from "react";

import "@app/discord/vocal_preview.css";

interface PreviewSpeakerProps {
    user: DiscordUser;
    index?: number;
}

function PreviewSpeaker({ user }: PreviewSpeakerProps) {
    const [speaking, setSpeaking] = useState<boolean>(user.speaking);
    const attr_id = `$${user.id}/=1$${user.id}`;
    const avatar = user.avatar || "/static/discord/avatar_default_silent.png";

    const style_span = {
        color: "rgb(255, 255, 255)",
        fontSize: "14px",
        backgroundColor: "rgba(30, 33, 36, 0.95)"
    }

    useEffect(() => {
        setSpeaking(user.speaking);
    }, [user.speaking]);
    // id                                 160110285066207232
    // https://cdn.discordapp.com/avatars/160110285066207232/d4312fc4392c0cd1a4796c57b7a36b3d.jpg
    return (
        <li className="Voice_voiceState__OCoZh" onClick={() => setSpeaking(!speaking)}>
            <img className={`Voice_avatar__htiqH ${speaking ? " Voice_avatarSpeaking__Lali" : ""}`} src={`${avatar}#userIDtrick/${user.id}/`} alt="" />
            <div className="Voice_user__8fGwX">
                <span className="Voice_name__TALd9" style={style_span}>{user.username}</span>
            </div>
        </li>
    )
}


interface PreviewProps {
    users: DiscordUser[];
    style: string;
}

export default function Preview({ users, style }: PreviewProps) {
    const [sortedUsers, setSortedUsers] = useState<DiscordUser[]>([]);

    useEffect(() => {
        setSortedUsers([...users].sort((a, b) => a.username.toLocaleLowerCase() < b.username.toLocaleLowerCase() ? -1 : 1))
    }, [users]);


    return (<>
        <style>{style}</style>
        <div id="discord-preview">
            <div style={{ fontFamily: 'Whitney, sans-serif, sans', backgroundColor: 'transparent' }}>
                <div className="Voice_voiceContainer__adk9M">
                    <ul className="Voice_voiceStates__a121W">
                        {sortedUsers.map((user: DiscordUser, index: number) => <PreviewSpeaker key={index} user={user} />)}
                    </ul>
                </div>
            </div>
        </div>
    </>);
}
