'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Calculator, X } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  taxType: string;
  baseTaxRate: number;
  individualRate?: number;
  businessRate?: number;
  isActive: boolean;
}

interface TaxSelectorProps {
  selectedTaxIds: string[];
  onTaxChange: (taxIds: string[]) => void;
  subtotal: number;
  clientType?: 'INDIVIDUAL' | 'BUSINESS';
}

export default function TaxSelector({ selectedTaxIds, onTaxChange, subtotal, clientType }: TaxSelectorProps) {
  const [availableTaxes, setAvailableTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getActiveTaxes();
      
      if (response.status === 200 && response.data) {
        setAvailableTaxes(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to load taxes');
      }
    } catch (err) {
      console.error('Error loading taxes:', err);
      setError('Error loading taxes');
      setAvailableTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaxToggle = (taxId: string, checked: boolean) => {
    if (checked) {
      onTaxChange([...selectedTaxIds, taxId]);
    } else {
      onTaxChange(selectedTaxIds.filter(id => id !== taxId));
    }
  };

  const getApplicableRate = (tax: Tax): number => {
    if (clientType === 'INDIVIDUAL' && tax.individualRate !== undefined) {
      return tax.individualRate;
    }
    if (clientType === 'BUSINESS' && tax.businessRate !== undefined) {
      return tax.businessRate;
    }
    return tax.baseTaxRate;
  };

  const calculateTaxAmount = (tax: Tax): number => {
    const rate = getApplicableRate(tax);
    return (subtotal * rate) / 100;
  };

  const getTotalTaxAmount = (): number => {
    return selectedTaxIds.reduce((total, taxId) => {
      const tax = availableTaxes.find(t => t.id === taxId);
      return tax ? total + calculateTaxAmount(tax) : total;
    }, 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} />
          <h3 className="text-lg font-semibold">Invoice Taxes</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} />
          <h3 className="text-lg font-semibold">Invoice Taxes</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadTaxes}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} />
        <h3 className="text-lg font-semibold">Invoice Taxes</h3>
      </div>

      {availableTaxes.length === 0 ? (
        <div className="text-center py-8">
          <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No taxes available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableTaxes.map((tax) => {
            const isSelected = selectedTaxIds.includes(tax.id);
            const applicableRate = getApplicableRate(tax);
            const taxAmount = calculateTaxAmount(tax);

            return (
              <div
                key={tax.id}
                className={`border rounded-lg p-3 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleTaxToggle(tax.id, e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{tax.name}</h4>
                        <p className="text-sm text-gray-600">
                          {tax.taxType} • {applicableRate}%
                          {clientType && (
                            <span className="ml-1 text-xs text-gray-500">
                              ({clientType.toLowerCase()} rate)
                            </span>
                          )}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₦{taxAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            on ₦{subtotal.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            );
          })}

          {selectedTaxIds.length > 0 && (
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Tax Amount:</span>
                <span className="font-semibold text-lg text-gray-900">
                  ₦{getTotalTaxAmount().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Subtotal + Taxes:</span>
                <span className="font-semibold text-gray-900">
                  ₦{(subtotal + getTotalTaxAmount()).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}