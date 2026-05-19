import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata('/cookies');

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
