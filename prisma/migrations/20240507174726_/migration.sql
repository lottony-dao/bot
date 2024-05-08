-- CreateTable
CREATE TABLE "user_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "tg_id" BIGINT,
    "name" TEXT NOT NULL,
    "username" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wallet_address" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "user_type_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "jetton_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jetton" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jetton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_ledger" (
    "id" SERIAL NOT NULL,
    "user_id_from" INTEGER NOT NULL,
    "user_id_to" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance_ledger" (
    "id" SERIAL NOT NULL,
    "wallet_id_from" INTEGER NOT NULL,
    "wallet_id_to" INTEGER NOT NULL,
    "jetton_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_ledger" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experience_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plashka" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plashka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_plashka_junction" (
    "user_id" INTEGER NOT NULL,
    "plashka_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_plashka_junction_pkey" PRIMARY KEY ("user_id","plashka_id")
);

-- CreateTable
CREATE TABLE "_plashkaTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_type_type_key" ON "user_type"("type");

-- CreateIndex
CREATE UNIQUE INDEX "user_tg_id_key" ON "user"("tg_id");

-- CreateIndex
CREATE INDEX "user_tg_id_idx" ON "user"("tg_id");

-- CreateIndex
CREATE INDEX "wallet_user_id_idx" ON "wallet"("user_id");

-- CreateIndex
CREATE INDEX "wallet_jetton_id_idx" ON "wallet"("jetton_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_user_id_jetton_id_key" ON "wallet"("user_id", "jetton_id");

-- CreateIndex
CREATE INDEX "rating_ledger_user_id_from_idx" ON "rating_ledger"("user_id_from");

-- CreateIndex
CREATE INDEX "rating_ledger_user_id_to_idx" ON "rating_ledger"("user_id_to");

-- CreateIndex
CREATE INDEX "rating_ledger_user_id_from_user_id_to_idx" ON "rating_ledger"("user_id_from", "user_id_to");

-- CreateIndex
CREATE INDEX "rating_ledger_user_id_to_user_id_from_idx" ON "rating_ledger"("user_id_to", "user_id_from");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_from_idx" ON "balance_ledger"("wallet_id_from");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_to_idx" ON "balance_ledger"("wallet_id_to");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_from_wallet_id_to_idx" ON "balance_ledger"("wallet_id_from", "wallet_id_to");

-- CreateIndex
CREATE INDEX "balance_ledger_wallet_id_to_wallet_id_from_idx" ON "balance_ledger"("wallet_id_to", "wallet_id_from");

-- CreateIndex
CREATE INDEX "balance_ledger_jetton_id_idx" ON "balance_ledger"("jetton_id");

-- CreateIndex
CREATE INDEX "experience_ledger_user_id_idx" ON "experience_ledger"("user_id");

-- CreateIndex
CREATE INDEX "experience_ledger_source_idx" ON "experience_ledger"("source");

-- CreateIndex
CREATE INDEX "plashka_type_idx" ON "plashka"("type");

-- CreateIndex
CREATE INDEX "plashka_title_idx" ON "plashka"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_plashkaTouser_AB_unique" ON "_plashkaTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_plashkaTouser_B_index" ON "_plashkaTouser"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_jetton_id_fkey" FOREIGN KEY ("jetton_id") REFERENCES "jetton"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_user_id_from_fkey" FOREIGN KEY ("user_id_from") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_ledger" ADD CONSTRAINT "rating_ledger_user_id_to_fkey" FOREIGN KEY ("user_id_to") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_from_fkey" FOREIGN KEY ("wallet_id_from") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_wallet_id_to_fkey" FOREIGN KEY ("wallet_id_to") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_ledger" ADD CONSTRAINT "balance_ledger_jetton_id_fkey" FOREIGN KEY ("jetton_id") REFERENCES "jetton"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_ledger" ADD CONSTRAINT "experience_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plashka_junction" ADD CONSTRAINT "user_plashka_junction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plashka_junction" ADD CONSTRAINT "user_plashka_junction_plashka_id_fkey" FOREIGN KEY ("plashka_id") REFERENCES "plashka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_plashkaTouser" ADD CONSTRAINT "_plashkaTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "plashka"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_plashkaTouser" ADD CONSTRAINT "_plashkaTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
