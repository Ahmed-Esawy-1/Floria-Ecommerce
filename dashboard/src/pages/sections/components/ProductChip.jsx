import { useLanguage } from "@/contexts/LanguageContext";
import { BASE_URL } from "@/api/config";
import HoverRevealText from "@/components/HoverRevealText";

const ProductChip = ({ product, order }) => {
   const { language } = useLanguage();

   return (
      <div className="min-w-50 flex-1 flex items-center gap-2 bg-surface-container rounded-xl p-2 border border-outline-variant/30">
         {product.primaryImageUrl ? (
            <img
               src={BASE_URL + product.primaryImageUrl}
               alt={product.nameEn}
               className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
         ) : (
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-on-surface-variant/40 text-xs">
               🌸
            </div>
         )}
         <div className="flex-1 min-w-0">
            <HoverRevealText
               className="text-on-surface text-sm font-semibold w-full"
               text={language === "en" ? product.nameEn : product.nameAr}
            />
            <p className="text-xs text-on-surface-variant/60">#{order}</p>
         </div>
      </div>
   );
};

export default ProductChip;
