import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NonceDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' })
  address: string;
}
