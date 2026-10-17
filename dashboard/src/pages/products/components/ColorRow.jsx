import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const ColorRow = ({
   color,
   onRemoveColor, // (colorId, productColorId)
   onAddImages, // (colorId, FileList)
   onRemoveImage, // (colorId, img)   => full img object
   onReorderImage, // (colorId, fromIndex, toIndex)
}) => {
   const { t } = useTranslation("products");
   const { language } = useLanguage();
   const fileRef = useRef(null);

   const [draggingIndex, setDraggingIndex] = useState(null);
   const [dragOverIndex, setDragOverIndex] = useState(null);

   const handleDrop = (e) => {
      e.preventDefault();
      onAddImages(color.colorId, e.dataTransfer.files);
   };

   return (
      <div className="border border-outline-variant rounded-xl p-4 bg-surface-container-lowest">
         {/* Top: Color + Name + Hex + Remove */}
         <div className="flex items-center gap-3 mb-3">
            {/* Color picker */}
            <label
               className="w-9 h-9 rounded-full border-2 border-outline-variant cursor-pointer flex-shrink-0 relative overflow-hidden"
               style={{ background: color.hex }}
               title={t("colorRow.pickColor")}
            >
               <input
                  type="color"
                  value={color.hex}
                  readOnly
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
               />
            </label>

            {/* Name */}
            <input
               type="text"
               value={language === "en" ? color.nameEn : color.nameAr}
               readOnly
               className="flex-1 px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary text-on-surface placeholder:text-outline"
            />

            {/* Hex */}
            <input
               type="text"
               value={color.hex}
               maxLength={7}
               readOnly
               className="w-24 px-3 py-2 text-xs font-mono bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary text-on-surface-variant"
            />

            {/* Remove */}
            <button
               type="button"
               onClick={() =>
                  onRemoveColor(color.colorId, color.productColorId)
               }
               className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-red-50 hover:text-error hover:border-red-200 transition-all"
            >
               <CloseIcon className="!text-sm" />
            </button>
         </div>

         {/* Drop zone */}
         <div
            className="border-2 border-dashed border-outline-variant rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
         >
            <input
               ref={fileRef}
               type="file"
               accept="image/*"
               multiple
               className="hidden"
               onChange={(e) => {
                  onAddImages(color.colorId, e.target.files);
                  e.target.value = "";
               }}
            />

            {color.images.length === 0 ? (
               <div className="flex flex-col items-center py-4 text-outline gap-1">
                  <p className="text-sm font-medium">
                     {t("colorRow.dropSubtitle")}
                  </p>
                  <p className="text-xs">{t("colorRow.dropTitle")}</p>
               </div>
            ) : (
               <>
                  <div className="flex flex-wrap gap-2">
                     {color.images.map((img, i) => (
                        <div
                           key={img.id ?? img.uid}
                           draggable
                           onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggingIndex(i);
                           }}
                           onDragEnter={(e) => {
                              e.stopPropagation();
                              setDragOverIndex(i);
                           }}
                           onDragOver={(e) => e.preventDefault()}
                           onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (draggingIndex !== null) {
                                 onReorderImage(
                                    color.colorId,
                                    draggingIndex,
                                    i,
                                 );
                              }
                              setDraggingIndex(null);
                              setDragOverIndex(null);
                           }}
                           onDragEnd={(e) => {
                              e.stopPropagation();
                              setDraggingIndex(null);
                              setDragOverIndex(null);
                           }}
                           className={`relative w-16 h-16 flex-shrink-0 group cursor-grab active:cursor-grabbing transition-all ${
                              draggingIndex === i ? "opacity-40" : ""
                           } ${
                              dragOverIndex === i && draggingIndex !== i
                                 ? "ring-2 ring-primary rounded-lg"
                                 : ""
                           }`}
                        >
                           <img
                              src={img.preview}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg border border-outline-variant pointer-events-none"
                           />
                           {i === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white rounded-b-lg py-0.5">
                                 {t("colorRow.cover")}
                              </span>
                           )}
                           <div
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center shadow cursor-pointer"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onRemoveImage(color.colorId, img);
                              }}
                           >
                              <CloseIcon className="!text-[10px]" />
                           </div>
                        </div>
                     ))}

                     {/* Add more tile */}
                     <div className="w-16 h-16 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-outline text-xl hover:border-primary transition-colors">
                        +
                     </div>
                  </div>
                  <p className="text-xs text-outline mt-2">
                     {t("colorRow.image", {
                        count: color.images.length,
                     })}
                  </p>
               </>
            )}
         </div>
      </div>
   );
};

export default ColorRow;
