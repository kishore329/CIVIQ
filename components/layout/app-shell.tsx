"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export interface AppShellProps {
  children: React.ReactNode;
  activeItem?: string;
  onNavigate?: (id: string) => void;
  pageTitle?: string;
  pageDescription?: string;
}

export function AppShell({
  children,
  activeItem = "overview",
  onNavigate,
  pageTitle,
  pageDescription,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--text)] antialiased overflow-x-hidden">
      {/* Sidebar (Desktop sticky, Tablet collapsible, Mobile drawer) */}
      <Sidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeItem}
        onNavigate={onNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Topbar
          title={pageTitle}
          description={pageDescription}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
