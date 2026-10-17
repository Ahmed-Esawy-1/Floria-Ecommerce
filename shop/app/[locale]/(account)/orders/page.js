import OrdersView from "@/features/orders/OrdersView";

export const metadata = {
    title: "My Orders",
    robots: { index: false, follow: false },
};

export default function OrdersPage() {
    return <OrdersView />;
}
