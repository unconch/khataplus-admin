import { sql } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Clock, Shield, User, Activity, Search, Filter, MoreHorizontal, ArrowRight, ShieldCheck, Zap, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AuditLogsPage() {
    const logs = await sql`
        SELECT * FROM audit_logs 
        ORDER BY created_at DESC 
        LIMIT 50
    ` as any[];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Audit Stream
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Global Protocol Execution Trace
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Hook Active</span>
                    </div>
                </div>
            </header>

            {/* Audit Timeline */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary" />
                        Trace History
                    </h2>
                    <button className="glossy-button px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Config Filter
                    </button>
                </div>

                <div className="relative space-y-4">
                    {/* Vertical Beam */}
                    <div className="absolute left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent hidden md:block" />

                    {logs.map((log, i) => (
                        <div key={log.id} className="glass-neo p-6 rounded-[2.2rem] group hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                                {/* Time Marker */}
                                <div className="flex items-center gap-4 min-w-[140px]">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner text-primary group-hover:scale-110 transition-transform relative z-20">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white italic">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</div>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString()}</div>
                                    </div>
                                </div>

                                {/* Content Shell */}
                                <div className="flex-1 grid md:grid-cols-[200px,1fr,250px] gap-8 items-center border-l border-white/5 md:pl-8">
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none px-2 py-0.5 rounded bg-white/5 w-fit">Subject Entity</div>
                                        <div className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5" />
                                            {log.org_name || 'Protocol / Static'}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Operation Result</div>
                                        <div className="text-sm font-black text-white tracking-tight uppercase flex items-center gap-2">
                                            {log.action}
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-4 neo-inner border border-white/5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                <User className="w-3 h-3 text-indigo-400" />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-200">{log.user_name || 'System Auto'}</div>
                                        </div>
                                        <div className="text-[9px] font-mono text-muted-foreground truncate leading-none opacity-60 italic">{JSON.stringify(log.details)}</div>
                                    </div>
                                </div>

                                <button className="glossy-button p-3 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
