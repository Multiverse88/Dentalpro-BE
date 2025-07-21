-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "patient" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
