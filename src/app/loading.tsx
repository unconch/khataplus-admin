export default function Loading() {
    return (
        <div className="min-h-screen bg-[#03040b] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="text-indigo-400 font-bold tracking-widest text-[10px] uppercase animate-pulse">
                Initializing Secure Access...
            </div>
        </div>
    );
}
