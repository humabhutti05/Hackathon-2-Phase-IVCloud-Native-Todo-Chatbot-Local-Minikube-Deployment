
"use client";

import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

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
    const columns = ["To Do", "In Progress", "Done"];

    return (
        <div className="flex gap-6 h-full overflow-x-auto pb-4 scrollbar-hide px-6">
            {columns.map((column) => (
                <div key={column} className="flex flex-col w-80 shrink-0">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">{column}</h2>
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-white/5">
                                {tasks.filter(t => t.status === column).length}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-400 transition-all">
                                <Plus size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-400 transition-all">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/[0.01] rounded-3xl border border-white/[0.03] p-3 space-y-3 overflow-y-auto">
                        {tasks
                            .filter((t) => t.status === column)
                            .map((task) => (
                                <TaskCard key={task.id} task={task} onUpdateStatus={onUpdateStatus} />
                            ))}

                        {tasks.filter((t) => t.status === column).length === 0 && (
                            <div className="h-32 rounded-2xl border border-dashed border-white/5 flex items-center justify-center text-xs text-zinc-600 italic">
                                No tasks here
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
