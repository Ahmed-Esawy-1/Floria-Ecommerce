import { Suspense } from "react";
import VerifyEmailView from "@/features/auth/VerifyEmailView";

export const metadata = {
    title: "Verify Email",
    robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailView />
        </Suspense>
    );
}
