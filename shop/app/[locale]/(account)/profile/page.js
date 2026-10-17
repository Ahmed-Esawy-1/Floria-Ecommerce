import ProfileView from "@/features/profile/ProfileView";

export const metadata = {
    title: "My Profile",
    robots: { index: false, follow: false },
};

export default function ProfilePage() {
    return <ProfileView />;
}
