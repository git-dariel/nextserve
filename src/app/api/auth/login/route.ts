import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { successResponse, validateRequest, apiHandler } from '@/lib/api';
import { SUCCESS_MESSAGES } from '@/lib/constants';

export const POST = apiHandler(async (request: NextRequest) => {
  const validation = await validateRequest(request, loginSchema);
  
  if (!validation.success) {
    return validation.response;
  }

  const { email, password } = validation.data;

  const result = await AuthService.login(email, password);

  return NextResponse.json(
    successResponse(result, SUCCESS_MESSAGES.LOGIN_SUCCESS),
    { status: 200 }
  );
});
