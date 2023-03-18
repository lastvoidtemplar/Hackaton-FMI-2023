import axios from "axios"

const authenticateAPICall = async ({config, user_id}) => {
    const reqBody = JSON.stringify({user_id})
    const transport = axios.create(config)
    return await transport.post(reqBody)
}

export const authenticate = async (accessToken, user_id) => {
    const config = {
        url: `${VITE_NODE_URL}/api/`,
        method: "GET",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const { data, error } = await axios({
        config, 
        params: {
            user_id
        } });
    return {
        data: data || null,
        error,
    };
        
}