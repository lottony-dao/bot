-- DropForeignKey
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_B_fkey";

-- DropForeignKey
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_jetton_id_fkey";

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
DROP INDEX "rating_ledger_user_id_from_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_from_user_id_to_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_to_idx";

-- DropIndex
DROP INDEX "rating_ledger_user_id_to_user_id_from_idx";

-- AlterTable
ALTER TABLE "rating_ledger" RENAME COLUMN "user_id_from" TO "account_id_from";
ALTER TABLE "rating_ledger" RENAME COLUMN "user_id_to" TO "account_id_to";

-- DropTable
DROP TABLE "_plashkaTouser";

-- DropTable
DROP TABLE "balance_ledger";

-- DropTable
DROP TABLE "experience_ledger";

-- DropTable
DROP TABLE "jetton";

-- DropTable
DROP TABLE "plashka";

-- DropTable

-- DropTable
DROP TABLE "user_plashka_junction";

-- DropTable
DROP TABLE "wallet";

-- CreateTable
ALTER TABLE "user" RENAME TO "account";
ALTER TABLE "account" ADD COLUMN  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "account" DROP COLUMN "wallet_address";
ALTER TABLE "account" DROP COLUMN "level";
ALTER TABLE "account" RENAME CONSTRAINT "user_pkey" TO "account_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "account_tg_id_key" ON "account"("tg_id");

-- CreateIndex
CREATE INDEX "account_tg_id_idx" ON "account"("tg_id");

-- CreateIndex
CREATE INDEX "rating_ledger_account_id_from_idx" ON "rating_ledger"("account_id_from");

-- CreateIndex
CREATE INDEX "rating_ledger_account_id_to_idx" ON "rating_ledger"("account_id_to");

-- CreateIndex
CREATE INDEX "rating_ledger_account_id_from_account_id_to_idx" ON "rating_ledger"("account_id_from", "account_id_to");

-- CreateIndex
CREATE INDEX "rating_ledger_account_id_to_account_id_from_idx" ON "rating_ledger"("account_id_to", "account_id_from");

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_from_fkey" FOREIGN KEY ("account_id_from") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_to_fkey" FOREIGN KEY ("account_id_to") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;





