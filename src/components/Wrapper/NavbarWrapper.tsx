import { ReactNode } from 'react';
import { AppSidebar } from '../Navbar/app-sidebar';
import { SidebarProvider } from '../ui/sidebar';

interface NavbarWrapperProps {
  children: ReactNode;
}

function NavbarWrapper({ children }: NavbarWrapperProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">{children}</div>
      </SidebarProvider>
    </>
  );
}

export default NavbarWrapper;
