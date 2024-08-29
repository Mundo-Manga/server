/*
  Warnings:

  - A unique constraint covering the columns `[code_producto]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_code_producto_key" ON "Product"("code_producto");
