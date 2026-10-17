import axios from "axios";

const TOKENS_KEY = "authTokens";

// ----  LOAD TOKENS IF EXITS ----------------------------------------
export function readStoredTokens() {
    const raw =
        localStorage.getItem(TOKENS_KEY) || sessionStorage.getItem(TOKENS_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// ---- SAVE TOKENS ----------------------------------------
export function persistTokens(tokens, rememberMe) {
    const value = JSON.stringify(tokens);
    console.log("Tokens => ", value);
    if (rememberMe) {
        localStorage.setItem(TOKENS_KEY, value);
        sessionStorage.removeItem(TOKENS_KEY);
    } else {
        sessionStorage.setItem(TOKENS_KEY, value);
        localStorage.removeItem(TOKENS_KEY);
    }
}

// ---- CLEAR TOKENS ----------------------
export function clearStoredTokens() {
    localStorage.removeItem(TOKENS_KEY);
    sessionStorage.removeItem(TOKENS_KEY);
}

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Make [Authorization: Bearer ${accessToken}]  FOR EVERY REQUEST
api.interceptors.request.use((config) => {
    const tokens = readStoredTokens();
    if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
});

// ---- On a 401, REFRESH access token once -------------------
let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // Unauthorized
        if (response?.status !== 401 || config?._retry) {
            throw error;
        }

        // Refresh
        const tokens = readStoredTokens();
        if (!tokens?.refreshToken) {
            clearStoredTokens();
            throw error;
        }

        config._retry = true; // Prevent infinite loop

        try {
            refreshPromise =
                refreshPromise ??
                axios.post(`${api.defaults.baseURL}/auth/refresh`, {
                    refreshToken: tokens.refreshToken,
                });

            const { data: newTokens } = await refreshPromise;
            const stillRemembered = !!localStorage.getItem(TOKENS_KEY);
            persistTokens(newTokens, stillRemembered);

            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(config);
        } catch (refreshError) {
            clearStoredTokens();
            window.location.href = "/login";
            throw refreshError;
        } finally {
            refreshPromise = null;
        }
    },
);

export default api;
