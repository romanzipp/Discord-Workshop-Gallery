import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { useDiscordBot } from '@/lib/discord';

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.send({ error: 'unauthenticated' });
    }

    const discord = useDiscordBot(async (client) => {
        const guild = await client.guilds.fetch(req.query.guild_id);
        const channels = await guild.channels.fetch();

        return channels.filter((channel) => channel.type === 0);
    });

    const channelsResponse = await discord;

    console.log('channels response:', channelsResponse);

    res.send({
        data: channelsResponse,
    });
};
