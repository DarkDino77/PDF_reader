import Spinner from "./Spinner";

interface StatusBadgeProps {
    isProcessed: boolean;
}

const StatusBadge = ({isProcessed}: StatusBadgeProps) =>{
    if (isProcessed) {
        return (   <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full w-fit border-emerald-400/20 ">
            <div className="w-3 h-3 rounded-full bg-emerald-400">
                Ready
            </div>
        </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-amber-400 text-xs font-medium bg-amber-400/10 px-2 py-1 rounded-full w-fit border border-amber-400/20 animate-pulse">
            <Spinner className="w-3 h-3 text-amber-400"/>
            Processing
        </div>
    );
};

export default StatusBadge