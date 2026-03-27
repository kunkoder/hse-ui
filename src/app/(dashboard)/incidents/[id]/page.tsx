"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Download, Eye, FileText, MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { EditSheet } from "./components/edit-sheet";

import {
  categories,
  statuses,
  severities,
} from "@/types/incident"

// Incident data constant - matches EditSheet props structure
const incident = {
  id: "INC-1001",
  code: "INC-1001",
  category: "ACCIDENT",
  severity: "HIGH",
  status: "REPORTED",
  reportedAt: "2026-03-20T10:30:00Z",
  description: "Worker slipped on wet floor in production area and sustained minor injury.",
  area: { code: "AREA-01", name: "Production Area" },
  reportedBy: { empId: "EMP-001", name: "John Doe" },
  involvedPeople: [
    { empId: "EMP-010", name: "Ahmad Ali" },
    { empId: "EMP-011", name: "Ali Khan" },
    { empId: "EMP-012", name: "Fatima Noor" },
  ],
  witnesses: [
    { empId: "EMP-020", name: "Sarah Khan" },
    { empId: "EMP-021", name: "Ali Rehman" },
    { empId: "EMP-022", name: "Nadia Ahmed" },
  ],
  immediateAction: "Create a comprehensive safety guide for the workplace, focusing on updated safety protocols, regulations, and best practices for 2024. The guide should cover essential topics such as emergency procedures, hazard identification, employee training, and equipment safety. Ensure the content is clear, practical, and accessible to all employees. Include visual aids, checklists, and real-life examples to enhance understanding and compliance.",
  correctiveAction: "Create a comprehensive safety guide for the workplace, focusing on updated safety protocols, regulations, and best practices for 2024. The guide should cover essential topics such as emergency procedures, hazard identification, employee training, and equipment safety. Ensure the content is clear, practical, and accessible to all employees. Include visual aids, checklists, and real-life examples to enhance understanding and compliance.",
  medicalAttentionRequired: true,
  createdAt: "2026-03-20T11:00:00Z",
  updatedAt: "2026-03-21T09:00:00Z",
  updatedBy: { empId: "EMP-005", name: "Supervisor A" },
  attachments: [
    {
      id: "FILE-001",
      fileName: "1248371294812.pdf",
      filePath: "/files/1248371294812.pdf",
      fileType: "DOCUMENT" as const,
      uploadedAt: new Date("2026-03-20T11:30:00Z"),
    },
    {
      id: "FILE-002",
      fileName: "incident_report_draft.docx",
      filePath: "/files/incident_report_draft.docx",
      fileType: "DOCUMENT" as const,
      uploadedAt: new Date("2026-03-20T12:00:00Z"),
    },
    {
      id: "FILE-003",
      fileName: "safety_checklist.pdf",
      filePath: "/files/safety_checklist.pdf",
      fileType: "DOCUMENT" as const,
      uploadedAt: new Date("2026-03-20T12:15:00Z"),
    },
  ],
  images: [
    {
      id: "FILE-004",
      fileName: "dashboard-dark.png",
      filePath: "/dashboard-dark.png",
      fileType: "IMAGE" as const,
      uploadedAt: new Date("2026-03-20T10:35:00Z"),
    },
    {
      id: "FILE-005",
      fileName: "dashboard-light.png",
      filePath: "/dashboard-light.png",
      fileType: "IMAGE" as const,
      uploadedAt: new Date("2026-03-20T10:36:00Z"),
    },
    {
      id: "FILE-006",
      fileName: "dashboard.png",
      filePath: "/dashboard.png",
      fileType: "IMAGE" as const,
      uploadedAt: new Date("2026-03-20T10:37:00Z"),
    },
    {
      id: "FILE-007",
      fileName: "favicon-dark.png",
      filePath: "/favicon-dark.png",
      fileType: "IMAGE" as const,
      uploadedAt: new Date("2026-03-20T10:38:00Z"),
    },
  ],
};

