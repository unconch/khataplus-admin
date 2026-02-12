"use client";

import { useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserModal } from "./user-modal";

interface RecentRegistrationsProps {
    users: any[];
}

export function RecentRegistrations({ users }: RecentRegistrationsProps) {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <>
            <section className="xl:col-span-2 glass-card rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden bg-transparent border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Users className="w-32 h-32 text-indigo-500" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Recent Registrations</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">Latest users who joined the KhataPlus ecosystem.</p>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold flex items-center gap-2 text-slate-300">
                        View Directory <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid gap-2 relative z-10">
                    {users.map((user: any, i) => (
                        <div
                            key={user.id}
                            onClick={() => handleUserClick(user)}
                            className="group flex items-center justify-between p-4 px-6 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center font-bold text-lg text-white group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-500 shadow-lg group-hover:shadow-indigo-500/20">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    {i < 3 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#03040b] rounded-full" />}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">{user.name || 'Anonymous User'}</div>
                                    <div className="text-xs text-slate-500 font-medium tracking-tight">{user.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="hidden md:block text-right">
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Permissions</div>
                                    <div className={cn(
                                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider",
                                        user.role === 'admin' ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-500/10 text-slate-400"
                                    )}>{user.role || 'Member'}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <UserModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
