import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';

import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { id } = params;
  const updatedTreatmentData = await req.json();
  const { date, procedure, notes, cost, toothIds } = updatedTreatmentData;

  if (!date || !procedure || !toothIds || !Array.isArray(toothIds)) {
    return new NextResponse(JSON.stringify({ message: 'Missing required treatment fields' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
      }
    });
  }

  try {
    const treatmentToUpdate = {
      date: new Date(date),
      procedure,
      notes,
      cost: cost ? parseFloat(cost) : null,
    };

    const updatedTreatment = await prisma.treatment.update({
      where: { id },
      data: treatmentToUpdate,
    });

    if (!updatedTreatment) {
      return new NextResponse(JSON.stringify({ message: 'Treatment not found' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
        }
      });
    }

    // Update treatment_teeth relationships
    await prisma.treatmentTooth.deleteMany({ where: { treatment_id: id } }); // Delete existing
    const treatmentTeethToInsert = toothIds.map((toothId: number) => ({
      treatment_id: id,
      tooth_id: toothId,
    }));
    if (treatmentTeethToInsert.length > 0) {
      await prisma.treatmentTooth.createMany({ data: treatmentTeethToInsert });
    }

    return new NextResponse(JSON.stringify({ ...updatedTreatment, toothIds }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
      }
    });
  } catch (error) {
    console.error('Error updating treatment:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
      }
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { id } = params;

  try {
    const deletedTreatment = await prisma.treatment.delete({ where: { id } });

    if (!deletedTreatment) {
      return new NextResponse(JSON.stringify({ message: 'Treatment not found' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
        }
      });
    }

    return new NextResponse(JSON.stringify({ message: 'Treatment deleted successfully' }), {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
      }
    });
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app'
      }
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}