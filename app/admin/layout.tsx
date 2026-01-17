'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const pathname = usePathname();
  
  // Don't show AdminHeader on login page or when not authenticated
  const isLoginPage = pathname === '/admin';
  const showAdminHeader = isAuthenticated && !isLoginPage && !isLoading;

  // Hide client header and footer when admin layout mounts
  useEffect(() => {
    // Add class to body to hide client elements
    document.body.classList.add('admin-page');
    
    // Directly hide header and footer elements
    const header = document.querySelector('body > div > header');
    const footer = document.querySelector('body > div > footer');
    const mainContent = document.querySelector('body > div > main');
    
    if (header) (header as HTMLElement).style.display = 'none';
    if (footer) (footer as HTMLElement).style.display = 'none';
    if (mainContent) (mainContent as HTMLElement).style.minHeight = '100vh';

    return () => {
      document.body.classList.remove('admin-page');
      if (header) (header as HTMLElement).style.display = '';
      if (footer) (footer as HTMLElement).style.display = '';
      if (mainContent) (mainContent as HTMLElement).style.minHeight = '';
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Hide client header and footer in admin pages */
        body.admin-page > div > header,
        body.admin-page > div > footer {
          display: none !important;
        }
        body.admin-page > div > main {
          min-height: 100vh !important;
        }
      `}</style>
      <div className="min-h-screen bg-[#F9F8F6]">
        {showAdminHeader && <AdminHeader />}
        {children}
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
