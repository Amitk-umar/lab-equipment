export enum InstrumentStatus {
  Available = 'Available',
  InUse = 'In Use',
  Maintenance = 'Maintenance',
  Offline = 'Offline',
}

export enum UserRole {
  Admin = 'Admin',
  Technician = 'Technician',
  Researcher = 'Researcher',
  Student = 'Student',
}

export enum ConsumableUnit {
    Items = 'items',
    Milliliters = 'mL',
    Grams = 'g',
    Box = 'box',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Instrument {
  id: string;
  name:string;
  type: string;
  serialNumber: string;
  location: string;
  status: InstrumentStatus;
  lastMaintenance: string; // ISO date string
  nextMaintenance: string; // ISO date string
}

export interface Booking {
  id: string;
  instrumentId: string;
  userId: string; // Corresponds to User name for simplicity
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  purpose: string;
}

export interface MaintenanceLog {
  id: string;
  instrumentId: string;
  date: string; // ISO date string
  technician: string;
  description: string;
  cost: number;
}

export interface Consumable {
    id: string;
    name: string;
    unit: ConsumableUnit;
    quantity: number;
    lowStockThreshold: number;
}