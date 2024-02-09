export function useDiscord(accessToken) {
    const makeRequest = async (url, options) => {
        const response = await fetch(`https://discord.com/${url}`, {
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await response.json();
    };

    return {
        api: makeRequest,
    };
}
