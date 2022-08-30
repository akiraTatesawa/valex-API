CREATE TYPE "transactionType" AS ENUM ('groceries', 'restaurant', 'transport', 'education', 'health');

CREATE TABLE "companies"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "apiKey" TEXT NULL
);

CREATE TABLE "employees"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES companies(id)
);

CREATE TABLE "cards"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "employeeId" INTEGER NOT NULL REFERENCES employees(id),
    "number" TEXT NOT NULL UNIQUE,
    "cardholderName" TEXT NOT NULL,
    "securityCode" TEXT NOT NULL,
    "expirationDate" TEXT NOT NULL,
    "password" TEXT NULL,
    "isVirtual" BOOLEAN NOT NULL,
    "originalCardId" INTEGER NULL REFERENCES cards(id),
    "isBlocked" BOOLEAN NOT NULL,
    "type" "transactionType" NOT NULL
);

CREATE TABLE "businesses"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "type" "transactionType" NOT NULL
);

CREATE TABLE "payments"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "cardId" INTEGER NOT NULL REFERENCES cards(id),
    "businessId" INTEGER NOT NULL REFERENCES businesses(id),
    "timestamp" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "amount" INTEGER NOT NULL
);

CREATE TABLE "recharges"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "cardId" INTEGER NOT NULL REFERENCES cards(id),
    "timestamp" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "amount" INTEGER NOT NULL
);