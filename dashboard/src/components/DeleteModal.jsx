import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import DangerousIcon from "@mui/icons-material/Dangerous";

export default function DeletedModal({
    isOpen,
    onClose,
    onConfirm,
    name,
    mode = "soft", // "soft" | "hard"
}) {
    const { t } = useTranslation("common");

    if (!isOpen) return null;

    const isSoft = mode === "soft";
    const itemName = name || t("deleteModal.them");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="m-5.5 md:m-0 w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                        isSoft ? "bg-amber-100" : "bg-red-100"
                    }`}
                >
                    {isSoft ? (
                        <DeleteIcon className="w-6 h-6 text-amber-600" />
                    ) : (
                        <DangerousIcon className="w-6 h-6 text-red-600" />
                    )}
                </div>

                <h2 className="text-lg font-semibold">
                    {isSoft
                        ? t("deleteModal.moveTitle")
                        : t("deleteModal.deleteTitle")}
                </h2>

                <p className="mt-2 text-sm text-on-surface-variant">
                    {isSoft
                        ? t("deleteModal.moveMessage", { name: itemName })
                        : t("deleteModal.deleteMessage", {
                              name: itemName,
                          })}{" "}
                    <span className="font-medium text-base text-on-surface">
                        {itemName}
                    </span>{" "}
                    {isSoft
                        ? t("deleteModal.restoreHint", {
                              item: name
                                  ? t("deleteModal.it")
                                  : t("deleteModal.them"),
                          })
                        : t("deleteModal.deleteHint")}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 hover:bg-surface-container border border-surface-variant rounded-lg text-on-surface text-sm font-medium transition-colors"
                    >
                        {t("cancel")}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors border border-surface-variant ${
                            isSoft
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {isSoft
                            ? t("deleteModal.move")
                            : t("deleteModal.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}
