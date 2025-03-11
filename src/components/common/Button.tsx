
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', icon, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none active:translate-y-[1px]";
    
    const variantClasses = {
      primary: "bg-cargo-orange text-white shadow-sm hover:bg-cargo-orange/90",
      secondary: "bg-cargo-gray text-foreground hover:bg-cargo-gray/80",
      outline: "border border-cargo-gray bg-white hover:bg-cargo-gray/30"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          "rounded-md px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
