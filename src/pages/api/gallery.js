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
        const channel = await guild.channels.fetch(req.query.channel_id);

        const messages = await channel.messages.fetch();

        console.log(messages);

        return messages.map((message) => ({
            ...message,
            attachments: message.attachments,
        }));
    });

    const messagesResponse = await discord;

    res.send({
        data: messagesResponse,
    });
};