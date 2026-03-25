import {
  AlertTriangle,
  ShieldAlert,
  Siren,
  UserX,
  Hammer,
  Eye,
  CircleDot,
  BadgeCheck,
  Search,
  CheckCheck,
} from "lucide-react";

export const categories = [
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
    icon: UserX,
  },
  {
    value: "UNSAFE_CONDITION",
    label: "Unsafe Condition",
    icon: ShieldAlert,
  },
  {
    value: "PROPERTY_DAMAGE",
    label: "Property Damage",
    icon: Hammer,
  },
];

export const statuses = [
  {
    value: "REPORTED",
    label: "Reported",
    icon: CircleDot,
  },
  {
    value: "UNDER_INVESTIGATION",
    label: "Under Investigation",
    icon: Search,
  },
  {
    value: "RESOLVED",
    label: "Resolved",
    icon: CheckCheck,
  },
  {
    value: "CLOSED",
    label: "Closed",
    icon: BadgeCheck,
  },
];

export const severities = [
  {
    value: "LOW",
    label: "Low",
    color:
      "text-green-600 border-green-500",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color:
      "text-yellow-600 border-yellow-500",
  },
  {
    value: "HIGH",
    label: "High",
    color: "text-orange-600 border-orange-500",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    color: "text-red-600 border-red-600",
  },
];