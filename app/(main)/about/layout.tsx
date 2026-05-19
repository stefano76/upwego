import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata('/about');

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
