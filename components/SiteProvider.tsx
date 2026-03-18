'use client';

import { createContext, useContext } from 'react';
import type { SiteConfig } from '@/lib/site-config';

const SiteContext = createContext<SiteConfig | null>(null);

export function SiteProvider({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={config}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteConfig {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
