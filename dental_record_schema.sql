-- Tabel: users
-- Menyimpan informasi pengguna yang dapat login ke sistem.
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID untuk ID unik
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Simpan hash password, bukan plain text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel: patients
-- Menyimpan informasi detail pasien.
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID untuk ID unik
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL, -- Sesuai dengan 'dob' di frontend
    gender VARCHAR(50) NOT NULL, -- 'Male', 'Female', 'Other'
    contact VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Sesuai dengan 'createdAt' di frontend
);

-- Tabel: teeth
-- Menyimpan definisi gigi universal (1-32 UNS). Tabel ini akan diisi sekali dan berfungsi sebagai lookup.
CREATE TABLE teeth (
    id INT PRIMARY KEY, -- Nomor gigi universal (1-32)
    name VARCHAR(255) NOT NULL, -- Nama deskriptif gigi (e.g., 'Gigi Bungsu Kanan Atas')
    quadrant VARCHAR(10) NOT NULL -- 'UR', 'UL', 'LR', 'LL'
);

-- Tabel: patient_teeth
-- Menyimpan status spesifik setiap gigi untuk setiap pasien.
CREATE TABLE patient_teeth (
    patient_id VARCHAR(36) NOT NULL,
    tooth_id INT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Healthy', 'Decay', 'Filled', dll.
    PRIMARY KEY (patient_id, tooth_id),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (tooth_id) REFERENCES teeth(id) ON DELETE CASCADE
);

-- Tabel: treatments
-- Menyimpan riwayat perawatan komprehensif untuk setiap pasien.
CREATE TABLE treatments (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID untuk ID unik
    patient_id VARCHAR(36) NOT NULL,
    date TIMESTAMP NOT NULL, -- Tanggal perawatan
    procedure TEXT NOT NULL, -- Deskripsi prosedur/tindakan
    notes TEXT,
    cost DECIMAL(10, 2), -- Biaya perawatan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Tabel: treatment_teeth
-- Tabel penghubung untuk hubungan many-to-many antara treatments dan teeth.
-- Sebuah perawatan bisa melibatkan banyak gigi, dan satu gigi bisa terlibat dalam banyak perawatan.
CREATE TABLE treatment_teeth (
    treatment_id VARCHAR(36) NOT NULL,
    tooth_id INT NOT NULL,
    PRIMARY KEY (treatment_id, tooth_id),
    FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
    FOREIGN KEY (tooth_id) REFERENCES teeth(id) ON DELETE CASCADE
);

-- Tabel: dental_records
-- Menyimpan catatan dental tambahan yang terpisah dari riwayat perawatan komprehensif.
CREATE TABLE dental_records (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID untuk ID unik
    patient_id VARCHAR(36) NOT NULL,
    tooth_number INT NOT NULL, -- Nomor gigi yang terkait dengan catatan ini
    treatment_date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    treatment_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (tooth_number) REFERENCES teeth(id) ON DELETE CASCADE
);