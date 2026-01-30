"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";

interface UploadReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload?: (file: File) => void;
    invoiceId?: string; // Invoice ID for API upload
}

type UploadState = 'idle' | 'uploading' | 'completed' | 'failed';

const UploadReceiptModal = ({ isOpen, onClose, onUpload, invoiceId }: UploadReceiptModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
<<<<<<< HEAD
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { uploadReceipt, uploading, progress, error: uploadError, success, reset } = useReceiptUpload();

    // Sync upload state with hook state
    useEffect(() => {
        if (uploading) {
            setUploadState('uploading');
        } else if (success) {
            setUploadState('completed');
        } else if (uploadError) {
            setUploadState('failed');
        }
    }, [uploading, success, uploadError]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedFile(null);
                setUploadState('idle');
<<<<<<< HEAD
                setFilePreviewUrl(null);
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                reset();
            }, 300);
        }
    }, [isOpen, reset]);

<<<<<<< HEAD
    // Create preview URL when file is selected
    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setFilePreviewUrl(url);
            
            // Cleanup URL when component unmounts or file changes
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [selectedFile]);

=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    if (!isOpen) return null;

    const handleFileSelect = (file: File) => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid file type (JPG, PNG, PDF)');
            return;
        }

        // Check file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // If invoiceId is provided, use the API
        if (invoiceId) {
            const uploadSuccess = await uploadReceipt(invoiceId, selectedFile);
            
            if (!uploadSuccess) {
                setUploadState('failed');
            }
            // Success state is handled by useEffect watching the success flag
        } else {
            // Fallback to callback if no invoiceId (backward compatibility)
            setUploadState('uploading');
            
            // Simulate upload progress for callback mode
            const progressInterval = setInterval(() => {
                setUploadState((prev) => {
                    if (prev === 'uploading') {
                        return prev;
                    }
                    clearInterval(progressInterval);
                    return prev;
                });
            }, 200);
            
            try {
                if (onUpload) {
                    onUpload(selectedFile);
                }
                clearInterval(progressInterval);
                setUploadState('completed');
            } catch (error) {
                clearInterval(progressInterval);
                setUploadState('failed');
            }
        }
    };

    const handleRetry = () => {
        setUploadState('idle');
<<<<<<< HEAD
        setFilePreviewUrl(null);
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
        reset();
    };

    const handleSave = () => {
        // Handle save action for completed upload
        onClose();
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setUploadState('idle');
<<<<<<< HEAD
        setFilePreviewUrl(null);
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Payment Receipt</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm mb-4">
                        Please upload proof of your payment so the business can review and confirm it. 
                        Supported files: JPG, PNG, PDF (max 10MB).
                    </p>

                    {/* Upload States */}
                    {uploadState === 'idle' && (
                        /* Upload Area */
                        <div
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                                isDragOver
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedFile
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {selectedFile ? (
                                <div className="space-y-2">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">File Selected</p>
                                        <p className="text-sm text-gray-600">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1">Upload Receipt</p>
                                        <p className="text-sm text-gray-500 mb-3">Drag & drop or click to upload</p>
                                        <button
                                            onClick={handleBrowseClick}
                                            className="px-6 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Browse File
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Uploading State */}
<<<<<<< HEAD
                    {uploadState === 'uploading' && selectedFile && filePreviewUrl && (
                        <div className="space-y-4">
                            {/* Receipt Preview - Actual Uploaded File */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden" style={{ minHeight: '280px' }}>
                                {selectedFile.type === 'application/pdf' ? (
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                <path d="M8 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M8 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">PDF Document - Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center p-4">
                                        <img 
                                            src={filePreviewUrl} 
                                            alt="Receipt preview" 
                                            className="max-w-full max-h-[280px] object-contain rounded"
                                        />
                                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-700 text-sm">Uploading...</span>
                                        </div>
                                    </div>
                                )}
=======
                    {uploadState === 'uploading' && selectedFile && (
                        <div className="space-y-4">
                            {/* Receipt Preview - Full Color During Upload */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-700">Transfer from IYATUN EMMANUEL</p>
                                    <p className="text-2xl font-bold text-gray-900">₦8,000.00</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-green-500 font-medium">Successful</span>
                                    </div>
                                </div>
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                            </div>
                            
                            {/* File Upload Progress */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-medium">PDF</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{Math.round((selectedFile.size * progress) / 100 / 1024)} KB of {Math.round(selectedFile.size / 1024)} KB</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading...</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                        <div 
                                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Completed State */}
<<<<<<< HEAD
                    {uploadState === 'completed' && selectedFile && filePreviewUrl && (
                        <div className="space-y-4">
                            {/* Receipt Preview - Actual Uploaded File */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden" style={{ minHeight: '280px' }}>
                                {selectedFile.type === 'application/pdf' ? (
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                                            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                <path d="M8 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M8 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500 mb-3">PDF Document</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-green-500 font-medium text-sm">Upload Successful</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center p-4">
                                        <img 
                                            src={filePreviewUrl} 
                                            alt="Receipt preview" 
                                            className="max-w-full max-h-[280px] object-contain rounded"
                                        />
                                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-green-500 font-medium text-sm">Upload Successful</span>
                                        </div>
                                    </div>
                                )}
=======
                    {uploadState === 'completed' && selectedFile && (
                        <div className="space-y-4">
                            {/* Receipt Preview with Dashed Border */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white">
                                <div className="text-center space-y-3">
                                    <p className="text-lg font-medium text-gray-700">Transfer from IYATUN EMMANUEL</p>
                                    <p className="text-4xl font-bold text-gray-900">₦8,000.00</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-green-500 font-medium text-lg">Successful</span>
                                    </div>
                                </div>
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                            </div>
                            
                            {/* File Completed */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-medium">PDF</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{Math.round(selectedFile.size / 1024)} KB of {Math.round(selectedFile.size / 1024)} KB</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-green-600">Completed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Failed State */}
                    {uploadState === 'failed' && selectedFile && (
                        <div className="space-y-4">
                            {/* Empty Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50">
                                {/* Empty space to match the layout */}
                            </div>
                            
                            {/* File Failed */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-medium">PDF</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                                            <button className="text-red-400 hover:text-red-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>0 KB of {Math.round(selectedFile.size / 1024)} KB</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-red-600">Failed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {uploadError && (
                                    <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                                )}
                                <button 
                                    onClick={handleRetry}
                                    className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    {uploadState === 'completed' ? (
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadState === 'uploading'}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                selectedFile && uploadState !== 'uploading'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {uploadState === 'uploading' ? 'Uploading...' : 'Upload Receipt'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadReceiptModal;