"use client";
// src/components/DateRangeFilter.jsx

export default function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange, onApply, onReset }) {
    return (
        <div className="card flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
                <label className="label">From Date</label>
                <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                />
            </div>
            <div className="flex-1 min-w-[140px]">
                <label className="label">To Date</label>
                <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <button className="btn btn-primary" onClick={onApply}>
                    🔍 Filter
                </button>
                <button className="btn btn-secondary" onClick={onReset}>
                    ✖ Reset
                </button>
            </div>
        </div>
    );
}
