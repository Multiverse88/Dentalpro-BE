import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../db/prisma';

export async function PUT(req: NextRequest, { params }: any) {
  const id = params.id;
  const data = await req.json();
  const q = await prisma.queue.update({ where: { id }, data });
  return NextResponse.json(q);
}

export async function DELETE(req: NextRequest, { params }: any) {
  const id = params.id;
  const q = await prisma.queue.delete({ where: { id } });
  return NextResponse.json(q);
} 