

import React, { useMemo } from 'react';
import type { Instrument, Booking, MaintenanceLog } from '../../types';
import { InstrumentStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

interface AnalyticsViewProps {
  instruments: Instrument[];
  bookings: Booking[];
  logs: MaintenanceLog[];
}

const COLORS = {
  [InstrumentStatus.Available]: '#4ade80', // green-400
  [InstrumentStatus.InUse]: '#facc15', // yellow-400
  [InstrumentStatus.Maintenance]: '#f87171', // red-400
  [InstrumentStatus.Offline]: '#9ca3af', // gray-400
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-gray-200">{`${value} Instrument${value !== 1 ? 's' : ''}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="dark:fill-gray-400">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ instruments, bookings, logs }) => {
  
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const usageData = useMemo(() => {
    return instruments.map(inst => {
      const instrumentBookings = bookings.filter(b => b.instrumentId === inst.id);
      const totalHours = instrumentBookings.reduce((acc, b) => {
        const duration = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60);
        return acc + duration;
      }, 0);
      return { name: inst.name, 'Usage (hours)': totalHours };
    });
  }, [instruments, bookings]);

  const statusData = useMemo(() => {
    const statusCounts = instruments.reduce((acc, inst) => {
      acc[inst.status] = (acc[inst.status] || 0) + 1;
      return acc;
    }, {} as Record<InstrumentStatus, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [instruments]);

  const maintenanceCostData = useMemo(() => {
     return instruments.map(inst => {
      const instrumentLogs = logs.filter(l => l.instrumentId === inst.id);
      const totalCost = instrumentLogs.reduce((acc, l) => acc + l.cost, 0);
      return { name: inst.name, 'Maintenance Cost ($)': totalCost };
    });
  }, [instruments, logs]);


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Instrument Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as InstrumentStatus]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Total Maintenance Cost</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    color: '#ffffff',
                  }}
                  cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Maintenance Cost ($)" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Instrument Usage (Hours)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: 'currentColor', fontSize: 12 }}/>
            <YAxis tick={{ fill: 'currentColor' }} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    color: '#ffffff',
                }}
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="Usage (hours)" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};