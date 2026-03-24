import { z } from "zod";

export const employeeSchema = z.object({
  empId: z.string(),
  name: z.string(),
});