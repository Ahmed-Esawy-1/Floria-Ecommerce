import CheckoutView from "@/features/checkout/CheckoutView";

export const metadata = {
    title: "Checkout",
    robots: { index: false, follow: false },
};

export default function CheckoutPage() {
    return <CheckoutView />;
}
