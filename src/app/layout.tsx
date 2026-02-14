import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KhataPlus Admin",
  description: "Internal Admin Panel for KhataPlus",
};

import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground selection:bg-primary/30 min-h-screen overflow-x-hidden`}>
        {/* Animated Liquid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] liquid-blob opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] liquid-blob opacity-60" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/5 blur-[100px] liquid-blob opacity-40" style={{ animationDelay: '-4s' }} />
        </div>

        <AuthProvider
          projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}
          baseUrl="https://auth.khataplus.online"
        >
          <Sidebar />
          <div className="lg:pl-24 min-h-screen relative z-10">
            <main className="p-4 md:p-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

