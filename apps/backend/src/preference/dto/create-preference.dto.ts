import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreferenceDto {
  @ApiProperty({ example: 'Brand' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Nike, Adidas' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'Fashion' })
  @IsString()
  @IsNotEmpty()
  category: string;
}
