"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { X, SlidersHorizontal } from "lucide-react";

import { MultiLiveSearch } from "../../../components/custom/multi-live-search";

import {
  useSearchWorkItemsQuery,
  useSearchEquipmentQuery,
  useSearchUsersQuery,
} from "@/store/api-slice";

import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface Complaint {
  subject: string;
  description: string;
  imagesBefore: string[];
  imagesAfter: string[];
  relatedReports: { code: string; title: string; datetime: string }[];
  relatedTasks: { code: string; title: string; datetime: string }[];
  relatedParts: { code: string; name: string; quantity: number }[];
  technicians: { empId: string; name: string }[];
  closeTime?: string;
  equipments: { code: string; name: string }[];
}

interface Props {
  complaint: Complaint;
}

export function EditComplaintCard({ complaint }: Props) {
  const [subject, setSubject] = useState(complaint.subject);
  const [description, setDescription] = useState(complaint.description);

  const [selectedReports, setSelectedReports] = useState(
    complaint.relatedReports.map((r) => r.code)
  );
  const [selectedTasks, setSelectedTasks] = useState(
    complaint.relatedTasks.map((t) => t.code)
  );
  const [selectedParts, setSelectedParts] = useState(
    complaint.relatedParts.map((p) => p.code)
  );
  const [selectedTechnicians, setSelectedTechnicians] = useState(
    complaint.technicians.map((t) => t.empId)
  );
  const [selectedEquipment, setSelectedEquipment] = useState(
    complaint.equipments.map((e) => e.code)
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-1" /> Edit Complaint
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Complaint</SheetTitle>
          <SheetDescription>Update fields and save changes.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 px-4">
          {/* Subject */}
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Related Reports */}
          <div>
            <MultiLiveSearch<{ code: string; title: string }>
              label="Related Reports"
              placeholder="Search reports..."
              rangeEnabled={false}
              queryHook={useSearchWorkItemsQuery}
              buildQuery={(q) => ({ search: q, type: "report" })}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.title}`}
              onChange={setSelectedReports}
            />
          </div>

          {/* Related Tasks */}
          <div>
            <MultiLiveSearch<{ code: string; title: string }>
              label="Related Tasks"
              placeholder="Search tasks..."
              rangeEnabled={false}
              queryHook={useSearchWorkItemsQuery}
              buildQuery={(q) => ({ search: q, type: "task" })}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.title}`}
              onChange={setSelectedTasks}
            />
          </div>

          {/* Parts Used */}
          <div>
            <MultiLiveSearch<{ code: string; name: string }>
              label="Parts Used"
              placeholder="Search parts..."
              rangeEnabled={false}
              queryHook={useSearchEquipmentQuery}
              buildQuery={(q) => q}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.name}`}
              onChange={setSelectedParts}
            />
          </div>

          {/* Equipment */}
          <div>
            <MultiLiveSearch<{ code: string; name: string }>
              label="Equipment"
              placeholder="Search equipment..."
              rangeEnabled={true}
              queryHook={useSearchEquipmentQuery}
              buildQuery={(q) => q}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.name}`}
              onChange={setSelectedEquipment}
            />
          </div>

          {/* Technicians */}
          <div>
            <MultiLiveSearch<{ empId: string; name: string }>
              label="Technicians"
              placeholder="Search technicians..."
              rangeEnabled={false}
              queryHook={useSearchUsersQuery}
              buildQuery={(q) => ({ search: q, department: "maintenance" })}
              getValue={(item) => item.empId}
              getLabel={(item) => `${item.empId} - ${item.name}`}
              onChange={setSelectedTechnicians}
            />
          </div>
        </div>

        <SheetFooter>
          <Button type="submit">Save Changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}