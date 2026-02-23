"use client";
// src/components/BillForm.jsx
import { useState, useEffect } from "react";
import { addBill, addCustomType } from "@/lib/bills";
import ItemTypeDropdown from "./ItemTypeDropdown";

const INITIAL = { name: "", type: "", unitCost: "", quantity: "", total: 0 };

export default function BillForm({ onSuccess }) {
    const [form, setForm] = useState(INITIAL);
    const [extraTypes, setExtraTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Real-time total calculation
    useEffect(() => {
        const cost = parseFloat(form.unitCost) || 0;
        const qty = parseFloat(form.quantity) || 0;
        setForm((prev) => ({ ...prev, total: +(cost * qty).toFixed(2) }));
    }, [form.unitCost, form.quantity]);

    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleAddType = async (label) => {
        setExtraTypes((prev) => [...prev, label]);
        try { await addCustomType(label); } catch (_) { /* offline ok */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.type || !form.unitCost || !form.quantity) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await addBill({
                name: form.name,
                type: form.type,
                unitCost: parseFloat(form.unitCost),
                quantity: parseFloat(form.quantity),
                total: form.total,
            });
            setSuccess(true);
            setForm(INITIAL);
            if (onSuccess) onSuccess();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Failed to save bill. Check Firebase config.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Name */}
            <div>
                <label className="label">Item Name</label>
                <input
                    className="input"
                    placeholder="e.g. PVC Pipe 3-inch"
                    value={form.name}
                    onChange={set("name")}
                />
            </div>

            {/* Item Type */}
            <div>
                <label className="label">Item Type</label>
                <ItemTypeDropdown
                    value={form.type}
                    onChange={(v) => setForm((p) => ({ ...p, type: v }))}
                    extraTypes={extraTypes}
                    onAddType={handleAddType}
                />
            </div>

            {/* Unit Cost & Quantity */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label">Unit Cost (Rs.)</label>
                    <input
                        className="input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.unitCost}
                        onChange={set("unitCost")}
                    />
                </div>
                <div>
                    <label className="label">Quantity</label>
                    <input
                        className="input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={form.quantity}
                        onChange={set("quantity")}
                    />
                </div>
            </div>

            {/* Live Total */}
            <div className="card flex items-center justify-between"
                style={{ background: "rgba(249,115,22,0.08)", borderColor: "rgba(249,115,22,0.3)" }}>
                <span className="font-semibold text-lg" style={{ color: "var(--text-muted)" }}>
                    Total Cost
                </span>
                <span className="text-3xl font-bold" style={{ color: "var(--brand)" }}>
                    Rs. {form.total.toLocaleString("en-PK")}
                </span>
            </div>

            {error && (
                <p className="text-sm px-3 py-2 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    ⚠️ {error}
                </p>
            )}
            {success && (
                <p className="text-sm px-3 py-2 rounded-lg"
                    style={{ background: "rgba(34,197,94,0.1)", color: "var(--success)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    ✅ Bill saved successfully!
                </p>
            )}

            <button type="submit" className="btn btn-primary w-full text-lg py-4" disabled={loading}>
                {loading ? "Saving…" : "➕ Add Bill"}
            </button>
        </form>
    );
}
