-- AlterTable
ALTER TABLE "order" ALTER COLUMN "total" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "order_item" ALTER COLUMN "price" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "price" SET DATA TYPE DECIMAL(15,2);
