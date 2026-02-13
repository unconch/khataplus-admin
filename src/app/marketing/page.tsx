"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PenTool, History, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCampaigns, getMarketingMetrics } from "./actions";
import { MarketingOverview } from "./components/MarketingOverview";
import { CampaignStudio } from "./components/CampaignStudio";
import { CampaignHistory } from "./components/CampaignHistory";

export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'history'>('overview');
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium tracking-widest uppercase">Loading Marketing Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-20 space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketing Hub</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage campaigns, track growth, and leverage AI insights.</p>
                </div>

                {/* Custom Tabs */}
                <div className="flex p-1 bg-muted/30 border border-border rounded-xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'overview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('studio')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'studio' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <PenTool className="w-4 h-4" /> Studio
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'history' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <History className="w-4 h-4" /> Campaigns
                    </button>
                </div>
            </header>

            {/* Tab Content */}
            <main className="min-h-[60vh]">
                {activeTab === 'overview' && (
                    <MarketingOverview metrics={metrics} activeCampaignsCount={campaigns.filter(c => c.status === 'posted').length} />
                )}

                {activeTab === 'studio' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Create New Campaign</h2>
                        </div>
                        <CampaignStudio onCreated={() => {
                            fetchData();
                            setActiveTab('history');
                        }} />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Campaign History</h2>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                Total: {campaigns.length}
                            </span>
                        </div>
                        <CampaignHistory campaigns={campaigns} onUpdate={fetchData} />
                    </div>
                )}
            </main>
        </div>
    );
}
