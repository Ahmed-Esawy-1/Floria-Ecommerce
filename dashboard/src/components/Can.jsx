import { useAuth } from "@/contexts/AuthContext";

/**
 * <Can permission={PERMISSIONS.DELETE_PRODUCT}>
 *   <button onClick={handleDelete}>Delete</button>
 * </Can>
 * <Can anyOf={[PERMISSIONS.UPDATE_ORDER, PERMISSIONS.DELETE_ORDER]}>...</Can>
 */
export default function Can({
    permission,
    anyOf,
    allOf,
    children,
    fallback = null,
}) {
    const { hasPermission, user } = useAuth();

    const has = (p) => user?.permissions?.includes(p) ?? false;

    let allowed = true;
    if (permission) allowed = hasPermission(permission);
    else if (anyOf) allowed = anyOf.some(has);
    else if (allOf) allowed = allOf.every(has);

    return allowed ? children : fallback;
}
