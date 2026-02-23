"use client";
// src/components/PDFExport.jsx
import { format } from "date-fns";

export default function PDFExport({ bills, startDate, endDate }) {
    const grandTotal = bills.reduce((s, b) => s + (b.total || 0), 0);

    const generatePDF = async (action = "download") => {
        // Dynamic import so jsPDF only loads client-side
        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");

        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = doc.internal.pageSize.getWidth();

        // ── Header band ──────────────────────────────────────────────
        doc.setFillColor(249, 115, 22);
        doc.rect(0, 0, pageW, 42, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, "bold");
        doc.text("🏗️  CONSTRUCTION STATEMENT", 14, 18);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("Bill Management System — Professional Report", 14, 27);

        // Date range
        const dateRange =
            startDate && endDate
                ? `Period: ${format(new Date(startDate), "dd MMM yyyy")} – ${format(new Date(endDate), "dd MMM yyyy")}`
                : `Generated: ${format(new Date(), "dd MMM yyyy, HH:mm")}`;
        doc.text(dateRange, 14, 36);

        // Right: generated on
        doc.setFontSize(9);
        doc.text(`Printed: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, pageW - 14, 36, { align: "right" });

        // ── Table ────────────────────────────────────────────────────
        const rows = bills.map((b, i) => [
            i + 1,
            b.name,
            b.type,
            `Rs. ${(b.unitCost || 0).toLocaleString("en-PK")}`,
            b.quantity,
            `Rs. ${(b.total || 0).toLocaleString("en-PK")}`,
            b.timestamp?.toDate ? format(b.timestamp.toDate(), "dd MMM yyyy") : "—",
        ]);

        autoTable(doc, {
            startY: 50,
            head: [["#", "Item Name", "Type", "Unit Cost", "Qty", "Total", "Date"]],
            body: rows,
            theme: "striped",
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [249, 115, 22],
                fontStyle: "bold",
                fontSize: 10,
            },
            bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: {
                0: { cellWidth: 8 },
                3: { halign: "right" },
                5: { halign: "right", fontStyle: "bold" },
            },
            margin: { left: 14, right: 14 },
        });

        // ── Grand Total footer ────────────────────────────────────────
        const finalY = doc.lastAutoTable.finalY + 6;
        doc.setFillColor(249, 115, 22);
        doc.roundedRect(14, finalY, pageW - 28, 14, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont(undefined, "bold");
        doc.text("GRAND TOTAL", 20, finalY + 9.5);
        doc.text(`Rs. ${grandTotal.toLocaleString("en-PK")}`, pageW - 20, finalY + 9.5, { align: "right" });

        // ── Footer note ───────────────────────────────────────────────
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont(undefined, "normal");
        doc.text("This is a computer-generated document. No signature required.", 14, finalY + 22);

        // ── Output ────────────────────────────────────────────────────
        if (action === "preview") {
            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } else {
            doc.save("construction-statement.pdf");
        }
    };

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                className="btn btn-secondary"
                onClick={() => generatePDF("preview")}
                disabled={!bills.length}
            >
                👁️ Preview PDF
            </button>
            <button
                className="btn btn-primary"
                onClick={() => generatePDF("download")}
                disabled={!bills.length}
            >
                ⬇️ Download PDF
            </button>
        </div>
    );
}
