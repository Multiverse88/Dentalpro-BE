const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  // Reset data
  await prisma.patientTooth.deleteMany({});
  await prisma.treatmentTooth.deleteMany({});
  await prisma.dentalRecord.deleteMany({});
  await prisma.treatment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tooth.deleteMany({});

  // Teeth
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

  // Fake data
  const names = [
    'Budi Santoso', 'Siti Aminah', 'Andi Wijaya', 'Dewi Lestari', 'Rina Kurniawan', 'Agus Prabowo', 'Fitriani', 'Joko Susilo', 'Maya Sari', 'Tono Prasetyo',
    'Lina Marlina', 'Dian Puspita', 'Rizky Ramadhan', 'Yuni Astuti', 'Fajar Nugroho', 'Sari Dewi', 'Dedi Gunawan', 'Putri Ayu', 'Hendra Saputra', 'Nina Kartika',
    'Eka Putra', 'Rizka Amelia', 'Bayu Saputra', 'Wulan Sari', 'Dimas Prasetya', 'Ayu Lestari', 'Rudi Hartono', 'Mega Sari', 'Fikri Hidayat', 'Sinta Dewi',
    'Rian Pratama', 'Dewi Sartika', 'Bambang Irawan', 'Suci Ramadhani', 'Yoga Pratama', 'Novi Andriani', 'Dian Permata', 'Rina Susanti', 'Fajar Setiawan', 'Lina Agustina',
    'Dedi Prasetyo', 'Putri Maharani', 'Hendra Wijaya', 'Nina Sari', 'Eka Saputra', 'Rizka Putri', 'Bayu Prabowo', 'Wulan Dewi', 'Dimas Saputra', 'Ayu Pratiwi',
    'Rudi Santoso', 'Mega Putri', 'Fikri Ramadhan', 'Sinta Lestari', 'Rian Nugroho', 'Dewi Kurniawan', 'Bambang Prasetyo', 'Suci Amelia', 'Yoga Hidayat', 'Novi Sari',
    'Dian Agustina', 'Rina Permata', 'Fajar Susilo', 'Lina Ramadhani', 'Dedi Setiawan', 'Putri Andriani', 'Hendra Pratama', 'Nina Permata', 'Eka Sari', 'Rizka Dewi',
    'Bayu Pratama', 'Wulan Maharani', 'Dimas Wijaya', 'Ayu Nugroho', 'Rudi Prabowo', 'Mega Dewi', 'Fikri Prasetyo', 'Sinta Putri', 'Rian Lestari', 'Dewi Santoso',
    'Bambang Nugroho', 'Suci Pratiwi', 'Yoga Santoso', 'Novi Prasetyo', 'Dian Nugroho', 'Rina Pratiwi', 'Fajar Prabowo', 'Lina Dewi', 'Dedi Maharani', 'Putri Nugroho',
    'Hendra Ramadhan', 'Nina Pratama', 'Eka Dewi', 'Rizka Pratiwi', 'Bayu Santoso', 'Wulan Pratiwi', 'Dimas Dewi', 'Ayu Prasetyo', 'Rudi Dewi', 'Mega Pratiwi'
  ];
  const addresses = [
    'Jl. Merdeka No. 1, Jakarta', 'Jl. Sudirman No. 2, Bandung', 'Jl. Diponegoro No. 3, Surabaya', 'Jl. Gajah Mada No. 4, Yogyakarta',
    'Jl. Ahmad Yani No. 5, Semarang', 'Jl. Pemuda No. 6, Medan', 'Jl. Asia Afrika No. 7, Bandung', 'Jl. Malioboro No. 8, Yogyakarta',
    'Jl. Gatot Subroto No. 9, Jakarta', 'Jl. Sisingamangaraja No. 10, Medan'
  ];
  const genders = ['Male', 'Female'];
  const procedures = ['Tambal Gigi', 'Cabut Gigi', 'Scaling', 'Pemasangan Behel', 'Pembersihan Karang Gigi'];
  const notes = ['Sukses', 'Perlu kontrol ulang', 'Pasien mengeluh nyeri', 'Tidak ada komplikasi', 'Butuh perawatan lanjutan'];

  // 100 patients
  const fakePatients = Array.from({ length: 100 }).map(() => {
    const name = randomItem(names);
    return {
      id: uuidv4(),
      name,
      date_of_birth: randomDate(new Date('1970-01-01'), new Date('2015-12-31')),
      gender: randomItem(genders),
      contact: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
      address: randomItem(addresses),
    };
  });
  await prisma.patient.createMany({ data: fakePatients });
  console.log('Seeded 100 patients!');

  // Patient teeth (patient_teeth)
  const toothStatuses = ['Healthy', 'Decay', 'Filled', 'Extracted', 'RootCanal', 'Crown', 'Missing'];
  let patientTeethData = [];
  for (const patient of fakePatients) {
    for (let toothId = 1; toothId <= 32; toothId++) {
      patientTeethData.push({
        patient_id: patient.id,
        tooth_id: toothId,
        status: randomItem(toothStatuses),
      });
    }
  }
  await prisma.patientTooth.createMany({ data: patientTeethData });
  console.log('Seeded patient teeth for 100 patients!');

  // Treatments
  let allTreatments = [];
  let allTreatmentTeeth = [];
  const treatmentStartDate = new Date('2020-01-01');
  const treatmentEndDate = new Date('2025-12-31');
  for (const patient of fakePatients) {
    const numTreatments = Math.floor(Math.random() * 3) + 2; // 2-4 treatments per patient
    for (let i = 0; i < numTreatments; i++) {
      const treatmentId = uuidv4();
      const treatment = {
        id: treatmentId,
        patient_id: patient.id,
        date: randomDate(treatmentStartDate, treatmentEndDate),
        procedure: randomItem(procedures),
        notes: randomItem(notes),
        cost: Math.floor(Math.random() * 500000) + 100000,
      };
      allTreatments.push(treatment);
      // Assign 1-3 random teeth to this treatment
      const numTeeth = Math.floor(Math.random() * 3) + 1;
      const usedTeeth = new Set();
      for (let j = 0; j < numTeeth; j++) {
        let toothId;
        do {
          toothId = Math.floor(Math.random() * 32) + 1;
        } while (usedTeeth.has(toothId));
        usedTeeth.add(toothId);
        allTreatmentTeeth.push({ treatment_id: treatmentId, tooth_id: toothId });
      }
    }
  }
  await prisma.treatment.createMany({ data: allTreatments });
  await prisma.treatmentTooth.createMany({ data: allTreatmentTeeth });
  console.log('Seeded treatments and treatment_teeth for 100 patients!');

  // Tambah user demo
  const demoPassword = 'admin123';
  const demoHash = bcrypt.hashSync(demoPassword, 10);
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password_hash: demoHash,
    }
  });
  console.log('Seeded demo user: admin@demo.com / admin123');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 