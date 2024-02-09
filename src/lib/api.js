import { useQuery } from '@tanstack/react-query';

async function jsonFetch(url, options) {
    const res = await fetch(url, options);

    return res.json();
}

export function useGallery({ session, selectedGuild }) {
    return useQuery({
        queryKey: ['gallery'],
        queryFn: () => jsonFetch('/api/gallery'),
        enabled: !!session && selectedGuild !== null,
    });
}

export function useGuilds({ session, selectedGuild }) {
    return useQuery({
        queryKey: ['guilds'],
        queryFn: () => jsonFetch('/api/guilds'),
        enabled: !!session && !selectedGuild,
    });
}

export function useChannels({ session, selectedGuild }) {
    return useQuery({
        queryKey: ['channels', selectedGuild],
        queryFn: () => jsonFetch(`/api/channels?guild_id=${selectedGuild}`),
        enabled: !!session && !!selectedGuild,
    });
}
