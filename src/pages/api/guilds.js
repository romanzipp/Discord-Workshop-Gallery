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

        const guilds = guildsResponse.filter((guild) =>
            // check for admin permission
            // https://discord.com/developers/docs/topics/permissions
            (guild.permissions & 0x0000000000000008) === 0x0000000000000008);

        res.send({
            data: guilds,
        });
    } catch (err) {
        res.send({
            error: err.message,
            data: err,
        });
    }
};
