import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import ProductForm from "./components/ProductForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const EditProduct = () => {
    const { t: tcommon } = useTranslation("common");
    const { t } = useTranslation("products");
    const { productId } = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                        <Link
                            to="/products"
                            className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                        >
                            {tcommon("products")}
                        </Link>
                        <ChevronRightIcon
                            fontSize="small"
                            className="rtl:rotate-180"
                        />
                        <span className="text-indigo-600 font-bold">
                            {tcommon("edit")}
                        </span>
                    </nav>
                    <h2 className="text-on-surface">{t("editPage.title")}</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                        {t("editPage.subtitle")}
                    </p>
                </div>
            </div>

            <ProductForm mode="edit" productId={productId} />
        </>
    );
};

export default EditProduct;
