import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';

import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { id } = params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
      include: {
        patient_teeth: {
          include: {
            tooth: true,
          },
        },
        treatments: {
          include: {
            treatment_teeth: {
              select: {
                tooth_id: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return new NextResponse(JSON.stringify({ message: 'Patient not found' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        }
      });
    }

    const patientWithDetails = {
      ...patient,
      dob: patient.date_of_birth, // Map DB column to frontend field
      teeth: patient.patient_teeth.map(pt => ({
        id: pt.tooth.id,
        name: pt.tooth.name,
        status: pt.status,
        quadrant: pt.tooth.quadrant,
      })),
      treatments: patient.treatments.map(treatment => ({
        ...treatment,
        toothIds: treatment.treatment_teeth.map(tt => tt.tooth_id),
      })),
    };

    return new NextResponse(JSON.stringify(patientWithDetails), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      }
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      }
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authMiddleware(req as AuthenticatedRequest);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const { id } = params;
  const updatedPatientData = await req.json();

  try {
    const patientToUpdate = {
      name: updatedPatientData.name,
      date_of_birth: new Date(updatedPatientData.dob),
      gender: updatedPatientData.gender,
      contact: updatedPatientData.contact,
      address: updatedPatientData.address,
    };

    await prisma.patient.update({
      where: { id: Number(id) },
      data: patientToUpdate,
    });

    // Handle teeth updates
    if (updatedPatientData.teeth && Array.isArray(updatedPatientData.teeth)) {
      for (const tooth of updatedPatientData.teeth) {
        await prisma.patientTooth.update({
          where: { patient_id_tooth_id: { patient_id: Number(id), tooth_id: tooth.id } },
          data: { status: tooth.status },
        });
      }
    }

    // Re-fetch the updated patient with all details
    const updatedPatient = await GET(req, { params });
    return updatedPatient;

  } catch (error) {
    console.error('Error updating patient:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
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
    const deletedTreatment = await prisma.treatment.delete({ where: { id: Number(id) } });

    if (!deletedTreatment) {
      return new NextResponse(JSON.stringify({ message: 'Patient not found' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
        }
      });
    }

    return new NextResponse(JSON.stringify({ message: 'Patient deleted successfully' }), {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      }
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      }
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://dentalpro-ten.vercel.app',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}