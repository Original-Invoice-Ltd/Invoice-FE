'use client';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { name: 'Simple', id: 'simple' },
    { name: 'Standard', id: 'standard' },
    { name: 'Compact', id: 'compact' },
    { name: 'Default', id: 'default' }
  ];

  const getTemplatePreview = (templateId: string) => {
    switch (templateId) {
      case 'simple':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            {/* Info lines */}
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            {/* Table */}
            <div className="border-t border-[#D0D5DD] pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
      case 'standard':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            {/* Info lines */}
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            {/* Table */}
            <div className="border-t border-[#D0D5DD] pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
              <div className="flex-1 h-8 bg-white rounded border border-[#E4E7EC]"></div>
            </div>
          </div>
        );
      case 'compact':
        return (
          <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8ECFF] rounded-lg p-4 h-40 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">Logo</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            {/* Info lines */}
            <div className="space-y-1">
              <div className="h-1.5 bg-[#D0D5DD] rounded w-20 ml-auto"></div>
              <div className="h-1.5 bg-[#D0D5DD] rounded w-16 ml-auto"></div>
            </div>
            {/* Single column table */}
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
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#D4E0FF] rounded-full flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#667085]">U</span>
              </div>
              <span className="text-[14px] font-bold text-[#101828]">INV</span>
            </div>
            {/* Info lines - two columns */}
            <div className="flex gap-8">
              <div className="space-y-1">
                <div className="h-1.5 bg-[#D0D5DD] rounded w-16"></div>
                <div className="h-1.5 bg-[#D0D5DD] rounded w-20"></div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#D0D5DD] rounded w-16"></div>
                <div className="h-1.5 bg-[#D0D5DD] rounded w-20"></div>
              </div>
            </div>
            {/* Table */}
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
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`rounded-xl p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-2 border-[#2F80ED] bg-[#F0F7FF]'
                : 'border-2 border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
            }`}
          >
            {/* Template Preview */}
            {getTemplatePreview(template.id)}
            {/* Template Name */}
            <p className="text-[14px] font-semibold text-[#101828] mt-3 text-center">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
