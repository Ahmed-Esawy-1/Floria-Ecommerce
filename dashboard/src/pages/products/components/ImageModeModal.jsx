import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Trans, useTranslation } from "react-i18next";

const ImageModeModal = ({
   isOpen,
   targetMode,
   itemCount,
   onClose,
   onConfirm,
}) => {
   const { t } = useTranslation("products");

   if (!isOpen) return null;

   const title =
      targetMode === "color"
         ? t("imageModeModal.titleColor")
         : t("imageModeModal.titleGeneral");

   const losing =
      targetMode === "color"
         ? t("imageModeModal.generalImages", {
              count: itemCount,
           })
         : t("imageModeModal.colorVariants", {
              count: itemCount,
           });

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-full max-w-md p-6">
            {/* Body */}
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <WarningAmberIcon className="text-error !text-xl" />
               </div>

               <div>
                  <h3 className="text-on-surface font-semibold text-base">
                     {title}
                  </h3>

                  <p className="text-sm text-on-surface-variant mt-1.5">
                     <Trans
                        ns="products"
                        i18nKey="imageModeModal.message"
                        count={itemCount}
                        values={{ items: losing }}
                        components={{
                           1: (
                              <strong className="font-semibold text-on-surface" />
                           ),
                        }}
                     />
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
               <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
               >
                  {t("imageModeModal.keep")}
               </button>

               <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-semibold text-white bg-error rounded-lg hover:opacity-90 transition-colors"
               >
                  {t("imageModeModal.switch")}
               </button>
            </div>
         </div>
      </div>
   );
};

export default ImageModeModal;
