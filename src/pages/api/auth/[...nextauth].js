import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: process.env.DSICORD_CLIENT_ID,
            clientSecret: process.env.DSICORD_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'guilds messages.read',
                },
            },
        }),
    ],
};

export default NextAuth(authOptions);
