export default function ProductSkeleton() {
    return (
        <div className="animate-pulse bg-marble-light rounded-2xl overflow-hidden border border-gold/20">
            {/* Image */}
            <div className="h-56 bg-rose/15" />

            {/* Content */}
            <div className="p-4">
                <div className="h-3 w-20 bg-rose/15 rounded mb-3" />

                <div className="h-5 w-full bg-rose/15 rounded mb-2" />
                <div className="h-5 w-3/4 bg-rose/15 rounded mb-4" />

                <div className="flex justify-between mb-4">
                    <div className="h-6 w-24 bg-rose/15 rounded" />
                    <div className="h-6 w-6 bg-rose/15 rounded-full" />
                </div>

                <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-rose/15 rounded-full" />
                    <div className="h-10 flex-1 bg-rose/15 rounded-full" />
                </div>
            </div>
        </div>
    );
}
