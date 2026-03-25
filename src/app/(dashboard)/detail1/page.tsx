"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Download, Eye, FileText, MoreHorizontal } from "lucide-react";

import * as React from "react";
import { useState } from "react";
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

import { EditComplaintCard } from "./edit-complaint-card";

// Dummy data
const complaint = {
  subject: "Motor Overheating",
  reportDate: new Date().toISOString(),
  closeDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  priority: "High",
  equipmentCodes: ["EQ-123", "EQ-456"],
  equipmentRange: "AQPCK-1023/1-3",
  areaCode: "Area-51",
  category: "Mechanical",
  reporterName: "John Doe",
  assigneeName: "Jane Smith",
  description: `The motor began overheating during extended operation, causing unexpected shutdowns. Immediate inspection is required.`,
  imagesBefore: [
    "/dashboard-dark.png",
    "/dashboard-light.png",
    "/dashboard.png",
    "/favicon-dark.png",
  ],
  imagesAfter: [
    "/dashboard-dark.png",
    "/dashboard-light.png",
    "/dashboard.png",
    "/favicon-dark.png",
  ],
  relatedReports: [
    {
      code: "RPT-101",
      title: "Voltage Check",
      desc: "Checked voltage levels",
      datetime: "2026-03-21T10:00",
    },
    {
      code: "RPT-102",
      title: "Thermal Scan",
      desc: "Scan for overheating zones",
      datetime: "2026-03-21T12:00",
    },
  ],
  relatedTasks: [
    {
      code: "TSK-201",
      title: "Cooling Fan Replacement",
      desc: "Replace faulty cooling fan",
      datetime: "2026-03-21T13:00",
    },
    {
      code: "TSK-202",
      title: "Motor Lubrication",
      desc: "Lubricate motor bearings",
      datetime: "2026-03-21T14:00",
    },
  ],
  relatedParts: [
    { code: "PRT-501", name: "Fan Blade", quantity: 2 },
    { code: "PRT-502", name: "Lubricant Oil", quantity: 1 },
  ],
  technicians: [
    { empId: "EMP-01", name: "Alice" },
    { empId: "EMP-02", name: "Bob" },
  ],
  equipments: [
    { code: "EQ-123", name: "Pump Motor" },
    { code: "EQ-456", name: "Cooling Fan" },
  ]
};


