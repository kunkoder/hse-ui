import { z } from "zod";
import { employeeSchema } from "./employee-schema";
import { fileSchema } from "./file-schema";
import { commentSchema } from "./comment-schema";

const imageSchema = fileSchema.extend({
  fileType: z.literal("IMAGE"),
});

const attachmentSchema = fileSchema.extend({
  fileType: z.literal("DOCUMENT"),
});

export const incidentSchema = z.object({
  id: z.string(),
  code: z.string(),

  type: z.string(),
  severity: z.string(),
  status: z.string(),

  reportDate: z.coerce.date(),
  description: z.string(),

  area: z
    .object({
      code: z.string(),
      name: z.string(),
    })
    .optional(),

  reportedBy: z
    .object({
      empId: z.string(),
      name: z.string(),
    })
    .optional(),

  involvedPeople: z.array(employeeSchema).optional(),
  witnesses: z.array(employeeSchema).optional(),

  immediateAction: z.string().optional(),
  correctiveAction: z.string().optional(),
  medicalAttentionRequired: z.boolean().default(false),

  images: z.array(imageSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  comments: z.array(commentSchema).optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),

  updatedBy: z
    .object({
      empId: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type Incident = z.infer<typeof incidentSchema>;
export type InvolvedPeople = z.infer<typeof employeeSchema>;
export type Witnesses = z.infer<typeof employeeSchema>;
export type IncidentImages = z.infer<typeof imageSchema>;
export type IncidentAttachments = z.infer<typeof attachmentSchema>;
export type IncidentComments = z.infer<typeof commentSchema>;