/*
  Warnings:

  - You are about to drop the column `id_cartDetails` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id_orderDetails` on the `Product` table. All the data in the column will be lost.

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
    "description" TEXT
);
INSERT INTO "new_Product" ("code_producto", "description", "id", "nombre", "price", "stock") SELECT "code_producto", "description", "id", "nombre", "price", "stock" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
