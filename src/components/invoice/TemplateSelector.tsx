'use client';

import { usePlanAccess } from '@/hooks/usePlanAccess';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const { canUseTemplate } = usePlanAccess();
  
  const templates = [
    { name: 'Default', id: 'default', requiredPlan: 'FREE' },
    { name: 'Simple', id: 'simple', requiredPlan: 'FREE' },
    { name: 'Standard', id: 'standard', requiredPlan: 'ESSENTIALS' },
    { name: 'Compact', id: 'compact', requiredPlan: 'ESSENTIALS' }
  ];

  const getTemplatePreview = (templateId: string) => {
    switch (templateId) {
      case 'simple':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            <div className="border-t border-[#D0D5DD] pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
      case 'standard':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            <div className="border-t border-[#D0D5DD] pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
      case 'compact':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            <div className="border-t border-[#D0D5DD] pt-2 space-y-1">
              <div className="h-6 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="h-6 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="h-6 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">U</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            <div className="flex gap-8">
              <div className="space-y-1">
                <div className="h-1.5 bg-[#D0D5DD] rounded w-16"></div>
                <div className="h-1.5 bg-[#D0D5DD] rounded w-20"></div>
              </div>
            </div>
            <div className="border-t border-[#D0D5DD] pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-medium text-[16px] mb-4">Select Template</h3>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => {
          const isAvailable = canUseTemplate(template.id);
          const isLocked = !isAvailable;
          
          return (
            <div
              key={template.id}
              onClick={() => isAvailable && onTemplateChange(template.id)}
              className={`rounded-xl p-4 transition-all relative ${
                isLocked 
                  ? 'opacity-50 cursor-not-allowed border-2 border-[#E4E7EC] bg-gray-50'
                  : selectedTemplate === template.id
                    ? 'border-2 border-[#2F80ED] bg-[#F0F7FF] cursor-pointer'
                    : 'border-2 border-[#E4E7EC] bg-white hover:border-[#D0D5DD] cursor-pointer'
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V5C12 2.79086 10.2091 1 8 1C5.79086 1 4 2.79086 4 5V7M8 10V12M5 15H11C12.1046 15 13 14.1046 13 13V9C13 7.89543 12.1046 7 11 7H5C3.89543 7 3 7.89543 3 9V13C3 14.1046 3.89543 15 5 15Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              
              {getTemplatePreview(template.id)}
              
              <p className="text-[14px] font-semibold text-[#101828] mt-3 text-center">{template.name}</p>
              
              {isLocked && (
                <p className="text-[10px] text-gray-500 mt-1 text-center">
                  {template.requiredPlan === 'ESSENTIALS' ? 'Essentials+' : 'Premium'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
