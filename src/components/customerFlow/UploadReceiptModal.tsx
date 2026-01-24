"use client";

import React, { useState, useRef } from "react";
import { X, Upload as UploadIcon, Trash2, CheckCircle, XCircle } from "lucide-react";

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  testMode?: boolean;
}

type ModalState = "initial" | "uploading" | "success" | "failed";

interface UploadedFile {
  name: string;
  size: number;
  maxSize: number;
  status: "uploading" | "completed" | "failed";
  progress: number;
}

const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({
  isOpen,
  onClose,
  testMode = false,
}) => {
  const [modalState, setModalState] = useState<ModalState>("initial");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      setUploadedFile({
        name: file.name,
        size: 0,
        maxSize: 120,
        status: "failed",
        progress: 0,
      });
      setModalState("failed");
      return;
    }

    setUploadedFile({
      name: file.name,
      size: 0,
      maxSize: 120,
      status: "uploading",
      progress: 0,
    });
    setModalState("uploading");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFile((prev) =>
        prev ? { ...prev, progress, size: Math.floor((progress / 100) * 120) } : null
      );

      if (progress === 30 && (Math.random() < 0.2 || file.name.toLowerCase().includes('fail') || file.name.toLowerCase().includes('error'))) {
        clearInterval(interval);
        setUploadedFile((prev) =>
          prev ? { ...prev, status: "failed", progress: 0, size: 0 } : null
        );
        setModalState("failed");
        return;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFile((prev) =>
          prev ? { ...prev, status: "completed", progress: 100, size: 120 } : null
        );
        setModalState("success");
      }
    }, 200);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleTryAgain = () => {
    setUploadedFile(null);
    setModalState("initial");
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setModalState("initial");
  };

  const handleSave = () => {
    onClose();
    setTimeout(() => {
      setModalState("initial");
      setUploadedFile(null);
    }, 300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setModalState("initial");
      setUploadedFile(null);
    }, 300);
  };

  const testFailedState = () => {
    setUploadedFile({
      name: "Img 4568",
      size: 0,
      maxSize: 120,
      status: "failed",
      progress: 0,
    });
    setModalState("failed");
  };

  const testUploadingState = () => {
    setUploadedFile({
      name: "Img 4568",
      size: 45,
      maxSize: 120,
      status: "uploading",
      progress: 37,
    });
    setModalState("uploading");
  };

  const testSuccessState = () => {
    setUploadedFile({
      name: "Img 4568",
      size: 120,
      maxSize: 120,
      status: "completed",
      progress: 100,
    });
    setModalState("success");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Upload Payment Receipt
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please upload proof of your payment so the business can review and
              confirm it. Supported files: JPG, PNG, PDF (max 10MB).
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Large Preview Area - shown for uploading, success, and failed states */}
          {(modalState === "uploading" || modalState === "success" || modalState === "failed") && (
            <div className="border-2 border-gray-200 rounded-lg mb-4 bg-[#F5F7FA] min-h-[280px] flex items-center justify-center p-6">
              {(modalState === "uploading" || modalState === "success") && (
                <div className="text-center w-full">
                  <div className="text-sm text-gray-600 mb-1">
                    Transfer from IYATUN EMMANUEL
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ₦8,000.00
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-medium">Successful</span>
                  </div>

                  {modalState === "success" && (
                    <div className="text-xs text-gray-500 space-y-1 mt-4">
                      <div className="flex justify-between">
                        <span>Transaction Details</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Account:</span>
                        <span className="text-right">Available Balance</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sender Details:</span>
                        <span className="text-right">
                          IYATUN EMMANUEL<br />
                          MONIEPOINT | 8127***186
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remark:</span>
                        <span className="text-right text-xs">
                          Confirmation:8531YESEC24JZPG1...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Upload Area (initial state) */}
          {modalState === "initial" && !uploadedFile && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UploadIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-gray-900 font-semibold mb-1">
                  Upload Receipt
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Drag & drop or click to upload
                </div>
                <button
                  onClick={handleBrowseClick}
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                >
                  Browse File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* File Upload Status */}
          {uploadedFile && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  PDF
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">
                    {uploadedFile.name || "Img 4568"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span>
                      {uploadedFile.size} KB of {uploadedFile.maxSize} KB
                    </span>
                    {uploadedFile.status === "uploading" && (
                      <>
                        <span>•</span>
                        <span className="text-gray-500">Uploading...</span>
                      </>
                    )}
                    {uploadedFile.status === "completed" && (
                      <>
                        <span>•</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Completed</span>
                      </>
                    )}
                    {uploadedFile.status === "failed" && (
                      <>
                        <span>•</span>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Failed</span>
                      </>
                    )}
                  </div>
                  {uploadedFile.status === "uploading" && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}
                  {uploadedFile.status === "failed" && (
                    <button
                      onClick={handleTryAgain}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Try Again
                    </button>
                  )}
                </div>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {testMode && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-xs font-semibold text-yellow-800 mb-2">
                TEST MODE - Click to preview states:
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setModalState("initial");
                    setUploadedFile(null);
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  Initial
                </button>
                <button
                  onClick={testUploadingState}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Uploading
                </button>
                <button
                  onClick={testSuccessState}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Success
                </button>
                <button
                  onClick={testFailedState}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Failed
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={modalState === "success" ? handleSave : handleBrowseClick}
              disabled={modalState === "uploading"}
              className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                modalState === "uploading"
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {modalState === "success" ? "Save" : "Upload Receipt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReceiptModal;
