import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@exemplo.com', description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário com no mínimo 6 caracteres' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    example: 'user', 
    description: 'Perfil do usuário', 
    enum: ['admin', 'user'] 
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
