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

@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UsePipes(new ZodValidationPipe(createTodoSchema))
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.todosService.remove(id, userId);
  }
}
