/*
  Warnings:

  - Added the required column `codeProducto` to the `DetailsCart` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetailsCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subtotal" INTEGER NOT NULL DEFAULT 1,
    "cant_producto" INTEGER NOT NULL,
    "id_detallesCarrito" INTEGER NOT NULL,
    "codeProducto" TEXT NOT NULL,
    CONSTRAINT "DetailsCart_id_detallesCarrito_fkey" FOREIGN KEY ("id_detallesCarrito") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailsCart_codeProducto_fkey" FOREIGN KEY ("codeProducto") REFERENCES "Product" ("code_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetailsCart" ("cant_producto", "id", "id_detallesCarrito", "subtotal") SELECT "cant_producto", "id", "id_detallesCarrito", "subtotal" FROM "DetailsCart";
DROP TABLE "DetailsCart";
ALTER TABLE "new_DetailsCart" RENAME TO "DetailsCart";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
