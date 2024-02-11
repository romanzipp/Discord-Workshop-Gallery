import { useQuery } from '@tanstack/react-query';

async function jsonFetch(url, options) {
    const res = await fetch(url, options);

    return res.json();
}

export function useGallery({ session, selectedGuild, selectedChannel }) {
    return useQuery({
        queryKey: ['gallery'],
        queryFn: () => jsonFetch(`/api/gallery?guild_id=${selectedGuild}&channel_id=${selectedChannel}`),
        enabled: !!session && !!selectedGuild && !!selectedChannel,
        retry: 2,
    });
}

export function useGuilds({ session, selectedGuild }) {
    return useQuery({
        queryKey: ['guilds'],
        queryFn: () => jsonFetch('/api/guilds'),
        enabled: !!session && !selectedGuild,
        retry: 2,
    });
}

export function useChannels({ session, selectedGuild, selectedChannel }) {
    return useQuery({
        queryKey: ['channels', selectedGuild],
        queryFn: () => jsonFetch(`/api/channels?guild_id=${selectedGuild}`),
        enabled: !!session && !!selectedGuild && !selectedChannel,
        retry: 2,
    });
}
