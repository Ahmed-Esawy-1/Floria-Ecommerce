import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import UserForm from "./EmployeeForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const EditUser = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("employees");
    const { employeeId } = useParams();

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
                            {tCommon("edit")}
                        </span>
                    </nav>
                    <h2 className="text-on-surface">{t("editPage.title")}</h2>
                    <p className="page-subtitle mt-1">
                        {t("editPage.subtitle")}
                    </p>
                </div>
            </div>
            <UserForm mode="edit" employeeId={employeeId} />
        </>
    );
};

export default EditUser;
