import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-9 rounded-lg bg-[var(--surface)] text-[var(--text)] text-sm border border-[var(--border)] px-3 py-1.5 placeholder:text-[var(--text-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-[var(--critical)] focus-visible:ring-[var(--critical)]",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            {rightIcon}
          </div>
        )}
        {error && <p className="mt-1 text-xs text-[var(--critical)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
