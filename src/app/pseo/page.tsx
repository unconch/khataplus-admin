import { sql } from "@/lib/db";
import { Globe, MapPin, Grid, Trash2, Power, Plus, Layers, ShieldCheck, Activity, Search, Filter, MoreHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { addCity, addCategory, toggleCity, toggleCategory, deleteCity, deleteCategory } from "./actions";

export default async function PSEOPage() {
    const [cities, categories] = await Promise.all([
        sql`SELECT * FROM pseo_cities ORDER BY name ASC`,
        sql`SELECT * FROM pseo_categories ORDER BY name ASC`
    ]) as [any[], any[]];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black liquid-text tracking-tighter">
                        Search Cluster
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                        Autonomous pSEO Distribution Engine
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-neo px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Engine Online</span>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Regional Clusters */}
                <section className="space-y-8">
                    <div className="glass-neo p-8 rounded-[3rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <MapPin className="w-48 h-48 text-primary" />
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">Regional Nodes</h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Geographic Distribution</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 neo-inner text-primary">
                                <Globe className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Add City Form */}
                        <form action={addCity} className="flex gap-3 relative z-10">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    name="name"
                                    placeholder="Enter Region Name..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                            <button type="submit" className="glossy-button p-3 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </button>
                        </form>

                        <div className="space-y-3 relative z-10">
                            {cities.map((city) => (
                                <div key={city.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/row">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center neo-inner transition-colors",
                                            city.enabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        )}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{city.name}</div>
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Slug: {city.slug}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form action={async () => { "use server"; await toggleCity(city.id, city.enabled); }}>
                                            <button className={cn(
                                                "p-2 rounded-xl transition-all",
                                                city.enabled ? "text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/20" : "text-rose-400 bg-rose-400/5 hover:bg-rose-400/20"
                                            )}>
                                                <Power className="w-4 h-4" />
                                            </button>
                                        </form>
                                        <form action={async () => { "use server"; await deleteCity(city.id); }}>
                                            <button className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Category Clusters */}
                <section className="space-y-8">
                    <div className="glass-neo p-8 rounded-[3rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Grid className="w-48 h-48 text-primary" />
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">Market Segments</h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Niche Categorization</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 neo-inner text-primary">
                                <Layers className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Add Category Form */}
                        <form action={addCategory} className="flex gap-3 relative z-10">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    name="name"
                                    placeholder="Enter Category Name..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                            <button type="submit" className="glossy-button p-3 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </button>
                        </form>

                        <div className="space-y-3 relative z-10">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/row">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center neo-inner transition-colors",
                                            cat.enabled ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        )}>
                                            <Grid className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{cat.name}</div>
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Slug: {cat.slug}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form action={async () => { "use server"; await toggleCategory(cat.id, cat.enabled); }}>
                                            <button className={cn(
                                                "p-2 rounded-xl transition-all",
                                                cat.enabled ? "text-indigo-400 bg-indigo-400/5 hover:bg-indigo-400/20" : "text-rose-400 bg-rose-400/5 hover:bg-rose-400/20"
                                            )}>
                                                <Power className="w-4 h-4" />
                                            </button>
                                        </form>
                                        <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                                            <button className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
