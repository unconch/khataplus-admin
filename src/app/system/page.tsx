import { getSystemMetrics } from "@/lib/data/system";
import { Activity, ShieldCheck, Zap, Database, Clock, Server, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Search, Filter, MoreHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import HealthDoctor from "@/components/health-doctor";

export default async function SystemPage() {
    const metrics = await getSystemMetrics();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Core Integrity
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Autonomous Infrastructure Monitoring
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Secured</span>
                    </div>
                </div>
            </header>

            {/* Health Doctor Component */}
            <HealthDoctor />

            {/* System Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "System Latency", value: metrics.latency, trend: metrics.latencyTrend, icon: Zap, color: "text-amber-500" },
                    { label: "Audit Throughput", value: metrics.recentAudits, trend: "Daily", icon: Activity, color: "text-indigo-500" },
                    { label: "Mesh Status", value: metrics.status, trend: "Stable", icon: ShieldCheck, color: "text-emerald-500" },
                    { label: "Last Backup", value: metrics.lastBackup, trend: "Secured", icon: Clock, color: "text-rose-500" },
                ].map((stat, i) => (
                    <div key={i} className="glass-neo p-8 rounded-[2.5rem] group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-4 rounded-xl bg-white/5 border border-white/10 neo-inner group-hover:rotate-12 transition-transform", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 border border-emerald-400/10 px-2.5 py-1 rounded-full bg-emerald-400/5">
                                {stat.trend}
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Detail Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
                <section className="glass-neo rounded-[3rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Server className="w-48 h-48 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-white">Active Node Cluster</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Global Compute Nodes</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Asia-Pacific (Mumbai)", load: "42%", status: "Nominal" },
                                { name: "Europe (Frankfurt)", load: "28%", status: "Nominal" },
                                { name: "US-East (Virginia)", load: "64%", status: "High Load" },
                            ].map((node, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner text-primary">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-white text-sm">{node.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-white mb-1">{node.load}</div>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{node.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="glass-neo rounded-[3rem] p-10 bg-indigo-500/[0.03] border-indigo-500/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-white">Security Protocol</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Active Threat Monitor</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 neo-inner flex flex-col items-center justify-center text-center">
                            <ShieldCheck className="w-16 h-16 text-indigo-400 mb-6 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest">All Nodes Secure</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-2">Last Scan: 2m ago</p>
                        </div>
                        <button className="glossy-button w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white">
                            Execute Security Audit
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
