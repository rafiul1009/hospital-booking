import AuthProvider from '@/components/auth/AuthProvider';
import { Nav } from '@/components/ui/nav';
import { ReactNode } from 'react';

export default function NonAuthLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <AuthProvider>
      <Nav />
      <div className="p-5">
        {children}
      </div>
    </AuthProvider>
  );
}