import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Loading from "./Loading";

const MainLayout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    // Redirect once the auth check (done in AuthProvider) has settled.
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/");
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (sidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isLoading || !isAuthenticated) return <Loading />;

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="min-h-screen p-4 md:p-8 lg:ltr:ml-[280px] lg:rtl:mr-[280px]">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};

export default MainLayout;
