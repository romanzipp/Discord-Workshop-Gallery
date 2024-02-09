import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DSICORD_CLIENT_ID,
            clientSecret: process.env.DSICORD_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'bot identify guilds messages.read',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            console.log(account);
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

export default NextAuth(authOptions);
