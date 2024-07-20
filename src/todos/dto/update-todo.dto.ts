import { z } from 'zod';

export const updateTodoSchema = z.object({
  id: z.string({ message: 'El id es requerido' }),
  title: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
