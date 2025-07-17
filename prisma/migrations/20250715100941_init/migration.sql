-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "teeth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quadrant" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "patient_teeth" (
    "patient_id" TEXT NOT NULL,
    "tooth_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    PRIMARY KEY ("patient_id", "tooth_id"),
    CONSTRAINT "patient_teeth_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_teeth_tooth_id_fkey" FOREIGN KEY ("tooth_id") REFERENCES "teeth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treatments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "procedure" TEXT NOT NULL,
    "notes" TEXT,
    "cost" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treatment_teeth" (
    "treatment_id" TEXT NOT NULL,
    "tooth_id" INTEGER NOT NULL,

    PRIMARY KEY ("treatment_id", "tooth_id"),
    CONSTRAINT "treatment_teeth_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "treatment_teeth_tooth_id_fkey" FOREIGN KEY ("tooth_id") REFERENCES "teeth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dental_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "tooth_number" INTEGER NOT NULL,
    "treatment_date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "treatment_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dental_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dental_records_tooth_number_fkey" FOREIGN KEY ("tooth_number") REFERENCES "teeth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
