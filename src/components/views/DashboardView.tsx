import React, { useState, useMemo } from 'react';
import type { Instrument, Booking, MaintenanceLog, User } from '../../types';
import { UserRole, InstrumentStatus } from '../../types';
import { InstrumentCard } from '../InstrumentCard';
import { InstrumentModal } from '../modals/InstrumentModal';
import { ScannerModal } from '../modals/ScannerModal';
import { InstrumentDetailModal } from '../modals/InstrumentDetailModal';
import { BookingModal } from '../modals/BookingModal';
import { MaintenanceModal } from '../modals/MaintenanceModal';
import { BulkStatusUpdateModal } from '../modals/BulkStatusUpdateModal';

interface DashboardViewProps {
  instruments: Instrument[];
  currentUser: User;
  onAddInstrument: (instrument: Omit<Instrument, 'id'>) => void;
  onUpdateInstrument: (instrument: Instrument) => void;
  onBulkUpdateStatus: (instrumentIds: string[], newStatus: InstrumentStatus) => void;
  onDeleteInstrument: (instrumentId: string) => void;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onAddLog: (log: Omit<MaintenanceLog, 'id'>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
    instruments, 
    currentUser,
    onAddInstrument, 
    onUpdateInstrument,
    onBulkUpdateStatus,
    onDeleteInstrument,
    onAddBooking,
    onAddLog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [detailedInstrument, setDetailedInstrument] = useState<Instrument | null>(null);
  const [bookingInstrument, setBookingInstrument] = useState<Instrument | null>(null);
  const [loggingInstrument, setLoggingInstrument] = useState<Instrument | null>(null);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);

  // Selection state
  const [selectedInstruments, setSelectedInstruments] = useState<Set<string>>(new Set());

  // Filters and Sorting State
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('nextMaintenance-asc');

  const uniqueLocations = useMemo(() => ['All', ...new Set(instruments.map(i => i.location))], [instruments]);
  
  const filteredAndSortedInstruments = useMemo(() => {
    let result = instruments
      .filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(inst => statusFilter === 'All' || inst.status === statusFilter)
      .filter(inst => locationFilter === 'All' || inst.location === locationFilter);

    switch (sortBy) {
      case 'nextMaintenance-asc':
        result.sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime());
        break;
      case 'nextMaintenance-desc':
        result.sort((a, b) => new Date(b.nextMaintenance).getTime() - new Date(a.nextMaintenance).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return result;
  }, [instruments, searchTerm, statusFilter, locationFilter, sortBy]);

  const handleToggleSelection = (instrumentId: string) => {
    setSelectedInstruments(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(instrumentId)) {
        newSelection.delete(instrumentId);
      } else {
        newSelection.add(instrumentId);
      }
      return newSelection;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedInstruments.size === filteredAndSortedInstruments.length) {
      setSelectedInstruments(new Set());
    } else {
      setSelectedInstruments(new Set(filteredAndSortedInstruments.map(i => i.id)));
    }
  };


  const handleOpenAddModal = () => {
    setEditingInstrument(null);
    setIsInstrumentModalOpen(true);
  };
  
