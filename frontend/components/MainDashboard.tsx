
"use client";

import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { KanbanBoard } from './KanbanBoard';
import { LayoutDashboard, CheckCircle2, MessageSquare, Calendar, Settings, Bell, Search, User, Plus, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { EmptyState } from './ui/EmptyState';

export default function MainDashboard() {
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState<'board' | 'chat'>('board');
    const [userId] = useState('User');
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const navItems = [
        { id: 'board', icon: LayoutDashboard, label: 'Kanban Board' },
        { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#0a0a0c] text-zinc-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar - Always Visible */}
            <aside className="hidden lg:flex w-64 h-full border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex-col p-4 z-20">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Zendo AI</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Settings & User */}
                <div className="mt-auto space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                    <div className="p-4 border-t border-white/5 flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/5">
                            <User size={14} />
                        </div>
                        <div className="text-[10px]">
                            <div className="font-medium text-zinc-300">{userId}</div>
                            <div className="text-zinc-600 truncate">Connected</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar - Animated */}
            <motion.aside
                initial={false}
                animate={{
                    x: isSidebarOpen ? 0 : '-100%'
                }}
                className="lg:hidden fixed w-64 h-full border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col p-4 z-50"
            >
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-zinc-400"
                    aria-label="Close sidebar"
                >
                    <X size={20} />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Zendo AI</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as any);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Settings & User */}
                <div className="mt-auto space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                    <div className="p-4 border-t border-white/5 flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/5">
                            <User size={14} />
                        </div>
                        <div className="text-[10px]">
                            <div className="font-medium text-zinc-300">{userId}</div>
                            <div className="text-zinc-600 truncate">Connected</div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0a0a0c] to-[#111115] overflow-hidden">
                {/* Header */}
                <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/20 backdrop-blur-md shrink-0">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-zinc-400"
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            icon={<Search size={16} />}
                            className="hidden sm:block"
                        />
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="relative p-2 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-400 transition-all">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
                        </button>
                        <div className="hidden sm:block h-8 w-[1px] bg-white/5 mx-2" />
                        <Button variant="primary" size="sm" className="hidden sm:flex">
                            <Plus size={16} />
                            New Task
                        </Button>
                        <Button variant="primary" size="sm" className="sm:hidden p-2">
                            <Plus size={16} />
                        </Button>
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
                                transition={{ duration: 0.2 }}
                                className="h-full pt-4 md:pt-8"
                            >
                                {isLoading ? (
                                    <EmptyState
                                        icon={LayoutDashboard}
                                        title="Loading tasks..."
                                        description="Please wait while we fetch your tasks"
                                    />
                                ) : (
                                    <KanbanBoard tasks={tasks} onUpdateStatus={handleUpdateStatus} />
                                )}
                            </motion.div>
                        ) : activeTab === 'chat' ? (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <ChatInterface />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full flex items-center justify-center"
                            >
                                <EmptyState
                                    icon={Calendar}
                                    title="Calendar View"
                                    description="Coming soon in Phase V"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
