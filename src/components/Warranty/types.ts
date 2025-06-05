
export type PriorityLevel = "low" | "medium" | "high" | "critical";
export type ProblemStatus = "open" | "in_progress" | "pending" | "resolved" | "canceled";
export type ClientWarrantyStatus = "pending" | "progress" | "complete" | "critical";

export interface WarrantyProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: PriorityLevel;
  status: ProblemStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  materials?: string[];
  notes?: string[];
  images?: string[];
}

export interface WarrantyAction {
  id: string;
  problemId: string;
  description: string;
  performedBy: string;
  timeSpent: number; // in minutes
  materialsUsed: string[];
  createdAt: Date;
  images?: string[];
}

export interface ClientWarrantyDisplay {
  id: string;
  title: string;
  description: string;
  property: string;
  unit: string;
  createdAt: Date;
  status: ClientWarrantyStatus;
  category?: string;
  priority?: string;
  estimatedResolutionTime?: number;
  satisfactionRating?: number;
  isUrgent?: boolean;
  client?: string;
}
