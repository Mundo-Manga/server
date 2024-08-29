-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    CONSTRAINT "Cart_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetailsCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subtotal" INTEGER NOT NULL,
    "cant_producto" INTEGER NOT NULL,
    "id_detallesCarrito" INTEGER NOT NULL,
    CONSTRAINT "DetailsCart_id_detallesCarrito_fkey" FOREIGN KEY ("id_detallesCarrito") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "id_cartDetails" INTEGER NOT NULL,
    "id_orderDetails" INTEGER NOT NULL,
    CONSTRAINT "Product_id_cartDetails_fkey" FOREIGN KEY ("id_cartDetails") REFERENCES "DetailsCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_id_orderDetails_fkey" FOREIGN KEY ("id_orderDetails") REFERENCES "DetailsOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetailsOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pending',
    "monto_total" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_address" INTEGER NOT NULL,
    CONSTRAINT "Order_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_postal" TEXT NOT NULL,
    "detalles" TEXT NOT NULL,
    "departamento" INTEGER NOT NULL,
    "piso" INTEGER NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "provincia" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_cartDetails_key" ON "Product"("id_cartDetails");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_orderDetails_key" ON "Product"("id_orderDetails");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_address_key" ON "Order"("id_address");