const categoryConfig = categories.find((c) => c.value === incident.category)
const severityConfig = severities.find((s) => s.value === incident.severity)
const statusConfig = statuses.find((s) => s.value === incident.status)

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (isoString: string) => {
    if (!isClient) return "";
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground">
          A powerful incident reporting and tracking system.
        </p>
      </div>
      <div className="flex flex-1 flex-col space-y-6 px-4 md:px-6">
        <Card>
          <CardContent className="space-y-6 px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-6">
              {/* Header: Code + Medical Alert */}
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-foreground text-2xl font-semibold">{incident.code}</h1>
                {incident.medicalAttentionRequired && (
                  <div className="flex items-center text-sm font-medium text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Medical attention required
                  </div>
                )}
              </div>

              {/* Created timestamp */}
              <p className="text-sm text-muted-foreground">
                Created on {formatDate(incident.createdAt)}
              </p>

              <div className="flex flex-wrap gap-2">
                {/* Category */}
                {categoryConfig && (
                  <Badge variant="outline" className="gap-1 bg-gray-100 text-gray-700 border-gray-300">
                    <categoryConfig.icon className="h-4 w-4" />
                    {categoryConfig.label}
                  </Badge>
                )}

                {/* Severity */}
                {severityConfig && (
                  <Badge variant="outline" className={severityConfig.color}>
                    {severityConfig.label} Severity
                  </Badge>
                )}

                {/* Status */}
                {statusConfig && (
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
              <Separator />

              {/* Two-column info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-foreground">Area:</span>{" "}
                    {incident.area?.name} ({incident.area?.code})
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Reported By:</span>{" "}
                    {incident.reportedBy?.name} ({incident.reportedBy?.empId})
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Report Time:</span>{" "}
                    {formatDate(incident.reportedAt)}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {/* Involved People */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Involved People</h4>
                    <div className="flex flex-wrap gap-2">
                      {incident.involvedPeople?.map((person) => (
                        <Badge
                          key={person.empId}
                          variant="outline"
                          className="gap-1 bg-gray-100 text-gray-700 border-gray-300"
                        >
                          {person.name} ({person.empId})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Witnesses */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Witnesses</h4>
                    <div className="flex flex-wrap gap-2">
                      {incident.witnesses?.map((person) => (
                        <Badge
                          key={person.empId}
                          variant="outline"
                          className="gap-1 bg-gray-100 text-gray-700 border-gray-300"
                        >
                          {person.name} ({person.empId})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Description</h3>
                <div className="bg-card rounded-lg border px-3 py-2">
                  <div className="border-l-4 border-gray-300 pl-4">
                    <p className="text-foreground text-sm leading-relaxed">
                      {incident.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images */}
              {incident.images?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-medium">Images</h3>
                  <Carousel className="w-full h-60 relative">
                    <CarouselContent>
                      {incident.images.map((file) => (
                        <CarouselItem
                          key={file.id}
                          className="basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <div className="relative w-full h-60">
                            <Image
                              src={file.filePath}
                              alt={file.fileName}
                              fill
                              className="object-cover rounded-md cursor-pointer"
                              onClick={() => setSelectedImage(file.filePath)}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md" />
                  </Carousel>
                </div>
              )}

              {/* Attachments */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Attachments</h3>
                <div className="grid grid-cols-1 gap-3">
                  {incident.attachments?.map((file) => (
                    <div key={file.id} className="bg-card rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <FileText className="h-4 w-4 text-gray-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.fileName}</p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(file.uploadedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={file.filePath} download={file.fileName}>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Action */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Immediate Action</h3>
                <div className="bg-card rounded-lg border px-3 py-2">
                  <div className="border-l-4 border-gray-300 pl-4">
                    <p className="text-foreground text-sm leading-relaxed">
                      {incident.immediateAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Corrective Action */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Corrective Action</h3>
                <div className="bg-card rounded-lg border px-3 py-2">
                  <div className="border-l-4 border-gray-300 pl-4">
                    <p className="text-foreground text-sm leading-relaxed">
                      {incident.correctiveAction}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Footer: Updated info + Actions */}
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  Last updated by {incident.updatedBy?.name} ({incident.updatedBy?.empId}) on {formatDate(incident.updatedAt)}
                </div>
                <div className="flex gap-2">
                  {/* Pass incident data as prop to EditSheet */}
                  <EditSheet incident={incident} />
                  <Button variant="destructive" className="cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-5xl w-full h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Zoomed"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}