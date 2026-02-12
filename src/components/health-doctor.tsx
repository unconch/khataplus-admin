'use client';

import { useState, useEffect } from 'react';
import { Activity, Trash2, ShieldCheck, Loader2, AlertTriangle, CheckCircle2, RotateCcw, Database, Zap } from 'lucide-react';
import { checkSystemHealth, cleanupOrphanedOrgs, cleanupOrphanedUsers } from '@/app/system/actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function HealthDoctor() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const data = await checkSystemHealth();
            setStats(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch system health');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const handleCleanupOrgs = async () => {
        if (!confirm('Are you sure you want to delete all orphaned organizations? This action cannot be undone.')) return;

        setActionLoading('orgs');
        try {
            await cleanupOrphanedOrgs();
            toast.success('Orphaned organizations cleaned up');
            fetchHealth();
        } catch (error) {
            toast.error('Cleanup failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCleanupUsers = async () => {
        if (!confirm('Are you sure you want to delete all orphaned users? This action cannot be undone.')) return;

        setActionLoading('users');
        try {
            await cleanupOrphanedUsers();
            toast.success('Orphaned users cleaned up');
            fetchHealth();
        } catch (error) {
            toast.error('Cleanup failed');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="glass-neo p-12 rounded-[3rem] flex flex-col items-center justify-center min-h-[300px] border-dashed border-white/10">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-6 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Calibrating Diagnostics...</p>
            </div>
        );
    }

    const hasIssues = (stats?.orphanedOrgs || 0) > 0 || (stats?.orphanedUsers || 0) > 0;

    return (
        <section className="space-y-10 group">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-5">
                    <div className={cn("p-4 rounded-[1.4rem] border transition-all duration-500 neo-inner", hasIssues ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>
                        <Activity className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Health Doctor</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Autonomous Integrity Validation</p>
                    </div>
                </div>
                <button onClick={fetchHealth} className="glossy-button p-4 rounded-2xl text-white hover:text-primary active:rotate-180 transition-all duration-500">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative">
                {/* Orphaned Orgs */}
                <div className={cn("glass-neo p-8 rounded-[3rem] flex flex-col justify-between group/card relative overflow-hidden transition-all duration-500", stats?.orphanedOrgs > 0 ? "border-rose-500/30 bg-rose-500/[0.03]" : "hover:scale-[1.02]")}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                        <AlertTriangle className="w-48 h-48 text-rose-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Orphaned Entities</div>
                                <div className={cn("text-5xl font-black tracking-tighter", stats?.orphanedOrgs > 0 ? "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "text-white")}>
                                    {stats?.orphanedOrgs || 0}
                                </div>
                            </div>
                            {stats?.orphanedOrgs > 0 ? (
                                <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                            ) : (
                                <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
                            )}
                        </div>
                        {stats?.orphanedOrgs > 0 && (
                            <button
                                onClick={handleCleanupOrgs}
                                disabled={!!actionLoading}
                                className="glossy-button bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                            >
                                {actionLoading === 'orgs' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Purge Orphaned Nodes
                            </button>
                        )}
                    </div>
                </div>

                {/* Orphaned Users */}
                <div className={cn("glass-neo p-8 rounded-[3rem] flex flex-col justify-between group/card relative overflow-hidden transition-all duration-500", stats?.orphanedUsers > 0 ? "border-amber-500/30 bg-amber-500/[0.03]" : "hover:scale-[1.02]")}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                        <AlertTriangle className="w-48 h-48 text-amber-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Ghost Identities</div>
                                <div className={cn("text-5xl font-black tracking-tighter", stats?.orphanedUsers > 0 ? "text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "text-white")}>
                                    {stats?.orphanedUsers || 0}
                                </div>
                            </div>
                            {stats?.orphanedUsers > 0 ? (
                                <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
                            ) : (
                                <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
                            )}
                        </div>
                        {stats?.orphanedUsers > 0 && (
                            <button
                                onClick={handleCleanupUsers}
                                disabled={!!actionLoading}
                                className="glossy-button bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                            >
                                {actionLoading === 'users' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Revoke Orphaned Auth
                            </button>
                        )}
                    </div>
                </div>

                {/* Stock Integrity */}
                <div className="glass-neo p-8 rounded-[3rem] md:col-span-2 relative overflow-hidden group/card hover:bg-white/[0.04] transition-all duration-500">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.6rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center neo-inner text-primary group-hover/card:scale-110 transition-transform">
                                <Database className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1.5 leading-none">Global Inventory Variance</div>
                                <div className="text-3xl font-black text-white tracking-tighter">{stats?.zeroStockItems || 0} <span className="text-sm font-bold text-muted-foreground ml-2 uppercase tracking-widest">Null-Nodes Detected</span></div>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/card:border-primary/20 group-hover/card:text-primary transition-all">
                                Protocol Review Required
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
