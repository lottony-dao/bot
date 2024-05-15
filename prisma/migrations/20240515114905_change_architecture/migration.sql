/*
  Warnings:

  - You are about to drop the column `user_id_from` on the `balance_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_to` on the `balance_ledger` table. All the data in the column will be lost.
  - Added the required column `wallet_id_from` to the `balance_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id_to` to the `balance_ledger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_from_fkey";

-- DropForeignKey
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_to_fkey";

-- DropIndex
DROP INDEX "balance_ledger_user_id_from_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_from_user_id_to_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_to_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_to_user_id_from_idx";

-- AlterTable
ALTER TABLE "balance_ledger" DROP COLUMN "user_id_from",
DROP COLUMN "user_id_to",
ADD COLUMN     "wallet_id_from" INTEGER NOT NULL,
ADD COLUMN     "wallet_id_to" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_type_id" INTEGER,
ALTER COLUMN "tg_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_type_type_key" ON "user_type"("type");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_from_idx" ON "balance_ledger"("wallet_id_from");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_to_idx" ON "balance_ledger"("wallet_id_to");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_from_wallet_id_to_idx" ON "balance_ledger"("wallet_id_from", "wallet_id_to");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_to_wallet_id_from_idx" ON "balance_ledger"("wallet_id_to", "wallet_id_from");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_from_fkey" FOREIGN KEY ("wallet_id_from") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_to_fkey" FOREIGN KEY ("wallet_id_to") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
