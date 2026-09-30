import { AIInsight } from "@/types/civic";

export const DEMO_AI_INSIGHTS: AIInsight[] = [
  {
    id: "insight-01",
    title: "Critical Drainage Cluster in Ward 17",
    summary:
      "Drainage-related citizen signals have formed a concentrated cluster around Ward 17. The area also shows a high infrastructure gap and relatively low existing investment coverage.",
    relatedWard: "Ward 17",
    evidence: {
      reportCount: 327,
      infrastructureGap: 82,
      investmentCoverage: 31,
    },
    type: "Cluster Anomaly & Infrastructure Gap",
    confidence: 0.94,
    groundingSources: [
      "Citizen SMS & Grievance Stream (327 reports)",
      "Municipal Stormwater Blueprint v2.1",
      "Ward 17 Public Works Capital Audit (FY25-26)",
    ],
  },
  {
    id: "insight-02",
    title: "Healthcare Transit Gap in Ward 12",
    summary:
      "Correlating elderly population density with road degradation highlights severe physical accessibility barriers to Ward 12 Primary Health Center.",
    relatedWard: "Ward 12",
    evidence: {
      reportCount: 183,
      infrastructureGap: 71,
      investmentCoverage: 38,
    },
    type: "Demographic Vulnerability",
    confidence: 0.89,
    groundingSources: [
      "Community Grievance Ingestion (183 reports)",
      "Constituency Senior Citizen Census Index",
      "Transit Feeder Reliability Dataset",
    ],
  },
];
