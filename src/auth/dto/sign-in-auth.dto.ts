import { z } from 'zod';

export const signInAuthSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .email({ message: 'El email debe ser válido' }),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener mínimo 6 caracteres' }),
});

export type SignInAuthDto = z.infer<typeof signInAuthSchema>;
