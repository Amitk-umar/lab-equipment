

import React from 'react';
import type { Instrument, Booking, MaintenanceLog } from '../../types';

export const ReportsView: React.FC<{
  instruments: Instrument[];
  bookings: Booking[];
  logs: MaintenanceLog[];
}> = ({ instruments, bookings, logs }) => {

  const generateUsageReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Instrument Name,User,Start Time,End Time,Duration (Hours),Purpose\n";
    
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    sortedBookings.forEach(booking => {
      const instrument = instruments.find(i => i.id === booking.instrumentId);
      const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 3600000;
      const row = [
        instrument?.name || 'N/A',
        booking.userId,
        new Date(booking.startTime).toLocaleString(),
        new Date(booking.endTime).toLocaleString(),
        duration.toFixed(2),
        `"${booking.purpose.replace(/"/g, '""')}"` // Escape double quotes
      ].join(',');
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "instrument_usage_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const generateMaintenanceReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Instrument Name,Date,Technician,Description,Cost\n";

    const sortedLogs = [...logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    sortedLogs.forEach(log => {
      const instrument = instruments.find(i => i.id === log.instrumentId);
      const row = [
        instrument?.name || 'N/A',
        new Date(log.date).toLocaleDateString(),
        log.technician,
        `"${log.description.replace(/"/g, '""')}"`, // Escape double quotes
        log.cost
      ].join(',');
      csvContent += row + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maintenance_log_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20 dark:border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6">Generate Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-lg font-semibold mb-3">Instrument Usage Report</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download a CSV file containing all booking records, including usage duration and purpose.
          </p>
          <button 
            onClick={generateUsageReport}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Download Usage Report
          </button>
        </div>
        
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-lg font-semibold mb-3">Maintenance Log Report</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download a CSV file detailing all maintenance activities, including costs and descriptions.
          </p>
          <button 
            onClick={generateMaintenanceReport}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Download Maintenance Report
          </button>
        </div>

      </div>
    </div>
  );
};