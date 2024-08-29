/*
  Warnings:

  - You are about to drop the column `id_address` on the `Order` table. All the data in the column will be lost.
  - Added the required column `codeProducto` to the `DetailsOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_order` to the `DetailsOrder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetailsOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_order" INTEGER NOT NULL,
    "codeProducto" TEXT NOT NULL,
    CONSTRAINT "DetailsOrder_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailsOrder_codeProducto_fkey" FOREIGN KEY ("codeProducto") REFERENCES "Product" ("code_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetailsOrder" ("cantidad", "id", "id_pedido", "subtotal") SELECT "cantidad", "id", "id_pedido", "subtotal" FROM "DetailsOrder";
DROP TABLE "DetailsOrder";
ALTER TABLE "new_DetailsOrder" RENAME TO "DetailsOrder";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pending',
    "monto_total" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "Order_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("estado", "fecha", "id", "id_usuario", "monto_total") SELECT "estado", "fecha", "id", "id_usuario", "monto_total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
