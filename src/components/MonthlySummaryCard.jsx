"use client";
// src/components/MonthlySummaryCard.jsx

export default function MonthlySummaryCard({ thisMonth, lastMonth, loading }) {
    const diff = thisMonth - lastMonth;
    const pct = lastMonth === 0 ? 100 : Math.round((diff / lastMonth) * 100);
    const up = diff >= 0;

    return (
        <div className="card space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base" style={{ color: "var(--text-muted)" }}>
                    Monthly Spend
                </h3>
                <span className="badge">This Month</span>
            </div>

            {loading ? (
                <div className="h-12 rounded-lg animate-pulse" style={{ background: "var(--border)" }} />
            ) : (
                <p className="text-4xl font-bold" style={{ color: "var(--brand)" }}>
                    Rs. {thisMonth.toLocaleString("en-PK")}
                </p>
            )}

            <div className="flex items-center gap-2 pt-1"
                style={{ color: up ? "var(--danger)" : "var(--success)" }}>
                <span className="text-lg">{up ? "📈" : "📉"}</span>
                <span className="font-semibold text-sm">
                    {up ? "+" : ""}{pct}% vs last month
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    (Rs. {lastMonth.toLocaleString("en-PK")})
                </span>
            </div>
        </div>
    );
}
