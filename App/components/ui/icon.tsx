'use client';

import { LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

interface IconProps {
  icon: LucideIcon;
  className?: string;
}

const Icon = ({ icon: Icon, className }: IconProps) => {
  return <Icon className={className} />;
};

// Export as a dynamic component with no SSR
export default dynamic(() => Promise.resolve(Icon), {
  ssr: false,
}); 