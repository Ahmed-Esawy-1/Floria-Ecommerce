import { Suspense } from "react";
import ConfirmationView from "@/features/checkout/ConfirmationView";

export const metadata = {
    title: "Order Confirmation",
    robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
    return (
        <Suspense fallback={null}>
            <ConfirmationView />
        </Suspense>
    );
}
