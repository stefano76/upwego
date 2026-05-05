import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata('/process');

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
