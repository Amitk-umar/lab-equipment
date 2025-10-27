

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Instrument } from '../../types';
import { InstrumentStatus } from '../../types';

interface InstrumentModalProps {
  instrument: Instrument | null;
  onClose: () => void;
  onSave: (instrument: Instrument) => void;
}

export const InstrumentModal: React.FC<InstrumentModalProps> = ({ instrument, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Instrument, 'id'>>({
    name: '',
    type: '',
    serialNumber: '',
    location: '',
    status: InstrumentStatus.Available,
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  });

  useEffect(() => {
    if (instrument) {
        setFormData({
            ...instrument,
            lastMaintenance: new Date(instrument.lastMaintenance).toISOString().split('T')[0],
            nextMaintenance: new Date(instrument.nextMaintenance).toISOString().split('T')[0],
        });
    }
  }, [instrument]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Instrument = {
      ...(instrument || { id: '' }),
      ...formData,
      lastMaintenance: new Date(formData.lastMaintenance).toISOString(),
      nextMaintenance: new Date(formData.nextMaintenance).toISOString(),
    };
    onSave(payload);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={instrument ? 'Edit Instrument' : 'Add New Instrument'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instrument Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <input type="text" name="type" id="type" value={formData.type} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
         <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial Number</label>
          <input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
         <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            {/* FIX: Explicitly type 'status' to resolve 'unknown' type error from Object.values() on an enum. */}
            {Object.values(InstrumentStatus).map((status: InstrumentStatus) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Maintenance</label>
            <input type="date" name="lastMaintenance" id="lastMaintenance" value={formData.lastMaintenance} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="nextMaintenance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Maintenance</label>
            <input type="date" name="nextMaintenance" id="nextMaintenance" value={formData.nextMaintenance} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save</button>
        </div>
      </form>
    </Modal>
  );
};