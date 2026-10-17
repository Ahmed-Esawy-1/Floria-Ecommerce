import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import UserForm from "./EmployeeForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CreateEmployee = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("employees");

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                        <Link
                            to="/employees"
                            className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                        >
                            {tCommon("employees")}
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
            <UserForm mode="create" />
        </>
    );
};

export default CreateEmployee;
