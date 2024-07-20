import { z } from 'zod';
import { trimAndLowerCase } from 'src/utils';

export const signUpAuthSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .email({ message: 'El email debe ser válido' }),
  name: z
    .string({ message: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre no puede estar vacío' })
    .transform(trimAndLowerCase),
  lastName: z
    .string({ message: 'El apellido es requerido' })
    .nonempty({ message: 'El apellido no puede estar vacío' })
    .transform(trimAndLowerCase),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener mínimo 6 caracteres' }),
});

export type SignUpAuthDto = z.infer<typeof signUpAuthSchema>;
