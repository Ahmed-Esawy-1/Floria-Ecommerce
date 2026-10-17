import ChangePasswordView from "@/features/change-password/ChangePasswordView";

export const metadata = {
    title: "Change Password",
    robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
    return <ChangePasswordView />;
}
