import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { InstrumentStatus } from '../../types';

interface BulkStatusUpdateModalProps {
  selectedCount: number;
  onClose: () => void;
  onSave: (newStatus: InstrumentStatus) => void;
}

export const BulkStatusUpdateModal: React.FC<BulkStatusUpdateModalProps> = ({ selectedCount, onClose, onSave }) => {
  const [newStatus, setNewStatus] = useState<InstrumentStatus>(InstrumentStatus.Available);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newStatus);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Update Status for ${selectedCount} Instruments`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Status</label>
          <select 
            name="status" 
            id="status" 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value as InstrumentStatus)} 
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {/* FIX: Explicitly type 'status' to resolve 'unknown' type error from Object.values() on an enum. */}
            {Object.values(InstrumentStatus).map((status: InstrumentStatus) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This action will change the status for all {selectedCount} selected instruments. This cannot be undone.
        </p>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Apply Status</button>
        </div>
      </form>
    </Modal>
  );
};