  const handleOpenEditModal = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setIsInstrumentModalOpen(true);
  };

  const handleSaveInstrument = (instrument: Instrument) => {
    if (editingInstrument) {
      onUpdateInstrument(instrument);
    } else {
      onAddInstrument(instrument);
    }
    setIsInstrumentModalOpen(false);
    setEditingInstrument(null);
  };
  
  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    const found = instruments.find(inst => inst.id === decodedText);
    if (found) {
      setDetailedInstrument(found);
    } else {
      alert(`Instrument with ID "${decodedText}" not found.`);
    }
  };

  const handleResetFilters = () => {
      setSearchTerm('');
      setStatusFilter('All');
      setLocationFilter('All');
      setSortBy('nextMaintenance-asc');
      setSelectedInstruments(new Set());
  }

  const handleBulkStatusSave = (newStatus: InstrumentStatus) => {
    onBulkUpdateStatus(Array.from(selectedInstruments), newStatus);
    setIsBulkStatusModalOpen(false);
    setSelectedInstruments(new Set());
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Instrument Dashboard</h1>
        <div className="flex items-center space-x-2">
           <button onClick={() => setIsScannerOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /><path d="M15 3h4a2 2 0 012 2v4M9 3H5a2 2 0 00-2 2v4m6 12h4a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4" /></svg>
            Scan QR
          </button>
          {currentUser.role === UserRole.Admin && (
            <button onClick={handleOpenAddModal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Add Instrument
            </button>
          )}
        </div>
      </div>
      
      {selectedInstruments.size > 0 && currentUser.role === UserRole.Admin && (
        <div className="sticky top-2 z-20 p-3 bg-blue-100 dark:bg-blue-900/80 backdrop-blur-md rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 flex items-center justify-between transition-all animate-fade-in-down">
            <p className="font-semibold">{selectedInstruments.size} instrument(s) selected</p>
            <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsBulkStatusModalOpen(true)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Change Status
                </button>
                <button 
                  onClick={() => setSelectedInstruments(new Set())}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                    Deselect All
                </button>
            </div>
        </div>
      )}


      <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md border border-white/20 dark:border-gray-700/50 space-y-4">
        <input
            type="text"
            placeholder="Search instruments by name, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="All">All Statuses</option>
                    {/* FIX: Explicitly type 's' to resolve 'unknown' type error from Object.values() on an enum. */}
                    {Object.values(InstrumentStatus).map((s: InstrumentStatus) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="nextMaintenance-asc">Next Maintenance (Soonest)</option>
                    <option value="nextMaintenance-desc">Next Maintenance (Latest)</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                </select>
            </div>
            <div className="flex items-end space-x-2">
                <button onClick={handleResetFilters} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    Reset
                </button>
            </div>
        </div>
         {currentUser.role === UserRole.Admin && (
            <div className="flex items-center pt-2">
                <input 
                    type="checkbox" 
                    id="selectAll"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedInstruments.size > 0 && selectedInstruments.size === filteredAndSortedInstruments.length}
                    onChange={handleToggleSelectAll}
                />
                <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Select/Deselect All ({filteredAndSortedInstruments.length} visible)
                </label>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedInstruments.map(instrument => (
          <InstrumentCard 
            key={instrument.id} 
            instrument={instrument} 
            currentUser={currentUser}
            isSelected={selectedInstruments.has(instrument.id)}
            onToggleSelection={handleToggleSelection}
            onEdit={handleOpenEditModal}
            onDelete={onDeleteInstrument}
            onViewDetails={setDetailedInstrument}
          />
        ))}
      </div>
      
      {isInstrumentModalOpen && (
        <InstrumentModal
          instrument={editingInstrument}
          onClose={() => setIsInstrumentModalOpen(false)}
          onSave={handleSaveInstrument}
        />
      )}
      
      {isScannerOpen && (
        <ScannerModal 
          onClose={() => setIsScannerOpen(false)} 
          onScanSuccess={handleScanSuccess} 
        />
      )}

      {detailedInstrument && (
          <InstrumentDetailModal 
            instrument={detailedInstrument}
            currentUser={currentUser}
            onClose={() => setDetailedInstrument(null)}
            onBook={(instrument) => {
                setDetailedInstrument(null);
                setBookingInstrument(instrument);
            }}
            onLogMaintenance={(instrument) => {
                setDetailedInstrument(null);
                setLoggingInstrument(instrument);
            }}
          />
      )}

      {bookingInstrument && (
        <BookingModal
          instrument={bookingInstrument}
          currentUser={currentUser}
          onClose={() => setBookingInstrument(null)}
          onSave={(booking) => {
            onAddBooking(booking);
            setBookingInstrument(null);
          }}
        />
      )}

      {loggingInstrument && (
        <MaintenanceModal
          instrument={loggingInstrument}
          onClose={() => setLoggingInstrument(null)}
          onSave={(log) => {
            onAddLog(log);
            setLoggingInstrument(null);
          }}
        />
      )}

      {isBulkStatusModalOpen && (
        <BulkStatusUpdateModal
            selectedCount={selectedInstruments.size}
            onClose={() => setIsBulkStatusModalOpen(false)}
            onSave={handleBulkStatusSave}
        />
      )}

    </div>
  );
};