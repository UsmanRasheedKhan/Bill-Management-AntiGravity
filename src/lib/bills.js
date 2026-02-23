// src/lib/bills.js
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const BILLS_COL = "bills";

/**
 * Add a new bill document.
 * @param {{ name: string, type: string, unitCost: number, quantity: number, total: number }} data
 */
export async function addBill(data) {
    const docRef = await addDoc(collection(db, BILLS_COL), {
        ...data,
        timestamp: Timestamp.now(),
    });
    return docRef.id;
}

/**
 * Fetch bills, optionally filtered by date range.
 * @param {{ startDate?: Date, endDate?: Date }} opts
 */
export async function getBills({ startDate, endDate } = {}) {
    let q = query(collection(db, BILLS_COL), orderBy("timestamp", "desc"));

    if (startDate) {
        q = query(q, where("timestamp", ">=", Timestamp.fromDate(startDate)));
    }
    if (endDate) {
        // Include the entire end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Delete a bill by id.
 */
export async function deleteBill(id) {
    await deleteDoc(doc(db, BILLS_COL, id));
}

/**
 * Get total spend for a given month (0-indexed).
 */
export async function getMonthTotal(year, month) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const bills = await getBills({ startDate: start, endDate: end });
    return bills.reduce((sum, b) => sum + (b.total || 0), 0);
}

/**
 * Persist a custom item type to Firestore (custom-types collection).
 */
export async function addCustomType(label) {
    await addDoc(collection(db, "custom-types"), { label, createdAt: Timestamp.now() });
}

/**
 * Fetch all custom item types.
 */
export async function getCustomTypes() {
    const snapshot = await getDocs(collection(db, "custom-types"));
    return snapshot.docs.map((d) => d.data().label);
}
