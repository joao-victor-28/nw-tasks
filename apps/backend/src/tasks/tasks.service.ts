import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  create(dto: CreateTaskDto, userId: number) {
    const task = this.repo.create({ ...dto, user: { id: userId } });
    return this.repo.save(task);
  }

  findAll(user: any) {
    if (user.role === 'admin') return this.repo.find({ relations: ['user'] });
    return this.repo.find({ where: { user: { id: user.userId } } });
  }

  async update(id: number, dto: UpdateTaskDto, user: any) {
    const task = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!task || (user.role !== 'admin' && task.user.id !== user.userId)) {
      throw new NotFoundException('Task not found or forbidden');
    }
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async delete(id: number, user: any) {
    const task = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!task || (user.role !== 'admin' && task.user.id !== user.userId)) {
      throw new NotFoundException('Task not found or forbidden');
    }
    return this.repo.remove(task);
  }
}
