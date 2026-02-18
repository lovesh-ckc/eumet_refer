import React from "react";
import { cn } from "./utils";
import { Loader2 } from "lucide-react";

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, icon: Icon, children, ...props }, ref) => {
    const variants = {
      primary: "bg-base-black text-base-white hover:bg-gray-800",
      secondary: "bg-gray-100 text-base-black hover:bg-gray-200",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
      ghost: "hover:bg-gray-100 text-gray-600",
      danger: "bg-error-500 text-white hover:bg-error-600",
    };
    const sizes = {
      sm: "h-8 px-3 text-caption",
      md: "h-10 px-4 text-body-text",
      lg: "h-12 px-6 text-section-header",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : Icon ? (
          <Icon className={cn("mr-2 h-4 w-4", children ? "" : "mr-0")} />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// --- Badge ---
export const Badge = ({ children, variant = "default", className }: { children: React.ReactNode, variant?: "default" | "success" | "warning" | "error", className?: string }) => {
  const styles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-success-100 text-success-500",
    warning: "bg-warning-100 text-warning-500",
    error: "bg-error-100 text-error-500",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[variant], className)}>
      {children}
    </span>
  );
};

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-base-white px-3 py-2 text-body-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Card ---
export const Card = ({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "rounded-lg border border-gray-200 bg-base-white shadow-sm", 
      onClick && "cursor-pointer hover:border-gray-300 transition-colors",
      className
    )}
  >
    {children}
  </div>
);

// --- Stat Card ---
export const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-caption text-gray-500 font-haas-text">{label}</p>
        <p className="text-sub-heading font-haas-disp mt-1">{value}</p>
        {trend && (
          <span className={cn("text-xs font-medium", trend > 0 ? "text-success-500" : "text-error-500")}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      {Icon && <div className="p-2 bg-gray-50 rounded-full"><Icon className="w-5 h-5 text-gray-600" /></div>}
    </div>
  </Card>
);

// --- Avatar ---
export const Avatar = ({ initials, src, size = "md" }: { initials: string, src?: string, size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-14 h-14 text-base",
    };
    
    return (
        <div className={cn("rounded-full bg-accent-200 flex items-center justify-center font-bold text-accent-700 overflow-hidden relative", sizeClasses[size])}>
            {src ? (
                <img src={src} alt={initials} className="w-full h-full object-cover" />
            ) : (
                initials
            )}
        </div>
    );
};
