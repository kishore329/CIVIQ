import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, icon, children, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-9 appearance-none rounded-lg bg-[var(--surface)] text-[var(--text)] text-sm border border-[var(--border)] px-3 pr-8 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
            icon && "pl-9",
            error && "border-[var(--critical)] focus-visible:ring-[var(--critical)]",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[var(--surface)] text-[var(--text)]">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
        {error && <p className="mt-1 text-xs text-[var(--critical)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
