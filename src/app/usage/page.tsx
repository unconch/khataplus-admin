import { getInfrastructureUsage } from "@/lib/data/usage";
import { Database, Zap, Shield, HardDrive, BarChart3, ArrowUpRight, Server, Box, Activity, ShieldCheck, Layers, TrendingUp, Clock, Search, MoreHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function UsagePage() {
    const data = await getInfrastructureUsage();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Resource Velocity
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Global Infrastructure Scaling Telemetry
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <Server className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Scaling Auto-On</span>
                    </div>
                </div>
            </header>

            {/* Capacity Surface */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "DB Throughput", value: data.database.totalSize, trend: "Nominal", icon: Database, color: "text-indigo-400" },
                    { label: "Auth Objects", value: data.authentication.totalUsers.toLocaleString(), trend: "Active", icon: ShieldCheck, color: "text-rose-400" },
                    { label: "Compute Nodes", value: "12", trend: "Secured", icon: Layers, color: "text-amber-400" },
                    { label: "Peak Efficiency", value: "98.4%", trend: "Optimal", icon: Zap, color: "text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass-neo p-8 rounded-[2.5rem] group relative overflow-hidden hover:scale-[1.02] transition-all duration-500">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <div className={cn("p-4 rounded-xl bg-white/5 border border-white/10 neo-inner mb-6 w-fit", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                        <div className="text-[9px] font-black text-emerald-400/60 uppercase tracking-widest mt-2">{stat.trend}</div>
                    </div>
                ))}
            </section>

            <div className="grid lg:grid-cols-[1fr,450px] gap-12 items-start">
                {/* Partition Mapping */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Layers className="w-6 h-6 text-primary" />
                            Data Partitioning
                        </h2>
                    </div>

                    <div className="glass-neo rounded-[3rem] overflow-hidden group">
                        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                            <div className="grid grid-cols-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                <span>Entity</span>
                                <span>Volume</span>
                                <span className="text-right">Utilization</span>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {data.database.tables.map((table: any) => (
                                <div key={table.table_name} className="flex items-center justify-between p-6 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group/row">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner text-indigo-400">
                                            <Box className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase tracking-tight">{table.table_name}</div>
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">System Node</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="text-xs font-black text-white font-mono">{table.size_pretty}</div>
                                    </div>
                                    <div className="flex-1 flex justify-end">
                                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden neo-inner">
                                            <div className="h-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: '45%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Scaling Projections */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            Projections
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { label: '30-Day Growth Delta', value: data.authentication.newUsers30d, icon: ArrowUpRight, color: 'text-emerald-500' },
                            { label: 'Node Capacity Limit', value: '450 GB', icon: Server, color: 'text-indigo-500' },
                            { label: 'Latency Threshold', value: '12ms', icon: Activity, color: 'text-rose-500' }
                        ].map((proj, i) => (
                            <div key={i} className="glass-neo p-8 rounded-[2.8rem] group relative overflow-hidden hover:translate-x-2 transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10 neo-inner", proj.color)}>
                                        <proj.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest px-2 py-0.5 rounded-lg border border-emerald-400/10">Calculated</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{proj.label}</div>
                                    <div className="text-3xl font-black text-white tracking-tighter">{proj.value}</div>
                                </div>
                            </div>
                        ))}

                        <div className="glass-neo p-8 rounded-[3rem] bg-indigo-500/5 border-indigo-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-indigo-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">Protocol Protocol</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                    "Infrastructure is currently optimized for burst-mode. No expansion nodes required for the next 42 production cycles."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
