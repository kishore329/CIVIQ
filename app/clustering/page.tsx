"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { ClusteringPipelineHero } from "@/features/clustering/clustering-pipeline-hero";
import { ClusterFilterBar } from "@/features/clustering/cluster-filter-bar";
import { ClustersGrid } from "@/features/clustering/clusters-grid";
import {
  getClusteringPipelineStats,
  getAllClusters,
  filterClusters,
} from "@/lib/clustering/engine";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, CheckSquare, Layers, Radio, Network } from "lucide-react";

export default function ClusteringPage() {
  const router = useRouter();
  const stats = getClusteringPipelineStats();
  const allClusters = getAllClusters();

  // Filters state
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("all");
  const [category, setCategory] = useState("all");
  const [priorityOnly, setPriorityOnly] = useState(true);

  const filteredClusters = useMemo(() => {
    return filterClusters(allClusters, {
      search,
      ward,
      category,
      priorityOnly,
    });
  }, [allClusters, search, ward, category, priorityOnly]);

  const handleResetFilters = () => {
    setSearch("");
    setWard("all");
    setCategory("all");
    setPriorityOnly(true);
  };

  return (
    <AppShell
      pageTitle="Issue Clustering"
      pageDescription="Synthesizing 5,284 citizen signals into 127 infrastructure issues and 23 high-priority clusters."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Issue Clustering & Intelligence Pipeline"
          description="Transforming 5,284 multi-dialect citizen signals into 127 localized infrastructure issues and 23 high-priority clusters."
          badge={<DemoDataBadge label="DEMO DATA" />}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => router.push("/signals")}
              >
                <Radio className="w-3.5 h-3.5 text-[var(--primary)]" />
                Ingest New Signal
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => router.push("/priorities")}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Priority Projects (18)
              </Button>
            </div>
          }
        />

        {/* 5-Stage Interactive Intelligence Pipeline Hero */}
        <ClusteringPipelineHero stats={stats} />

        {/* Filter Controls */}
        <ClusterFilterBar
          search={search}
          onSearchChange={setSearch}
          ward={ward}
          onWardChange={setWard}
          category={category}
          onCategoryChange={setCategory}
          priorityOnly={priorityOnly}
          onPriorityOnlyToggle={() => setPriorityOnly((prev) => !prev)}
          onReset={handleResetFilters}
          totalFiltered={filteredClusters.length}
          totalClusters={allClusters.length}
        />

        {/* Clusters Grid */}
        <ClustersGrid
          clusters={filteredClusters}
          onNavigateToProjects={() => router.push("/priorities")}
        />
      </div>
    </AppShell>
  );
}
