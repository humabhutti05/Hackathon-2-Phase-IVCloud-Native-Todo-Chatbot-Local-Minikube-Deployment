"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <Icon size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}
