
"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, CheckCircle2, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    tool_calls?: any[];
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [userId] = useState('User');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    conversation_id: conversationId,
                }),
            });

            const data = await response.json();

            if (data.conversation_id) {
                setConversationId(data.conversation_id);
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                tool_calls: data.tool_calls,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the service.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-transparent overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth z-10"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                            <Bot size={40} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Hello, I'm Zendo</h2>
                            <p className="text-zinc-400 max-w-md mx-auto">
                                Ask me to add tasks, list your todos, or mark them as complete. Use my AI powers to manage your life!
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-w-lg">
                            {[
                                "Add a task to buy groceries",
                                "What's on my pending list?",
                                "Show all tasks",
                                "Delete task 1"
                            ].map((hint) => (
                                <button
                                    key={hint}
                                    onClick={() => setInput(hint)}
                                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all text-sm text-zinc-300 text-left"
                                >
                                    {hint}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                                msg.role === 'user' ? "bg-zinc-800" : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/10"
                            )}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={cn(
                                "max-w-[80%] space-y-3",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed prose prose-invert max-w-none",
                                    msg.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10"
                                        : "bg-white/[0.03] border border-white/5 text-zinc-100 rounded-tl-none"
                                )}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>

                                {/* Tool Call Visualization */}
                                {msg.tool_calls && msg.tool_calls.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {msg.tool_calls.map((tc, tIdx) => (
                                            <div key={tIdx} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                                                <CheckCircle2 size={12} />
                                                Action: {tc.tool}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <Loader2 size={18} className="animate-spin text-indigo-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-12 pt-0 max-w-5xl mx-auto w-full z-10">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[28px] opacity-20 group-focus-within:opacity-40 blur transition duration-1000 group-focus-within:duration-200" />
                    <div className="relative flex items-center bg-[#0d0d10] border border-white/10 rounded-3xl p-2 pl-6">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask Zendo..."
                            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 py-3 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-[0.2em] font-medium font-bold">
                    Zendo AI • SQLite V2 • Phase III
                </p>
            </div>
        </div>
    );
}
