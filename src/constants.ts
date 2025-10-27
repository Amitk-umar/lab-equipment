import type { Instrument, Booking, MaintenanceLog, Consumable } from './types';
import { InstrumentStatus, ConsumableUnit } from './types';

export const DUMMY_INSTRUMENTS: Instrument[] = [
  {
    id: 'instr-1',
    name: 'Zeiss LSM 980',
    type: 'Confocal Microscope',
    serialNumber: 'SN-Z980-001',
    location: 'Lab 301',
    status: InstrumentStatus.Available,
    lastMaintenance: '2024-05-15T00:00:00.000Z',
    nextMaintenance: '2024-11-15T00:00:00.000Z',
  },
  {
    id: 'instr-2',
    name: 'Thermo Orbitrap',
    type: 'Mass Spectrometer',
    serialNumber: 'SN-TFS-ORBI-015',
    location: 'Lab 205',
    status: InstrumentStatus.InUse,
    lastMaintenance: '2024-03-20T00:00:00.000Z',
    nextMaintenance: '2024-09-20T00:00:00.000Z',
  },
  {
    id: 'instr-3',
    name: 'Agilent 1290 Infinity II',
    type: 'HPLC System',
    serialNumber: 'SN-AG-1290-2023',
    location: 'Lab 110',
    status: InstrumentStatus.Maintenance,
    lastMaintenance: '2024-06-01T00:00:00.000Z',
    nextMaintenance: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'instr-4',
    name: 'Illumina NovaSeq 6000',
    type: 'DNA Sequencer',
    serialNumber: 'SN-IL-NS6K-007',
    location: 'Genomics Core',
    status: InstrumentStatus.Offline,
    lastMaintenance: '2024-01-10T00:00:00.000Z',
    nextMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
  },
   {
    id: 'instr-5',
    name: 'Bruker Avance NEO',
    type: 'NMR Spectrometer',
    serialNumber: 'SN-BRK-NEO-002',
    location: 'NMR Facility',
    status: InstrumentStatus.Available,
    lastMaintenance: '2024-04-05T00:00:00.000Z',
    nextMaintenance: '2024-10-05T00:00:00.000Z',
  },
];

export const DUMMY_BOOKINGS: Booking[] = [];

export const DUMMY_LOGS: MaintenanceLog[] = [];

export const DUMMY_CONSUMABLES: Consumable[] = [
    { id: 'cons-1', name: '1000uL Pipette Tips', unit: ConsumableUnit.Box, quantity: 5, lowStockThreshold: 10 },
    { id: 'cons-2', name: 'Ethanol (99%)', unit: ConsumableUnit.Milliliters, quantity: 1500, lowStockThreshold: 500 },
    { id: 'cons-3', name: 'Nitrile Gloves (M)', unit: ConsumableUnit.Box, quantity: 22, lowStockThreshold: 5 },
    { id: 'cons-4', name: 'SYBR Green Master Mix', unit: ConsumableUnit.Items, quantity: 3, lowStockThreshold: 2 },
];