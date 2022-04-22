import React, { useEffect, useState } from "react";

import "@app/discord/vocal_preview.css";

interface PreviewSpeakerProps {
    user: DiscordUser;
    index?: number;
}

function PreviewSpeaker({ user }: PreviewSpeakerProps) {
    const [speaking, setSpeaking] = useState<boolean>(user.speaking);
    const attr_id = `$${user.id}/=1$${user.id}`

    useEffect(() => {
        setSpeaking(user.speaking);
    }, [user.speaking]);

    return (
        <li className="voice-state" data-reactid={`.0.0.0.${attr_id}`} onClick={() => setSpeaking(!speaking)}>
            <img className={`avatar ${speaking ? "speaking" : ""}`} src={`${user.avatar || "https://cdn.discordapp.com/avatars/160110285066207232/d4312fc4392c0cd1a4796c57b7a36b3d.jpg"}`} data-reactid={`.0.0.0.${attr_id}.$=10`} />
            <div className="user" data-reactid={`.0.0.0.${attr_id}.$/=11`}>
                <span className="name" style={{ color: '#ffffff', fontSize: '14px', backgroundColor: 'rgba(30, 33, 36, 0.95)' }} data-reactid={`.0.0.0.${attr_id}.$/=11.0`}>{user.username}</span>
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
                <div className="voice-container">
                    <ul className="voice-states">
                        {sortedUsers.map((user: DiscordUser, index: number) => <PreviewSpeaker key={index} user={user} />)}
                    </ul>
                </div>
            </div>
        </div>
    </>);
}
