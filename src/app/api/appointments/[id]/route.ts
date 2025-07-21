import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../db/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await req.json();
  const appt = await prisma.appointment.update({ where: { id }, data });
  return NextResponse.json(appt);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const appt = await prisma.appointment.delete({ where: { id } });
  return NextResponse.json(appt);
} 