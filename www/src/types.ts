export interface ILinks {
    href: string;
    title?: string;
};

export interface DiscordUser {
    id: string;
    username: string;
    speaking: boolean;
    avatar?: string;
    talk_avatar?: string;
};
