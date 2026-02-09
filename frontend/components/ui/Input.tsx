"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-zinc-100 placeholder:text-zinc-600",
                            "focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20",
                            "transition-all duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            icon && "pl-10",
                            error && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-rose-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
