"use client";
// src/app/page.js — Dashboard
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBills, getMonthTotal } from "@/lib/bills";
import MonthlySummaryCard from "@/components/MonthlySummaryCard";
import { format } from "date-fns";

export default function DashboardPage() {
    const [thisMonth, setThisMonth] = useState(0);
    const [lastMonth, setLastMonth] = useState(0);
    const [recentBills, setRecentBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const now = new Date();
            const [tm, lm, bills] = await Promise.all([
                getMonthTotal(now.getFullYear(), now.getMonth()),
                getMonthTotal(now.getFullYear(), now.getMonth() - 1),
                getBills({}),
            ]);
            setThisMonth(tm);
            setLastMonth(lm);
            setRecentBills(bills.slice(0, 5));
            setLoading(false);
        };
        load().catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    {format(new Date(), "EEEE, dd MMMM yyyy")}
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MonthlySummaryCard thisMonth={thisMonth} lastMonth={lastMonth} loading={loading} />

                <div className="card space-y-3">
                    <h3 className="font-semibold text-base" style={{ color: "var(--text-muted)" }}>
                        Quick Actions
                    </h3>
                    <Link href="/bills/new" className="btn btn-primary w-full">
                        ➕ New Bill Entry
                    </Link>
                    <Link href="/bills" className="btn btn-secondary w-full">
                        📋 View All Bills
                    </Link>
                    <Link href="/reports" className="btn btn-secondary w-full">
                        📊 Monthly Reports
                    </Link>
                </div>
            </div>

            {/* Recent bills */}
            <div className="card space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">Recent Bills</h2>
                    <Link href="/bills" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
                        View all →
                    </Link>
                </div>
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: "var(--border)" }} />
                        ))}
                    </div>
                ) : recentBills.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-4xl mb-2">📭</p>
                        <p style={{ color: "var(--text-muted)" }}>No bills yet. Create your first entry!</p>
                        <Link href="/bills/new" className="btn btn-primary mt-4">➕ Add First Bill</Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentBills.map((bill) => (
                            <div key={bill.id}
                                className="flex items-center justify-between p-3 rounded-xl"
                                style={{ background: "var(--surface-2)" }}>
                                <div>
                                    <p className="font-medium text-sm">{bill.name}</p>
                                    <span className="badge" style={{ fontSize: "0.65rem" }}>{bill.type}</span>
                                </div>
                                <p className="font-bold" style={{ color: "var(--brand)" }}>
                                    Rs. {(bill.total || 0).toLocaleString("en-PK")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
