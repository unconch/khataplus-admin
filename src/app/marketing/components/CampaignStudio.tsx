"use client";

import { useState } from "react";
import { Sparkles, Send, Lightbulb, ArrowRight, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createCampaign, generateCampaignIdeasAction, generateGimmickAction } from "../actions";
import { PlatformPreview } from "./PlatformPreview";

export function CampaignStudio({ onCreated }: { onCreated: () => void }) {
    const [mode, setMode] = useState<'brainstorm' | 'editor'>('brainstorm');
    const [goal, setGoal] = useState("");
    const [ideas, setIdeas] = useState<any[]>([]);
    const [generating, setGenerating] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // AI Content Refinement
    const [variants, setVariants] = useState<any[]>([]);

    const handleBrainstorm = async () => {
        if (!goal) {
            toast.error("Please enter a marketing goal.");
            return;
        }
        setGenerating(true);
        try {
            const res = await generateCampaignIdeasAction(goal);
            setIdeas(res);
        } catch (error) {
            toast.error("Failed to generate ideas.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSelectIdea = (idea: any) => {
        setTitle(idea.title);
        setContent(idea.description + "\n\n" + (idea.suggestedPlatforms || []).map((p: string) => `#${p}`).join(" "));
        setMode('editor');
    };

    const handleGenerateVariants = async () => {
        if (!title || !content) return;
        setGenerating(true);
        try {
            const res = await generateGimmickAction(title, content);
            setVariants(res);
        } catch (error) {
            toast.error("Failed to polish content.");
        } finally {
            setGenerating(false);
        }
    };

    if (mode === 'brainstorm') {
        return (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> AI Strategic Partner
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">What's your goal today?</h2>
                    <p className="text-muted-foreground text-lg">Describe what you want to achieve, and we'll craft the campaign.</p>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <input
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. 'Clear out old summer inventory' or 'Announce new GST features'"
                        className="w-full bg-background border border-border shadow-lg rounded-full px-8 py-6 text-lg focus:ring-2 focus:ring-primary/20 outline-none pr-32"
                        onKeyDown={(e) => e.key === 'Enter' && handleBrainstorm()}
                    />
                    <button
                        onClick={handleBrainstorm}
                        disabled={generating}
                        className="absolute right-2 top-2 bottom-2 bg-primary text-primary-foreground rounded-full px-8 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {generating ? "Thinking..." : "Ideate"}
                    </button>
                </div>

                {ideas.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6">
                        {ideas.map((idea, i) => (
                            <div
                                key={i}
                                onClick={() => handleSelectIdea(idea)}
                                className="group p-6 rounded-3xl bg-card border border-border hover:border-primary shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight">{idea.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
                                </div>
                                <div className="pt-6 mt-4 border-t border-border flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Use this Strategy <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center pt-8">
                    <button onClick={() => setMode('editor')} className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4">
                        Skip AI, just let me write
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] min-h-[600px] grid grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Editor Pane */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                <form
                    action={async (formData) => {
                        const res = await createCampaign(formData);
                        if (res.success) {
                            toast.success("Campaign launched!");
                            onCreated();
                        }
                    }}
                    className="flex-1 bg-card border border-border rounded-3xl shadow-sm flex flex-col"
                >
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setMode('brainstorm')} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                                ← Back to Ideas
                            </button>
                            <div className="h-4 w-px bg-border" />
                            <h3 className="font-semibold">Campaign Editor</h3>
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all">
                            Launch Campaign <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Campaign Title</label>
                            <input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-2xl font-bold border-none bg-transparent placeholder:text-muted-foreground/50 focus:ring-0 px-0"
                                placeholder="Untitled Campaign"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium">Primary Content</label>
                                <button type="button" onClick={handleGenerateVariants} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                    <Wand2 className="w-3 h-3" /> Polish with AI
                                </button>
                            </div>
                            <textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[300px] resize-none bg-muted/20 border-border rounded-xl p-4 text-base leading-relaxed focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                placeholder="Write your campaign content here..."
                                required
                            />
                            {variants.length > 0 && (
                                <div className="absolute top-12 right-0 w-64 bg-background border border-border rounded-xl shadow-xl z-20 p-2 space-y-2 animate-in slide-in-from-right-4">
                                    <div className="text-[10px] font-bold uppercase text-muted-foreground px-2">AI Suggestions</div>
                                    {variants.map((v, i) => (
                                        <div key={i} onClick={() => setContent(v.content)} className="p-3 hover:bg-muted rounded-lg cursor-pointer text-xs">
                                            <div className="font-bold mb-1 text-primary">{v.type}</div>
                                            <div className="line-clamp-3 text-muted-foreground">{v.content}</div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setVariants([])} className="w-full text-center text-[10px] text-muted-foreground py-1 hover:text-foreground">Dismiss</button>
                                </div>
                            )}
                        </div>

                        {/* Hidden Platform Inputs for now, defaulting to all for simplicity or add selector back if needed */}
                        <div className="hidden">
                            <input type="checkbox" name="platforms" value="twitter" checked readOnly />
                            <input type="checkbox" name="platforms" value="linkedin" checked readOnly />
                        </div>
                    </div>
                </form>
            </div>

            {/* Preview Pane */}
            <div className="hidden lg:block lg:col-span-5 h-[calc(100vh-220px)] sticky top-6">
                <PlatformPreview content={content} title={title} />
            </div>
        </div>
    );
}
