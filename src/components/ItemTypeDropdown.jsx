"use client";
// src/components/ItemTypeDropdown.jsx
import { useState } from "react";

const DEFAULT_TYPES = ["Electric", "Sanitary", "Cement", "Labor", "Sand", "Bricks"];

export default function ItemTypeDropdown({ value, onChange, extraTypes = [], onAddType }) {
    const [adding, setAdding] = useState(false);
    const [newType, setNewType] = useState("");

    const allTypes = [...DEFAULT_TYPES, ...extraTypes];

    const handleAdd = () => {
        const trimmed = newType.trim();
        if (!trimmed) return;
        onAddType(trimmed);
        onChange(trimmed);
        setNewType("");
        setAdding(false);
    };

    return (
        <div className="space-y-2">
            <select
                className="input"
                value={adding ? "__add__" : value}
                onChange={(e) => {
                    if (e.target.value === "__add__") {
                        setAdding(true);
                    } else {
                        setAdding(false);
                        onChange(e.target.value);
                    }
                }}
            >
                <option value="">Select type…</option>
                {allTypes.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
                <option value="__add__">➕ Add New Type…</option>
            </select>

            {adding && (
                <div className="flex gap-2">
                    <input
                        className="input"
                        placeholder="e.g. Tiles, Roofing…"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        autoFocus
                    />
                    <button type="button" onClick={handleAdd} className="btn btn-primary" style={{ minWidth: 72 }}>
                        Add
                    </button>
                    <button type="button" onClick={() => { setAdding(false); setNewType(""); }}
                        className="btn btn-secondary" style={{ minWidth: 72 }}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
