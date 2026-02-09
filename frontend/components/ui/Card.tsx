"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            whileHover={hover ? { y: -2 } : undefined}
            className={cn(
                "bg-white/[0.03] border border-white/5 rounded-2xl transition-all",
                hover && "hover:border-white/10 hover:bg-white/[0.05]",
                onClick && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                className
            )}
            onClick={onClick}
        >
            {children}
        </Component>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-4 border-b border-white/5", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-4 border-t border-white/5", className)}>{children}</div>;
}
