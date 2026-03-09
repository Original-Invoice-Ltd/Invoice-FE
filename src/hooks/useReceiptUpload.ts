import { useState } from 'react';
import { ApiClient } from '@/lib/api';

interface UseReceiptUploadResult {
  uploadReceipt: (invoiceId: string, file: File) => Promise<boolean>;
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export const useReceiptUpload = (): UseReceiptUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadReceipt = async (invoiceId: string, file: File): Promise<boolean> => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);
      setProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await ApiClient.uploadReceipt(invoiceId, file);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return true;
      } else {
        setError(response.error || 'Failed to upload receipt');
        return false;
      }
    } catch (err) {
      setError('An error occurred while uploading the receipt');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setSuccess(false);
  };

  return {
    uploadReceipt,
    uploading,
    progress,
    error,
    success,
    reset,
  };
};
