import { useTranslation } from "react-i18next";

const NotFound = () => {
   const { t } = useTranslation("notFound");

   return (
      <div className="bg-surface-container-low min-h-screen flex flex-col items-center justify-center p-6 text-center">
         <h1 className="text-on-surface text-6xl font-bold tracking-wider mb-2">
            404
         </h1>
         <p className="text-on-surface-variant text-lg mb-6">
            {t("message", "Page not found")}
         </p>
      </div>
   );
};

export default NotFound;
