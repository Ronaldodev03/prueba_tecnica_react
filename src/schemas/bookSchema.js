import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(100, "El título es demasiado largo"),
});
