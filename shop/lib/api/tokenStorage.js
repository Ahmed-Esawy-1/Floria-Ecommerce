const KEY = "flow_auth";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
    // Returns { accessToken, refreshToken, remember } or null
    load() {
        if (!isBrowser()) return null;
        try {
            const inLocal = localStorage.getItem(KEY);
            const raw = inLocal ?? sessionStorage.getItem(KEY);
            if (!raw) return null;
            const { accessToken, refreshToken } = JSON.parse(raw);
            if (!accessToken) return null;
            return {
                accessToken,
                refreshToken: refreshToken ?? null,
                remember: inLocal !== null,
            };
        } catch {
            return null;
        }
    },

    // remember = true  => localStorage (survives browser restart)
    // remember = false => sessionStorage (cleared when the tab closes)
    save({ accessToken, refreshToken, remember }) {
        if (!isBrowser()) return;
        try {
            const target = remember ? localStorage : sessionStorage;
            const other = remember ? sessionStorage : localStorage;
            other.removeItem(KEY);
            target.setItem(KEY, JSON.stringify({ accessToken, refreshToken }));
        } catch {
            // storage unavailable (private mode / quota) - stay in memory only
        }
    },

    clear() {
        if (!isBrowser()) return;
        try {
            localStorage.removeItem(KEY);
            sessionStorage.removeItem(KEY);
        } catch {}
    },
};
