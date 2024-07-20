import { z } from 'zod';

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
