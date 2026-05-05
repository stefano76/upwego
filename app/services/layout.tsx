import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata('/services');

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
