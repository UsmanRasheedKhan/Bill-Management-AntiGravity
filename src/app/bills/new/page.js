"use client";
// src/app/bills/new/page.js
import BillForm from "@/components/BillForm";
import { useRouter } from "next/navigation";

export default function NewBillPage() {
    const router = useRouter();
    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <div>
                <h1 className="text-2xl font-bold">New Bill Entry</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    Fill in the details below. Total updates in real-time.
                </p>
            </div>
            <div className="card">
                <BillForm onSuccess={() => setTimeout(() => router.push("/bills"), 1500)} />
            </div>
        </div>
    );
}
