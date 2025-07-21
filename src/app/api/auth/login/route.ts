import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use environment variable in production

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    const { password_hash, ...userWithoutPassword } = user;

    return new NextResponse(JSON.stringify({ token, user: userWithoutPassword }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}