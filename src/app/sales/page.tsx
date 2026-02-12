import { sql } from "@/lib/db";
import { ShoppingCart, TrendingUp, Calendar, CreditCard, Building2, Search, Filter, MoreHorizontal, ArrowUpRight, Activity, Zap, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
    const [transactions, metrics] = await Promise.all([
        sql`
            SELECT * FROM sales 
            ORDER BY created_at DESC 
            LIMIT 10
        ` as Promise<any[]>,
        sql`
            SELECT 
                SUM(total_amount) as total_volume,
                SUM(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN total_amount ELSE 0 END) as daily_volume,
                1 as active_channels
            FROM sales
        ` as Promise<any[]>
    ]);

    const stats = metrics[0];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Transaction Ledger
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Global Revenue Stream Telemetry
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-6 py-3 rounded-2xl flex items-center gap-4 border-white/5 shadow-2xl">
                        <div className="text-right">
                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Gross Nodes</div>
                            <div className="text-lg font-black text-white">₹{((stats.total_volume || 0) / 1000000).toFixed(2)}M</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center neo-inner">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <section className="grid md:grid-cols-3 gap-8">
                {[
                    { label: "Daily Throughput", value: `₹${((stats.daily_volume || 0) / 1000).toFixed(1)}K`, delta: "Live", icon: Zap, color: "text-amber-500" },
                    { label: "Active Channels", value: stats.active_channels || "0", delta: "Nominal", icon: Activity, color: "text-indigo-500" },
                    { label: "System Uptime", value: "99.98%", delta: "Secured", icon: ShieldCheck, color: "text-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="glass-neo p-8 rounded-[2.5rem] group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 neo-inner group-hover:rotate-12 transition-transform", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full">
                                {stat.delta}
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Recent Transactions */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-primary" />
                        Live Velocity
                    </h2>
                </div>

                <div className="grid gap-4">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="glass-neo p-6 rounded-[2rem] group hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner group-hover:scale-110 transition-transform">
                                        <ShoppingCart className="w-7 h-7 text-primary/80" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-white tracking-tight">₹{tx.total_amount}</div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                            <Building2 className="w-3 h-3" />
                                            {tx.org_name || 'System Transaction'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 flex-1 max-w-2xl px-8 border-x border-white/5">
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Method</div>
                                        <div className="text-xs font-bold text-slate-200 uppercase">DIGITAL</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Time Delta</div>
                                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-indigo-400" />
                                            {new Date(tx.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="hidden lg:block">
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">System Hash</div>
                                        <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">{tx.id}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Validation</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Secured</span>
                                        </div>
                                    </div>
                                    <button className="glossy-button p-3 rounded-xl hover:text-primary transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
