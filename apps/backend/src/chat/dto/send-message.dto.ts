import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: '我想买一件黑色卫衣，预算300以内' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
