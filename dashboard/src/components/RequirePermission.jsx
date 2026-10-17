import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export default function RequirePermission({ permission, children }) {
    const { hasPermission, isLoading } = useAuth();
    if (isLoading) return null;
    return hasPermission(permission) ? (
        children
    ) : (
        <Navigate to="/dashboard" replace />
    );
}
