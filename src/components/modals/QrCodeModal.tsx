import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import type { Instrument } from '../../types';
import QRCode from 'qrcode';

interface QrCodeModalProps {
  instrument: Instrument;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ instrument, onClose }) => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');

  useEffect(() => {
    const canvas = document.getElementById('qrcode-canvas');
    if (canvas) {
      QRCode.toCanvas(canvas, instrument.id, {
        width: 256,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: errorCorrectionLevel,
      }, (error: Error | null | undefined) => {
        if (error) console.error(error);
      });
    }
  }, [instrument.id, foregroundColor, backgroundColor, errorCorrectionLevel]);
  
  const handleDownload = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qrcode-${instrument.serialNumber || instrument.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };


  return (
    <Modal isOpen={true} onClose={onClose} title={`QR Code for ${instrument.name}`}>
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-inner">
          <canvas id="qrcode-canvas" className="rounded-lg"></canvas>
        </div>
        
        <div className="w-full p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foreground Color</label>
            <input
              id="fgColor"
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="mt-1 w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Color</label>
            <input
              id="bgColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="mt-1 w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="errorCorrection" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Error Correction</label>
            <select
              id="errorCorrection"
              value={errorCorrectionLevel}
              onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="L">Low</option>
              <option value="M">Medium</option>
              <option value="Q">Quartile</option>
              <option value="H">High</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">Scan this code to quickly view instrument details.</p>
        <p className="text-xs text-gray-500">ID: {instrument.id}</p>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as PNG
        </button>
      </div>
    </Modal>
  );
};