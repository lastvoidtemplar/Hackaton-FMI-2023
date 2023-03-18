import React, { createContext, useReducer} from 'react'

export const UserContext = createContext();

const initialState = {
    role: "",
}

const userReducer= (state, action) => {
    switch(action.type) {
        case 'LEAVE_PARTY':
            return {...state, role: "Guest"}
        case 'START_PARTY':
            return {...state, role: "Owner"}
    }
}

export const UserProvider = ({ children }) => {
    const [auth, userDispatch] = useReducer(userReducer, initialState)

    return (
        <UserContext.Provider value={{
            auth,
            userDispatch
        }}>
            {children}
        </UserContext.Provider>
    )
}