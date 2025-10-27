import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ConsumablesView } from './components/views/ConsumablesView';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Instrument, Booking, MaintenanceLog, Consumable } from './types';
import { DUMMY_INSTRUMENTS, DUMMY_BOOKINGS, DUMMY_LOGS, DUMMY_CONSUMABLES } from './constants';
import { InstrumentStatus } from './types';
import { notificationService } from './services/notificationService';
import { useAuth } from './contexts/AuthContext';

export type View = 'dashboard' | 'calendar' | 'consumables' | 'analytics' | 'reports' | 'ai-assistant';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [instruments, setInstruments] = useLocalStorage<Instrument[]>('instruments', DUMMY_INSTRUMENTS);
  const [bookings, setBookings] = useLocalStorage<Booking[]>('bookings', DUMMY_BOOKINGS);
  const [logs, setLogs] = useLocalStorage<MaintenanceLog[]>('logs', DUMMY_LOGS);
  const [consumables, setConsumables] = useLocalStorage<Consumable[]>('consumables', DUMMY_CONSUMABLES);
  const [notified, setNotified] = useState(new Set<string>());

  useEffect(() => {
    // REMOVED: document.documentElement.classList.add('dark');
    const newNotified = new Set<string>(notified);
    notificationService.checkOverdueMaintenance(instruments, newNotified, setNotified);
    notificationService.checkOverdueBookings(bookings, instruments, newNotified, setNotified);
    consumables.forEach(c => notificationService.checkLowStock(c, newNotified, setNotified));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
      return null; // Or a loading indicator, though App.tsx handles the main one.
  }

  const handleAddInstrument = (instrument: Omit<Instrument, 'id'>) => {
    const newInstrument = { ...instrument, id: `instr-${Date.now()}`};
    setInstruments(prev => [...prev, newInstrument]);
  };
  
  const handleUpdateInstrument = (updatedInstrument: Instrument) => {
    setInstruments(prev => prev.map(inst => inst.id === updatedInstrument.id ? updatedInstrument : inst));
  };

  const handleBulkUpdateStatus = (instrumentIds: string[], newStatus: InstrumentStatus) => {
    setInstruments(prev => prev.map(inst => 
        instrumentIds.includes(inst.id) ? { ...inst, status: newStatus } : inst
    ));
  };
  
  const handleDeleteInstrument = (instrumentId: string) => {
    setInstruments(prev => prev.filter(inst => inst.id !== instrumentId));
  };
  
  const handleAddBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = { ...booking, id: `book-${Date.now()}`};
    setBookings(prev => [...prev, newBooking]);
    setInstruments(prev => prev.map(inst => 
        (inst.id === booking.instrumentId && inst.status === InstrumentStatus.Available) 
        ? { ...inst, status: InstrumentStatus.InUse } 
        : inst
    ));
  };
  
  const handleAddLog = (log: Omit<MaintenanceLog, 'id'>) => {
     const newLog = { ...log, id: `log-${Date.now()}`};
     setLogs(prev => [...prev, newLog]);
  }
  
  const handleUpdateConsumable = (consumableId: string, newQuantity: number) => {
      setConsumables(prev => {
          const updatedConsumables = prev.map(c => 
              c.id === consumableId ? { ...c, quantity: newQuantity } : c
          );
          const updatedConsumable = updatedConsumables.find(c => c.id === consumableId);
          if (updatedConsumable) {
              notificationService.checkLowStock(updatedConsumable, notified, setNotified);
          }
          return updatedConsumables;
      });
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView 
                    instruments={instruments}
                    currentUser={user}
                    onAddInstrument={handleAddInstrument}
                    onUpdateInstrument={handleUpdateInstrument}
                    onBulkUpdateStatus={handleBulkUpdateStatus}
                    onDeleteInstrument={handleDeleteInstrument}
                    onAddBooking={handleAddBooking}
                    onAddLog={handleAddLog}
                />;
      case 'calendar':
        return <CalendarView instruments={instruments} bookings={bookings} />;
      case 'consumables':
        return <ConsumablesView consumables={consumables} onUpdateConsumable={handleUpdateConsumable} />;
      case 'analytics':
        return <AnalyticsView instruments={instruments} bookings={bookings} logs={logs} />;
      case 'reports':
        return <ReportsView instruments={instruments} bookings={bookings} logs={logs} />;
      case 'ai-assistant':
        return <AIAssistantView />;
      default:
        return <DashboardView 
                    instruments={instruments} 
                    currentUser={user}
                    onAddInstrument={handleAddInstrument}
                    onUpdateInstrument={handleUpdateInstrument}
                    onBulkUpdateStatus={handleBulkUpdateStatus}
                    onDeleteInstrument={handleDeleteInstrument}
                    onAddBooking={handleAddBooking}
                    onAddLog={handleAddLog}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200">
       <Sidebar currentView={view} setView={setView} currentUser={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;