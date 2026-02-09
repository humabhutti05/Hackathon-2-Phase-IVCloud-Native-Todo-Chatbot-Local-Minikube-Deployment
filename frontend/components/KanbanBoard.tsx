
"use client";

import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus, MoreHorizontal, ListTodo, Loader, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
}

interface KanbanBoardProps {
    tasks: Task[];
    onUpdateStatus: (taskId: number, newStatus: string) => void;
}

export function KanbanBoard({ tasks, onUpdateStatus }: KanbanBoardProps) {
    const columns = [
        { name: "To Do", icon: ListTodo, color: "text-zinc-400" },
        { name: "In Progress", icon: Loader, color: "text-amber-400" },
        { name: "Done", icon: CheckCircle2, color: "text-emerald-400" }
    ];

    return (
        <div className="flex gap-4 md:gap-6 h-full overflow-x-auto pb-4 px-4 md:px-6 scrollbar-hide">
            {columns.map((column) => {
                const columnTasks = tasks.filter(t => t.status === column.name);
                const Icon = column.icon;

                return (
                    <div key={column.name} className="flex flex-col min-w-[280px] md:w-80 shrink-0">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <Icon size={16} className={column.color} />
                                <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-widest">
                                    {column.name}
                                </h2>
                                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-white/5">
                                    {columnTasks.length}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-400 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
                                    aria-label={`Add task to ${column.name}`}
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-400 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
                                    aria-label={`More options for ${column.name}`}
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 bg-white/[0.01] rounded-3xl border border-white/[0.03] p-3 space-y-3 overflow-y-auto">
                            <AnimatePresence mode="popLayout">
                                {columnTasks.length > 0 ? (
                                    columnTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onUpdateStatus={onUpdateStatus}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-32 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-xs text-zinc-600 italic gap-2"
                                    >
                                        <Icon size={24} className="text-zinc-700" />
                                        <span>No tasks here</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
