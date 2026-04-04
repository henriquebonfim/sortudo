import React from "react";

export type InfographicType =
  | "Statistical"
  | "Timeline"
  | "Comparison"
  | "Hierarchical"
  | "Geographic"
  | "Informational"
  | "List"
  | "Process";

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  type: InfographicType;
  insight: string;
  note: string;
  component: React.ReactNode;
  className?: string;
}

export interface Chapter {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  lineClass: string;
  iconColorClass: string;
  sections: Section[];
}
