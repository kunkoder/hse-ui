import { z } from "zod";

export const fileSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  fileType: z.enum(["IMAGE", "DOCUMENT"]),
  uploadedAt: z.coerce.date(),
});