import React, { useState, useRef, useEffect } from 'react';
import type { Instrument, User } from '../types';
import { InstrumentStatus, UserRole } from '../types';
import { QrCodeModal } from './modals/QrCodeModal';

interface InstrumentCardProps {
  instrument: Instrument;
  currentUser: User;
  isSelected: boolean;
  onToggleSelection: (instrumentId: string) => void;
  onEdit: (instrument: Instrument) => void;
  onDelete: (instrumentId: string) => void;
  onViewDetails: (instrument: Instrument) => void;
}

const StatusIndicator: React.FC<{ status: InstrumentStatus }> = ({ status }) => {
  const colorClasses = {
    [InstrumentStatus.Available]: 'bg-green-500',
    [InstrumentStatus.InUse]: 'bg-yellow-500',
    [InstrumentStatus.Maintenance]: 'bg-red-500',
    [InstrumentStatus.Offline]: 'bg-gray-500',
  };
  return (
    <div className="flex items-center">
      <span className={`h-3 w-3 rounded-full mr-2 ${colorClasses[status]}`}></span>
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ 
  instrument, 
  currentUser,
  isSelected,
  onToggleSelection, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionsMenuRef]);
  
  const isMaintenanceDueSoon = () => {
    const due = new Date(instrument.nextMaintenance);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14 && diffDays >= 0;
  }

  const isAdmin = currentUser.role === UserRole.Admin;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent toggling selection when clicking on buttons or the actions menu itself.
    if ((e.target as HTMLElement).closest('button, a, .actions-menu-content')) {
      return;
    }
    if(isAdmin) {
        onToggleSelection(instrument.id);
    }
  };

  return (
    <div 
        className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all transform hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isAdmin ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
    >
      {isAdmin && (
        <div className={`absolute top-2 left-2 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <input 
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={isSelected}
                onChange={() => onToggleSelection(instrument.id)}
                onClick={(e) => e.stopPropagation()} // Stop propagation to prevent card click handler
            />
        </div>
      )}
      <div className="p-4 flex-grow pt-8">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg mb-1">{instrument.name}</h3>
          <StatusIndicator status={instrument.status} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{instrument.type}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {instrument.location}
        </p>
         {isMaintenanceDueSoon() && (
            <p className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 p-1 rounded">
                Maintenance due: {new Date(instrument.nextMaintenance).toLocaleDateString()}
            </p>
        )}
      </div>
      
      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 grid grid-cols-2 gap-2">
        <button onClick={() => onViewDetails(instrument)} className="flex items-center justify-center text-sm px-3 py-1.5 rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Details
        </button>
        <div className="relative" ref={actionsMenuRef}>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsActionsOpen(prev => !prev); }}
                className="w-full text-sm px-3 py-1.5 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
                Actions
            </button>
            {isActionsOpen && (
              <div className="actions-menu-content absolute z-10 right-0 bottom-full mb-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  {isAdmin && (
                    <>
                      <a href="#" onClick={(e) => {e.preventDefault(); onEdit(instrument); setIsActionsOpen(false);}} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                        Edit
                      </a>
                    </>
                  )}
                  <a href="#" onClick={(e) => {e.preventDefault(); setIsQrModalOpen(true); setIsActionsOpen(false);}} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5l-1-1M4 12H2m13.5-6.5l1-1M12 20v1m-6.5-13.5l-1-1M20 12h2M6.5 6.5l1-1m0 0l-1 1m1-1l-1 1M12 4v16" /><path d="M15 3h4a2 2 0 012 2v4M9 3H5a2 2 0 00-2 2v4m6 12h4a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4" /></svg>
                    QR Code
                  </a>
                  {isAdmin && (
                     <a href="#" onClick={(e) => {e.preventDefault(); if(window.confirm('Are you sure you want to delete this instrument?')) onDelete(instrument.id); setIsActionsOpen(false);}} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                    </a>
                  )}
              </div>
            )}
        </div>
      </div>

      {isQrModalOpen && <QrCodeModal instrument={instrument} onClose={() => setIsQrModalOpen(false)} />}
    </div>
  );
};