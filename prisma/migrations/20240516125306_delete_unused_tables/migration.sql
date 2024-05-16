-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL PRIMARY KEY,
    "tg_id" BIGINT,
    "name" TEXT NOT NULL,
    "username" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL
);

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD COLUMN "account_id_from" INTEGER NOT NULL;
ALTER TABLE "rating_ledger" ADD COLUMN "account_id_to" INTEGER NOT NULL;

-- Populate the "account" table with data from the "user" table
INSERT INTO "account" ("tg_id", "name", "username")
SELECT "tg_id", "name", "username" FROM "user";

-- Update the "rating_ledger" table with the new account ids
UPDATE "rating_ledger"
SET "account_id_from" = (SELECT "id" FROM "account" WHERE "account"."tg_id" = "rating_ledger"."user_id_from"),
    "account_id_to" = (SELECT "id" FROM "account" WHERE "account"."tg_id" = "rating_ledger"."user_id_to");

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_from_fkey" FOREIGN KEY ("account_id_from") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_account_id_to_fkey" FOREIGN KEY ("account_id_to") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey (if still necessary)
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_A_fkey";
ALTER TABLE "_plashkaTouser" DROP CONSTRAINT "_plashkaTouser_B_fkey";
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_jetton_id_fkey";
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_from_fkey";
ALTER TABLE "balance_ledger" DROP CONSTRAINT "balance_ledger_user_id_to_fkey";
ALTER TABLE "experience_ledger" DROP CONSTRAINT "experience_ledger_user_id_fkey";
ALTER TABLE "rating_ledger" DROP CONSTRAINT "rating_ledger_user_id_from_fkey";
ALTER TABLE "rating_ledger" DROP CONSTRAINT "rating_ledger_user_id_to_fkey";
ALTER TABLE "user_plashka_junction" DROP CONSTRAINT "user_plashka_junction_plashka_id_fkey";
ALTER TABLE "user_plashka_junction" DROP CONSTRAINT "user_plashka_junction_user_id_fkey";
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_jetton_id_fkey";
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_user_id_fkey";

-- DropIndex (if still necessary)
DROP INDEX "rating_ledger_user_id_from_idx";
DROP INDEX "rating_ledger_user_id_from_user_id_to_idx";
DROP INDEX "rating_ledger_user_id_to_idx";
DROP INDEX "rating_ledger_user_id_to_user_id_from_idx";

-- AlterTable (if still necessary)
ALTER TABLE "rating_ledger" DROP COLUMN "user_id_from";
ALTER TABLE "rating_ledger" DROP COLUMN "user_id_to";

-- DropTable (if still necessary)
DROP TABLE "_plashkaTouser";
DROP TABLE "balance_ledger";
DROP TABLE "experience_ledger";
DROP TABLE "jetton";
DROP TABLE "plashka";
DROP TABLE "user";
DROP TABLE "user_plashka_junction";
DROP TABLE "wallet";

