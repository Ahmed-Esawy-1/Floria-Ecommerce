import Link from "next/link";

export default function NotFound() {
    return (
        <section className="w-full py-20 px-6 flex flex-col items-center">
            <div className="max-w-5xl w-full text-center relative">
                <div className="mb-12 relative flex flex-col items-center">
                    <div className="w-full max-w-2xl aspect-[16/9] rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(74,29,77,0.12)]">
                        <div
                            className="w-full h-full bg-center bg-cover bg-no-repeat brightness-95
              bg-[url(https://lh3.googleusercontent.com/aida-public/AB6AXuCNkSBu1vfJj6z9GQ2K9NVUEJWImKKZny5UIVntSvIIUoTWTzJ3k-MhNjnlpQcaxo7yuHuomLzn4ZOC1XwmNeOV7QHE6-yGJmzHG-9cuZFWle8QrGlthv1X72GH6nenUhzKBwM8SuNsXBv8CO2KWE5soskEqjmKjY1lQe-LRcgQjPmquCwvc78tahycpyWX0MXsCoQmNO7Zk9Lo7dcT1rOR6dvKqaiQvhTJlij5WORD_KuXQh6ZgaZLHZDHJ8j3Uu_EbNyMQi3nYWfY)]"
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-24">
                        <h1 className="font-display text-[16rem] leading-none font-[300] tracking-[-0.05em] text-404-gradient select-none">
                            404
                        </h1>
                    </div>
                </div>

                <div className="space-y-8 mt-24 relative z-10">
                    <h3 className="font-display text-5xl md:text-6xl font-normal text-slate-800 dark:text-slate-100 tracking-tight">
                        Something's Missing
                    </h3>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-light italic">
                        Like a petal carried by a gentle breeze, this page has
                        drifted beyond our garden paths. Let us guide you back
                        to where beauty blooms.
                    </p>
                </div>
                {/* Buttons */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        className="luxury-button w-full sm:w-auto bg-primary text-white hover:bg-slate-900 shadow-xl shadow-primary/20"
                        href="/"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        className="luxury-button w-full sm:w-auto border border-primary text-primary hover:bg-primary/5"
                        href="/shop/best-sellers"
                    >
                        View Best Sellers
                    </Link>
                    <Link
                        className="luxury-button w-full sm:w-auto border border-slate-300 text-slate-600 hover:border-primary hover:text-primary"
                        href="/contact-us"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </section>
    );
}
