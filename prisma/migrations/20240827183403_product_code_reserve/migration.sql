/*
  Warnings:

  - Added the required column `code_producto` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code_producto" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "id_cartDetails" INTEGER NOT NULL,
    "id_orderDetails" INTEGER NOT NULL,
    CONSTRAINT "Product_id_cartDetails_fkey" FOREIGN KEY ("id_cartDetails") REFERENCES "DetailsCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_id_orderDetails_fkey" FOREIGN KEY ("id_orderDetails") REFERENCES "DetailsOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("description", "id", "id_cartDetails", "id_orderDetails", "nombre", "price", "stock") SELECT "description", "id", "id_cartDetails", "id_orderDetails", "nombre", "price", "stock" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_id_cartDetails_key" ON "Product"("id_cartDetails");
CREATE UNIQUE INDEX "Product_id_orderDetails_key" ON "Product"("id_orderDetails");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
