import { sql } from "@/lib/db";
import { Building2, Globe, Phone, MapPin, Calendar, ExternalLink, Search, TrendingUp, ShieldCheck, Plus, MoreHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function OrganizationsPage() {
    const orgs = await sql`
        SELECT * FROM organizations 
        ORDER BY created_at DESC
    ` as any[];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Entity Directory
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Enterprise Node Network
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="glossy-button px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 shadow-lg group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Register Org
                    </button>
                </div>
            </header>

            {/* Entity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {orgs.map((org) => (
                    <div key={org.id} className="glass-neo p-4 rounded-[2.8rem] group relative hover:translate-y-[-4px] transition-all duration-500">
                        {/* Inner Shell */}
                        <div className="bg-white/[0.02] rounded-[2.2rem] p-6 border border-white/5 neo-inner">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[1.6rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center neo-inner shadow-2xl group-hover:scale-110 transition-transform">
                                        <Building2 className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.4)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">{org.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-1">
                                            <Globe className="w-3 h-3" />
                                            {org.slug}.khataplus.com
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 rounded-xl bg-white/5 border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5 flex flex-col gap-1.5 group-hover:bg-primary/5 transition-colors">
                                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Global Reach</div>
                                    <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                                        <MapPin className="w-3 h-3 text-rose-400" />
                                        {org.country || 'International'}
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5 flex flex-col gap-1.5 group-hover:bg-primary/5 transition-colors">
                                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Status</div>
                                    <div className="text-xs font-bold text-white flex items-center gap-2 leading-none">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        Operational
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/40 transition-colors cursor-pointer group/icon">
                                        <Phone className="w-3 h-3 text-muted-foreground group-hover/icon:text-primary" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/40 transition-colors cursor-pointer group/icon">
                                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover/icon:text-primary" />
                                    </div>
                                </div>
                                <button className="glossy-button px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 group/btn">
                                    Manage Node
                                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {orgs.length === 0 && (
                    <div className="col-span-full py-40 glass-neo rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center">
                        <Building2 className="w-20 h-20 text-muted-foreground/10 mb-8" />
                        <h3 className="text-3xl font-bold text-muted-foreground">Entity-Zero</h3>
                        <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.3em] font-black mt-3">Initializing Network Mesh...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
