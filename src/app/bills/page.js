"use client";
// src/app/bills/page.js — Bill History + Filter + PDF Export
import { useState, useEffect, useCallback } from "react";
import { getBills } from "@/lib/bills";
import BillTable from "@/components/BillTable";
import DateRangeFilter from "@/components/DateRangeFilter";
import PDFExport from "@/components/PDFExport";
import Link from "next/link";

export default function BillsPage() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchBills = useCallback(async (sd, ed) => {
        setLoading(true);
        try {
            const data = await getBills({
                startDate: sd ? new Date(sd) : undefined,
                endDate: ed ? new Date(ed) : undefined,
            });
            setBills(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBills(); }, [fetchBills]);

    const handleFilter = () => fetchBills(startDate, endDate);
    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        fetchBills();
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Bill History</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                        {bills.length} record{bills.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <div className="flex gap-2">
                    <PDFExport bills={bills} startDate={startDate} endDate={endDate} />
                    <Link href="/bills/new" className="btn btn-primary">➕ New</Link>
                </div>
            </div>

            <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onApply={handleFilter}
                onReset={handleReset}
            />

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card h-16 animate-pulse" style={{ background: "var(--surface)" }} />
                    ))}
                </div>
            ) : (
                <BillTable
                    bills={bills}
                    onDeleted={(id) => setBills((prev) => prev.filter((b) => b.id !== id))}
                />
            )}
        </div>
    );
}
