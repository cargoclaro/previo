
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', icon, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30 active:translate-y-[1px]";
    
    const variantClasses = {
      primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-background hover:bg-secondary/50"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          "rounded-lg px-4 py-2",
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
