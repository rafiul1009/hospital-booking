import { Nav } from '@/components/ui/nav';
import { ReactNode } from 'react';

export default function NonAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (<>
    <Nav />
    <div className="p-5">
      {children}
    </div>
  </>

  );
}