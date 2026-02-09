
"use client";

import React from 'react';
import { Calendar, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
}

interface TaskCardProps {
    task: Task;
    onUpdateStatus: (taskId: number, newStatus: string) => void;
}

export function TaskCard({ task, onUpdateStatus }: TaskCardProps) {
    const priorityVariants: Record<string, 'danger' | 'warning' | 'success'> = {
        High: 'danger',
        Medium: 'warning',
        Low: 'success',
    };

    const isOverdue = task.due_date && new Date(task.due_date) < new Date();
    const canMoveBack = task.status !== "To Do";
    const canMoveForward = task.status !== "Done";

    const getNextStatus = () => {
        if (task.status === "To Do") return "In Progress";
        if (task.status === "In Progress") return "Done";
        return task.status;
    };

    const getPreviousStatus = () => {
        if (task.status === "Done") return "In Progress";
        if (task.status === "In Progress") return "To Do";
        return task.status;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all overflow-hidden"
        >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant={priorityVariants[task.priority] || 'warning'}>
                    {task.priority || "Medium"}
                </Badge>

                {task.due_date && (
                    <div className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-rose-400' : 'text-zinc-500'}`}>
                        <Calendar size={12} />
                        <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className="font-semibold text-sm mb-2 text-zinc-100 line-clamp-2 leading-snug">
                {task.title}
            </h3>

            {task.description && (
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                {canMoveBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(task.id, getPreviousStatus())}
                        className="text-xs"
                    >
                        <ArrowLeft size={12} />
                        Back
                    </Button>
                )}

                {canMoveForward && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onUpdateStatus(task.id, getNextStatus())}
                        className="ml-auto text-xs"
                    >
                        {task.status === "In Progress" ? (
                            <>
                                <CheckCircle size={12} />
                                Complete
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight size={12} />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
