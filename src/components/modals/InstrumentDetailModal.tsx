

import React from 'react';
import { Modal } from '../common/Modal';
import type { Instrument, User } from '../../types';
import { InstrumentStatus, UserRole } from '../../types';

interface InstrumentDetailModalProps {
  instrument: Instrument;
  currentUser: User;
  onClose: () => void;
  onBook: (instrument: Instrument) => void;
  onLogMaintenance: (instrument: Instrument) => void;
}

const StatusBadge: React.FC<{ status: InstrumentStatus }> = ({ status }) => {
  const colorClasses = {
    [InstrumentStatus.Available]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [InstrumentStatus.InUse]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [InstrumentStatus.Maintenance]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [InstrumentStatus.Offline]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-full ${colorClasses[status]}`}>
      {status}
    </span>
  );
};


export const InstrumentDetailModal: React.FC<InstrumentDetailModalProps> = ({ instrument, currentUser, onClose, onBook, onLogMaintenance }) => {
  const canLogService = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Technician;
  const canBook = currentUser.role !== UserRole.Technician;

  return (
    <Modal isOpen={true} onClose={onClose} title={instrument.name}>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <StatusBadge status={instrument.status} />
            </div>
            <div className="mt-2 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                <p>{instrument.type}</p>
            </div>
            <div className="mt-2 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p>{instrument.location}</p>
            </div>
            <div className="mt-2 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
                <p>{instrument.serialNumber}</p>
            </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-semibold mb-2">Maintenance Schedule</h4>
            <div className="mt-2 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Service</p>
                <p>{new Date(instrument.lastMaintenance).toLocaleDateString()}</p>
            </div>
             <div className="mt-2 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Service Due</p>
                <p>{new Date(instrument.nextMaintenance).toLocaleDateString()}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => onBook(instrument)}
              disabled={!canBook || instrument.status !== InstrumentStatus.Available}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
            {canLogService && (
                <button
                onClick={() => onLogMaintenance(instrument)}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                Log Service
                </button>
            )}
        </div>
      </div>
    </Modal>
  );
};