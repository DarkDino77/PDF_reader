import { Loader2 } from "lucide-react";

interface SpinnerProps {
    className?: string;
}

const Spinner = ({className="w-8 h-8 text-blue-500"}: SpinnerProps)=>{
    return <Loader2 className={`animate-spin ${className}`}></Loader2>;
};

export default Spinner;

