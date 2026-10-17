import { GoogleIcon } from "./Icons";

export default function GoogleAuthButton({ label }) {
    const handleClick = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/authorization/google`;
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`block bg-white mx-auto flex items-center justify-center gap-2 py-5 px-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors`}
        >
            <GoogleIcon className="text-primary" />
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
}
