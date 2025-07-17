import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export type AuthenticatedRequest = NextRequest & {
  user?: { id: string; email: string };
};

const JWT_SECRET = process.env.JWT_SECRET;



export async function authMiddleware(req: AuthenticatedRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Authentication required' }, {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded; // Attach user payload to the request
    return undefined; // Jangan return NextResponse.next() di app route handler
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, {
      status: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}
