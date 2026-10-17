import LoginView from "@/features/auth/LoginView";

export const metadata = {
    title: "Login",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return <LoginView />;
}
