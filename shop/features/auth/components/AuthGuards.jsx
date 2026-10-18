"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import Spinner from "@/components/loading/Spinner";

function FullScreenSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner />
        </div>
    );
}

// NOT LOGGED
export function RequireAuth({ children }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) return <FullScreenSpinner />;

    return children;
}

// LOGGED
export function GuestOnly({ children }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || isAuthenticated) return <FullScreenSpinner />;

    return children;
}
