import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ message: 'El título es requerido' })
    .transform((value) => value.trim()),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
