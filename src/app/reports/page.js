"use client";
// src/app/reports/page.js — Monthly Reports
import { useEffect, useState } from "react";
import { getMonthTotal } from "@/lib/bills";
import { format, subMonths } from "date-fns";

function MonthCard({ label, total, isCurrent, loading }) {
    return (
        <div className="card space-y-2" style={isCurrent ? { borderColor: "rgba(249,115,22,0.5)" } : {}}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
                {isCurrent && <span className="badge">Current</span>}
            </div>
            {loading ? (
                <div className="h-8 rounded animate-pulse" style={{ background: "var(--border)" }} />
            ) : (
                <p className="text-2xl font-bold" style={{ color: isCurrent ? "var(--brand)" : "var(--text)" }}>
                    Rs. {total.toLocaleString("en-PK")}
                </p>
            )}
        </div>
    );
}

export default function ReportsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const now = new Date();
            const months = Array.from({ length: 6 }, (_, i) => {
                const d = subMonths(now, i);
                return { label: format(d, "MMMM yyyy"), year: d.getFullYear(), month: d.getMonth(), isCurrent: i === 0 };
            });
            const totals = await Promise.all(months.map((m) => getMonthTotal(m.year, m.month)));
            setData(months.map((m, i) => ({ ...m, total: totals[i] })));
            setLoading(false);
        };
        load().catch(() => setLoading(false));
    }, []);

    const maxTotal = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Monthly Reports</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    Last 6 months spend overview
                </p>
            </div>

            {/* Spend cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.length === 0
                    ? [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card h-24 animate-pulse" style={{ background: "var(--surface)" }} />
                    ))
                    : data.map((d) => (
                        <MonthCard key={d.label} label={d.label} total={d.total} isCurrent={d.isCurrent} loading={loading} />
                    ))}
            </div>

            {/* Bar chart (CSS-based) */}
            {!loading && data.length > 0 && (
                <div className="card space-y-3">
                    <h2 className="font-bold">Spend Trend</h2>
                    <div className="space-y-3">
                        {[...data].reverse().map((d) => (
                            <div key={d.label} className="space-y-1">
                                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                                    <span>{d.label}</span>
                                    <span className="font-semibold" style={{ color: d.isCurrent ? "var(--brand)" : "var(--text)" }}>
                                        Rs. {d.total.toLocaleString("en-PK")}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                                    <div
                                        className="h-2 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.round((d.total / maxTotal) * 100)}%`,
                                            background: d.isCurrent ? "var(--brand)" : "var(--text-muted)",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
