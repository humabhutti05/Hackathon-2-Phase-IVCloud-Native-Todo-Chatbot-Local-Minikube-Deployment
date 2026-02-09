
"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    tool_calls?: any[];
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [userId] = useState('User');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

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

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.conversation_id) {
                setConversationId(data.conversation_id);
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || 'I received your message but have no response.',
                tool_calls: data.tool_calls,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);

            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: '⚠️ Sorry, I encountered an error connecting to the service. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedPrompts = [
        "Add a task to buy groceries",
        "What's on my pending list?",
        "Show all tasks",
        "Mark task 1 as complete"
    ];

    return (
        <div className="flex flex-col h-full relative bg-transparent overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Messages Container */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-6 scroll-smooth z-10"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
            >
                {messages.length === 0 ? (
                    <EmptyState
                        icon={Bot}
                        title="Hello, I'm Zendo"
                        description="Ask me to add tasks, list your todos, or mark them as complete. Use my AI powers to manage your life!"
                        action={
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mt-4">
                                {suggestedPrompts.map((hint) => (
                                    <motion.button
                                        key={hint}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setInput(hint)}
                                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all text-sm text-zinc-300 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <Sparkles size={14} className="inline mr-2 text-indigo-400" />
                                        {hint}
                                    </motion.button>
                                ))}
                            </div>
                        }
                    />
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex gap-3 md:gap-4",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 mt-1",
                                    msg.role === 'user'
                                        ? "bg-zinc-800 ring-2 ring-white/5"
                                        : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"
                                )}
                                    aria-hidden="true"
                                >
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>

                                {/* Message Content */}
                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[85%] md:max-w-[75%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "p-3 md:p-4 rounded-2xl text-sm leading-relaxed",
                                        "prose prose-invert prose-sm max-w-none",
                                        "prose-p:my-2 prose-ul:my-2 prose-ol:my-2",
                                        msg.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-tr-md shadow-lg shadow-indigo-600/20"
                                            : "bg-white/[0.03] border border-white/5 text-zinc-100 rounded-tl-md"
                                    )}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>

                                    {/* Tool Call Badges */}
                                    {msg.tool_calls && msg.tool_calls.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-wrap gap-2"
                                        >
                                            {msg.tool_calls.map((tc, tIdx) => (
                                                <Badge key={tIdx} variant="success">
                                                    <Sparkles size={10} />
                                                    {tc.tool}
                                                </Badge>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Bot size={18} />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <Loader2 size={18} className="animate-spin text-indigo-400" />
                            <span className="text-sm text-zinc-400">Thinking...</span>
                        </div>
                    </motion.div>
                )}

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"
                    >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 lg:p-12 pt-0 max-w-5xl mx-auto w-full z-10">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[28px] opacity-20 group-focus-within:opacity-40 blur transition duration-500" />

                        {/* Input container */}
                        <div className="relative flex items-center gap-2 bg-[#0d0d10] border border-white/10 rounded-3xl p-2 pl-4 md:pl-6">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Zendo anything..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 py-2 md:py-3 text-sm disabled:opacity-50"
                                aria-label="Chat input"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={!input.trim() || isLoading}
                                isLoading={isLoading}
                                className="rounded-2xl w-10 h-10 p-0"
                                aria-label="Send message"
                            >
                                {!isLoading && <Send size={18} />}
                            </Button>
                        </div>
                    </div>
                </form>

                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-[0.2em] font-bold">
                    Zendo AI • Powered by OpenAI • Phase IV
                </p>
            </div>
        </div>
    );
}
