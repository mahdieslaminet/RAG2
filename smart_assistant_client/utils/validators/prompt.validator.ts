import * as z from "zod";

export const promptFormSchema = z.object({
  question: z.string().trim().optional().or(z.literal("")),
});

export type promptFormSchemaType = z.infer<typeof promptFormSchema>;
