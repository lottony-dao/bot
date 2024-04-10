-- CreateTable
CREATE TABLE "rating_history" (
    "id" SERIAL NOT NULL,
    "from_user" INTEGER NOT NULL,
    "to_user" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate_value" INTEGER NOT NULL,

    CONSTRAINT "rating_history_pkey" PRIMARY KEY ("id")
);
