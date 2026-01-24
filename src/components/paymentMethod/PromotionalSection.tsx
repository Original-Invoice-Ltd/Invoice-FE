import React from 'react';
import Image from 'next/image';

const PromotionalSection: React.FC = () => {
  return (
<div className="mb-12 pt-[20px] ml-[30px]">
  <Image
    src="/assets/mainframe.svg"
    alt="Original Invoice"
    width={700}
    height={900}
    priority
  />
</div>
  );
};

export default PromotionalSection;
