import React, { useEffect, useState } from "react";

interface UserInfoFormProps {
    user: DiscordUser;
    index: number;
    handleChange: (ev: any, index: number) => void;
    removeUser: (index: number) => void;
}

export default function UserInfoForm({ user, index, handleChange, removeUser }: UserInfoFormProps) {
    return (<form onChange={(ev) => handleChange(ev, index)}>
        <button type="button" onClick={() => removeUser(index)}>-</button>
        <label htmlFor={`username-${index}`}>Username: </label>
        <input type="text" name="username" id={`username-${index}`} defaultValue={user.username} />

        <label htmlFor={`userid-${index}`}>User ID: </label>
        <input type="number" name="id" id={`userid-${index}`} pattern="\d+" placeholder="Discord user ID" defaultValue={user.id} />

        <label htmlFor={`avatar-url-${index}`}>Avatar URL: </label>
        <input type="text" name="avatar" id={`avatar-url-${index}`} defaultValue={user.avatar} disabled={!user.id} />

        <label htmlFor={`avatar-talking-url-${index}`}>Avatar Talking URL: </label>
        <input type="text" name="talk_avatar" id={`avatar-talking-url-${index}`} defaultValue={user.talk_avatar} disabled={!user.id} />
    </form>)
}

// https://cdn.discordapp.com/attachments/974684903528615978/1053814467894464614/Screenshot_2022-12-18_at_00.22.19.png
