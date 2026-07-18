-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_stripeSessionId_key" ON "Customer"("stripeSessionId");
