import { sql } from "@/lib/db";
import { Megaphone, Bell, Calendar, Power, Trash2, Plus, Send, Radio, Activity, Search, Filter, MoreHorizontal, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { addAnnouncement, deleteAnnouncement, toggleAnnouncement } from "./actions";

export default async function AnnouncementsPage() {
    const announcements = await sql`
        SELECT * FROM announcements 
        ORDER BY created_at DESC
    ` as any[];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-12 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Broadcast Center
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Global Protocol Propagation
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal Active</span>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-[450px,1fr] gap-12 items-start">
                {/* Compose Broadcast */}
                <section className="space-y-8 sticky top-8">
                    <div className="glass-neo p-10 rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Send className="w-48 h-48 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-2xl font-black text-white">New Broadcast</h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Protocol Injection</p>
                            </div>

                            <form action={addAnnouncement} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Protocol Title</label>
                                    <input
                                        name="title"
                                        placeholder="Enter Broadcast Title..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Payload Content</label>
                                    <textarea
                                        name="content"
                                        placeholder="Enter Transmission Payload..."
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium resize-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Priority Layer</label>
                                    <select
                                        name="type"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium appearance-none"
                                    >
                                        <option value="info" className="bg-background">Class: INFO</option>
                                        <option value="warning" className="bg-background">Class: ALERT</option>
                                        <option value="success" className="bg-background">Class: NOTIFY</option>
                                    </select>
                                </div>
                                <button type="submit" className="glossy-button w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 group shadow-2xl">
                                    <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                    Propagate Signal
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Transmission Log */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Radio className="w-6 h-6 text-primary" />
                            Transmission History
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {announcements.map((ann) => (
                            <div key={ann.id} className="glass-neo p-8 rounded-[2.8rem] relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                                <div className={cn(
                                    "absolute top-0 right-0 w-4 h-full opacity-20",
                                    ann.type === 'warning' ? "bg-rose-500" :
                                        ann.type === 'success' ? "bg-emerald-500" :
                                            "bg-indigo-500"
                                )} />

                                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                ann.type === 'warning' ? "text-rose-400 border-rose-400/20 bg-rose-400/5" :
                                                    ann.type === 'success' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                                                        "text-indigo-400 border-indigo-400/20 bg-indigo-400/5"
                                            )}>
                                                {ann.type} Signal
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 grayscale opacity-60">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(ann.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">{ann.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">{ann.content}</p>
                                    </div>

                                    <div className="flex md:flex-col items-center justify-between gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                        <div className="text-center md:text-right">
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Status</div>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", ann.enabled ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10")} />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{ann.enabled ? 'Live' : 'Cached'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <form action={async () => { "use server"; await toggleAnnouncement(ann.id, ann.enabled); }}>
                                                <button className="glossy-button p-2.5 rounded-xl text-white hover:text-primary">
                                                    <Power className="w-5 h-5" />
                                                </button>
                                            </form>
                                            <form action={async () => { "use server"; await deleteAnnouncement(ann.id); }}>
                                                <button className="glossy-button p-2.5 rounded-xl text-white hover:text-rose-400">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {announcements.length === 0 && (
                            <div className="py-32 glass-neo rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <Bell className="w-16 h-16 text-muted-foreground/10 mb-6" />
                                <h3 className="text-2xl font-bold text-muted-foreground">Silence in Ether</h3>
                                <p className="text-xs text-muted-foreground/40 uppercase tracking-[0.3em] font-black mt-3">Ready for Signal Injection</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
