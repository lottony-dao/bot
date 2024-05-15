/*
  Warnings:

  - You are about to drop the column `user_id_from` on the `balance_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_to` on the `balance_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `balance_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `experience_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_from` on the `rating_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_to` on the `rating_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `jetton_id` on the `wallet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `wallet` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `wallet` table. All the data in the column will be lost.
  - You are about to drop the `_plashkaTouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_plashka_junction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `balance_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id_from` to the `balance_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id_to` to the `balance_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `experience_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cents` to the `jetton` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id_from` to the `rating_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id_to` to the `rating_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockchain_id` to the `wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_B_fkey";

-- DropForeignKey
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_from_fkey";

-- DropForeignKey
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_to_fkey";

-- DropForeignKey
ALTER TABLE "experience_ledger" DROP CONSTRAINT "experience_ledger_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rating_ledger" DROP CONSTRAINT "rating_ledger_user_id_from_fkey";

-- DropForeignKey
ALTER TABLE "rating_ledger" DROP CONSTRAINT "rating_ledger_user_id_to_fkey";

-- DropForeignKey
ALTER TABLE "user_plashka_junction" DROP CONSTRAINT "user_plashka_junction_plashka_id_fkey";

-- DropForeignKey
ALTER TABLE "user_plashka_junction" DROP CONSTRAINT "user_plashka_junction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_jetton_id_fkey";

-- DropForeignKey
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_user_id_fkey";

-- DropIndex
DROP INDEX "balance_ledger_jetton_id_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_from_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_from_user_id_to_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_to_idx";

-- DropIndex
DROP INDEX "balance_ledger_user_id_to_user_id_from_idx";

-- DropIndex
DROP INDEX "experience_ledger_source_idx";

-- DropIndex
DROP INDEX "experience_ledger_user_id_idx";

-- DropIndex
DROP INDEX "plashka_title_idx";

-- DropIndex
DROP INDEX "plashka_type_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_from_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_from_user_id_to_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_to_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_to_user_id_from_idx";

-- DropIndex
DROP INDEX "wallet_jetton_id_idx";

-- DropIndex
DROP INDEX "wallet_user_id_idx";

-- DropIndex
DROP INDEX "wallet_user_id_jetton_id_key";

-- AlterTable
ALTER TABLE "balance_ledger" DROP COLUMN "user_id_from",
DROP COLUMN "user_id_to",
DROP COLUMN "value",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "wallet_id_from" INTEGER NOT NULL,
ADD COLUMN     "wallet_id_to" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "experience_ledger" DROP COLUMN "user_id",
ADD COLUMN     "account_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "jetton" ADD COLUMN     "cents" INTEGER NOT NULL,
ADD COLUMN     "mineable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "rating_ledger" DROP COLUMN "user_id_from",
DROP COLUMN "user_id_to",
ADD COLUMN     "account_id_from" INTEGER NOT NULL,
ADD COLUMN     "account_id_to" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "wallet" DROP COLUMN "jetton_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "account_id" INTEGER NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "blockchain_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_plashkaTouser";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_plashka_junction";

-- CreateTable
CREATE TABLE "account" (
    "id" INTEGER NOT NULL,
    "tg_id" BIGINT,
    "name" TEXT NOT NULL,
    "username" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plashkaToaccount" (
    "id" SERIAL NOT NULL,
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plashkaToaccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "native_jetton_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_virtual" BOOLEAN NOT NULL,

    CONSTRAINT "blockchain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_from_fkey" FOREIGN KEY ("account_id_from") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_to_fkey" FOREIGN KEY ("account_id_to") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_from_fkey" FOREIGN KEY ("wallet_id_from") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_to_fkey" FOREIGN KEY ("wallet_id_to") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_ledger" ADD CONSTRAINT "experience_ledger_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plashkaToaccount" ADD CONSTRAINT "plashkaToaccount_A_fkey" FOREIGN KEY ("A") REFERENCES "plashka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plashkaToaccount" ADD CONSTRAINT "plashkaToaccount_B_fkey" FOREIGN KEY ("B") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain" ADD CONSTRAINT "blockchain_native_jetton_id_fkey" FOREIGN KEY ("native_jetton_id") REFERENCES "jetton"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
