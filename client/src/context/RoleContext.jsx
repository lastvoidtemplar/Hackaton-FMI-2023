import React, { createContext, useReducer} from 'react'

export const RoleContext = createContext();

const initialState = {
    role: "",
}

const roleReducer= (state, action) => {
    switch(action.type) {
        case 'LEAVE_PARTY':
            return {...state, role: "Guest"}
        case 'START_PARTY':
            return {...state, role: "Owner"}
    }
}

export const RoleProvider = ({ children }) => {
    const [role, roleDispatch] = useReducer(roleReducer, initialState)

    return (
        <RoleContext.Provider value={{
            role,
            roleDispatch
        }}>
            {children}
        </RoleContext.Provider>
    )
}