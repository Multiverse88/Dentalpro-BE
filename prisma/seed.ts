import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Reset data gigi
  await prisma.patientTooth.deleteMany({});
  await prisma.treatmentTooth.deleteMany({});
  await prisma.dentalRecord.deleteMany({});
  await prisma.treatment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tooth.deleteMany({});
  // Universal Numbering System (1-32)
  const teeth = [
    { id: 1, name: 'Geraham ketiga (gigi bungsu) kanan atas', quadrant: 'UR' },
    { id: 2, name: 'Geraham kedua kanan atas', quadrant: 'UR' },
    { id: 3, name: 'Geraham pertama kanan atas', quadrant: 'UR' },
    { id: 4, name: 'Premolar kedua kanan atas', quadrant: 'UR' },
    { id: 5, name: 'Premolar pertama kanan atas', quadrant: 'UR' },
    { id: 6, name: 'Gigi taring kanan atas', quadrant: 'UR' },
    { id: 7, name: 'Gigi seri lateral kanan atas', quadrant: 'UR' },
    { id: 8, name: 'Gigi seri central kanan atas', quadrant: 'UR' },
    { id: 9, name: 'Gigi seri central kiri atas', quadrant: 'UL' },
    { id: 10, name: 'Gigi seri lateral kiri atas', quadrant: 'UL' },
    { id: 11, name: 'Gigi taring kiri atas', quadrant: 'UL' },
    { id: 12, name: 'Premolar pertama kiri atas', quadrant: 'UL' },
    { id: 13, name: 'Premolar kedua kiri atas', quadrant: 'UL' },
    { id: 14, name: 'Geraham pertama kiri atas', quadrant: 'UL' },
    { id: 15, name: 'Geraham kedua kiri atas', quadrant: 'UL' },
    { id: 16, name: 'Geraham ketiga (gigi bungsu) kiri atas', quadrant: 'UL' },
    { id: 17, name: 'Geraham ketiga (gigi bungsu) kiri bawah', quadrant: 'LL' },
    { id: 18, name: 'Geraham kedua kiri bawah', quadrant: 'LL' },
    { id: 19, name: 'Geraham pertama kiri bawah', quadrant: 'LL' },
    { id: 20, name: 'Premolar kedua kiri bawah', quadrant: 'LL' },
    { id: 21, name: 'Premolar pertama kiri bawah', quadrant: 'LL' },
    { id: 22, name: 'Gigi taring kiri bawah', quadrant: 'LL' },
    { id: 23, name: 'Gigi seri lateral kiri bawah', quadrant: 'LL' },
    { id: 24, name: 'Gigi seri central kiri bawah', quadrant: 'LL' },
    { id: 25, name: 'Gigi seri central kanan bawah', quadrant: 'LR' },
    { id: 26, name: 'Gigi seri lateral kanan bawah', quadrant: 'LR' },
    { id: 27, name: 'Gigi taring kanan bawah', quadrant: 'LR' },
    { id: 28, name: 'Premolar pertama kanan bawah', quadrant: 'LR' },
    { id: 29, name: 'Premolar kedua kanan bawah', quadrant: 'LR' },
    { id: 30, name: 'Geraham pertama kanan bawah', quadrant: 'LR' },
    { id: 31, name: 'Geraham kedua kanan bawah', quadrant: 'LR' },
    { id: 32, name: 'Geraham ketiga (gigi bungsu) kanan bawah', quadrant: 'LR' },
  ];
  await prisma.tooth.createMany({ data: teeth });
  console.log('Seeded teeth data!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 