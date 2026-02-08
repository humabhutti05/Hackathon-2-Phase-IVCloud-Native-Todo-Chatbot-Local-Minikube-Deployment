
"use client";

import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const priorityColors = {
        High: "text-rose-400 bg-rose-400/10 border-rose-400/20",
        Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
                    {task.priority || "Medium"}
                </span>
                {task.due_date && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Calendar size={12} />
                        {new Date(task.due_date).toLocaleDateString()}
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-sm mb-1 text-zinc-100">{task.title}</h3>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                {task.description || "No description provided."}
            </p>

            <div className="flex items-center gap-2 mt-auto">
                {task.status !== "To Do" && (
                    <button
                        onClick={() => onUpdateStatus(task.id, task.status === "Done" ? "In Progress" : "To Do")}
                        className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                    >
                        ← Move Back
                    </button>
                )}
                {task.status !== "Done" && (
                    <button
                        onClick={() => onUpdateStatus(task.id, task.status === "To Do" ? "In Progress" : "Done")}
                        className="ml-auto text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                    >
                        Next Step →
                    </button>
                )}
            </div>
        </motion.div>
    );
}
