import { RequireAuth } from "@/features/auth/components/AuthGuards";

export default function AccountLayout({ children }) {
    return <RequireAuth>{children}</RequireAuth>;
}
