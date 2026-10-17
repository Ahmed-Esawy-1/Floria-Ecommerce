import SignupView from "@/features/auth/SignupView";

export const metadata = {
    title: "Sign Up",
    robots: { index: false, follow: false },
};

export default function SignupPage() {
    return <SignupView />;
}
