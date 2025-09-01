import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';
import { successResponse, apiHandler } from '@/lib/api';
import { APP_CONFIG } from '@/lib/constants';

export const GET = apiHandler(async (request: NextRequest) => {
  const dbHealth = await checkDatabaseHealth();
  
  const healthData = {
    status: dbHealth.status === 'connected' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    database: dbHealth.status,
    version: APP_CONFIG.VERSION,
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(successResponse(healthData));
});
