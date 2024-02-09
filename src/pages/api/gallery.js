import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { useDiscordBot } from '@/lib/discord';

function messageIsDivider(content) {
    return content.includes('------------------------------------------------------------')
    || content.includes('THANK YOU FOR ALL YOUR SUBMISSIONS');
}

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.send({ error: 'unauthenticated' });
    }

    const discord = useDiscordBot(async (client) => {
        const guild = await client.guilds.fetch(req.query.guild_id);
        const channel = await guild.channels.fetch(req.query.channel_id);

        const before = null;
        let i = 0;
        const allMessages = {};

        // eslint-disable-next-line no-constant-condition
        while (true) {
            i += 1;

            // eslint-disable-next-line no-await-in-loop
            const messages = await channel.messages.fetch({
                limit: 100,
                before,
            });

            let hasDivider = false;

            messages.forEach((message) => {
                hasDivider = hasDivider || messageIsDivider(message.content);

                if (hasDivider) {
                    return false;
                }

                allMessages[message.id] = message;

                return true;
            });

            if (hasDivider || i >= 10) {
                break;
            }
        }

        return Object.values(allMessages).map((message) => ({
            ...message,
            attachments: message.attachments,
        }));
    });

    const messagesResponse = await discord;

    res.send({
        data: messagesResponse,
    });
};
