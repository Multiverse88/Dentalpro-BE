import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/db/prisma';

import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return new NextResponse(JSON.stringify({ message: 'patientId is required' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const records = await prisma.dentalRecord.findMany({ where: { patient_id: patientId } });
    return new NextResponse(JSON.stringify(records), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching dental records:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { patient_id, tooth_number, treatment_date, description, treatment_type } = await req.json();

  if (!patient_id || !tooth_number || !treatment_date || !description || !treatment_type) {
    return new NextResponse(JSON.stringify({ message: 'Missing required dental record fields' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const newRecord = await prisma.dentalRecord.create({
      data: {
        id: uuidv4(),
        patient_id,
        tooth_number,
        treatment_date: new Date(treatment_date),
        description,
        treatment_type,
      },
    });

    return new NextResponse(JSON.stringify(newRecord), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error adding dental record:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}