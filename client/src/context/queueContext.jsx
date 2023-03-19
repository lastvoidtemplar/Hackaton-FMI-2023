import React, { createContext, useReducer } from 'react';

export const QueueContext = createContext();

const initialState = {
    queue: [],
    nowPlaying: null,
    searchQueue: []
};

const queueReducer = (state, action) => {
    switch(action.type) {
        case 'QUEUE_UPDATE':
            return {...state, queue: action.payload.map.forEach((el, i) => {
                {el.track, el.score}
            })}
        case 'PLAY':
            return {...state, nowPlaying: action.payload.np}
        case 'QUEUE_SEARCH':
            return {...state, searchQueue: action.payload.map.forEach((el, i) => {
                {el.track, el.score}
            })}
    }
}

export const QueueProvider = ({ children }) => {
    const [queueState, queueStateDispatch] = useReducer(queueReducer, initialState);

    return (
    <QueueContext.Provider value = {{
        queueState, 
        queueStateDispatch
    }}>
        {children}
    </QueueContext.Provider>);
};