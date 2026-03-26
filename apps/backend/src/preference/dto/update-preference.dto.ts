import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  monetized?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;
}
