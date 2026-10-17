"use client";

import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import { useGetMeQuery } from "@/lib/api/authApi";
import { hydrate, setUser } from "@/features/auth/authSlice";
import { tokenStorage } from "@/lib/api/tokenStorage";

const tokensKey = (a) => `${a.accessToken}|${a.refreshToken}|${a.remember}`;

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const store = useStore();
    const accessToken = useSelector((s) => s.auth.accessToken);

    // Ask auth/me if token exist
    const { data } = useGetMeQuery(undefined, { skip: !accessToken });

    // Load Token & Make storage concarence with Redux
    useEffect(() => {
        dispatch(hydrate(tokenStorage.load()));

        let lastKey = tokensKey(store.getState().auth);
        return store.subscribe(() => {
            const auth = store.getState().auth;
            const key = tokensKey(auth);
            if (key === lastKey) return;
            lastKey = key;

            if (auth.accessToken) tokenStorage.save(auth);
            else tokenStorage.clear();
        });
    }, [dispatch, store]);


    useEffect(() => {
        dispatch(setUser(accessToken ? (data?.user ?? null) : null));
    }, [data, accessToken, dispatch]);

    return children;
}
