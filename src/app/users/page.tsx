import { getRecentUsers } from "@/lib/data/admin";
import { Users, Mail, Phone, Calendar, Shield } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await getRecentUsers(50); // Fetch last 50 users

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        User Directory
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Registered Nodes & Identities
                    </p>
                </div>
                <div className="px-4 py-2 glass-neo rounded-xl text-xs font-bold text-primary uppercase tracking-widest">
                    Totally Count: {users.length}
                </div>
            </header>

            <div className="glass-neo rounded-[2.5rem] p-8 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 text-left">
                                <th className="pb-6 pl-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white mb-0.5">{user.full_name || user.email?.split('@')[0] || 'Anonymous'}</div>
                                                <div className="text-[10px] font-mono text-muted-foreground">{user.id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                                                <Mail size={12} className="text-indigo-500" />
                                                {user.email || 'No Email'}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                    <Phone size={12} className="text-emerald-500" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.role === 'admin'
                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            : 'bg-white/5 text-slate-400 border-white/10'
                                            }`}>
                                            {(() => {
                                                if (user.role === 'admin' || user.role === 'main admin') return 'Admin';
                                                if (user.org_name) {
                                                    return user.role === 'owner' ? `Owner • ${user.org_name}` : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} • ${user.org_name}`;
                                                }
                                                return 'Visitor';
                                            })()}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                            <Calendar size={12} />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
