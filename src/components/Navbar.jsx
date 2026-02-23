"use client";
// src/components/Navbar.jsx
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/bills/new", label: "New Bill", icon: "➕" },
    { href: "/bills", label: "History", icon: "📋" },
    { href: "/reports", label: "Reports", icon: "📊" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40"
                style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
                <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏗️</span>
                        <div>
                            <p className="font-bold text-sm" style={{ color: "var(--brand)" }}>
                                Construction
                            </p>
                            <p className="font-bold text-lg leading-tight">Bill Manager</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                                style={{
                                    background: isActive ? "rgba(249,115,22,0.15)" : "transparent",
                                    color: isActive ? "var(--brand)" : "var(--text-muted)",
                                    borderLeft: isActive ? "3px solid var(--brand)" : "3px solid transparent",
                                }}
                            >
                                <span className="text-xl">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(249,115,22,0.08)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: "var(--brand)", color: "#fff" }}>SM</div>
                        <div>
                            <p className="text-sm font-semibold">Site Manager</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Demo Mode</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 pt-1"
                style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-around items-center">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[64px]"
                                style={{
                                    background: isActive ? "rgba(249,115,22,0.15)" : "transparent",
                                    color: isActive ? "var(--brand)" : "var(--text-muted)",
                                }}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="text-xs font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
