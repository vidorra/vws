import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Beheer - Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function DataBeheerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}