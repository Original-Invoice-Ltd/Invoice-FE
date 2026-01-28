'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface CTAButtonProps {
  text: string;
  signUpHref?: string;
  dashboardHref?: string;
  className?: string;
}

export default function CTAButton({ 
  text, 
  signUpHref = '/signUp', 
  dashboardHref = '/dashboard/invoices/create',
  className = "bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] flex items-center justify-center cursor-pointer"
}: CTAButtonProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link href={signUpHref} className={className}>
        {text}
      </Link>
    );
  }

  return (
    <Link href={dashboardHref} className={className}>
      {text}
    </Link>
  );
}