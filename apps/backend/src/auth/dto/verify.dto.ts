import { IsString, IsNotEmpty, Matches, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' })
  address: string;

  @ApiProperty({ description: 'Wallet signature of the nonce message' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(132) // 标准 secp256k1 签名: 0x + 65 bytes hex = 132 chars
  signature: string;

  @ApiProperty({ description: 'Nonce obtained from /auth/nonce' })
  @IsString()
  @IsNotEmpty()
  @Length(64, 64) // 32 bytes hex = 64 chars
  nonce: string;
}
