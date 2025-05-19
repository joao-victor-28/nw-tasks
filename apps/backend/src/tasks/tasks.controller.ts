import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@ApiTags('tasks')

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar Tasks' })
  @ApiResponse({ status: 200, description: 'Tasks listadas.' })
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar Task' })
  @ApiResponse({ status: 200, description: 'Tasks registrada.' })
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar task' })
  @ApiResponse({ status: 200, description: 'Tasks editada.' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(+id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar task' })
  @ApiResponse({ status: 200, description: 'Tasks deletada.' })
  delete(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(+id, req.user);
  }
}
