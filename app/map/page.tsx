"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { MapPreviewSection } from "@/features/dashboard/map-preview-section";
import { DevelopmentIntelligenceSection } from "@/features/dashboard/development-intelligence-section";

export default function MapPage() {
  return (
    <AppShell
      pageTitle="Development Map"
      pageDescription="Explore geographic patterns in citizen demand, infrastructure gaps and development priorities."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Development Map"
          description="Explore geographic patterns in citizen demand, infrastructure gaps and development priorities."
          badge={<DemoDataBadge label="DEMO DATA" />}
        />

        {/* Primary Geographic Intelligence */}
        <DevelopmentIntelligenceSection />

        {/* GIS Simulation Frame */}
        <MapPreviewSection />
      </div>
    </AppShell>
  );
}
