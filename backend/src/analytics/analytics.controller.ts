import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get task statistics' })
    getStats(@Request() req) {
        return this.analyticsService.getStats(req.user.id);
    }
}
