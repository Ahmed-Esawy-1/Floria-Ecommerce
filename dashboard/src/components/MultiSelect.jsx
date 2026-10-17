import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MultiSelect = ({ label, options, selectedIds, onChange, getLabel }) => {
   const { t } = useTranslation("products");
   const [open, setOpen] = useState(false);
   const ref = useRef(null);

   useEffect(() => {
      const onClickOutside = (e) => {
         if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
   }, []);

   const toggle = (id) => {
      onChange(
         selectedIds.includes(id)
            ? selectedIds.filter((x) => x !== id)
            : [...selectedIds, id],
      );
   };

   return (
      <div className="relative" ref={ref}>
         <label className="block text-on-surface-variant mb-2">{label}</label>
         <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-left text-on-surface rtl:text-right"
         >
            {selectedIds.length === 0
               ? t("select")
               : options
                    .filter((o) => selectedIds.includes(o.id))
                    .map(getLabel)
                    .join(", ")}
         </button>

         {open && (
            <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg">
               {options.map((o) => (
                  <label
                     key={o.id}
                     className="flex items-center gap-2 px-4 py-2 hover:bg-primary/5 cursor-pointer text-sm text-on-surface"
                  >
                     <input
                        type="checkbox"
                        checked={selectedIds.includes(o.id)}
                        onChange={() => toggle(o.id)}
                     />
                     {getLabel(o)}
                  </label>
               ))}
            </div>
         )}
      </div>
   );
};

export default MultiSelect;
