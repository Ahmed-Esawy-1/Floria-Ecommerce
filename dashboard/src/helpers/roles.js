export const formatRoleName = (name = "") =>
    name
        .toLowerCase()
        .split(/[_\s]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

export const getRoleLabel = (role, language = "en") =>
    language.startsWith("ar") ? role.nameAr : formatRoleName(role.nameEn);
