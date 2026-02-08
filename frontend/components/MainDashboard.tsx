
"use client";

import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { KanbanBoard } from './KanbanBoard';
import { LayoutDashboard, CheckCircle2, MessageSquare, Calendar, Settings, Bell, Search, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainDashboard() {
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState<'board' | 'chat'>('board');
    const [userId] = useState('User');
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/tasks`);
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        // Poll for changes every 5 seconds to catch AI additions
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (taskId: number, newStatus: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0c] text-zinc-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-20 lg:w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col p-4 z-20">
                <div className="flex items-center gap-3 mb-10 lg:px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="font-bold text-lg tracking-tight">Zendo AI</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Dashboard</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: 'board', icon: LayoutDashboard, label: 'Kanban Board' },
                        { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
                        { id: 'calendar', icon: Calendar, label: 'Calendar' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                        <Settings size={20} />
                        <span className="hidden lg:block text-sm font-medium">Settings</span>
                    </button>
                    <div className="p-4 border-t border-white/5 flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/5">
                            <User size={14} />
                        </div>
                        <div className="hidden lg:block text-[10px]">
                            <div className="font-medium text-zinc-300">{userId}</div>
                            <div className="text-zinc-600 truncate">SQLite V2 Connected</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0a0a0c] to-[#111115] overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs w-full focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-400">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
                        </button>
                        <div className="h-8 w-[1px] bg-white/5 mx-2" />
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </header>

                {/* Dynamic View */}
                <main className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'board' ? (
                            <motion.div
                                key="board"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full pt-8"
                            >
                                <KanbanBoard tasks={tasks} onUpdateStatus={handleUpdateStatus} />
                            </motion.div>
                        ) : activeTab === 'chat' ? (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <ChatInterface />
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 italic">
                                Calendar View coming soon (Phase C)
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
