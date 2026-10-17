import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Pagination({
    currentPage,
    totalPages,
    setCurrentPage,
}) {
    return (
        <div className="flex justify-center gap-4 mt-15 mb-10">
            <button
                className={` ${currentPage !== 1 ? "hover:text-rose-900 transition-colors" : ""} text-stone-400`}
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    className={` ${currentPage == i + 1 ? "text-white bg-primary px-3 py-2 rounded-lg" : "text-stone-400 hover:text-rose-900"} transition-colors cursor-pointer`}
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className={` ${currentPage !== totalPages ? "hover:text-rose-900 transition-colors" : ""} text-stone-400`}
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight />
            </button>
        </div>
    );
}
