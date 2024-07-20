import { trimAndLowerCase } from 'src/utils';
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ message: 'El título es requerido' })
    .transform(trimAndLowerCase),
  userId: z.string({ message: 'El id del usuario es requerido' }),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
