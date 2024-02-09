import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { useDiscord } from '@/lib/discord';

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.send({ error: 'unauthenticated' });
    }

    const discord = useDiscord(session.accessToken);

    try {
        const channelsResponse = await discord.api(`/api/guilds/${req.query.guild_id}/channels`);

        res.send({
            data: channelsResponse,
        });
    } catch (err) {
        res.send({
            error: 'error getting channels',
            data: err?.data,
            status: err?.status,
        });
    }
};
