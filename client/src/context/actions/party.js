import axios from "axios"

export const join = async (accessToken, user_id, partyCode) => {
    const config = {
        url: `${VITE_PYTHON_URL}/api/join`,
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const { data, error } = await axios({
        config, 
        params: {
            user_id,
            partyCode
        } });
        
    return {
        data: data || null,
        error,
    };
}

export const leave = async (accessToken, user_id, partyCode) => {
    const config = {
        url: `${VITE_PYTHON_URL}/api/leave`,
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const { data, error } = await axios({
        config, 
        params: {
            user_id,
            partyCode
        } });

    return {
        data: data || null,
        error,
    };
}