import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PreferenceService } from './preference.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Preferences')
@Controller('preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  @ApiOperation({ summary: 'List all preferences for current user' })
  findAll(@CurrentUser() user: { address: string }) {
    return this.preferenceService.findAll(user.address);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new preference' })
  create(
    @CurrentUser() user: { address: string },
    @Body() dto: CreatePreferenceDto,
  ) {
    return this.preferenceService.create(user.address, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a preference (e.g., toggle monetization)' })
  update(
    @CurrentUser() user: { address: string },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePreferenceDto,
  ) {
    return this.preferenceService.update(user.address, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (burn) a preference' })
  remove(
    @CurrentUser() user: { address: string },
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.preferenceService.remove(user.address, id);
    return { success: true };
  }
}
