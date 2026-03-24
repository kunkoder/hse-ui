import {
  AlertTriangle,
  ShieldAlert,
  Siren,
  Activity,
  Eye,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  ArrowDown,
  Minus,
  ArrowUp,
} from "lucide-react";

export const incidentTypes = [
  {
    value: "ACCIDENT",
    label: "Accident",
    icon: Siren,
  },
  {
    value: "INCIDENT",
    label: "Incident",
    icon: AlertTriangle,
  },
  {
    value: "NEAR_MISS",
    label: "Near Miss",
    icon: Eye,
  },
  {
    value: "UNSAFE_ACT",
    label: "Unsafe Act",
    icon: Activity,
  },
  {
    value: "UNSAFE_CONDITION",
    label: "Unsafe Condition",
    icon: ShieldAlert,
  },
  {
    value: "PROPERTY_DAMAGE",
    label: "Property Damage",
    icon: AlertTriangle,
  },
];

export const incidentStatuses = [
  {
    value: "OPEN",
    label: "Open",
    icon: Clock,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: PlayCircle,
  },
  {
    value: "RESOLVED",
    label: "Resolved",
    icon: CheckCircle2,
  },
  {
    value: "CLOSED",
    label: "Closed",
    icon: XCircle,
  },
];

export const incidentSeverities = [
  {
    value: "LOW",
    label: "Low",
    icon: ArrowDown,
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: Minus,
  },
  {
    value: "HIGH",
    label: "High",
    icon: ArrowUp,
  },
  {
    value: "CRITICAL",
    label: "Critical",
    icon: AlertTriangle,
  },
];