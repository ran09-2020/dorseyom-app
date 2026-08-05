import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div data-ev-id="ev_002c4f35c6" className="min-h-screen flex flex-col bg-forest-bg" dir="rtl">
      <Navbar />
      <main data-ev-id="ev_be098fbb33" className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>);

}