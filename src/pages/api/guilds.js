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
        const guildsResponse = await discord.api('/api/users/@me/guilds');

        res.send({
            data: guildsResponse,
        });
    } catch (err) {
        res.send({
            error: err.message,
            data: err,
        });
    }
};