import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { useDiscord } from '@/lib/discord';

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.send({ error: 'unauthenticated' });
    }

    console.log(session);

    const discord = useDiscord(session.accessToken);

    try {
        const guildsResponse = await discord.api('/api/users/@me/guilds');

        res.send({
            data: guildsResponse,
        });
    } catch (err) {
        res.send({
            error: 'error getting guilds',
            data: err,
        });
    }

    if (session) {
        res.send({
            content: 'This is protected content. You can access this content because you are signed in.',
        });
    } else {
        res.send({
            error: 'You must be signed in to view the protected content on this page.',
        });
    }
};
