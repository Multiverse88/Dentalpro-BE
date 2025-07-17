import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/db/prisma';

// Tambahkan definisi enum langsung di sini
enum ToothStatus {
  Healthy = 'Healthy',
  Decayed = 'Decayed',
  Filled = 'Filled',
  Missing = 'Missing',
}
import { authMiddleware } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  try {
    const patients = await prisma.patient.findMany();

    // For each patient, fetch their teeth and treatments
    const patientsWithDetails = await Promise.all(patients.map(async (patient) => {
      const patientTeeth = await prisma.patientTooth.findMany({
        where: { patient_id: patient.id },
        include: {
          tooth: true,
        },
      });

      const treatments = await prisma.treatment.findMany({
        where: { patient_id: patient.id },
        select: {
          id: true,
          date: true,
          procedure: true,
          notes: true,
          cost: true,
          treatment_teeth: {
            select: {
              tooth_id: true,
            },
          },
        },
      });

      const treatmentsWithToothIds = treatments.map(treatment => ({
        ...treatment,
        toothIds: treatment.treatment_teeth.map(t => t.tooth_id),
      }));

      return {
        ...patient,
        teeth: patientTeeth.map(pt => ({
          id: pt.tooth.id,
          name: pt.tooth.name,
          status: pt.status,
          quadrant: pt.tooth.quadrant,
        })),
        treatments: treatmentsWithToothIds,
      };
    }));

    return new NextResponse(JSON.stringify(patientsWithDetails), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return new NextResponse(JSON.stringify({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Authentication failed
  }

  const newPatientData = await req.json();
  const patientId = uuidv4();

  // Validasi tanggal lahir
  const dob = new Date(newPatientData.date_of_birth || newPatientData.dob);
  if (isNaN(dob.getTime())) {
    return new NextResponse(JSON.stringify({
      message: 'Tanggal lahir tidak valid',
      error: 'date_of_birth is invalid',
    }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
  try {
    const patientToInsert = {
      id: patientId,
      name: newPatientData.name,
      date_of_birth: dob,
      gender: newPatientData.gender,
      contact: newPatientData.contact,
      address: newPatientData.address,
      created_at: new Date(),
    };

    await prisma.patient.create({ data: patientToInsert });

    // Initialize patient teeth with default healthy status
    const defaultTeeth = await prisma.tooth.findMany();
    const patientTeethToInsert = defaultTeeth.map(tooth => ({
      patient_id: patientId,
      tooth_id: tooth.id,
      status: ToothStatus.Healthy,
    }));
    await prisma.patientTooth.createMany({ data: patientTeethToInsert });

    const newPatient = {
      ...patientToInsert,
      dob: patientToInsert.date_of_birth, // Map back to frontend dob
      teeth: defaultTeeth.map(tooth => ({ ...tooth, status: ToothStatus.Healthy })),
      treatments: [],
    };

    return new NextResponse(JSON.stringify(newPatient), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error adding patient:', error);
    return new NextResponse(JSON.stringify({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      raw: error,
    }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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