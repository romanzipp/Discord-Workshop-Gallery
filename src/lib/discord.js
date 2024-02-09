export function useDiscord(accessToken) {
    const makeRequest = async (url, options = {}) => {
        const response = await fetch(`https://discord.com${url}`, {
            ...options,
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (response.status < 200 || response.status >= 300) {
            console.log('-------------------------------------------------- Error in API');
            console.log('url:', url);
            console.log('status:', response.status, response.statusText);
            console.log('token:', accessToken);
            console.log(data);
            console.log('--------------------------------------------------');

            const error = new Error(`Error ${response.status} when querying ${url}`);
            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    };

    return {
        api: makeRequest,
    };
}
