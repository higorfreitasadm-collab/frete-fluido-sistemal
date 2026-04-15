import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopbar } from '@/components/AppTopbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      <AppSidebar collapsed={!sidebarOpen} />
      <div className={`flex-1 flex flex-col transition-[margin-left] duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <AppTopbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
