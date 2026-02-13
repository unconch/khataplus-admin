"use client";

import { Twitter, Linkedin, MessageCircle, MoreHorizontal, Heart, MessageSquare, Repeat2, Share, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PlatformPreview({ content, title }: { content: string; title: string }) {
    const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'whatsapp'>('twitter');
    const [view, setView] = useState<'mobile' | 'desktop'>('mobile');

    const cleanContent = content || "Start writing to see the preview...";
    const hashtags = cleanContent.match(/#[a-zA-Z0-9_]+/g) || [];
    const textWithoutHashtags = cleanContent.replace(/#[a-zA-Z0-9_]+/g, "").trim();

    return (
        <div className="flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setPlatform('twitter')}
                        className={cn("p-2 rounded-md transition-all", platform === 'twitter' ? "bg-background text-[#1DA1F2] shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        <Twitter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPlatform('linkedin')}
                        className={cn("p-2 rounded-md transition-all", platform === 'linkedin' ? "bg-background text-[#0A66C2] shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPlatform('whatsapp')}
                        className={cn("p-2 rounded-md transition-all", platform === 'whatsapp' ? "bg-background text-[#25D366] shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live Preview</div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-muted/10 p-8 flex items-center justify-center overflow-y-auto">
                {platform === 'twitter' && (
                    <div className="w-full max-w-[400px] bg-black text-white rounded-xl p-4 border border-zinc-800 font-sans">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-700" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-[15px]">
                                    <span className="font-bold">KhataPlus</span>
                                    <span className="text-zinc-500">@khataplus • 1m</span>
                                </div>
                                <div className="mt-1 text-[15px] whitespace-pre-wrap leading-normal">
                                    {textWithoutHashtags}
                                    <br />
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {hashtags.map((tag, i) => (
                                            <span key={i} className="text-[#1D9BF0]">{tag}</span>
                                        ))}
                                    </div>
                                    {/* Mock Image Placeholder if media url existed */}
                                    <div className="mt-3 h-48 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
                                        Media Placeholder
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3 text-zinc-500 max-w-[300px]">
                                    <MessageSquare className="w-4 h-4" />
                                    <Repeat2 className="w-4 h-4" />
                                    <Heart className="w-4 h-4" />
                                    <Share className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {platform === 'linkedin' && (
                    <div className="w-full max-w-[400px] bg-white text-black rounded-xl border border-gray-200 font-sans shadow-sm">
                        <div className="p-3 flex gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded" />
                            <div>
                                <div className="text-sm font-semibold">KhataPlus</div>
                                <div className="text-xs text-gray-500">SaaS • 10,000 followers</div>
                                <div className="text-xs text-gray-500">1m • <GlobeIcon /></div>
                            </div>
                        </div>
                        <div className="px-3 pb-2 text-sm whitespace-pre-wrap">
                            {textWithoutHashtags}
                            <div className="mt-2 text-[#0A66C2] font-semibold">
                                {hashtags.join(' ')}
                            </div>
                        </div>
                        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border-t border-b border-gray-200">
                            Image / Video Content
                        </div>
                        <div className="p-3 flex justify-between border-t border-gray-200 px-8 text-gray-500">
                            <div className="flex flex-col items-center gap-1"><ThumbsUp className="w-5 h-5" /><span className="text-xs">Like</span></div>
                            <div className="flex flex-col items-center gap-1"><MessageSquare className="w-5 h-5" /><span className="text-xs">Comment</span></div>
                            <div className="flex flex-col items-center gap-1"><Repeat2 className="w-5 h-5" /><span className="text-xs">Repost</span></div>
                            <div className="flex flex-col items-center gap-1"><Share className="w-5 h-5" /><span className="text-xs">Send</span></div>
                        </div>
                    </div>
                )}

                {platform === 'whatsapp' && (
                    <div className="w-full max-w-[350px] bg-[#E5DDD5] h-[500px] rounded-[30px] border-[8px] border-black relative overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-[#075E54] p-4 text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20" />
                            <div className="text-sm font-medium">Business Broadcast</div>
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] rounded-tl-none text-sm">
                                <span className="font-bold text-[#075E54] text-xs block mb-1">~KhataPlus Official</span>
                                {cleanContent}
                                <div className="text-[10px] text-gray-500 text-right mt-1">10:42 AM</div>
                            </div>
                        </div>
                        <div className="bg-[#f0f0f0] p-2 flex items-center gap-2">
                            <div className="flex-1 bg-white h-8 rounded-full px-3 text-sm text-gray-500 flex items-center">Type a message</div>
                            <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center text-white">
                                <SendIcon />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function GlobeIcon() {
    return <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM2.04 4.326c.325 1.329 2.532 2.54 6.717 2.192 1.053-.19 1.745-.038 2.062 0 .586.29 1.175.782 1.621 1.482.492.74.808 1.435.808 1.435s-.765-.303-1.605-.444c-.751-.127-1.472.08-1.705.589-.2.434.136 3.16.136 3.16S9.421 13 8 13c-1.397 0-3.321-.132-4.992-1.258.118-.328.665-2.008 1.058-2.673.578-.971.696-1.574 1.257-2.618.376-.693.308-1.503-.131-2.124-.45-.634-1.336-.88-2.164-1.045-.589-.117-1.67-.179-1.928-.276A7.99 7.99 0 0 1 2.04 4.326z" /></svg>
}

function SendIcon() {
    return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
}
