import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodosService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService,
  ) {}

  create(createTodoDto: CreateTodoDto, userId: string) {
    return this.prisma.todo.create({
      data: {
        ...createTodoDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`No se encontró la tarea con el id ${id}`);
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string) {
    const todo = await this.findOne(id, userId);

    return this.prisma.todo.update({
      where: { id: todo.id },
      data: updateTodoDto,
    });
  }

  async remove(id: string, userId: string) {
    const todo = await this.findOne(id, userId);

    return this.prisma.todo.delete({
      where: { id: todo.id },
    });
  }
}
