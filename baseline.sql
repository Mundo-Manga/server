-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_usuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'cliente'
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
    "subtotal" INTEGER NOT NULL DEFAULT 1,
    "cant_producto" INTEGER NOT NULL,
    "id_detallesCarrito" INTEGER NOT NULL,
    "codeProducto" TEXT NOT NULL,
    CONSTRAINT "DetailsCart_id_detallesCarrito_fkey" FOREIGN KEY ("id_detallesCarrito") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailsCart_codeProducto_fkey" FOREIGN KEY ("codeProducto") REFERENCES "Product" ("code_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code_producto" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "DetailsOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "id_order" INTEGER NOT NULL,
    "codeProducto" TEXT NOT NULL,
    CONSTRAINT "DetailsOrder_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailsOrder_codeProducto_fkey" FOREIGN KEY ("codeProducto") REFERENCES "Product" ("code_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pending',
    "monto_total" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "Order_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "User_nombre_usuario_key" ON "User"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_id_user_key" ON "Cart"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_producto_key" ON "Product"("code_producto");

