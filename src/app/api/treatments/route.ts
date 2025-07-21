import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/db/prisma';

import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { patient_id, date, procedure, notes, cost, toothIds } = await req.json();

  if (!patient_id || !date || !procedure || !toothIds || !Array.isArray(toothIds)) {
    return new NextResponse(JSON.stringify({ message: 'Missing required treatment fields' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  try {
    const newTreatmentId = uuidv4();
    const newTreatment = await prisma.treatment.create({
      data: {
        id: newTreatmentId,
        patient_id,
        date: new Date(date),
        procedure,
        notes,
        cost: cost ? parseFloat(cost) : null,
      },
    });

    const treatmentTeethToInsert = toothIds.map((toothId: number) => ({
      treatment_id: newTreatmentId,
      tooth_id: toothId,
    }));

    if (treatmentTeethToInsert.length > 0) {
      await prisma.treatmentTooth.createMany({ data: treatmentTeethToInsert });
    }

    return new NextResponse(JSON.stringify(newTreatment), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error adding treatment:', error);
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