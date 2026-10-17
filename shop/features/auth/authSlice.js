import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    remember: false,
    initialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },

        // Once from AuthInitializer
        hydrate: (state, { payload }) => {
            if (payload) {
                state.accessToken = payload.accessToken;
                state.refreshToken = payload.refreshToken ?? null;
                state.remember = Boolean(payload.remember);
            }
            state.initialized = true;
        },

        // After login (with remember) and after token refresh (without remember)
        setCredentials: (state, { payload }) => {
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken ?? null;
            if (payload.remember !== undefined) {
                state.remember = Boolean(payload.remember);
            }
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.remember = false;
        },
    },
});

export const { setUser, hydrate, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
