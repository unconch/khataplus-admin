import { sql } from "@/lib/db";
import { Tag, Search, Filter, Plus, FileText, ShieldCheck, ArrowRight, Shield, Activity, MoreHorizontal, Zap, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addHSN, deleteHSN } from "./actions";

export default async function HSNPage() {
    const codes = await sql`
        SELECT * FROM hsn_master 
        ORDER BY hsn_code ASC
    ` as any[];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        HSN Registry
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Global Regulatory Tariff Master
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Locked</span>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-[450px,1fr] gap-12 items-start">
                {/* Registration Form */}
                <section className="space-y-8 sticky top-8">
                    <div className="glass-neo p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Tag className="w-48 h-48 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-2xl font-black text-white">Registry Injection</h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">New HSN Definition</p>
                            </div>

                            <form action={addHSN} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">HSN Global Code</label>
                                    <input
                                        name="hsn_code"
                                        placeholder="Enter 4-8 Digit Code..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tariff Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Classification Details..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium resize-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">IGST Magnitude (%)</label>
                                    <input
                                        name="igst"
                                        type="number"
                                        placeholder="e.g. 18"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <button type="submit" className="glossy-button w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 group shadow-2xl">
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    Validate & Insert
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Registry View */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <FileText className="w-6 h-6 text-primary" />
                                Active Codes
                            </h2>
                            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground group">
                                <span className="text-primary">{codes.length}</span> CLASSIFIED
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    placeholder="Filter Registry..."
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/30 transition-all w-48"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {codes.map((item) => (
                            <div key={item.id} className="glass-neo p-6 rounded-[2.2rem] group hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center neo-inner text-primary group-hover:scale-110 transition-transform">
                                            <Tag className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-white tracking-tighter">#{item.hsn_code}</div>
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Global Classification</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 px-8 border-x border-white/5">
                                        <p className="text-sm font-medium text-slate-300 line-clamp-1">{item.description}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                IGST: {item.igst}%
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                                Secured
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="glossy-button p-2.5 rounded-xl text-white hover:text-primary">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        <form action={async () => { "use server"; await deleteHSN(item.id); }}>
                                            <button className="glossy-button p-2.5 rounded-xl text-white hover:text-rose-400">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {codes.length === 0 && (
                            <div className="py-32 glass-neo rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center">
                                <Shield className="w-16 h-16 text-muted-foreground/10 mb-6" />
                                <h3 className="text-2xl font-bold text-muted-foreground">Registry Null</h3>
                                <p className="text-xs text-muted-foreground/40 uppercase tracking-[0.3em] font-black mt-3">Awaiting Compliance Input</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
