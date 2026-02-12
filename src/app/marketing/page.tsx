"use client"

import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Target,
    TrendingUp,
    Share2,
    Plus,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    BarChart3,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Users,
    Zap,
    Activity,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    Send,
    Trash2,
    ExternalLink,
    LineChart,
    MousePointer2,
    PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCampaigns, createCampaign, postCampaign, getMarketingMetrics, generateGimmickAction, deleteCampaign } from "./actions";
import { toast } from "sonner";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function MarketingPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [postingId, setPostingId] = useState<number | null>(null);
    const [generating, setGenerating] = useState(false);
    const [variants, setVariants] = useState<any[]>([]);
    const [selectedVariant, setSelectedVariant] = useState(0);

    const fetchData = async () => {
        try {
            const [c, m] = await Promise.all([getCampaigns(), getMarketingMetrics()]);
            setCampaigns(c);
            setMetrics(m);
        } catch (error) {
            console.error("Failed to fetch marketing data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateGimmick = async (e: any) => {
        const form = e.target.closest('form');
        const title = form.querySelector('[name="title"]').value;
        const content = form.querySelector('[name="content"]').value;

        if (!title || !content) {
            toast.error("Please provide strategy and payload first.");
            return;
        }

        setGenerating(true);
        try {
            const res = await generateGimmickAction(title, content);
            setVariants(res);
            toast.success("AI Variants active. Select one to use.");
        } catch (error) {
            toast.error("AI Node failed to respond.");
        } finally {
            setGenerating(false);
        }
    };

    const handleApplyVariant = (variant: any) => {
        const contentArea = document.querySelector('[name="content"]') as HTMLTextAreaElement;
        if (contentArea) {
            contentArea.value = variant.content + "\n\n" + variant.hashtags.join(' ');
            toast.success("Gimmick applied to tactical payload.");
        }
    };

    const handlePost = async (campaign: any) => {
        setPostingId(campaign.id);
        try {
            await postCampaign(campaign.id);

            // Build Intent URLs
            const text = encodeURIComponent(campaign.content);
            const url = encodeURIComponent(`https://khataplus.online?cid=${campaign.id}&src=viral`);

            const intents: Record<string, string> = {
                twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                reddit: `https://www.reddit.com/submit?title=${encodeURIComponent(campaign.title)}&text=${text}%0A%0A${url}`,
                whatsapp: `https://wa.me/?text=${text}%20${url}`
            };

            campaign.platforms?.forEach((p: string) => {
                if (intents[p]) window.open(intents[p], '_blank');
            });

            toast.success("Social intents launched into orbit.");
            fetchData();
        } catch (error) {
            toast.error("Post sync failed.");
        } finally {
            setPostingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCampaign(id);
            setCampaigns(prev => prev.filter(c => c.id !== id));
            toast.success("Strategy purged.");
        } catch (error) {
            toast.error("Purge unsuccessful.");
        }
    };

    if (loading) {
        return (
            <div className="p-12 min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
                    <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Growth Nodes</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
            {/* Infinity Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black tracking-[0.2em] text-[10px] uppercase shadow-inner">
                        <Globe className="w-3.5 h-3.5" /> Infinity Command Hub
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white leading-none liquid-text">
                        Organic <span className="text-primary">Infinity</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-xl text-lg mt-4">Autonomous growth orchestration with predictive AI and localized social propagation.</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="glass-neo px-8 py-5 rounded-[2rem] flex items-center gap-6 border-white/5 bg-primary/5">
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Global Reach</div>
                            <div className="text-3xl font-black text-white">{metrics?.totalOrganicReach?.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center neo-inner">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Nodes Operational</span>
                    </div>
                </div>
            </header>

            {/* Metrics Dashboard */}
            <section className="grid gap-8 md:grid-cols-4">
                {[
                    { label: "Vector Flow", val: metrics?.vectorFlow, icon: <Zap className="w-6 h-6 text-amber-500" />, trend: "+2.4%", color: "amber" },
                    { label: "Conversion rate", val: metrics?.engagementRate, icon: <MousePointer2 className="w-6 h-6 text-emerald-500" />, trend: "Steady", color: "emerald" },
                    { label: "Active Nodes", val: campaigns.filter(c => c.status === 'posted').length, icon: <Activity className="w-6 h-6 text-indigo-500" />, trend: "+4", color: "indigo" },
                    { label: "Influence Score", val: "942", icon: <ShieldCheck className="w-6 h-6 text-rose-500" />, trend: "Peak", color: "rose" },
                ].map((stat, i) => (
                    <div key={i} className="glass-neo p-8 rounded-[2.5rem] group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[50px] -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                            stat.color === 'amber' ? 'bg-amber-500' :
                                stat.color === 'emerald' ? 'bg-emerald-500' :
                                    stat.color === 'indigo' ? 'bg-indigo-500' : 'bg-rose-500'
                        )} />
                        <div className="flex justify-between items-start relative z-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 neo-inner group-hover:rotate-12 transition-transform shadow-inner">
                                {stat.icon}
                            </div>
                            <span className="text-[9px] font-black text-white px-3 py-1 bg-white/10 rounded-full border border-white/20 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div className="mt-8 relative z-10">
                            <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.val}</div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Advanced Campaign Studio */}
                <section className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                            <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                            Tactical Studio
                        </h2>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const res = await createCampaign(formData);
                            if (res.success) {
                                toast.success("Strategy synchronized to operational queue.");
                                fetchData();
                                (e.target as HTMLFormElement).reset();
                                setVariants([]);
                            }
                        }}
                        className="glass-neo p-12 rounded-[3.5rem] space-y-12 bg-white/[0.01]"
                    >
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] ml-2">Strategy Identifier</label>
                                <div className="neo-inner bg-black/20 rounded-3xl relative flex items-center group">
                                    <Target className="ml-6 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="title"
                                        placeholder="IDENTIFY GROWTH VECTOR (E.G. REDDIT_VIRAL_X1)"
                                        className="w-full bg-transparent border-none focus:ring-0 outline-none px-6 py-6 font-black text-xs uppercase tracking-[0.2em] text-white placeholder:text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]">Tactical Payload</label>
                                    <button
                                        type="button"
                                        onClick={handleGenerateGimmick}
                                        disabled={generating}
                                        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <Sparkles className={cn("w-3.5 h-3.5", generating && "animate-spin")} />
                                        {generating ? "Calibrating AI..." : "Spark Intelligence"}
                                    </button>
                                </div>
                                <textarea
                                    name="content"
                                    placeholder="CRAFT ORGANIC TRANSMISSION..."
                                    className="w-full bg-black/20 border-none rounded-[2rem] p-8 min-h-[180px] text-sm font-bold text-white placeholder:text-slate-800 outline-none focus:ring-0 transition-all neo-inner tracking-wide leading-relaxed"
                                    required
                                />

                                {variants.length > 0 && (
                                    <div className="mt-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                        <div className="text-[10px] uppercase font-black text-primary tracking-[0.3em] ml-2 italic">AI Variants Generated</div>
                                        <div className="grid gap-4">
                                            {variants.map((v, i) => (
                                                <div
                                                    key={i}
                                                    className="p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
                                                    onClick={() => handleApplyVariant(v)}
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 rounded-lg">{v.type}</span>
                                                        <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{v.content}</p>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {v.hashtags.map((h: string) => (
                                                            <span key={h} className="text-[8px] text-primary/60 font-black">{h}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] ml-2">Propagation Network</label>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { id: 'twitter', icon: <Twitter className="w-5 h-5" />, color: 'hover:text-[#1DA1F2]' },
                                            { id: 'linkedin', icon: <Linkedin className="w-5 h-5" />, color: 'hover:text-[#0A66C2]' },
                                            { id: 'reddit', icon: <Share2 className="w-5 h-5" />, color: 'hover:text-[#FF4500]' },
                                            { id: 'whatsapp', icon: <MessageCircle className="w-5 h-5" />, color: 'hover:text-[#25D366]' }
                                        ].map((platform) => (
                                            <label key={platform.id} className="relative cursor-pointer group">
                                                <input type="checkbox" name="platforms" value={platform.id} className="peer sr-only" />
                                                <div className={cn(
                                                    "p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary/50 transition-all neo-inner group-hover:border-white/20",
                                                    platform.color
                                                )}>
                                                    {platform.icon}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] ml-2">Activation Schedule</label>
                                    <div className="p-1 rounded-3xl neo-inner bg-black/20">
                                        <input
                                            type="datetime-local"
                                            name="scheduledAt"
                                            className="w-full bg-transparent border-none rounded-2xl p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-6 rounded-[2rem] bg-primary text-white font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.98]">
                            Lock Growth Vector <Send className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Operational Queue */}
                    <div className="space-y-8 px-2">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-4">
                            <Clock className="w-6 h-6 text-primary" /> Operational Matrix
                        </h3>
                        {campaigns.length === 0 ? (
                            <div className="glass-neo p-24 rounded-[3.5rem] text-center border-dashed border-white/5">
                                <Activity className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">No active tactics in vector path.</div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {campaigns.map((c) => (
                                    <div key={c.id} className="glass-neo p-8 rounded-[3rem] bg-white/[0.01] flex items-center justify-between group hover:border-white/10 transition-all duration-500">
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-5">
                                                <div className="flex -space-x-3">
                                                    {c.platforms?.map((p: string) => (
                                                        <div key={p} className="w-10 h-10 rounded-full bg-[#03050c] border-2 border-border flex items-center justify-center shadow-2xl transition-transform hover:z-10 hover:scale-110">
                                                            {p === 'twitter' ? <Twitter className="w-4 h-4 text-[#1DA1F2]" /> :
                                                                p === 'linkedin' ? <Linkedin className="w-4 h-4 text-[#0A66C2]" /> :
                                                                    p === 'reddit' ? <Share2 className="w-4 h-4 text-[#FF4500]" /> :
                                                                        <MessageCircle className="w-4 h-4 text-[#25D366]" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="font-black text-white text-xl tracking-tight group-hover:text-primary transition-colors uppercase italic">{c.title}</div>
                                                {c.status === 'posted' ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase border border-emerald-500/20 shadow-inner tracking-[0.2em]">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" /> LIVE_PULSE
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase border border-primary/20 shadow-sm tracking-[0.2em] italic">
                                                        {c.status || 'DEPLOYED'}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest line-clamp-1 max-w-xl italic opacity-50">{c.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500/30 hover:text-rose-500 transition-all hover:rotate-12"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            {c.status !== 'posted' && (
                                                <button
                                                    onClick={() => handlePost(c)}
                                                    disabled={postingId === c.id}
                                                    className="px-10 py-4 rounded-2xl bg-primary hover:bg-white hover:text-primary text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary/20"
                                                >
                                                    {postingId === c.id ? 'SYNCHRONIZING...' : 'MANUAL_BOOT'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Data Insights Column */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Growth Intelligence</h2>
                    </div>

                    <div className="glass-neo p-10 rounded-[3rem] space-y-12">
                        {/* Reach Map/Visual Placeholder */}
                        <div className="space-y-6">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] flex items-center justify-between">
                                <span>Propagation Map</span>
                                <span className="text-primary italic">Live Telemetry</span>
                            </div>
                            <div className="min-h-64 w-full bg-black/40 rounded-[2rem] neo-inner relative overflow-hidden flex flex-col items-center justify-center p-8 text-center group">
                                {Object.keys(metrics?.geoClusters || {}).length === 0 ? (
                                    <>
                                        <Globe className="w-16 h-16 text-primary/10 absolute animate-pulse rotate-12" />
                                        <div className="space-y-4 relative z-10">
                                            <div className="text-[40px] font-black text-white tracking-tighter leading-none">{metrics?.vectorFlow || 0}</div>
                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global PSEO Vectors Active</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full space-y-4 relative z-10">
                                        {Object.entries(metrics.geoClusters).map(([city, count]: [string, any]) => (
                                            <div key={city} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{city}</span>
                                                </div>
                                                <div className="text-xs font-black text-primary">{count} CLICKS</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Funnel */}
                        <div className="space-y-10">
                            <div className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-primary" /> Funnel Performance
                            </div>
                            {[
                                { label: "IMPRESSIONS", value: metrics?.totalOrganicReach, color: "bg-primary", sub: "Estimated reach" },
                                { label: "CLICKS", value: metrics?.referralTraffic, color: "bg-emerald-500", sub: "UTM matched" },
                                { label: "SIGNUPS", value: (metrics?.referralTraffic * 0.1).toFixed(0), color: "bg-amber-500", sub: "Attributed ROI" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-black text-white tracking-widest uppercase">{item.label}</div>
                                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.sub}</div>
                                        </div>
                                        <div className="text-xl font-black text-white">{item.value?.toLocaleString()}</div>
                                    </div>
                                    <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden neo-inner">
                                        <div
                                            className={cn("h-full transition-all duration-[2s] shadow-lg", item.color)}
                                            style={{ width: `${Math.min((parseInt(item.value?.toString() || '0') / (metrics?.totalOrganicReach || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Alerts */}
                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">System Protocol</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-5 shadow-inner group cursor-pointer hover:bg-primary/10 transition-all">
                                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">Vector Sync v4.2</div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">System tracking 1,240 propagation nodes across 100 cities.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
