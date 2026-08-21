import loadingGif from "@/assets/loading/loading.gif";

export const LoadingOverlay = () => {
    return (
        <div
            role="status"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black-900/50"
            aria-live="polite"
            aria-busy="true"
        >
            <img
                src={loadingGif}
                alt=""
                aria-hidden="true"
                className="h-60 w-60"
            />
            <span className="sr-only">로딩 중입니다</span>
        </div>
    );
};
