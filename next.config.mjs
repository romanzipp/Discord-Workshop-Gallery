/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        preselectGuildId: process.env.PRESELECT_GUILD_ID,
        preselectChannelId: process.env.PRESELECT_CHANNEL_ID,
    },
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.discordapp.com',
            },
        ],
    },
};

export default nextConfig;
