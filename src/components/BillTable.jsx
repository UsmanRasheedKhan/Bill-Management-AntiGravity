"use client";
// src/components/BillTable.jsx
import { format } from "date-fns";
import { deleteBill } from "@/lib/bills";
import { useState } from "react";

export default function BillTable({ bills, onDeleted }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm("Delete this bill?")) return;
        setDeletingId(id);
        try {
            await deleteBill(id);
            if (onDeleted) onDeleted(id);
        } catch (_) {
            alert("Failed to delete. Check connection.");
        } finally {
            setDeletingId(null);
        }
    };

    if (!bills.length) {
        return (
            <div className="card text-center py-12">
                <p className="text-5xl mb-3">📭</p>
                <p className="font-semibold" style={{ color: "var(--text-muted)" }}>
                    No bills found for this period.
                </p>
            </div>
        );
    }

    const grandTotal = bills.reduce((s, b) => s + (b.total || 0), 0);

    return (
        <div className="space-y-3">
            {/* Table — desktop */}
            <div className="card overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                            <th className="py-2 text-left px-2">Item</th>
                            <th className="py-2 text-left px-2">Type</th>
                            <th className="py-2 text-right px-2">Unit Cost</th>
                            <th className="py-2 text-right px-2">Qty</th>
                            <th className="py-2 text-right px-2">Total</th>
                            <th className="py-2 text-left px-2">Date</th>
                            <th className="py-2 px-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr
                                key={bill.id}
                                className="border-b transition-colors"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <td className="py-3 px-2 font-medium">{bill.name}</td>
                                <td className="py-3 px-2">
                                    <span className="badge">{bill.type}</span>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    Rs. {(bill.unitCost || 0).toLocaleString("en-PK")}
                                </td>
                                <td className="py-3 px-2 text-right">{bill.quantity}</td>
                                <td className="py-3 px-2 text-right font-semibold" style={{ color: "var(--brand)" }}>
                                    Rs. {(bill.total || 0).toLocaleString("en-PK")}
                                </td>
                                <td className="py-3 px-2 text-xs" style={{ color: "var(--text-muted)" }}>
                                    {bill.timestamp?.toDate
                                        ? format(bill.timestamp.toDate(), "dd MMM yyyy")
                                        : "—"}
                                </td>
                                <td className="py-3 px-2">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(bill.id)}
                                        disabled={deletingId === bill.id}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} className="pt-3 px-2 font-bold text-right">Grand Total</td>
                            <td className="pt-3 px-2 text-right font-bold text-lg" style={{ color: "var(--brand)" }}>
                                Rs. {grandTotal.toLocaleString("en-PK")}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Cards — mobile */}
            <div className="md:hidden space-y-3">
                {bills.map((bill) => (
                    <div key={bill.id} className="card space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{bill.name}</p>
                                <span className="badge mt-1">{bill.type}</span>
                            </div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(bill.id)}
                                disabled={deletingId === bill.id}
                            >🗑</button>
                        </div>
                        <div className="flex justify-between text-sm" style={{ color: "var(--text-muted)" }}>
                            <span>Rs. {(bill.unitCost || 0).toLocaleString()} × {bill.quantity}</span>
                            <span>{bill.timestamp?.toDate ? format(bill.timestamp.toDate(), "dd MMM yy") : "—"}</span>
                        </div>
                        <div className="text-right text-xl font-bold" style={{ color: "var(--brand)" }}>
                            Rs. {(bill.total || 0).toLocaleString("en-PK")}
                        </div>
                    </div>
                ))}
                <div className="card flex justify-between items-center"
                    style={{ borderColor: "rgba(249,115,22,0.4)" }}>
                    <span className="font-bold">Grand Total</span>
                    <span className="text-xl font-bold" style={{ color: "var(--brand)" }}>
                        Rs. {grandTotal.toLocaleString("en-PK")}
                    </span>
                </div>
            </div>
        </div>
    );
}
