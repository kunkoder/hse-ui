import { z } from "zod";

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  createdBy: z.object({
    empId: z.string(),
    name: z.string(),
  }),
});