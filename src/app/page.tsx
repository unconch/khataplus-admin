import { getAdminStats, getRecentLogs } from "@/lib/data/admin";
import {
  Users,
  Building2,
  ShoppingCart,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const adminStats = await getAdminStats();
  const recentLogs = await getRecentLogs();

  const stats = [
    { label: "Active Nodes", value: adminStats.users.total.toLocaleString(), trend: adminStats.users.trend, icon: Zap, color: "text-amber-500", glow: "shadow-amber-500/20" },
    { label: "Total Volume", value: `₹${(adminStats.sales.total / 1000).toFixed(1)}K`, trend: "+12.1%", icon: ShoppingCart, color: "text-emerald-500", glow: "shadow-emerald-500/20" },
    { label: "Global Entities", value: adminStats.organizations.total.toLocaleString(), trend: adminStats.organizations.trend, icon: Building2, color: "text-indigo-500", glow: "shadow-indigo-500/20" },
    { label: "Growth Index", value: adminStats.sales.recentCount.toLocaleString(), trend: "Live", icon: TrendingUp, color: "text-rose-500", glow: "shadow-rose-500/20" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black liquid-text tracking-tighter">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Autonomous Node Management v4.2
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              placeholder="Search Node Cluster..."
              className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-64 text-white"
            />
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-neo p-8 rounded-[2.5rem] relative group hover:scale-[1.02] transition-all duration-500 group overflow-hidden">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 rounded-full -mr-16 -mt-16 transition-all group-hover:opacity-20", stat.color.replace('text', 'bg'))} />

            <div className="flex justify-between items-start relative z-10">
              <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 neo-inner transition-transform group-hover:rotate-12", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border",
                stat.trend.startsWith('+') ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" : "text-rose-500 bg-rose-500/5 border-rose-500/10"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-4xl font-black text-white tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Main Visual/Activity Area */}
        <section className="glass-neo rounded-[3rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-64 h-64 text-primary" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Operational Stream</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Global Telemetry Data</p>
              </div>
              <button className="glossy-button px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                View Full Log
              </button>
            </div>

            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner text-primary group-hover/item:scale-110 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{log.org_name || 'System Protocol'}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{log.action}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-white mb-1 italic opacity-60">Verified</div>
                    <div className="text-[9px] font-bold text-primary uppercase tracking-widest">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tactical Overview */}
        <section className="space-y-6">
          <div className="glass-neo p-8 rounded-[3rem] relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 neo-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Global Pulse</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Efficiency Index</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Protocol Load", value: adminStats.pulse.load, color: "bg-indigo-500" },
                { label: "Mesh Stability", value: adminStats.pulse.stability.toFixed(1), color: "bg-emerald-500" },
                { label: "Sync Velocity", value: Math.min(adminStats.pulse.velocity, 100), color: "bg-amber-500" },
              ].map((pulse, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">{pulse.label}</span>
                    <span className="text-white">{pulse.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden neo-inner">
                    <div
                      className={cn("h-full transition-all duration-1000", pulse.color)}
                      style={{ width: `${pulse.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-neo p-10 rounded-[3rem] bg-primary/5 border-primary/10 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="w-20 h-20 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">System Status: Online</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                All systems active. Dashboard updated successfully.
              </p>
              <button className="w-full glossy-button py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white">
                Run Diagnostics
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
