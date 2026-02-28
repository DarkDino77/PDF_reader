interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20",
    danger: "bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50",
    ghost: "text-neutral-500 hover:text-white underline underline-offset-4"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {loading && <div className="w-4 h-4 border-2 border-t-transparent animate-spin rounded-full" />}
      {children}
    </button>
  );
};