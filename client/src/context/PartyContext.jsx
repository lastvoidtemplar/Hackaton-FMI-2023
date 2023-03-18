import React, { createContext, useReducer} from 'react'

export const PartyContext = createContext();

const initialState = {
    queue: [],
    name: "",
    code: "",
    nowPlaying: {}
}

const partyReducer = (state, action) => {
    switch(action.type) {
        case 'START_PARTY':
            return {...state, queue:[...action.payload.queue], name: action.payload.name, code: action.payload.code, }
        case 'UPDATE_QUEUE':
            return {...state, queue:[...action.payload.queue]}
        case 'SONG_END':
            return {...state, queue: queue.slice(1), nowPlaying: queue.slice(0, 1)}
        case 'NULLIFY_PARTY':
            return {...state, queue: [], name: "", code: "", nowPlaying: {}}
    }
}

export const PartyProvider = ({ children }) => {
    const [party, partyDispatch] = useReducer(partyReducer, initialState)

    return (
        <PartyContext.Provider value={{
            party,
            partyDispatch
        }}>
            {children}
        </PartyContext.Provider>
    )
}