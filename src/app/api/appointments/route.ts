import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../db/prisma';

export async function GET() {
  const appointments = await prisma.appointment.findMany();
  return NextResponse.json(appointments, {
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const appt = await prisma.appointment.create({ data });
  return NextResponse.json(appt, {
    status: 201,
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...rest } = data;
  const appt = await prisma.appointment.update({ where: { id: Number(id) }, data: rest });
  return NextResponse.json(appt, {
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  const appt = await prisma.appointment.delete({ where: { id } });
  return NextResponse.json(appt, {
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 