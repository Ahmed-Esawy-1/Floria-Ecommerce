"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { useTranslations } from "next-intl";
import Spinner from "@/components/loading/Spinner";

export default function OAuthCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const dispatch = useDispatch();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;

        handled.current = true;

        const code = params.get("code");
        if (!code) {
            router.replace("/login?error=oauth");
            return;
        }

        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth/exchange`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                        credentials: "include", // needed so the HttpOnly refresh_token cookie is sent
                    },
                );

                if (!res.ok) throw new Error("Exchange failed");

                const { accessToken } = await res.json();

                const payload = {
                    accessToken,
                    refreshToken: null, // refresh lives in the HttpOnly cookie
                    remember: true,
                };

                tokenStorage.save(payload);
                dispatch(setCredentials(payload));

                router.replace("/");
            } catch {
                router.replace("/login?error=oauth");
            }
        })();
    }, [params, router, dispatch]);

    // --------------------------------------------------------
    const t = useTranslations("auth.oauthCallback");
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Spinner />
            <p className="text-slate-500">{t("signingIn")}</p>
        </div>
    );
}
