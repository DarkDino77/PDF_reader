import {clsx, type ClassValue} from "clsx"
import { Children, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";


function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}


const Button = ({
  className,
  variant = "primary",
  isLoading,
  children,
  disabled,
  ...props //random standar stuff
}: ButtonProps) => {

 const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
  secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
  danger: "bg-red-500 text-white hover:bg-red-500",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-600"
};

return (
  <button
    className={cn(baseStyles, variants[variant], className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></span>
    ):null}
    {children}

  </button>
);
};

export default Button;