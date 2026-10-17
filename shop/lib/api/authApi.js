import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { watchlistApi } from "./watchlistApi";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,

    // "Me" is provided by getMe and invalidated after profile changes
    tagTypes: ["Me"],

    endpoints: (builder) => ({
        // Login -> { accessToken, refreshToken }
        login: builder.mutation({
            query: ({ email, password, rememberMe = false }) => ({
                url: "/auth/login",
                method: "POST",
                body: { email, password, rememberMe },
            }),
            async onQueryStarted(
                { rememberMe = false },
                { dispatch, queryFulfilled },
            ) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ ...data, remember: rememberMe }));
                } catch (err) {}
            },
        }),

        // Sign Up
        signup: builder.mutation({
            query: (body) => ({ url: "/auth/signup", method: "POST", body }),
        }),

        verifySignup: builder.mutation({
            query: ({ email, code }) => ({
                url: "/auth/signup/verify",
                method: "POST",
                body: { email, code },
                responseHandler: "text",
            }),
        }),

        resendCode: builder.mutation({
            query: ({ email }) => ({
                url: "/auth/signup/resend",
                method: "POST",
                body: { email },
                responseHandler: "text",
            }),
        }),

        // Current user -> { user, dashboardAccess }
        getMe: builder.query({
            query: () => "/auth/me",
            providesTags: ["Me"],
        }),

        // Logout: blacklists the access token on the server, then clears locally
        logout: builder.mutation({
            // queryFn gives access to getState, so we can read the refresh token here
            async queryFn(_arg, { getState }, _extraOptions, baseQuery) {
                const { refreshToken } = getState().auth;

                return baseQuery({
                    url: "/auth/logout",
                    method: "POST",
                    body: { refreshToken },
                    responseHandler: "text",
                });
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch {
                    // even if the call fails, sign the user out locally
                }
                dispatch(logout());
                dispatch(authApi.util.resetApiState());
                dispatch(watchlistApi.util.resetApiState());
            },
        }),

        // ---- Account: profile ----

        // Update profile
        updateProfile: builder.mutation({
            query: ({ userName, imageFile }) => {
                const formData = new FormData();
                formData.append("userName", userName);
                if (imageFile) {
                    formData.append("image", imageFile);
                }

                return {
                    url: "/auth/updateProfile",
                    method: "PUT",
                    body: formData,
                };
            },

            invalidatesTags: (result, error) => (error ? [] : ["Me"]),
        }),

        // ---- Account: password change ----

        // Change Password
        requestPasswordChange: builder.mutation({
            query: ({ oldPassword, newPassword, confirmNewPassword }) => ({
                url: "/account/change-password",
                method: "PUT",
                body: { oldPassword, newPassword, confirmNewPassword },
                responseHandler: "text",
            }),
        }),

        // Confirm Change password
        confirmPasswordChange: builder.mutation({
            query: ({ code }) => ({
                url: "/account/change-password/confirm",
                method: "POST",
                body: { code },
                responseHandler: "text",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                    dispatch(authApi.util.resetApiState());
                    dispatch(watchlistApi.util.resetApiState());
                } catch {
                    // keep the user signed in if the code was wrong
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useVerifySignupMutation,
    useResendCodeMutation,
    useGetMeQuery,
    useLogoutMutation,
    useUpdateProfileMutation,
    useRequestPasswordChangeMutation,
    useConfirmPasswordChangeMutation,
} = authApi;
