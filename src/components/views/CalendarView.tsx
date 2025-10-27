import React, { useState } from "react";
import type { Instrument, Booking } from "../types";

interface CalendarViewProps {
  instruments: Instrument[];
  bookings: Booking[];
}

const COLORS = [
  "bg-blue-200 border-blue-500 text-blue-800 dark:bg-blue-800 dark:border-blue-500 dark:text-blue-100",
  "bg-green-200 border-green-500 text-green-800 dark:bg-green-800 dark:border-green-500 dark:text-green-100",
  "bg-yellow-200 border-yellow-500 text-yellow-800 dark:bg-yellow-800 dark:border-yellow-500 dark:text-yellow-100",
  "bg-purple-200 border-purple-500 text-purple-800 dark:bg-purple-800 dark:border-purple-500 dark:text-purple-100",
  "bg-pink-200 border-pink-500 text-pink-800 dark:bg-pink-800 dark:border-pink-500 dark:text-pink-100",
  "bg-indigo-200 border-indigo-500 text-indigo-800 dark:bg-indigo-800 dark:border-indigo-500 dark:text-indigo-100",
];

// ✅ Safe helper — returns color even if index not found
const getInstrumentColor = (instrumentId: string, instruments: Instrument[]) => {
  const index = instruments.findIndex((inst) => inst.id === instrumentId);
  return COLORS[Math.max(0, index) % COLORS.length];
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  instruments,
  bookings,
}) => {
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // ✅ FIXED: explicitly type as (Date | null)[]
  const getMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // ✅ Type-safe array creation
    const emptyDays: (Date | null)[] = Array.from({ length: startDayOfWeek }, () => null);
    const realDays: (Date | null)[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    const days: (Date | null)[] = [...emptyDays, ...realDays];

    return (
      <div className="grid grid-cols-7 border-t border-l border-gray-300 dark:border-gray-600">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-bold p-2 border-b border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className="h-32 border-b border-r border-gray-300 dark:border-gray-600 p-1 overflow-y-auto"
          >
            {day && <span className="font-semibold">{day.getDate()}</span>}
            {day &&
              bookings
                .filter(
                  (b) =>
                    new Date(b.startTime).toDateString() ===
                    day.toDateString()
                )
                .map((booking) => {
                  const instrument = instruments.find(
                    (i) => i.id === booking.instrumentId
                  );
                  return (
                    <div
                      key={booking.id}
                      className={`p-1 text-xs rounded mt-1 ${getInstrumentColor(
                        booking.instrumentId,
                        instruments
                      )}`}
                    >
                      <p className="font-bold">{instrument?.name}</p>
                      <p>
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="truncate">{booking.userId}</p>
                    </div>
                  );
                })}
          </div>
        ))}
      </div>
    );
  };

  const getWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="text-center font-bold p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              {day.toLocaleDateString([], { weekday: "short" })} {day.getDate()}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 h-[60vh] overflow-y-auto border-l border-gray-300 dark:border-gray-600">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-r border-gray-300 dark:border-gray-600 p-1"
            >
              {bookings
                .filter(
                  (b) =>
                    new Date(b.startTime).toDateString() ===
                    day.toDateString()
                )
                .map((booking) => {
                  const instrument = instruments.find(
                    (i) => i.id === booking.instrumentId
                  );
                  return (
                    <div
                      key={booking.id}
                      className={`p-2 my-1 text-sm rounded ${getInstrumentColor(
                        booking.instrumentId,
                        instruments
                      )}`}
                    >
                      <p className="font-bold">{instrument?.name}</p>
                      <p className="text-xs">
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() - 1);
    if (view === "week") newDate.setDate(currentDate.getDate() - 7);
    if (view === "day") newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + 1);
    if (view === "week") newDate.setDate(currentDate.getDate() + 7);
    if (view === "day") newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20 dark:border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            &lt;
          </button>
          <h2 className="text-xl font-bold">
            {view === "month" &&
              currentDate.toLocaleDateString([], {
                month: "long",
                year: "numeric",
              })}
            {view === "week" &&
              `Week of ${currentDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}`}
          </h2>
          <button
            onClick={handleNext}
            className="px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            &gt;
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Today
          </button>
        </div>
        <div>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as "month" | "week" | "day")}
            className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            {/* <option value="day">Day</option> */}
          </select>
        </div>
      </div>

      {view === "month" && getMonthView()}
      {view === "week" && getWeekView()}
      {/* {view === "day" && getDayView()} */}
    </div>
  );
};
