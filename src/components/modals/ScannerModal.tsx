import React, { useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode('qr-reader');
    scannerRef.current = qrCodeScanner;

    const startScanner = async () => {
        try {
            await qrCodeScanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText: string) => {
                    onScanSuccess(decodedText);
                    if (scannerRef.current?.isScanning) {
                      scannerRef.current.stop();
                    }
                },
                (errorMessage: string) => {
                    // handle scan error, usually you can ignore this.
                }
            );
        } catch (err) {
            console.error('Error starting scanner:', err);
            alert('Could not start QR scanner. Please ensure you have a camera and have granted permissions.');
            onClose();
        }
    }
    
    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => console.error("Failed to stop scanner", err));
      }
    };
  }, [onClose, onScanSuccess]);

  return (
    <Modal isOpen={true} onClose={onClose} title="Scan Instrument QR Code">
      <div id="qr-reader" className="w-full"></div>
    </Modal>
  );
};