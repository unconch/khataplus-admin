"use client";

import { useState } from "react";
import { Trash2, Send, ExternalLink, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deleteCampaign, postCampaign } from "../actions";

export function CampaignHistory({ campaigns, onUpdate }: { campaigns: any[], onUpdate: () => void }) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handlePost = async (campaign: any) => {
        setLoadingId(campaign.id);
        try {
            await postCampaign(campaign.id);

            // Intent Popups (Same logic as before, but cleaner implementation)
            const text = encodeURIComponent(campaign.content);
            const url = encodeURIComponent(`https://khataplus.online?cid=${campaign.id}`);

            const intents: Record<string, string> = {
                twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                reddit: `https://www.reddit.com/submit?title=${encodeURIComponent(campaign.title)}&text=${text}%0A%0A${url}`,
                whatsapp: `https://wa.me/?text=${text}%20${url}`
            };

            campaign.platforms?.forEach((p: string) => {
                if (intents[p]) window.open(intents[p], '_blank');
            });

            toast.success("Campaign launched successfully.");
            onUpdate();
        } catch (error) {
            toast.error("Failed to launch campaign.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await deleteCampaign(id);
            toast.success("Campaign deleted.");
            onUpdate();
        } catch (error) {
            toast.error("Failed to delete campaign.");
        }
    };

    if (campaigns.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-muted/5 border border-dashed border-border">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No Campaigns Yet</h3>
                <p className="text-muted-foreground max-w-sm mt-2">Create your first marketing campaign in the Studio tab to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {campaigns.map((c) => (
                <div key={c.id} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg">{c.title}</h3>
                            <StatusBadge status={c.status} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{c.content}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {c.platforms?.map((p: string) => (
                                <span key={p} className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {c.status !== 'posted' && (
                            <button
                                onClick={() => handlePost(c)}
                                disabled={loadingId === c.id}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                            >
                                {loadingId === c.id ? (
                                    <>Processing...</>
                                ) : (
                                    <>Launch <Send className="w-3.5 h-3.5" /></>
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                            title="Delete Campaign"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'posted') {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Live
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            <AlertCircle className="w-3 h-3" /> Draft
        </span>
    );
}
