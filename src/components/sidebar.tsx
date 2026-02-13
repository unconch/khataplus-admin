"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Building2,
    Globe,
    Megaphone,
    BarChart3,
    Settings,
    ShieldCheck,
    Database,
    Clock,
    Tag,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Building2, label: "Organizations", href: "/organizations" },
    { icon: ShoppingCart, label: "Sales", href: "/sales" },
    { icon: Globe, label: "pSEO Engine", href: "/pseo" },
    { icon: Megaphone, label: "Announcements", href: "/announcements" },
    { icon: BarChart3, label: "Marketing", href: "/marketing" },
    { icon: Tag, label: "HSN Master", href: "/hsn" },
    { icon: Clock, label: "Audit Logs", href: "/audit" },
    { icon: ShieldCheck, label: "System", href: "/system" },
    { icon: Database, label: "Usage", href: "/usage" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 glass-neo rounded-[2rem] flex flex-col items-center py-8 z-50 hidden lg:flex">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-12 neo-inner border border-white/10 group cursor-pointer transition-all hover:scale-105 active:scale-95">
                <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>

            <nav className="flex-1 flex flex-col gap-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "p-3 rounded-2xl transition-all duration-300 relative group",
                                isActive
                                    ? "bg-white/10 text-primary neo-inner border border-white/5"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-6 h-6 transition-transform duration-300",
                                isActive ? "scale-110" : "group-hover:scale-110"
                            )} />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-1.5 glass-neo rounded-xl text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <Link href="/settings" className="p-3 rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group relative">
                    <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                    <div className="absolute left-full ml-4 px-3 py-1.5 glass-neo rounded-xl text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
                        Settings
                    </div>
                </Link>
            </div>
        </aside>
    );
}
