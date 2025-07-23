import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const allowedOrigins = [
  'https://dentalpro-ten.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin');
  return {
    'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
      headers: corsHeaders(req)
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: corsHeaders(req)
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: corsHeaders(req)
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    const { password_hash, ...userWithoutPassword } = user;

    return new NextResponse(JSON.stringify({ token, user: userWithoutPassword }), {
      status: 200,
      headers: corsHeaders(req)
    });
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders(req)
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(req)
  });
}