import axios from 'axios'

export const search = async (transport) => {
    try {
        const res = await transport.get(`${VITE_API_SERVER_URL}/queue/search/q=${q}&party=${party}&user=${user}`, {
            params: {
                q: 1,
                party: 5,
                user: 7
            }
        })
        contactDispatch({
            type: 'CONTACTS_GET',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
}