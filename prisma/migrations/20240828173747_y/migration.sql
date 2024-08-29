/*
  Warnings:

  - You are about to drop the column `id_pedido` on the `DetailsOrder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetailsOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "id_order" INTEGER NOT NULL,
    "codeProducto" TEXT NOT NULL,
    CONSTRAINT "DetailsOrder_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailsOrder_codeProducto_fkey" FOREIGN KEY ("codeProducto") REFERENCES "Product" ("code_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetailsOrder" ("cantidad", "codeProducto", "id", "id_order", "subtotal") SELECT "cantidad", "codeProducto", "id", "id_order", "subtotal" FROM "DetailsOrder";
DROP TABLE "DetailsOrder";
ALTER TABLE "new_DetailsOrder" RENAME TO "DetailsOrder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
