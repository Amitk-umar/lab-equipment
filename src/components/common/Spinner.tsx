import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-transparent border-t-4 border-t-blue-500 rounded-full animate-rotate"></div>
      <div className="w-20 h-20 border-4 border-transparent border-b-4 border-b-green-500 rounded-full animate-rotate-reverse absolute top-0 left-0"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
    </div>
  </div>
);