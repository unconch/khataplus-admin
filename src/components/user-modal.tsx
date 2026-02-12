"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, Calendar, Building2, User, Globe, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface UserModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0c16] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header/Cover */}
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-8">
                            <div className="relative -mt-12 mb-6">
                                <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-[#0a0c16] flex items-center justify-center text-3xl font-black text-white shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                                    {user.name?.[0] || 'U'}
                                </div>
                                <div className="absolute bottom-1 left-20 w-6 h-6 bg-emerald-500 border-4 border-[#0a0c16] rounded-full" title="Active Account" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{user.name || 'Anonymous User'}</h2>
                                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                                        <Mail className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                                    user.role === 'admin' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-slate-500/10 border-white/10 text-slate-400"
                                )}>
                                    {user.role || 'Member'}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem
                                    icon={<Calendar className="w-4 h-4 text-indigo-400" />}
                                    label="Registration Date"
                                    value={new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                />
                                <DetailItem
                                    icon={<Shield className="w-4 h-4 text-purple-400" />}
                                    label="Account Status"
                                    value={user.status || 'Verified Active'}
                                />
                                <DetailItem
                                    icon={<Building2 className="w-4 h-4 text-pink-400" />}
                                    label="Primary Organization"
                                    value="KhataPlus Cloud"
                                />
                                <DetailItem
                                    icon={<User className="w-4 h-4 text-emerald-400" />}
                                    label="Unique Identity ID"
                                    value={user.id.slice(0, 16) + '...'}
                                />
                            </div>

                            {/* Metadata / Logs Placeholder */}
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Security Insights</h3>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-500">Last Login Source</span>
                                        <span className="text-slate-300">Mumbai, India (Chrome/Windows)</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-500">MFA Enabled</span>
                                        <span className="text-emerald-500">Authenticator Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                            <button className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-tight hover:bg-white/10 transition-all">
                                Audit Activity
                            </button>
                            <button className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-tight shadow-lg shadow-indigo-600/20 transition-all">
                                Edit Permissions
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DetailItem({ icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-bold text-slate-200">{value}</div>
        </div>
    );
}