export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const priorityColors: Record<string, string> = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-yellow-50 text-yellow-700",
    Low: "bg-green-50 text-green-700",
  };

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Complaint Preview</h1>

      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {complaint.subject}
            <span
              className={`px-2 py-0.5 text-xs rounded ${priorityColors[complaint.priority] ||
                "bg-muted text-muted-foreground"
                }`}
            >
              {complaint.priority}
            </span>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Reported on{" "}
            {new Date(complaint.reportDate).toLocaleString()} | Closed on{" "}
            {new Date(complaint.closeDate).toLocaleString()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Equipment */}
          {(complaint.equipmentCodes?.length ||
            complaint.equipmentRange) && (
              <div>
                <h4 className="text-sm font-medium mb-1">Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {complaint.equipmentCodes?.map((code) => {
                    const eq = complaint.equipments.find((e) => e.code === code);
                    return (
                      <Badge
                        key={code}
                        variant="outline"
                        className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs"
                      >
                        {eq ? `${eq.name} (${eq.code})` : code}
                      </Badge>
                    );
                  })}
                  {complaint.equipmentRange && (
                    <Badge
                      variant="outline"
                      className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    >
                      {complaint.equipmentRange}
                    </Badge>
                  )}
                </div>
              </div>
            )}

          {/* Area & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {complaint.areaCode && (
              <div>
                <span className="font-medium">Area:</span>{" "}
                {complaint.areaCode}
              </div>
            )}
            {complaint.category && (
              <div>
                <span className="font-medium">Category:</span>{" "}
                {complaint.category}
              </div>
            )}
          </div>

          {/* Reporter & Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Reporter:</span>{" "}
              {complaint.reporterName}
            </div>
            {complaint.assigneeName && (
              <div>
                <span className="font-medium">Assignee:</span>{" "}
                {complaint.assigneeName}
              </div>
            )}
          </div>

          {/* ✅ Technicians (moved here) */}
          <div>
            <h4 className="text-sm font-medium mb-2">Technicians</h4>
            <div className="flex flex-wrap gap-2">
              {complaint.technicians.map((t) => (
                <Badge
                  key={t.empId}
                  variant="outline"
                  className="gap-1 bg-purple-50 text-purple-700 border-purple-200 text-xs"
                >
                  {t.name} ({t.empId})
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium mb-1">Description</h4>
            <p className="whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Images */}
          {["Before", "After"].map((type) => {
            const images =
              type === "Before"
                ? complaint.imagesBefore
                : complaint.imagesAfter;
            return (
              <div key={type}>
                <h4 className="text-sm font-medium mb-2">
                  Images {type}
                </h4>
                <Carousel className="w-full h-60 relative">
                  <CarouselContent>
                    {images.map((src, idx) => (
                      <CarouselItem key={idx}>
                        <div className="relative w-full h-60">
                          <Image
                            src={src}
                            alt={`${type} ${idx}`}
                            fill
                            className="object-cover rounded-md cursor-pointer"
                            onClick={() =>
                              setSelectedImage(src)
                            }
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md" />
                </Carousel>
              </div>
            );
          })}

          {/* Reports Table */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Related Reports
            </h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 w-[120px]">Code</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2 w-[180px]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaint.relatedReports.map((r) => (
                    <tr key={r.code} className="border-t hover:bg-muted/50">
                      <td className="p-2">{r.code}</td>
                      <td className="p-2">{r.title}</td>
                      <td className="p-2 text-muted-foreground">
                        {new Date(r.datetime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tasks Table */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Related Tasks
            </h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 w-[120px]">Code</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2 w-[180px]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaint.relatedTasks.map((t) => (
                    <tr key={t.code} className="border-t hover:bg-muted/50">
                      <td className="p-2">{t.code}</td>
                      <td className="p-2">{t.title}</td>
                      <td className="p-2 text-muted-foreground">
                        {new Date(t.datetime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parts Table */}
          <div>
            <h4 className="text-sm font-medium mb-2">Parts Used</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 w-[120px]">Code</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2 w-[80px]">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {complaint.relatedParts.map((p) => (
                    <tr key={p.code} className="border-t hover:bg-muted/50">
                      <td className="p-2">{p.code}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

            {/* Task Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Assignees */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-medium">Assignee:</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-card flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/professional-man.jpg" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">Raden Sam Pitak</span>
                    </div>
                    <div className="bg-card flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/professional-man-glasses.png" />
                        <AvatarFallback>JK</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">James Kokoklomel</span>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-medium">Date</h3>
                  <div className="bg-card flex w-fit items-center gap-2 rounded-lg border px-3 py-2">
                    <CalendarDays className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">May 18, 2024 - May 26, 2024</span>
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-medium">Priority</h3>
                  <Badge variant="secondary" className="w-fit border-blue-200 bg-blue-50 text-blue-700">
                    Low
                  </Badge>
                </div>
              </div>

              {/* Right Column - Attachments */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Attachment</h3>
                <div className="grid gap-3">
                  {/* Attachment 1 */}
                  <div className="bg-card rounded-lg border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                          <FileText className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">1248371294812.pdf</p>
                          <p className="text-muted-foreground text-xs">20 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Attachment 2 */}
                  <div className="bg-card rounded-lg border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                          <FileText className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">guideline fix_2024.pdf</p>
                          <p className="text-muted-foreground text-xs">101 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Attachment 3 */}
                  <div className="bg-card rounded-lg border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                          <FileText className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">21412981364.pdf</p>
                          <p className="text-muted-foreground text-xs">82 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-muted-foreground text-sm font-medium">Description</h3>
              <div className="bg-card rounded-lg border px-3 py-2">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-foreground text-sm leading-relaxed">
                    Create a comprehensive safety guide for the workplace, focusing on updated safety
                    protocols, regulations, and best practices for 2024. The guide should cover
                    essential topics such as emergency procedures, hazard identification, employee
                    training, and equipment safety. Ensure the content is clear, practical, and
                    accessible to all employees. Include visual aids, checklists, and real-life examples
                    to enhance understanding and compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <h2 className="text-lg font-semibold">Phase 1</h2>
              </div>

              <Card className="p-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-muted-foreground text-sm">
                    The guide should be aligned with current industry standards and legal requirements,
                    promoting a safe and healthy work environment for everyone.
                  </p>
                </div>
              </Card>

              {/* Task Progress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <h3 className="font-medium">Task - Phase 1</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">3/4</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-8 rounded-full bg-green-500"></div>
                      <div className="h-2 w-8 rounded-full bg-green-500"></div>
                      <div className="h-2 w-8 rounded-full bg-green-500"></div>
                      <div className="bg-muted h-2 w-8 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  {/* Completed Tasks */}
                  <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox checked disabled />
                    <span className="text-muted-foreground text-sm line-through">
                      Update Safety Protocols
                    </span>
                    <div className="ml-auto">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox checked disabled />
                    <span className="text-muted-foreground text-sm line-through">
                      Develop Clear Emergency Procedures
                    </span>
                    <div className="ml-auto">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox checked disabled />
                    <span className="text-muted-foreground text-sm line-through">
                      Create Employee Training Modules
                    </span>
                    <div className="ml-auto">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Pending Task */}
                  <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox />
                    <span className="text-sm font-medium">Include Visuals and Checklists</span>
                    <div className="ml-auto">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
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

      <EditComplaintCard complaint={complaint} />
    </main>
  );
}




