"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Download, Eye, FileText, MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";

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

import { EditSheet } from "./edit-sheet";

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
              <div className="flex justify-between items-center mb-1">
                {/* Left: Incident ID and status badges */}
                <h1 className="text-foreground text-2xl font-semibold">INC-1001</h1>


                <div className="flex items-center text-sm font-medium text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Medical attention required
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Created on 3/26/2026, 11:16:51 AM
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="border-red-200 bg-red-50 text-red-700"
                >
                  Unsafe Condition
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-yellow-200 bg-yellow-50 text-yellow-700"
                >
                  Low Severity
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  Reported
                </Badge>

              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">

                {/* Left Column */}
                <div className="space-y-3">
                  {/* Area */}
                  <div>
                    <span className="font-medium">Area:</span>{" "}
                    Production Area (AREA-01)
                  </div>

                  {/* Reporter */}
                  <div>
                    <span className="font-medium">Reported By:</span>{" "}
                    John Doe (EMP-001)
                  </div>

                  {/* Report Time */}
                  <div>
                    <span className="font-medium">Report Time:</span>{" "}
                    3/20/2026, 10:30:00
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {/* Involved People */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Involved People</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="gap-1 bg-purple-50 text-purple-700 border-purple-200 text-xs"
                      >
                        Ahmad Ali (EMP-010)
                      </Badge>
                      <Badge
                        variant="outline"
                        className="gap-1 bg-purple-50 text-purple-700 border-purple-200 text-xs"
                      >
                        Ali Khan (EMP-011)
                      </Badge>
                      <Badge
                        variant="outline"
                        className="gap-1 bg-purple-50 text-purple-700 border-purple-200 text-xs"
                      >
                        Fatima Noor (EMP-012)
                      </Badge>
                    </div>
                  </div>

                  {/* Witnesses */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Witnesses</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                      >
                        Sarah Khan (EMP-020)
                      </Badge>
                      <Badge
                        variant="outline"
                        className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                      >
                        Ali Rehman (EMP-021)
                      </Badge>
                      <Badge
                        variant="outline"
                        className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                      >
                        Nadia Ahmed (EMP-022)
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

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

              {/* Before Images */}
              {complaint.imagesBefore?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-medium">Images</h3>
                  <Carousel className="w-full h-60 relative">
                    <CarouselContent>
                      {complaint.imagesBefore.map((src, idx) => (
                        <CarouselItem
                          key={idx}
                          className="basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <div className="relative w-full h-60">
                            <Image
                              src={src}
                              alt={`Before ${idx}`}
                              fill
                              className="object-cover rounded-md cursor-pointer"
                              onClick={() => setSelectedImage(src)}
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

              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Attachments</h3>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-3">
                  {/* Attachment 1 */}
                  <div className="bg-card rounded-lg border p-4">
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
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Attachment 2 */}
                  <div className="bg-card rounded-lg border p-4">
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
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Attachment 3 */}
                  <div className="bg-card rounded-lg border p-4">
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
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Immediate Action</h3>
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

              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">Corrective Action</h3>
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


              <Separator className="my-4" />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                {/* Left: Last updated info */}
                <div>
                  Last updated by Supervisor A (EMP-005) on 3/21/2026, 09:00:00
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <EditSheet />
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




