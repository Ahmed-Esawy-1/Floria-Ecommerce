import { GuestOnly } from "@/features/auth/components/AuthGuards";

export default function AuthLayout({ children }) {
    return <GuestOnly>{children}</GuestOnly>;
}
