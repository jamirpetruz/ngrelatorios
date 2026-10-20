export default function Loading() {
    return (
        <div className="fixed top-2 left-[50%] flex items-center justify-center p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
    );
}