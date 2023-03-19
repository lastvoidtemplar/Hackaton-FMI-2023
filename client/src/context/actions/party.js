import axios from "axios"

export const join = async (accessToken, user_id, partyCode) => {
    const config = {
        url: `${import.meta.env.VITE_PYTHON_URL}/api/join`,
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
        url: `${import.meta.env.VITE_PYTHON_URL}/api/leave`,
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

export const getQueue = async (party_id, queueDispatch) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/queue/get`, {params: {
            id: party_id
        }})
        queueDispatch({
            type: "QUEUE_UPDATE",
            payload: res.data
        })
        return res;
    } catch(error) {
        return null;
    }
}

export const addQueue = async (party_id, track_id, queueDispatch) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/add`, {params: {
            id: party_id,
            track_id
        }})
        queueDispatch({
            type: "QUEUE_UPDATE",
            payload: res.data
        })
        return res;
    } catch(error) {
        return null;
    }
}

export const search = async (party_id, query, queueDispatch) => {
    console.log("dkjajdsajsd")
    //try {
        const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/queue/search`, {params: {
            q: query,
            id: party_id
        }})
        console.log(res)
        queueDispatch({
            type: "QUEUE_SEARCH",
            payload: res.data
        })
        //return res;
   // } catch(error) {
   //     return null;
    //}
}

export const vote = async (user_id, party_id, track_id, dir, queueDispatch) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/vote`, {params: {
            id: party_id,
            song: track_id,
            user: user_id,
            dir
        }})
        queueDispatch({
            type: "QUEUE_UPDATE",
            payload: res.data
        })
        return res;
    } catch(error) {
        return null;
    }
}

export const nowPlaying = async (queueDispatch) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/np`, {params: {
            id: party_id
        }})
        queueDispatch({
            type: "PLAY",
            payload: res.data
        })
        return res;
    } catch(error) {
        return null;
    }
}