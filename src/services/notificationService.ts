import type { Dispatch, SetStateAction } from 'react';
import type { Instrument, Booking, Consumable } from '../types';
import { InstrumentStatus } from '../types';

const ADMIN_EMAIL = 'lab.admin@example.com';

const sendEmail = (to: string, subject: string, body: string) => {
    console.log(`
    =================================================
    📧 SIMULATED EMAIL NOTIFICATION 📧
    -------------------------------------------------
    To: ${to}
    From: LabMonitor <noreply@labmonitor.app>
    Subject: ${subject}
    -------------------------------------------------
    
    ${body}

    =================================================
    `);
};

const checkOverdueMaintenance = (
    instruments: Instrument[], 
    notified: Set<string>, 
    setNotified: Dispatch<SetStateAction<Set<string>>>
) => {
    const today = new Date();
    instruments.forEach(inst => {
        const nextMaintenanceDate = new Date(inst.nextMaintenance);
        if (nextMaintenanceDate < today) {
            const notificationId = `overdue-maintenance-${inst.id}`;
            if (!notified.has(notificationId)) {
                const subject = `❗ Urgent: Maintenance Overdue for ${inst.name}`;
                const body = `
Dear Lab Admin,

This is an automated alert to inform you that the following instrument is overdue for its scheduled maintenance:

  - Instrument: ${inst.name} (${inst.serialNumber})
  - Location: ${inst.location}
  - Maintenance Due Date: ${nextMaintenanceDate.toLocaleDateString()}

Please schedule the required service as soon as possible to ensure equipment reliability and safety.

Thank you,
LabMonitor System
                `;
                sendEmail(ADMIN_EMAIL, subject, body);
                notified.add(notificationId);
            }
        }
    });
    setNotified(new Set(notified));
};

const checkOverdueBookings = (
    bookings: Booking[], 
    instruments: Instrument[], 
    notified: Set<string>,
    setNotified: Dispatch<SetStateAction<Set<string>>>
) => {
    const now = new Date();
    bookings.forEach(booking => {
        const endTime = new Date(booking.endTime);
        const instrument = instruments.find(i => i.id === booking.instrumentId);
        if (instrument && instrument.status === InstrumentStatus.InUse && endTime < now) {
            const notificationId = `overdue-checkin-${booking.id}`;
            if (!notified.has(notificationId)) {
                const subject = ` overdue check-in for ${instrument.name}`;
                const body = `
Dear Lab Admin,

This is an alert that an instrument has not been checked in after its booking period ended:

  - Instrument: ${instrument.name} (${instrument.serialNumber})
  - User: ${booking.userId}
  - Booking End Time: ${endTime.toLocaleString()}

Please verify the instrument's status and ensure it is available for the next user.

Thank you,
LabMonitor System
                `;
                sendEmail(ADMIN_EMAIL, subject, body);
                notified.add(notificationId);
            }
        }
    });
    setNotified(new Set(notified));
};

const checkLowStock = (
    consumable: Consumable, 
    notified: Set<string>,
    setNotified: Dispatch<SetStateAction<Set<string>>>
) => {
    const notificationId = `low-stock-${consumable.id}`;
    if (consumable.quantity <= consumable.lowStockThreshold) {
        if (!notified.has(notificationId)) {
            const subject = `Low Stock Alert: ${consumable.name}`;
            const body = `
Dear Lab Admin,

This is an automated alert that a consumable item is running low on stock:

  - Item: ${consumable.name}
  - Current Quantity: ${consumable.quantity} ${consumable.unit}
  - Low Stock Threshold: ${consumable.lowStockThreshold} ${consumable.unit}

Please reorder this item soon to avoid a shortage.

Thank you,
LabMonitor System
            `;
            sendEmail(ADMIN_EMAIL, subject, body);
            notified.add(notificationId);
            setNotified(new Set(notified));
        }
    } else {
        // If stock is replenished, remove from notified set so it can trigger again later
        if (notified.has(notificationId)) {
            notified.delete(notificationId);
            setNotified(new Set(notified));
        }
    }
};

export const notificationService = {
  checkOverdueMaintenance,
  checkOverdueBookings,
  checkLowStock,
};