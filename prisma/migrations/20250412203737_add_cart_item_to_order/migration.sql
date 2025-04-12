/*
  Warnings:

  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_product_id_fkey";

-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "order_id" UUID,
ADD COLUMN     "price" DECIMAL(5,2) NOT NULL;

-- DropTable
DROP TABLE "order_item";

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
