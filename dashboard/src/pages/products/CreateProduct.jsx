import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ProductForm from "./components/ProductForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CreateProduct = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("products");

    const [formKey, setFormKey] = useState(0); // Remount form after successful create

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                        <Link
                            to="/products"
                            className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                        >
                            {tCommon("products")}
                        </Link>
                        <ChevronRightIcon
                            fontSize="small"
                            className="rtl:rotate-180"
                        />
                        <span className="text-indigo-600 font-bold">
                            {tCommon("create")}
                        </span>
                    </nav>
                    <h2 className="text-on-surface">{t("createPage.title")}</h2>
                    <p className="page-subtitle mt-1">
                        {t("createPage.subtitle")}
                    </p>
                </div>
            </div>

            <ProductForm
                key={formKey}
                mode="create"
                onSuccess={() => setFormKey((k) => k + 1)}
            />
        </>
    );
};

export default CreateProduct;
