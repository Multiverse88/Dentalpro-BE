import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../db/prisma';

export async function GET() {
  const queue = await prisma.queue.findMany();
  return NextResponse.json(queue);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const q = await prisma.queue.create({ data });
  return NextResponse.json(q, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...rest } = data;
  const q = await prisma.queue.update({ where: { id: Number(id) }, data: rest });
  return NextResponse.json(q);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  const q = await prisma.queue.delete({ where: { id } });
  return NextResponse.json(q);
} 