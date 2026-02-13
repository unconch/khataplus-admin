"use client";

import { Activity, BarChart3, Globe, MousePointer2, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export function MarketingOverview({ metrics, activeCampaignsCount }: { metrics: any, activeCampaignsCount: number }) {
    if (!metrics) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Key Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Reach", val: metrics.totalOrganicReach, icon: <Globe className="w-5 h-5 text-indigo-500" /> },
                    { label: "Engagement", val: metrics.engagementRate, icon: <MousePointer2 className="w-5 h-5 text-emerald-500" /> },
                    { label: "Active Campaigns", val: activeCampaignsCount, icon: <Activity className="w-5 h-5 text-amber-500" /> },
                    { label: "Referrals", val: metrics.referralTraffic, icon: <TrendingUp className="w-5 h-5 text-rose-500" /> },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.val}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/50">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-muted-foreground" />
                            Growth Trend
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.growthTrend || []}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e1e2e', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Geo Distribution */}
                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Top Locations</h3>
                    <div className="space-y-4">
                        {Object.entries(metrics.geoClusters || {}).length === 0 ? (
                            <div className="h-[200px] flex flex-col items-center justify-center text-center p-4">
                                <Globe className="w-12 h-12 text-muted-foreground/20 mb-3" />
                                <p className="text-sm text-muted-foreground">No location data available yet.</p>
                            </div>
                        ) : (
                            Object.entries(metrics.geoClusters).slice(0, 5).map(([city, count]: [string, any], i) => (
                                <div key={city} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                                        <span className="text-sm font-medium">{city}</span>
                                    </div>
                                    <div className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        {count}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
