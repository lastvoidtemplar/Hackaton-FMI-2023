import axios from "axios"

const authenticateAPICall = async ({config}) => {
    const transport = axios.create(config)
    return await transport.post('/api/')
}

export const authenticate = async (accessToken) => {
    const config = {
        url: `${VITE_API_SERVER_URL}/api/`,
        method: "GET",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        };

        const { data, error } = await authenticateAPICall({ config });
    return {
        data: data || null,
        error,
    };
        
}