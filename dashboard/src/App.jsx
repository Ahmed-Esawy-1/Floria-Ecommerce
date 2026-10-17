import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import RequirePermission from "./components/RequirePermission";
import { PERMISSIONS } from "./constants/permissions";
import Loading from "./components/Loading";
import Coupons from "./pages/coupons/Coupons";

const Login = lazy(() => import("./pages/Login"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const NotFound = lazy(() => import("./components/NotFound"));

const Home = lazy(() => import("./pages/dashboard/Home"));

const Products = lazy(() => import("./pages/products/Products"));
const CreateProduct = lazy(() => import("./pages/products/CreateProduct"));
const EditProduct = lazy(() => import("./pages/products/EditProduct"));

const Cities = lazy(() => import("./pages/cities/cities"));

const Occasions = lazy(() => import("./pages/occasions/Occasions"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const Colors = lazy(() => import("./pages/colors/Colors"));

const Orders = lazy(() => import("./pages/orders/Orders"));
const UpdateOrder = lazy(() => import("./pages/orders/UpdateOrderStatus"));

const Sections = lazy(() => import("./pages/sections/Sections"));
const CreateSection = lazy(() => import("./pages/sections/CreateSection"));
const EditSection = lazy(() => import("./pages/sections/EditSection"));

const Employees = lazy(() => import("./pages/employees/Employees"));
const CreateEmployee = lazy(() => import("./pages/employees/CreateEmployee"));
const EditEmployee = lazy(() => import("./pages/employees/EditEmployee"));

const TrashPage = lazy(() => import("./pages/TrashPage"));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<MainLayout />}>
                    <Route
                        path="/dashboard"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.VIEW_DASHBOARD}
                            >
                                <Home />
                            </RequirePermission>
                        }
                    />

                    {/* ORDERS */}
                    <Route path="/orders">
                        <Route
                            index
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.READ_ORDER}
                                >
                                    <Orders />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path=":orderId/edit/status"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.UPDATE_ORDER}
                                >
                                    <UpdateOrder />
                                </RequirePermission>
                            }
                        />
                    </Route>

                    {/* PRODUCTS */}
                    <Route path="/products">
                        <Route
                            index
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.READ_PRODUCT}
                                >
                                    <Products />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.CREATE_PRODUCT}
                                >
                                    <CreateProduct />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path=":productId/edit"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.UPDATE_PRODUCT}
                                >
                                    <EditProduct />
                                </RequirePermission>
                            }
                        />
                    </Route>

                    {/* CITIES */}
                    <Route
                        path="/cities"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.READ_CITY}
                            >
                                <Cities />
                            </RequirePermission>
                        }
                    />

                    {/* COUPONS */}
                    <Route
                        path="/coupons"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.READ_COUPON}
                            >
                                <Coupons />
                            </RequirePermission>
                        }
                    />

                    {/* OCCASIONS */}
                    <Route
                        path="/occasions"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.READ_OCCASION}
                            >
                                <Occasions />
                            </RequirePermission>
                        }
                    />

                    {/* CATEGORIES */}
                    <Route
                        path="/categories"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.READ_CATEGORY}
                            >
                                <Categories />
                            </RequirePermission>
                        }
                    />

                    {/* COLORS */}
                    <Route path="/colors">
                        <Route
                            index
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.READ_COLOR}
                                >
                                    <Colors />
                                </RequirePermission>
                            }
                        />
                    </Route>

                    {/* SECTIONS */}
                    <Route path="/sections">
                        <Route
                            index
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.READ_SECTION}
                                >
                                    <Sections />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.CREATE_SECTION}
                                >
                                    <CreateSection />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path=":sectionId/edit"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.UPDATE_SECTION}
                                >
                                    <EditSection />
                                </RequirePermission>
                            }
                        />
                    </Route>

                    {/* USERS */}
                    <Route path="/employees">
                        <Route
                            index
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.READ_EMPLOYEE}
                                >
                                    <Employees />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.CREATE_EMPLOYEE}
                                >
                                    <CreateEmployee />
                                </RequirePermission>
                            }
                        />
                        <Route
                            path=":employeeId/edit"
                            element={
                                <RequirePermission
                                    permission={PERMISSIONS.UPDATE_EMPLOYEE}
                                >
                                    <EditEmployee />
                                </RequirePermission>
                            }
                        />
                    </Route>

                    {/* TRASH */}
                    <Route
                        path="/products/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_PRODUCT}
                            >
                                <TrashPage
                                    endpoint="/products/trash"
                                    backPath="/products"
                                    type="product"
                                />
                            </RequirePermission>
                        }
                    />
                    <Route
                        path="/categories/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_CATEGORY}
                            >
                                <TrashPage
                                    endpoint="/categories/trash"
                                    backPath="/categories"
                                    type="category"
                                />
                            </RequirePermission>
                        }
                    />
                    <Route
                        path="/occasions/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_OCCASION}
                            >
                                <TrashPage
                                    endpoint="/occasions/trash"
                                    backPath="/occasions"
                                    type="occasion"
                                />
                            </RequirePermission>
                        }
                    />
                    <Route
                        path="/colors/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_COLOR}
                            >
                                <TrashPage
                                    endpoint="/colors/trash"
                                    backPath="/colors"
                                    type="color"
                                />
                            </RequirePermission>
                        }
                    />
                    <Route
                        path="/sections/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_SECTION}
                            >
                                <TrashPage
                                    endpoint="/sections/trash"
                                    backPath="/sections"
                                    type="section"
                                />
                            </RequirePermission>
                        }
                    />
                    <Route
                        path="/employees/trash"
                        element={
                            <RequirePermission
                                permission={PERMISSIONS.DELETE_EMPLOYEE}
                            >
                                <TrashPage
                                    endpoint="/employees/trash"
                                    backPath="/employees"
                                    type="employee"
                                />
                            </RequirePermission>
                        }
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default App;
