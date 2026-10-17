export default function AuthShell({ children, maxWidth = "max-w-md" }) {
    return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div
                className={`w-full md:w-[70%] ${maxWidth} mx-auto p-6 md:p-12 bg-white rounded-xl`}
            >
                {children}
            </div>
        </div>
    );
}
