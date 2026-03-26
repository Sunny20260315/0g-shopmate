import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to the AI shopping assistant' })
  async send(
    @CurrentUser() user: { address: string },
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(user.address, dto.message);
  }

  @Delete('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear chat history' })
  clearHistory(@CurrentUser() user: { address: string }) {
    this.chatService.clearHistory(user.address);
    return { success: true };
  }
}
