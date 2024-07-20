import { forwardRef, Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
