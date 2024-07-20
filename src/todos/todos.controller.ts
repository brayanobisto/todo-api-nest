import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, createTodoSchema, UpdateTodoDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ZodValidationPipe } from 'src/pipes';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('todos')
@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({
    summary: 'Crea un nuevo todo',
    description: 'Crea un nuevo todo con un título',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                minLength: 1,
                example: 'Aprender NestJs',
              },
            },
            required: ['title'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Todo creado, por defecto no está completado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            isCompleted: { type: 'boolean', example: false },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(createTodoSchema))
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.create(createTodoDto, userId);
  }

  @ApiOperation({
    summary: 'Obtiene todos los todos del usuario',
    description:
      'Obtiene todos los todos del usuario autenticado, se obtiene el id del usuario del token',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos del usuario',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              isCompleted: { type: 'boolean', example: false },
              userId: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.todosService.findAll(userId);
  }

  @ApiOperation({
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    summary: 'Obtiene un todo por id',
    description:
      'Obtiene un todo por id, se valida que el todo pertenezca al usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Todo encontrado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            isCompleted: { type: 'boolean', example: false },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.findOne(id, userId);
  }

  @ApiOperation({
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    summary: 'Actualiza un todo por id',
    description:
      'Actualiza un todo por id, se valida que el todo pertenezca al usuario autenticado',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                minLength: 1,
                example: 'Aprender NestJs Actualizado!',
              },
              isCompleted: {
                type: 'boolean',
                example: true,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Todo actualizado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            isCompleted: { type: 'boolean', example: false },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @ApiOperation({
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    summary: 'Elimina un todo por id',
    description:
      'Elimina un todo por id, se valida que el todo pertenezca al usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Todo eliminado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            isCompleted: { type: 'boolean', example: false },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.remove(id, userId);
  }
}
