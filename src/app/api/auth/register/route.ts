import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { successResponse, validateRequest, apiHandler } from '@/lib/api';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@/lib/constants';

export const POST = apiHandler(async (request: NextRequest) => {
  const validation = await validateRequest(request, registerSchema);
  
  if (!validation.success) {
    return validation.response;
  }

  const { name, email, password, age } = validation.data;

  const result = await AuthService.register({
    name,
    email,
    password,
    ...(age !== undefined && { age }),
  });

  return NextResponse.json(
    successResponse(result, SUCCESS_MESSAGES.USER_CREATED),
    { status: HTTP_STATUS.CREATED }
  );
});
